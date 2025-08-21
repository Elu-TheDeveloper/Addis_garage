const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');
const xss = require('xss');
const { body, validationResult } = require('express-validator');

// Constants
const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
const ERRORS = {
  EMPLOYEE_EXISTS: 'Employee with this email already exists',
  INVALID_DATA: 'Invalid or missing employee data',
  DB_FAILURE: 'Database operation failed',
  WEAK_PASSWORD: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  INVALID_ROLE: 'Invalid company role specified',
  EMPLOYEE_NOT_FOUND: 'Employee not found'
};

// Input Validation Rules
const employeeValidationRules = [
  body('employee_email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('employee_password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: MIN_PASSWORD_LENGTH }).withMessage(ERRORS.WEAK_PASSWORD)
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  
  body('employee_first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isAlpha('en-US', {ignore: ' -' }).withMessage('First name must contain only letters'),
  
  body('employee_last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isAlpha('en-US', {ignore: ' -' }).withMessage('Last name must contain only letters'),
  
  body('employee_phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Invalid phone number format'),
  
  body('company_role_id')
    .notEmpty().withMessage('Company role is required')
    .isInt().withMessage('Company role must be an integer')
];

// Sanitize input
const sanitizeInput = (value) => {
  if (value === null || value === undefined) return value;
  return typeof value === 'string' ? xss(value.trim()) : value;
};

// Check if employee exists
const checkIfEmployeeExists = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 1 FROM employee 
       WHERE LOWER(employee_email) = ? 
       LIMIT 1`,
      [sanitizeInput(email?.toLowerCase())]
    );
    return rows.length > 0;
  } catch (error) {
    console.error(`Employee existence check failed:`, error);
    throw new Error(ERRORS.DB_FAILURE);
  } finally {
    connection.release();
  }
};

// Verify company role exists
const checkIfCompanyRoleExists = async (roleId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 1 FROM company_roles 
       WHERE company_role_id = ? 
       LIMIT 1`,
      [roleId]
    );
    return rows.length > 0;
  } catch (error) {
    console.error(`Role verification failed:`, error);
    throw new Error(ERRORS.DB_FAILURE);
  } finally {
    connection.release();
  }
};
async function getSingleEmployeeService(employee) {
  try {
    const employee_id = employee;

    const query =
      "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id WHERE employee.employee_id = ?";

    const rows = await connection.query(query, [employee_id]);

    return rows; 
  } catch (error) {
    console.log(error);
  }
}

// Get employee by email
async function getEmployeeByEmail(employee_email) {
  const query = `
   SELECT 
  employee.employee_id,
  employee.employee_email,
  employee.active_employee,        
  employee_info.employee_first_name,
  employee_info.employee_last_name,
  employee_pass.employee_password_hashed,
  employee_role.company_role_id
FROM employee
INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id
INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id
INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id
WHERE employee.employee_email = ?
LIMIT 1
  `;

  const [rows] = await pool.query(query, [employee_email]);
  return rows.length > 0 ? rows[0] : null;
}



