const express = require("express");
const router = express.Router();
const { getOwnerStats } = require("../controllers/StatsController");

router.get("/stats/:wallet", getOwnerStats);

module.exports = router;
