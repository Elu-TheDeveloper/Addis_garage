const bcrypt = require('bcrypt');
const employeeService = require("./employee.service");

async function logIn(employeeData) {
  try {
    const employee = await employeeService.getEmployeeByEmail(employeeData.employee_email);

    // Check if employee exists (now handling single object response)
    if (!employee) {
      return {
        status: "fail",
        message: "Employee does not exist",
        statusCode: 404
      };
    }
    //Check Active Status
if (!employee.active_employee) {
      return {
        status: "fail",
        message: "Your account is inactive. Please contact admin.",
        statusCode: 403
      };
    }
    // Verify password
    const passwordMatch = await bcrypt.compare(
      employeeData.employee_password,
      employee.employee_password_hashed
    );

    if (!passwordMatch) {
      return {
        status: "fail",
        message: "Incorrect password",
        statusCode: 401
      };
    }

    // Remove sensitive data before returning
    const { employee_password_hashed, ...safeEmployeeData } = employee;

    return {
      status: "success",
      employee: safeEmployeeData
    };

  } catch (error) {
    console.error("Login service error:", error);
    return {
      status: "error",
      message: "Internal server error during login",
      statusCode: 500,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    };
  }
}

module.exports = {
  logIn
};