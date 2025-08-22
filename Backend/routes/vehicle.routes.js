const express = require("express");
const vehicleController = require("../controllers/vehicle.controller");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
router.post('/api/vehicle',authMiddleware.verifyToken,vehicleController.addVehicle)

module.exports =router