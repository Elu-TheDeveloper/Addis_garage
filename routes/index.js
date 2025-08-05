// Import the Express module
const express = require('express')

// Create a new router instance from Express
const router = express.Router()

// Import the install-related routes from install.routes
const installRouter = require('./install.routes')

// Import the employee-related routes from employee.routes file
const employeeRouter = require('./employee.routes')

const loginRoutes =require('./login.routes')

// Use installRouter for handling install-related routes
router.use(installRouter)

// Use employeeRouter for handling employee-related routes
router.use(employeeRouter)
router.use(loginRoutes)

module.exports = router
