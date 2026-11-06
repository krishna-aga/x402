const mongoose = require("mongoose");

const apiStatsSchema = new mongoose.Schema(
  {
    apiId: {
      type: String,
      required: true,
      unique: true,
    },

    callCount: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    lastTxHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApiStats", apiStatsSchema);
