# 🚀 x402 API Marketplace

A decentralized API marketplace powered by the [x402 protocol](https://x402.org). 

This platform allows developers to **monetize their APIs** with instant, per-call crypto micropayments, and allows users to **consume paid APIs** without needing subscriptions or API keys.

---

## ✨ Features

- **Web3 Native Monetization:** Register your API and set a price in USDC.
- **Instant Micropayments:** Every API call instantly transfers crypto directly to your wallet.
- **No API Keys:** Authentication and payment are handled seamlessly by the x402 protocol.
- **Beautiful Dashboard:** Track your registered APIs, total calls, and total earnings.
- **Premium UI:** Built with React, Tailwind CSS v4, and modern glassmorphism aesthetics.

---

## 🛠️ Technology Stack

**Backend**
- Node.js & Express
- MongoDB (Atlas) for storing API metadata and stats
- `@x402/express` - x402 payment middleware
- `@x402/evm` - EVM (Ethereum) blockchain payment verification

**Frontend**
- React (Vite)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `ethers.js` - Wallet connection and Web3 interactions

**Client Library**
- `@x402/fetch` - Used by consumers to seamlessly pay and fetch data.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- A Web3 Wallet (like MetaMask) for the frontend dashboard

### 2. Installation

Clone the repository and install dependencies for both the backend and frontend:

```bash
npm install
```
*(The `postinstall` script will automatically install frontend dependencies as well).*

### 3. Environment Variables

Create a `.env` file in the root directory (you can copy from `.env.example`):

```env
# MongoDB Connection String (Ensure your IP is whitelisted in Atlas!)
MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/x402-marketplace

# Port for the backend server
PORT=5000

# Private key for the test client (Base Sepolia)
EVM_PRIVATE_KEY=your_private_key_here
```

### 4. Running the App

You can start both the backend and frontend concurrently using the provided bash script:

```bash
./start.sh
```

Alternatively, use npm:

```bash
npm run dev
```

- **Frontend App:** `http://localhost:5173` (or `5174`)
- **Backend Server:** `http://localhost:5000`

---

## 💻 Consuming APIs (Developers)

When you register an API on the marketplace, you receive a **proxy URL** (e.g., `http://localhost:5000/api/your-api-id`).

You **cannot** visit this URL directly in a web browser. Browsers do not understand the HTTP 402 Payment Required protocol natively. 

To consume an API and pay for it, use the provided `testClient.mjs` script:

```javascript
// 1. Configure your private key in .env
// 2. Open testClient.mjs and paste your API's proxy URL
// 3. Run the script:
node testClient.mjs
```

The `@x402/fetch` library will automatically intercept the `402` error, sign an EVM transaction on Base Sepolia using your private key, and securely fetch the data.

---

## 📜 License
MIT License
