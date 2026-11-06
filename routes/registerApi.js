const express = require("express");
const router = express.Router();

const { registerApiController } = require("../controllers/controllerApi");
const { validateRegisterApi } = require("../validation/validationApi");
const { listApis } = require("../controllers/listApis");

router.get("/list", listApis);

router.post("/register", validateRegisterApi, registerApiController);

module.exports = router;
