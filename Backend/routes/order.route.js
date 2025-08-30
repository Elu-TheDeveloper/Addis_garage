const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth");

router.post("/order",authMiddleware.verifyToken, orderController.createOrder);

module.exports =router