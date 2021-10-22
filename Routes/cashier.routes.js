const express = require("express");
const path = require("path");
const cashierController = require("../Controller/cashier.controller");
const { authorize } = require("../Middlewares/roleCheck");

const router = express.Router();

router.get("/orders", authorize("cashier"), cashierController.getOrderController);

router.post("/orders", authorize("cashier"), cashierController.postSearchOrdersController);

router.get("/viewOrder/:id", authorize("cashier"), cashierController.getViewOrderController);

router.post("/viewOrder", authorize("cashier"), cashierController.togglePaidController);

module.exports = router;