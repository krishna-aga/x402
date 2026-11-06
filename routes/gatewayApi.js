const express = require("express");
const router = express.Router();

const { checkApi } = require("../middlewares/checkApi");
const { x402Middleware } = require("../middlewares/x402middleware");
const { fetchApiMiddleware } = require("../middlewares/fetchApi");

router.get("/:Id", checkApi, x402Middleware, fetchApiMiddleware);

module.exports = router;
