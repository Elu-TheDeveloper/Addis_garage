const express =require('express')

const router = express.Router()

const employeeController = require('../controllers/employee.controller')
const authMiddleware = require("../middlewares/auth") 
router.post('/api/employee',authMiddleware.verifyToken ,authMiddleware.isAdmin, employeeController.createEmployee)
router.get('/api/employee', authMiddleware.verifyToken, authMiddleware.isAdmin, employeeController.getAllEmployees)
router.delete(
  '/api/employee/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  employeeController.deleteEmployee
);
module.exports = router