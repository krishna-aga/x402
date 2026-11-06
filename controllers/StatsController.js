
const db = require("../models/db");
const ApiStats = require("../models/apiStats");

const getOwnerStats = async (req, res) => {
  try {
    const { wallet } = req.params;

    // Escape special regex characters to prevent regex injection
    const escapedWallet = wallet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Fetch all APIs registered by this wallet
    const apis = await db.Api.find({
      payTo: {
        $regex: `^${escapedWallet}$`,
        $options: "i",
      },
    }).lean();

    // Extract API IDs
    const apiIds = apis.map(({ apiId }) => apiId);

    // Fetch statistics for all APIs in one query
    const stats = await ApiStats.find({
      apiId: { $in: apiIds },
    }).lean();

    // Create a lookup map for O(1) statistics access
    const statsMap = new Map(
      stats.map((stat) => [stat.apiId, stat])
    );

    // Calculate aggregated statistics
    const { totalCalls, totalEarnings } = stats.reduce(
      (totals, stat) => ({
        totalCalls: totals.totalCalls + (stat.callCount || 0),
        totalEarnings: totals.totalEarnings + (stat.totalEarnings || 0),
      }),
      { totalCalls: 0, totalEarnings: 0 }
    );

    // Build dashboard API data
    const apiData = apis.map((api) => {
      const stat = statsMap.get(api.apiId);

      return {
        apiId: api.apiId,
        name: api.name,
        amount: api.amount,
        callCount: stat?.callCount || 0,
        totalEarnings: stat?.totalEarnings || 0,
      };
    });

    return res.status(200).json({
      totalApis: apis.length,
      totalCalls,
      totalEarnings,
      apis: apiData,
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      error: "Failed to fetch stats",
    });
  }
};

module.exports = { getOwnerStats };
