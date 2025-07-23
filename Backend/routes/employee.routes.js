const express =require('express')

const router = express.Router()

const employeeController = require('../controllers/employee.controller')

router.post('/api/employee', employeeController.createEmployee)

module.exports = router