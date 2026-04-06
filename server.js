require('dotenv').config(); //reads .env file and makes the variables available in process.env
const express = require('express'); //adds express to the project
const Iyzipay = require('iyzipay');
const app = express(); //creates an express application

app.use(express.static('public')); //serves static files from the public directory

app.use(express.json()); //parses incoming requests with JSON payloads

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL,
});

iyzipay.installmentInfo.retrieve({
    locale: Iyzipay.LOCALE.TR,
    conversationId: 'test-123',
    binNumber: '552879',
    price: '100'
}, (err, result) => {
    if (err) {
        console.log('Connection error:', err);
    } else {
        console.log('iyzico connection successful, status:', result.status);
    }
});

app.post('/api/create-payment', (req, res) => {
    const { name, surname, email, cardNumber, expireMonth, expireYear, cvc } = req.body;

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: 'test-' + Date.now(),
        price: '10.00',
        paidPrice: '10.00',
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,

        paymentCard: {
            cardHolderName: name + ' ' + surname,
            cardNumber: cardNumber,
            expireMonth: expireMonth,
            expireYear: expireYear,
            cvc: cvc,
            registerCard: '0',
        },

        buyer: {
            id: 'BY789',
            name: name,
            surname: surname,
            email: email,
            gsmNumber: '+905350000000',
            identityNumber: '74300864791',
            registrationAddress: 'Test Mahallesi, Test Sokak',
            ip: req.ip,
            city: 'Istanbul',
            country: 'Turkey',
        },

        shippingAddress: {
            contactName: name + ' ' + surname,
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Test Mahallesi, Test Sokak',
        },

        billingAddress: {
            contactName: name + ' ' + surname,
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Test Mahallesi, Test Sokak',
        },

        basketItems: [
            {
                id: 'BI101',
                name: 'Digital Consulting Package',
                category1: 'Service',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '10.00',
            },
        ],
    };

    iyzipay.payment.create(request, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        if (result.status === 'success') {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, error: result.errorMessage });
        }
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});