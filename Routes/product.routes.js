const express = require("express");
const productController = require("../Controller/product.controller");

const router = express.Router();

// GET ROUTES

router.get("/", productController.getIndexController);

router.get("/products", productController.getProductController);

router.get("/cart", productController.getcartController);

router.get("/orders", productController.getOrdersController);

router.get("/checkout", productController.getcheckoutController);

// POST ROUTES

module.exports = router;