const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');
const xss = require('xss');

// Sanitize all input
function sanitize(value) {
  return typeof value === 'string' ? xss(value.trim()) : value;
}

// ✅ Check if employee exists by email
async function checkIfEmployeeExists(email) {
  try {
    const trimmedEmail = sanitize(email.toLowerCase());
    const [rows] = await pool.query(
      'SELECT * FROM employee WHERE LOWER(employee_email) = ?',
      [trimmedEmail]
    );

    return rows.length > 0;
  } catch (err) {
    console.error('Error checking if employee exists:', err);
    throw err;
  }
}

// ✅ Create a new employee with transactional integrity
async function createEmployee(employee) {
  let connection;

  try {
    // Sanitize inputs
    const sanitizedEmail = sanitize(employee.employee_email.toLowerCase());
    const sanitizedFirstName = sanitize(employee.employee_first_name);
    const sanitizedLastName = sanitize(employee.employee_last_name);
    const sanitizedPhone = sanitize(employee.employee_phone);
    const sanitizedPassword = sanitize(employee.employee_password);
    const sanitizedRoleId = parseInt(employee.company_role_id);
    const sanitizedActive = !!employee.active_employee;

    // Check if employee already exists
    const exists = await checkIfEmployeeExists(sanitizedEmail);
    if (exists) {
      throw new Error('Employee with this email already exists');
    }

    // Begin transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);

    // Insert into `employee` table
    const [result1] = await connection.query(
      'INSERT INTO employee(employee_email, active_employee) VALUES (?, ?)',
      [sanitizedEmail, sanitizedActive]
    );
    const employee_id = result1.insertId;

    // Insert into `employee_info` table
    await connection.query(
      'INSERT INTO employee_info(employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)',
      [employee_id, sanitizedFirstName, sanitizedLastName, sanitizedPhone]
    );

    // Insert into `employee_pass` table
    await connection.query(
      'INSERT INTO employee_pass(employee_id, employee_password_hashed) VALUES (?, ?)',
      [employee_id, hashedPassword]
    );

    // Insert into `employee_role` table
    await connection.query(
      'INSERT INTO employee_role(employee_id, company_role_id) VALUES (?, ?)',
      [employee_id, sanitizedRoleId]
    );

    await connection.commit();
    connection.release();

    return { employee_id };

  } catch (err) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error in createEmployee:', err.message);
    return false;
  }
}

// ✅ Get full employee data by email
async function getEmployeeByEmail(email) {
  try {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email passed to getEmployeeByEmail');
    }

    const sanitizedEmail = sanitize(email.toLowerCase());

    const [rows] = await pool.query(
      `
      SELECT 
        e.employee_id, e.employee_email, e.active_employee,
        ei.employee_first_name, ei.employee_last_name, ei.employee_phone,
        er.company_role_id,
        ep.employee_password_hashed
      FROM employee e
      JOIN employee_info ei ON e.employee_id = ei.employee_id
      JOIN employee_role er ON e.employee_id = er.employee_id
      JOIN employee_pass ep ON e.employee_id = ep.employee_id
      WHERE LOWER(e.employee_email) = ?
      `,
      [sanitizedEmail]
    );

    if (rows.length === 0) return null;

    return rows[0];
  } catch (err) {
    console.error('Error in getEmployeeByEmail:', err.message);
    return null;
  }
}


module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail
};
