const express = require("express");
const vehicleController = require("../controllers/vehicle.controller");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
router.post('/api/vehicle',authMiddleware.verifyToken,vehicleController.addVehicle)
router.get('/api/vehicle/:id',authMiddleware.verifyToken, vehicleController.singleVehicle)

module.exports =router