const express = require("express");
const adminController = require("../Controller/admin.controller");

const router = express.Router();

router.get("/login", adminController.loginController);

router.get("/add_product", adminController.addProductController);

router.post("/add_product", adminController.postProductController);

module.exports = router;
