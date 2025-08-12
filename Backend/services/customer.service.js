const bcrypt = require("bcrypt");
const xss = require("xss"); 
const { pool } = require('../config/db.config');

// Check if customer exists
async function checkIfCustomerExists(email) {
  try {
    const sanitizedEmail = xss(email);
    const [rows] = await pool.query(
      "SELECT * FROM customer_identifier WHERE customer_email = ?",
      [sanitizedEmail]
    );
    // Return true if customer exists, false otherwise
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking customer existence:", error);
    throw new Error("Could not check customer existence. Please try again later.");
  }
}

// Create a new customer
async function createCustomer(customer) {
  let createdCustomer = {};

  try {
    const sanitizedEmail = xss(customer.customer_email);
    const sanitizedPhone = xss(customer.customer_phone_number);
    const sanitizedFirstName = xss(customer.customer_first_name);
    const sanitizedLastName = xss(customer.customer_last_name);
    const sanitizedStatus = xss(customer.active_customer_status);

    const saltRounds = 10;
    const hash_id = await bcrypt.hash(sanitizedEmail + Date.now(), saltRounds);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash)
         VALUES (?, ?, ?)` ,
        [sanitizedEmail, sanitizedPhone, hash_id]
      );

      if (result.affectedRows !== 1) {
        throw new Error("Failed to insert into customer_identifier");
      }

      const customer_id = result.insertId;

      const [result2] = await conn.query(
        `INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status)
         VALUES (?, ?, ?, ?)` ,
        [customer_id, sanitizedFirstName, sanitizedLastName, sanitizedStatus]
      );

      if (result2.affectedRows !== 1) {
        throw new Error("Failed to insert into customer_info");
      }

      await conn.commit();

      createdCustomer = {
        customer_id,
        customer_email: sanitizedEmail,
        customer_first_name: sanitizedFirstName,
        customer_last_name: sanitizedLastName,
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error creating customer:", error);
    throw new Error("Could not create customer. Please try again later.");
  }

  return createdCustomer;
}

// Get customer by email
async function getCustomerByEmail(customer_email) {
  try {
    const sanitizedEmail = xss(customer_email);
    const [rows] = await pool.query(
      `SELECT *
       FROM customer_identifier
       INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id
       WHERE customer_identifier.customer_email = ?` ,
      [sanitizedEmail]
    );
    return rows;
  } catch (error) {
    console.error("Error getting customer by email:", error);
    throw new Error("Could not get customer by email. Please try again later.");
  }
}

// Get single customer by ID
async function getSingleCustomer(customer_id) {
  try {
    const sanitizedId = xss(customer_id);
    const [rows] = await pool.query(
      `SELECT *
       FROM customer_identifier
       INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id
       WHERE customer_identifier.customer_id = ?` ,
      [sanitizedId]
    );
    return rows;
  } catch (error) {
    console.error("Error getting single customer:", error);
    throw new Error("Could not get customer. Please try again later.");
  }
}

// Get all customers
async function getAllCustomers(offset = 0) {
  try {
    const sanitizedOffset = Number(offset) || 0;
    const [rows] = await pool.query(
      `SELECT *
       FROM customer_identifier
       INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id
       ORDER BY customer_info.customer_id DESC, customer_info.customer_first_name ASC
       LIMIT 10 OFFSET ?` ,
      [sanitizedOffset]
    );
    return rows;
  } catch (error) {
    console.error("Error getting all customers:", error);
    throw new Error("Could not get customers. Please try again later.");
  }
}

// Update customer by ID
// Update customer by ID
async function updateCustomer(customer) {
  try {
    const sanitizedId = xss(customer.customer_id);
    const sanitizedEmail = xss(customer.customer_email || "");
    const sanitizedPhone = xss(customer.customer_phone_number || "");
    const sanitizedFirstName = xss(customer.customer_first_name || "");
    const sanitizedLastName = xss(customer.customer_last_name || "");
    const sanitizedStatus = xss(customer.active_customer_status || "");

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result1] = await conn.query(
        `UPDATE customer_identifier
         SET customer_email = ?, customer_phone_number = ?
         WHERE customer_id = ?` ,
        [sanitizedEmail, sanitizedPhone, sanitizedId]
      );

      const [result2] = await conn.query(
        `UPDATE customer_info
         SET customer_first_name = ?, customer_last_name = ?, active_customer_status = ?
         WHERE customer_id = ?` ,
        [sanitizedFirstName, sanitizedLastName, sanitizedStatus, sanitizedId]
      );

      await conn.commit();

      return {
        identifierRowsAffected: result1.affectedRows,
        infoRowsAffected: result2.affectedRows
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Could not update customer. Please try again later.");
  }
}


// Delete customer by ID
async function deleteCustomer(customer_id) {
  try {
    const sanitizedId = xss(customer_id);
    if (!sanitizedId) throw new Error("Customer ID is undefined");

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query("DELETE FROM customer_info WHERE customer_id = ?", [sanitizedId]);
      await conn.query("DELETE FROM customer_identifier WHERE customer_id = ?", [sanitizedId]);

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error("Could not delete customer. Please try again later.");
  }
}

// Count total customers
async function totalNumberOfCustomers() {
  try {
    const [result] = await pool.query(
      "SELECT COUNT(customer_id) AS num FROM customer_identifier"
    );
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Could not get customers. Please try again later.");
  }
}

// Search customers
async function searchedCustomers(searchWord) {
  try {
    const sanitizedWord = `%${xss(searchWord)}%`;
    const [rows] = await pool.query(
      `SELECT *
       FROM customer_identifier
       INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id
       WHERE customer_identifier.customer_email LIKE ?
          OR customer_identifier.customer_phone_number LIKE ?
          OR customer_info.customer_first_name LIKE ?
          OR customer_info.customer_last_name LIKE ?` ,
      [sanitizedWord, sanitizedWord, sanitizedWord, sanitizedWord]
    );
    return rows;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw new Error("Could not search customers. Please try again later.");
  }
}

module.exports = {
  checkIfCustomerExists,
  createCustomer,
  getCustomerByEmail,
  getSingleCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  totalNumberOfCustomers,
  searchedCustomers
};
