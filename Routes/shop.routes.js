const express = require("express");
const shopController = require("../Controller/shop.controller");
const isAuthenticated = require("../Middlewares/isAuthenticated");

const router = express.Router();

router.get("/", shopController.getIndexController);

router.get("/products", shopController.getProductController);

router.post("/productsSort", shopController.postSortProductsController);

router.get("/products/:productId", shopController.getProductByIdController);

router.get("/cart", isAuthenticated, shopController.getcartController);

router.post("/cart", isAuthenticated, shopController.postCartController);

router.post("/cart_delete_item", isAuthenticated, shopController.postCartDeleteProductController);

router.get("/orders", isAuthenticated, shopController.getOrdersController);

router.post("/orders", isAuthenticated, shopController.getOrdersController);

router.post('/create_order', isAuthenticated, shopController.postOrderController);

router.get("/invoice/:id", isAuthenticated, shopController.getInvoiceController);

router.get("/checkout/:id", shopController.getcheckoutController);

router.post("/checkout/:id", shopController.postCheckoutController);


module.exports = router;
