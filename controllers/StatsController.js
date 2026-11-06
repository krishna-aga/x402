const db = require("../models/db");
const ApiStats = require("../models/apiStats");

async function getOwnerStats(req, res) {
  try {
    const { wallet } = req.params;

    const escapedWallet = wallet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const apis = await db.Api.find({
      payTo: { $regex: new RegExp(`^${escapedWallet}$`, "i") },
    });

    const apiIds = apis.map((api) => api.apiId);

    const stats = await ApiStats.find({ apiId: { $in: apiIds } });

    let totalCalls = 0;
    let totalEarnings = 0;

    stats.forEach((s) => {
      totalCalls += s.callCount;
      totalEarnings += s.totalEarnings;
    });

    return res.json({
      totalApis: apis.length,
      totalCalls,
      totalEarnings,
      apis: apis.map((api) => {
        const stat = stats.find((s) => s.apiId === api.apiId);
        return {
          apiId: api.apiId,
          name: api.name,
          amount: api.amount,
          callCount: stat?.callCount || 0,
          totalEarnings: stat?.totalEarnings || 0,
        };
      }),
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

module.exports = { getOwnerStats };
