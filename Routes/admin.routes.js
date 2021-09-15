const express = require("express");
const path = require("path");
const adminController = require("../Controller/admin.controller");

const router = express.Router();

// router.get("/login", adminController.loginController);

router.get("/add_product", adminController.getAddProductController);

router.post("/add_product", adminController.postAddProductController);

router.get("/products", adminController.getProductController);

router.get("/edit_product/:productId", adminController.getEditProductController);

router.post("/edit_product", adminController.postEditProductController);

router.post("/delete_product", adminController.postDeleteProductController);

router.post("/disable_product", adminController.toggleDisableProductController);

module.exports = router;
