const express = require("express");
const shopController = require("../Controller/shop.controller");
const isAuthenticated = require("../Middlewares/isAuthenticated");
const { authorize } = require("../Middlewares/roleCheck");

const router = express.Router();

router.get("/", shopController.getIndexController);

router.get("/products", shopController.getProductController);

router.post("/productsSort",  authorize('user'), shopController.postSortProductsController);

router.get("/products/:productId",  authorize('user'), shopController.getProductByIdController);

router.get("/cart", isAuthenticated,  authorize('user'), shopController.getcartController);

router.post("/cart", isAuthenticated,  authorize('user'), shopController.postCartController);

router.post("/cart_delete_item", isAuthenticated,  authorize('user'), shopController.postCartDeleteProductController);

router.get("/orders", isAuthenticated,  authorize('user'), shopController.getOrdersController);

router.post("/orders", isAuthenticated,  authorize('user'), shopController.getOrdersController);

router.post('/create_order', isAuthenticated,  authorize('user'), shopController.postOrderController);

router.get("/invoice/:id", isAuthenticated,  authorize('user'), shopController.getInvoiceController);

router.get("/checkout/:id",  authorize('user'), shopController.getcheckoutController);

router.post("/checkout/:id", authorize('user'), shopController.postCheckoutController);


module.exports = router;
