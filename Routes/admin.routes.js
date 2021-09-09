const express = require("express");
const path = require("path");
const adminController = require("../Controller/admin.controller");

const router = express.Router();

// GET ROUTES

// router.get("/login", adminController.loginController);

router.get("/add_product", adminController.getAddProductController);

router.get("/products", adminController.getProductController);

// POST ROUTES

router.post("/add_product", adminController.postAddProductController);

module.exports = router;
