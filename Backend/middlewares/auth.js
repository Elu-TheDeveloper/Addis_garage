// Import the dotenv package
require('dotenv').config();
// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");
// A function to verify the token received from the frontend 
// Import the employee service 
const employeeService = require("../services/employee.service");

// A function to verify the token received from the frontend 
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }

  // Authorization header format: "Bearer tokenvalue"
  const token = authHeader.split(' ')[1]; // split by space, take second part

  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!"
      });
    }

    req.employee_email = decoded.employee_email;
    next();
  });
}


// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  const employee_email = req.employee_email;
  const employee = await employeeService.getEmployeeByEmail(employee_email);

  if (!employee) {
    return res.status(404).send({
      status: "fail",
      message: "User not found!"
    });
  }

  if (employee.company_role_id === 3) {
    return next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Not an Admin!"
    });
  }
};


const authMiddleware = {
  verifyToken,
  isAdmin
}

module.exports = authMiddleware;