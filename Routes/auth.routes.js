const express = require("express");
const path = require("path");
const authController = require("../Controller/auth.controller");

const router = express.Router();

router.get("/login", authController.getLoginController);

router.post("/login", authController.postLoginController);

router.post("/logout", authController.postLogoutController);

router.get("/signup", authController.getSignupController);

router.post("/signup", authController.postSignupController);

module.exports = router;
