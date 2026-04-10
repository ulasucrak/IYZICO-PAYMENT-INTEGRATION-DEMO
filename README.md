# iyzico Demo

A minimal [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) demo that collects card details on a static page and creates a payment through the [iyzico](https://www.iyzico.com/) API using the official [`iyzipay`](https://www.npmjs.com/package/iyzipay) package.

## Features

- Simple checkout form (name, surname, email, card fields)
- `POST /api/create-payment` — builds an iyzico payment request and returns success or an error message
- Static success page after a successful payment
- Startup check via `installmentInfo.retrieve` to verify API credentials

## Requirements

- Node.js 18+ recommended
- An iyzico merchant account with **API Key**, **Secret Key**, and the correct **API base URL** (sandbox vs production)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/ulasucrak/IYZICO-PAYMENT-INTEGRATION-DEMO.git
cd IYZICO-PAYMENT-INTEGRATION-DEMO
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the project root (this file is gitignored):

```env
IYZICO_API_KEY=your_api_key
IYZICO_SECRET_KEY=your_secret_key
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
```

Use your iyzico dashboard values. For production, set `IYZICO_BASE_URL` to the production API URL from iyzico’s documentation.

**Never commit real API keys.**

### 4. Start the server

```bash
npm start
```

### 5. Open the application

After the server starts, open this address in your browser:

[http://localhost:3000](http://localhost:3000)

### 6. Test the payment form

1. Fill in the customer and card fields on the main page.
2. Submit the form.
3. If the payment is successful, you will be redirected to the result page.
4. If something fails, the API returns an error message on the page.

## Project layout

| Path | Purpose |
|------|---------|
| `server.js` | Express app, iyzico client, payment API |
| `public/index.html` | Checkout form and client-side `fetch` to the API |
| `public/result.html` | Success page |

## API

### `POST /api/create-payment`

**Body (JSON):** `name`, `surname`, `email`, `cardNumber`, `expireMonth`, `expireYear`, `cvc`

**Responses:**

- `{ "success": true }` — payment created with `status === 'success'`
- `{ "success": false, "error": "..." }` — iyzico error message or server error

> **Note:** The server still uses demo-style buyer/shipping data (fixed GSM, identity number, addresses) as in the sample. Replace these with real user data before any production use.

## Security

- Keep `.env` out of version control (already listed in `.gitignore`).
- Prefer iyzico’s hosted or tokenized flows for production instead of sending raw card data through your own backend unless you are fully PCI-compliant and follow iyzico’s integration guidelines.

## License

ISC (see `package.json`).
