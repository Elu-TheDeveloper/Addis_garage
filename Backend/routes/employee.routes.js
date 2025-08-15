const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const employeeController = require('../controllers/employee.controller');

router.post('/api/employee', authMiddleware.verifyToken, authMiddleware.isAdmin, employeeController.createEmployee);
router.get('/api/employee', authMiddleware.verifyToken, authMiddleware.isAdmin, employeeController.getAllEmployees);
router.delete('/api/employee/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, employeeController.deleteEmployee);
router.put('/api/employee/update', authMiddleware.verifyToken, authMiddleware.isAdmin, employeeController.updateEmployee);

module.exports = router;
