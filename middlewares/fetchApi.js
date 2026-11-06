const ApiStats = require("../models/apiStats");

async function fetchApiMiddleware(req, res) {
  try {
    const api = res.locals.api;

    if (!api || !api.endpoint) {
      return res.status(500).json({ error: "API endpoint not found" });
    }

    const url = new URL(api.endpoint);

    Object.keys(req.query).forEach((key) => {
      url.searchParams.append(key, req.query[key]);
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "External API error",
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "";
    let data;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    await ApiStats.findOneAndUpdate(
      { apiId: api.apiId },
      {
        $inc: {
          callCount: 1,
          totalEarnings: api.amount,
        },
      },
      { upsert: true, new: true }
    );

    return res.json({
      apiId: api.apiId,
      name: api.name,
      data,
    });
  } catch (error) {
    console.error("Fetch API Error:", error);
    return res.status(500).json({
      error: "Failed to fetch external API",
    });
  }
}

module.exports = { fetchApiMiddleware };
