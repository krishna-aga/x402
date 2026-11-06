import dotenv from "dotenv";
dotenv.config();

import { x402Client, wrapFetchWithPayment, x402HTTPClient } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const rawPk = process.env.EVM_PRIVATE_KEY || "";
const formattedPk = rawPk.startsWith("0x") ? rawPk : `0x${rawPk}`;
const signer = privateKeyToAccount(formattedPk);

const client = new x402Client();
registerExactEvmScheme(client, { signer });

const fetchWithPayment = wrapFetchWithPayment(globalThis.fetch, client);

async function callApi() {
  const response = await fetchWithPayment(
    "http://localhost:5000/api/9c3c0118-9d8b-423c-8f2c-288d16cc8ff4",
    { method: "GET" }
  );

  console.log("🔎 Headers:");
  for (const [key, value] of response.headers.entries()) {
    console.log(key, ":", value);
  }

  const body = await response.json();
  console.log("✅ API Response:", body);

  const httpClient = new x402HTTPClient(client);
  const paymentInfo = httpClient.getPaymentSettleResponse(
    (name) => response.headers.get(name)
  );

  console.log("💰 Payment Info:", paymentInfo);
}

callApi();
