const { paymentMiddleware, x402ResourceServer } = require("@x402/express");
const { ExactEvmScheme } = require("@x402/evm/exact/server");
const { HTTPFacilitatorClient } = require("@x402/core/server");

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

const server = new x402ResourceServer(facilitatorClient)
  .register("eip155:84532", new ExactEvmScheme());

function x402Middleware(req, res, next) {
  try {
    const api = res.locals.api;
    const Id = req.params.Id;

    if (!api) {
        return res.status(500).json({ error: "API data not found for payment" });
    }

    const payTo = api.payTo;
    const price = `$${api.amount}`; 

    const routeKey = `GET /${Id}`;
    const apiRouteKey = `GET /api/${Id}`;

    const routeConfig = {
      accepts: [
        {
          scheme: "exact",
          price,
          network: "eip155:84532",
          payTo,
        },
      ],
      description: `Paid API: ${api.name}`,
      mimeType: "application/json",
    };

    const middleware = paymentMiddleware(
      {
        [routeKey]: routeConfig,
        [apiRouteKey]: routeConfig,
      },
      server
    );

    return middleware(req, res, next);
  } catch (error) {
    console.error("x402 Middleware Error:", error);
    return res.status(500).json({ error: "x402 payment failed" });
  }
}

module.exports = { x402Middleware };
