const crypto = require("crypto");
const db = require("../models/db");
const ApiStats = require("../models/apiStats");

async function registerApiController(req, res) {
  try {
    const { name, payTo, amount, endpoint } = req.body;

    const apiId = crypto.randomUUID();

    const existingApi = await db.Api.findOne({ endpoint });
    if (existingApi) {
      return res.status(400).json({
        error: "API with this endpoint already exists",
      });
    }

    const newApi = new db.Api({
      apiId,
      name,
      payTo,
      amount,
      endpoint,
    });

    const savedApi = await newApi.save();
    await ApiStats.create({
        apiId: newApi.apiId,
      });

    return res.status(201).json({
      message: "✅ API registered successfully",
      data: savedApi,
    });
  } catch (error) {
    console.error("Register API Error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

module.exports = {
  registerApiController,
};
