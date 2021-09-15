const express = require("express");
const shopController = require("../Controller/shop.controller");

const router = express.Router();

router.get("/", shopController.getIndexController);

router.get("/products", shopController.getProductController);

router.get("/products/:productId", shopController.getProductByIdController);

router.get("/cart", shopController.getcartController);

router.post("/cart", shopController.postCartController);

// router.get("/orders", shopController.getOrdersController);

router.post('/create_order', shopController.postOrderController);

// router.get("/checkout", shopController.getcheckoutController);

router.post("/cart_delete_item", shopController.postCartDeleteProductController);

module.exports = router;
