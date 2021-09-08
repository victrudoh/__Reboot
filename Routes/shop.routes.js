const express = require("express");
const shopController = require("../Controller/shop.controller");

const router = express.Router();

router.get("/", shopController.shopController);

module.exports = router;