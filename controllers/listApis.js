const db = require("../models/db");

async function listApis(req, res) {
  try {
    const apis = await db.Api.find().sort({ createdAt: -1 }); 

    return res.status(200).json(apis);
  } catch (error) {
    console.error("Error fetching APIs:", error);
    return res.status(500).json({
      error: "Failed to fetch APIs",
    });
  }
}

module.exports = {
  listApis,
};
