const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth");

router.post("/order",authMiddleware.verifyToken, orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/order_detail/:id", orderController.getOrderDetailById);
router.get("/order/:id" ,orderController.getOrderById)
router.get('/order/customer/:customerid',orderController.getOrderByCustomerId)
router.get("/order/details/:order_hash", orderController.getOrderAllDetail);
router.get("/search-customers", orderController.searchOrder);
router.put("/update/:order_id", orderController.updateOrder);
module.exports =router