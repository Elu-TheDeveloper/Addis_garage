const pool =require("../config/db.config")

const bcrypt =require("bcrypt");

const employeeService =require("./employee.service")
async function logIn(employeeData) {
    try {
        if (!employeeData.employee_email || typeof employeeData.employee_email !== 'string') {
            return {
                status: "fail",
                message: "Invalid email"
            };
        }

        const employee = await employeeService.getEmployeeByEmail(employeeData.employee_email);

        if (!employee) {  // employee is null if not found
            return {
                status: "fail",
                message: "Employee does not exist"
            };
        }

        const passwordMatch = await bcrypt.compare(
            employeeData.employee_password,          // plaintext password from request
            employee.employee_password_hashed       // hashed password from DB
        );

        if (!passwordMatch) {
            return {
                status: 'fail',
                message: "Incorrect password"
            };
        }

        return {
            status: "success",
            data: employee
        };
    } catch (error) {
        console.error(error);
        return {
            status: "fail",
            message: "Internal server error"
        };
    }
}

module.exports={
    logIn
}