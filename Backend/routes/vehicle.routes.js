const express = require("express");
const vehicleController = require("../controllers/vehicle.controller");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
router.post('/api/vehicle',authMiddleware.verifyToken,vehicleController.addVehicle)
router.get('/api/vehicle/:id',authMiddleware.verifyToken, vehicleController.singleVehicle)
router.put('/api/vehicle/update',authMiddleware.verifyToken, vehicleController.updateVehicle)
router.get('/api/vehicle/:customer_id',authMiddleware.verifyToken,vehicleController.vehiclePerCustomer)
router.get('/api/vehicle_order/:vehicle_id',authMiddleware.verifyToken ,vehicleController.hasServiceOrder)
router.delete('/api/deleteVehicle/:vehicle_id', authMiddleware.verifyToken, authMiddleware.isAdmin ,vehicleController.deleteVehicle,
vehicleController.deleteVehicle);

module.exports =router