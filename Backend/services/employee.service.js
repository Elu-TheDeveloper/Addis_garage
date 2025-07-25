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
    .isAlpha('en-US', { ignore: ' -' }).withMessage('First name must contain only letters'),
  
  body('employee_last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isAlpha('en-US', { ignore: ' -' }).withMessage('Last name must contain only letters'),
  
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

// Get employee by email
const getEmployeeByEmail = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        e.employee_id,
        e.employee_email,
        e.active_employee,
        ei.employee_first_name,
        ei.employee_last_name,
        ei.employee_phone,
        er.company_role_id,
        ep.employee_password_hashed
       FROM employee e
       JOIN employee_info ei ON e.employee_id = ei.employee_id
       JOIN employee_role er ON e.employee_id = er.employee_id
       JOIN employee_pass ep ON e.employee_id = ep.employee_id
       WHERE LOWER(e.employee_email) = ?
       LIMIT 1`,
      [sanitizeInput(email?.toLowerCase())]
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`Failed to fetch employee:`, error);
    throw new Error(ERRORS.DB_FAILURE);
  } finally {
    connection.release();
  }
};

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
  ERRORS
};