// Import the express module
const express = require("express");

// Call the router method from express to create the router
const router = express.Router();

// Import the authMiddleware
const {
  verifyToken,
  isAdmin,
} = require("../middlewares/auth");

// Import the customer controller
const customerController = require("../controllers/customer.controller");

// Create a route to handle the customer creation request in post
router.post(
  "/api/customer",
  [verifyToken, isAdmin],
  customerController.createCustomerController
);

// Create a route to handle the get all customers request in get
router.get(
  "/api/customers/:offset",
  [verifyToken],
  customerController.getAllCustomersController
);



router.get(
  "/api/customer/single/:customer_id",
  [verifyToken],
  customerController.getSingleCustomerController
);

// Create a route to handle the customer update request in put
router.put(
  "/api/customer/update",
  [verifyToken],
  customerController.updateCustomerController
);

// Create a route to handle the customer deletion request in delete
router.delete(
  "/api/customer/delete/:customer_id",
  [verifyToken, isAdmin],
  customerController.deleteCustomerController
);



router.get('/api/total_customers',customerController.totalNCustomers)
router.get('/api/searched_customer/:credential',customerController.searchedCustomerController)

// Export the router
module.exports = router;