// Create new employee (transactional)
const createEmployee = async (employeeData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check for existing employee
    if (await checkIfEmployeeExists(employeeData.employee_email)) {
      throw new Error(ERRORS.EMPLOYEE_EXISTS);
    }

    // Verify company role exists
    if (!await checkIfCompanyRoleExists(employeeData.company_role_id)) {
      throw new Error(ERRORS.INVALID_ROLE);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      sanitizeInput(employeeData.employee_password), 
      SALT_ROUNDS
    );

    // Insert employee record
    const [result] = await connection.query(
      `INSERT INTO employee (employee_email, active_employee) 
       VALUES (?, ?)`,
      [
        sanitizeInput(employeeData.employee_email.toLowerCase()),
        true
      ]
    );
    const employeeId = result.insertId;

    // Insert related records
    await Promise.all([
      connection.query(
        `INSERT INTO employee_info 
         (employee_id, employee_first_name, employee_last_name, employee_phone) 
         VALUES (?, ?, ?, ?)`,
        [
          employeeId,
          sanitizeInput(employeeData.employee_first_name),
          sanitizeInput(employeeData.employee_last_name),
          sanitizeInput(employeeData.employee_phone)
        ]
      ),
      connection.query(
        `INSERT INTO employee_pass 
         (employee_id, employee_password_hashed) 
         VALUES (?, ?)`,
        [employeeId, hashedPassword]
      ),
      connection.query(
        `INSERT INTO employee_role 
         (employee_id, company_role_id) 
         VALUES (?, ?)`,
        [employeeId, employeeData.company_role_id]
      )
    ]);

    await connection.commit();
    return { employee_id: employeeId };
  } catch (error) {
    await connection.rollback();
    console.error('Employee creation failed:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};
async function getAllEmployeesService(showInactive = false) {
  const connection = await pool.getConnection();
  try {
    let query = `
      SELECT e.*, ei.*, er.*, cr.*
      FROM employee e
      LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
      LEFT JOIN employee_role er ON e.employee_id = er.employee_id
      LEFT JOIN company_roles cr ON er.company_role_id = cr.company_role_id
    `;

    if (!showInactive) {
      query += ` WHERE e.active_employee = 1`;
    } else {
      query += ` WHERE e.active_employee = 0`;
    }

    query += ` ORDER BY ei.employee_first_name ASC`;

    const [rows] = await connection.query(query);
    return rows;
  } catch (error) {
    console.error("Error in getAllEmployeesService:", error);
    throw error;
  } finally {
    connection.release();
  }
}



async function updateEmployeeService(employee) {
  const connection = await pool.getConnection();
  try {
    const {
      employee_id,
      employee_first_name,
      employee_last_name,
      employee_phone,
      company_role_id,
      employee_email,
      active_employee,
    } = employee;

    if (
      employee_id === undefined ||
      employee_first_name === undefined ||
      employee_last_name === undefined ||
      company_role_id === undefined ||
      employee_email === undefined ||
      active_employee === undefined
    ) {
      throw new Error("One or more required parameters are undefined.");
    }

    const phone = employee_phone || 'N/A'; // Default value if empty
    console.log("Updating employee with data:", employee);

    const query1 = `UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?`;
    const query2 = `UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?`;
    const query3 = `UPDATE employee SET employee_email = ?, active_employee = ? WHERE employee_id = ?`;

    const [rows1] = await connection.query(query1, [
      employee_first_name,
      employee_last_name,
      phone,
      employee_id,
    ]);
    const [rows2] = await connection.query(query2, [company_role_id, employee_id]);
    const [rows3] = await connection.query(query3, [employee_email, active_employee, employee_id]);

    return { rows1, rows2, rows3 };
  } catch (error) {
    console.error("Error updating employee:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

const deleteEmployeeService = async (employeeId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if employee exists
    const [rows] = await connection.query(
      `SELECT employee_id FROM employee WHERE employee_id = ?`,
      [employeeId]
    );
    if (rows.length === 0) {
      throw new Error("Employee not found");
    }

    // Delete from related tables first (to avoid FK constraint issues)
    await Promise.all([
      connection.query(
        `DELETE FROM employee_info WHERE employee_id = ?`,
        [employeeId]
      ),
      connection.query(
        `DELETE FROM employee_pass WHERE employee_id = ?`,
        [employeeId]
      ),
      connection.query(
        `DELETE FROM employee_role WHERE employee_id = ?`,
        [employeeId]
      )
    ]);

    // Finally, delete from employee table
    const [deleteResult] = await connection.query(
      `DELETE FROM employee WHERE employee_id = ?`,
      [employeeId]
    );

    await connection.commit();

    return deleteResult.affectedRows > 0; // true if deleted, false if not
  } catch (error) {
    await connection.rollback();
    console.error("Employee deletion failed:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};





// Validate middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array().map(err => err.msg) 
    });
  }
  next();
};

module.exports = {
  employeeValidationRules,
  validate,
  checkIfEmployeeExists,
  checkIfCompanyRoleExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployeesService,
  updateEmployeeService,
  getSingleEmployeeService,
  deleteEmployeeService,
  ERRORS
};