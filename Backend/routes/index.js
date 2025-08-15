const express = require('express');
const router = express.Router();

// Import routes
const installRouter = require('./install.routes');
const employeeRouter = require('./employee.routes');
const loginRoutes = require('./login.routes');
const customerRoute = require('./customer.routes');

// Add JSON parsing middleware FIRST
router.use(express.json());

// Add proper CORS headers
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Mount routes
router.use(installRouter);
router.use(employeeRouter);
router.use(loginRoutes);
router.use(customerRoute);

// 404 Handler (catches all unhandled routes)
router.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Endpoint not found'
  });
});

// Error handler (catches all errors)
router.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

module.exports = router;