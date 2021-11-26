const express = require("express");
const path = require("path");
const cashierController = require("../Controller/cashier.controller");
const { authorize } = require("../Middlewares/roleCheck");

const router = express.Router();

router.get("/orders", authorize("cashier"), cashierController.getOrderController);

router.post("/orders", authorize("cashier"), cashierController.postSearchOrdersController);

router.get("/viewOrder/:id", authorize("cashier"), cashierController.getViewOrderController);

router.post("/viewOrder", authorize("cashier"), cashierController.togglePaidController);

router.get("/dashboard", authorize("cashier"), cashierController.getDashboardController);

router.get("/pendingOrders", authorize("cashier"), cashierController.getPendingOrdersController);

router.post("/pendingOrders", authorize("cashier"), cashierController.postSearchOrdersController);

router.get("/confirmedOrders", authorize("cashier"), cashierController.getConfirmedOrdersController);

router.get("/findOrders", authorize("cashier"), cashierController.getFindOrderController);

module.exports = router;