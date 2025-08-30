const pool = require("../config/db.config")
const crypto = require("crypto");
const nodemailer = require("nodemailer");

async function checkCustomerExists(customer_id) {
  const query = "SELECT * FROM customer_identifier WHERE customer_id = ?";
  const result = await pool.query(query, [customer_id]);
  // console.log(`Query result for customer_id ${customer_id}:`, result);
  return Array.isArray(result) && result.length > 0;
}

async function checkService(service_id) {
  try {
    const query = "SELECT * FROM common_services WHERE service_id = ?";
    const result = await pool.query(query, [service_id]);
    // console.log(`Raw result for service_id ${service_id}:`, result);
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    return rows && (Array.isArray(rows) ? rows.length > 0 : !!rows);
  } catch (error) {
    console.error(`Error querying service_id ${service_id}:`, error);
    throw error;
  }
}

// Ensure these functions are defined in your db.config.js or similar
async function checkEmployeeExists(employee_id) {
  try {
    const query = `SELECT employee_id FROM employee WHERE employee_id = ?`;
    const result = await pool.query(query, [employee_id]);
    // console.log(`Raw result for employee_id ${employee_id}:`, result);
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    return rows && (Array.isArray(rows) ? rows.length > 0 : !!rows);
  } catch (error) {
    console.error(`Error checking employee existence: ${error.message}`);
    throw new Error("Failed to verify employee existence");
  }
}
async function checkVehicle(vehicle_id) {
  try {
    const query = "SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?";
    const result = await pool.query(query, [vehicle_id]);
    // console.log(`Raw result for vehicle_id ${vehicle_id}:`, result);
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    return rows && (Array.isArray(rows) ? rows.length > 0 : !!rows);
  } catch (error) {
    console.error(`Error querying vehicle_id ${vehicle_id}:`, error);
    throw error;
  }
}



async function createOrders(orderData) {
  try {
    const {
      vehicle_id,
      active_order,
      customer_id,
      employee_id,
      order_description,
      order_status,
      order_total_price,
      completion_date,
      additional_request,
      additional_requests_completed,
      order_services,
      estimated_completion_date,
    } = orderData;

    // Validate order_services
    if (!Array.isArray(order_services)) {
      throw new Error("order_services must be an array");
    }
    if (order_services.length === 0) {
      throw new Error("order_services must not be empty");
    }
    for (const service of order_services) {
      if (
        typeof service !== "object" ||
        !service.service_id ||
        service.service_completed === undefined
      ) {
        throw new Error(
          "Each service in order_services must have service_id and service_completed"
        );
      }
      const serviceExists = await checkService(service.service_id);
      if (!serviceExists) {
        throw new Error(`Service with ID ${service.service_id} does not exist`);
      }
    }

    console.log("Order Services:", order_services);

    const order_hash = crypto.randomUUID();

    // Check if customer exists
    const customerExists = await checkCustomerExists(customer_id);
    if (!customerExists) {
      throw new Error(`Customer with ID ${customer_id} does not exist`);
    }

    // Check if vehicle exists
    const vehicleExists = await checkVehicle(vehicle_id);
    if (!vehicleExists) {
      throw new Error(`Vehicle with ID ${vehicle_id} does not exist`);
    }

    // Check if employee exists
    const employeeExists = await checkEmployeeExists(employee_id);
    if (!employeeExists) {
      throw new Error(`Employee with ID ${employee_id} does not exist`);
    }

    console.log("Attempting to insert order with employee_id:", employee_id);

    // Create order
    const orderQuery = `
      INSERT INTO orders (
        employee_id, customer_id, vehicle_id, active_order, order_date, order_hash
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const orderResultRaw = await pool.query(orderQuery, [
      employee_id,
      customer_id,
      vehicle_id,
      active_order || 1,
      new Date(),
      order_hash,
    ]);
    // console.log(`Order query raw result:`, orderResultRaw);
    const orderResult = Array.isArray(orderResultRaw) && orderResultRaw[0] ? orderResultRaw[0] : orderResultRaw;
    if (!orderResult || !orderResult.insertId) {
      throw new Error("Failed to create order");
    }
    // console.log("Order Result:", orderResult);
    const order_id = orderResult.insertId;

    // Create order info
    const orderInfoQuery = `
      INSERT INTO order_info (
        order_id, 
        order_total_price, 
        estimated_completion_date, 
        completion_date,
        additional_request,
        additional_requests_completed,
        notes_for_customer
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const orderInfoResultRaw = await pool.query(orderInfoQuery, [
      order_id,
      order_total_price || 0,
      estimated_completion_date || null,
      completion_date || null,
      additional_request || null,
      additional_requests_completed || 0,
      order_description || null,
    ]);
    // console.log("Order Info Result:", orderInfoResultRaw);
    if (!orderInfoResultRaw || !orderInfoResultRaw.affectedRows) {
      throw new Error("Failed to create order info");
    }

    // Create order services
    const orderServiceQuery = `
      INSERT INTO order_services (
        order_id,
        service_id,
        service_completed
      ) VALUES (?, ?, ?)
    `;
    for (const service of order_services) {
      const serviceCompletedValue = service.service_completed ? 1 : 0;
      const orderServiceResultRaw = await pool.query(orderServiceQuery, [
        order_id,
        service.service_id,
        serviceCompletedValue,
      ]);
      // console.log("Order Service Result:", orderServiceResultRaw);
      if (!orderServiceResultRaw || !orderServiceResultRaw.affectedRows) {
        throw new Error("Failed to create order service");
      }
    }

    // Create order status
    const orderStatusQuery = `
      INSERT INTO order_status (
        order_id,
        order_status
      ) VALUES (?, ?)
    `;
    const orderStatusResultRaw = await pool.query(orderStatusQuery, [
      order_id,
      order_status,
    ]);
    // console.log("Order Status Result:", orderStatusResultRaw);
    if (!orderStatusResultRaw || !orderStatusResultRaw.affectedRows) {
      throw new Error("Failed to create order status");
    }

    sendEmail(customer_id, order_hash);

    return {
      message: "Order and related records created successfully",
      order_id,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function sendEmail(customerID, orderHash) {
  console.log("CID:", customerID);

  if (!customerID) {
    throw new Error("bado Customer-id");
  }

  const query =
    "SELECT customer_identifier.customer_email,customer_info.customer_first_name ,customer_info.customer_last_name FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_id =?";

  try {
    const [response] = await pool.query(query, [customerID]);
    console.log(response?.customer_email);
    console.log(response);

    if (!response?.customer_email) {
      throw new Error("Email not found or error updating user");
    }

    const email = response?.customer_email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AdminEmail,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.AdminEmail,
      to: email,
      subject: "Check Your Car Service Status Anytime!",
      text: `Update on Your Car Service: View Status via This Link:-  http://localhost:5173/order-status/${orderHash}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
      }
      console.log("the order email is  sent:", info.response);
    });
  } catch (error) {
    console.error("Error in reset function:", error);
  }
}

module.exports ={
checkCustomerExists,
checkVehicle,
checkEmployeeExists,
checkService,
createOrders,
}
