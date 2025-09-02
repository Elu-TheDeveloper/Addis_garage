const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth");

router.post("/order",authMiddleware.verifyToken, orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/order_detail/:id", orderController.getOrderDetailById);

module.exports =router