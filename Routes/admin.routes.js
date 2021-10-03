const express = require("express");
const path = require("path");
const adminController = require("../Controller/admin.controller");
const isAuthenticated = require("../Middlewares/isAuthenticated");
const {checkAdmin} = require("../Middlewares/isAdmin");

const router = express.Router();

// router.get("/login", adminController.loginController);

router.get("/add_product", isAuthenticated, checkAdmin, adminController.getAddProductController);

router.post("/add_product", isAuthenticated, checkAdmin, adminController.postAddProductController);

router.get("/products", checkAdmin, adminController.getProductController);

router.get("/edit_product/:productId", isAuthenticated, checkAdmin, adminController.getEditProductController);

router.post("/edit_product", isAuthenticated, checkAdmin, adminController.postEditProductController);

router.post("/delete_product", isAuthenticated, checkAdmin, adminController.postDeleteProductController);

router.post("/disable_product", isAuthenticated, checkAdmin, adminController.toggleDisableProductController
);

router.get("/dashboard", checkAdmin, adminController.getDashboardController);

router.get("/orders", checkAdmin, adminController.getOrdersController);

router.post("/orders", checkAdmin, adminController.getOrdersController);

module.exports = router;
