
const crypto = require("crypto");
const db = require("../models/db");
const ApiStats = require("../models/apiStats");

const registerApiController = async (req, res) => {
  try {
    const { name, payTo, amount, endpoint } = req.body;

    // Check if an API with the same endpoint already exists
    const existingApi = await db.Api.findOne({ endpoint });

    if (existingApi) {
      return res.status(400).json({
        error: "API with this endpoint already exists",
      });
    }

    // Generate a unique API ID
    const apiId = crypto.randomUUID();

    // Create and save the API
    const newApi = await db.Api.create({
      apiId,
      name,
      payTo,
      amount,
      endpoint,
    });

    // Initialize API usage statistics
    await ApiStats.create({ apiId });

    return res.status(201).json({
      message: "API registered successfully",
      data: newApi,
    });

  } catch (error) {
    console.error("Register API Error:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

module.exports = {
  registerApiController,
};
