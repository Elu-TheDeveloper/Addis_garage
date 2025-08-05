const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');
const xss = require('xss');

// Sanitize all input
function sanitize(value) {
  return typeof value === 'string' ? xss(value.trim()) : value;
}

// Check if employee exists by email
async function checkIfEmployeeExists(email) {
  try {
    const trimmedEmail = sanitize((email || '').toLowerCase());
    const [rows] = await pool.query(
      'SELECT employee_id FROM employee WHERE LOWER(employee_email) = ? LIMIT 1',
      [trimmedEmail]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking if employee exists:', error);
    throw error;
  }
}

// Check if company role ID exists
async function checkIfCompanyRoleExists(company_role_id) {
  try {
    const [rows] = await pool.query(
      'SELECT company_role_id FROM company_roles WHERE company_role_id = ? LIMIT 1',
      [company_role_id]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking company role:', error);
    throw error;
  }
}

// Create the add employee controller
async function createEmployee(req, res, next) {
  try {
    // Check if employee email already exists in the database 
    const employeeExists = await checkIfEmployeeExists(req.body.employee_email);
    
    // If employee exists, send a response to the client
    if (employeeExists) {
      return res.status(400).json({
        status: "fail",
        message: "This email address is already associated with another employee!"
      });
    }

    const employeeData = req.body;
    
    // Validate required fields
    if (!employeeData.employee_password || employeeData.employee_password.length < 8) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 8 characters"
      });
    }

    // Create the employee
    const employeeId = await createEmployeeWithTransaction(employeeData);
    
    return res.status(201).json({
      status: "success",
      data: { employee_id: employeeId }
    });

  } catch (error) {  // Fixed: Changed 'err' to 'error' to match the parameter
    console.error('Error creating employee:', error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}

// Transactional employee creation
async function createEmployeeWithTransaction(employeeData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert into employee table
    const [employeeResult] = await connection.query(
      'INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)',
      [sanitize(employeeData.employee_email.toLowerCase()), true]
    );
    const employeeId = employeeResult.insertId;

    // Hash password
    const hashedPassword = await bcrypt.hash(
      sanitize(employeeData.employee_password), 
      10 // salt rounds
    );

    // Insert into related tables
    await Promise.all([
      connection.query(
        'INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)',
        [
          employeeId,
          sanitize(employeeData.employee_first_name),
          sanitize(employeeData.employee_last_name),
          sanitize(employeeData.employee_phone)
        ]
      ),
      connection.query(
        'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
        [employeeId, hashedPassword]
      ),
      connection.query(
        'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)',
        [employeeId, employeeData.company_role_id]
      )
    ]);

    await connection.commit();
    return employeeId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get employee by email with password hash and role info
async function getEmployeeByEmail(email) {
  try {
    const sanitizedEmail = sanitize((email || '').toLowerCase());
    const [rows] = await pool.query(
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
      LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
      LEFT JOIN employee_role er ON e.employee_id = er.employee_id
      LEFT JOIN employee_pass ep ON e.employee_id = ep.employee_id
      WHERE LOWER(e.employee_email) = ? LIMIT 1`,
      [sanitizedEmail]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error in getEmployeeByEmail:', error);
    throw error;
  }
}

module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail
};