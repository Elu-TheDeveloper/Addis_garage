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
      notes_for_customer
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
    employee_id, customer_id, vehicle_id, active_order, order_description, order_hash
  ) VALUES (?, ?, ?, ?, ?, ?)
`;
 const orderResultRaw = await pool.query(orderQuery, [
  employee_id,
  customer_id,
  vehicle_id,
  active_order || 1,
  order_description || null, 
  order_hash,
]);

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
  notes_for_customer || null  // <-- Add this
]);

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
 
  if (!customerID) {
    throw new Error("Customer-id");
  }

  const query =
    "SELECT customer_identifier.customer_email,customer_info.customer_first_name ,customer_info.customer_last_name FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_id =?";

  try {
    const [response] = await pool.query(query, [customerID]);

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
async function getAllOrders({ limit, sortby, completed }) {
  try {
    let query = `
      SELECT 
      customer_identifier.customer_email,
      customer_identifier.customer_phone_number, 
      customer_info.customer_first_name,
      customer_info.customer_last_name ,
      customer_vehicle_info.vehicle_year,
      customer_vehicle_info.vehicle_make, 
      customer_vehicle_info.vehicle_model,
      customer_vehicle_info.vehicle_tag,
      employee_info.employee_first_name,
      employee_info.employee_last_name, 
      orders.*,
      order_info.*,
      order_services.*,
      order_status.* 
      FROM customer_identifier 
      INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id 
      INNER JOIN customer_vehicle_info ON customer_info.customer_id = customer_vehicle_info.customer_id 
      INNER JOIN orders ON orders.vehicle_id =  customer_vehicle_info.vehicle_id 
      INNER JOIN order_status ON orders.order_id = order_status.order_id 
      INNER JOIN employee_info ON orders.employee_id = employee_info.employee_id
      INNER JOIN order_info ON orders.order_id = order_info.order_id
      INNER JOIN order_services ON orders.order_id = order_services.order_id
      ORDER BY orders.order_id DESC
    `;
    let queryParams = [];

    if (completed !== undefined) {
      query += " WHERE o.order_status = ?";
      queryParams.push(completed);
    }

    if (sortby) {
      query += ` ORDER BY ${sortby}`;
    }

    if (limit) {
      query += " LIMIT ?";
      queryParams.push(parseInt(limit));
    }

    const orders = await pool.query(query, queryParams);
    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("An error occurred while retrieving the orders");
  }
}

// inside order.service.js

const getOrderDetailById = async (idOrHash) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        o.order_id,
        o.order_hash,
        o.order_date,
        o.order_description,
        oi.order_total_price,
        oi.estimated_completion_date,
        oi.completion_date,
        oi.additional_request,
        oi.notes_for_internal_use,
        oi.notes_for_customer,
        oi.additional_requests_completed,
        c.customer_id,
        c.customer_first_name,
        c.customer_last_name,
        ci.customer_email,
        ci.customer_phone_number,
        v.vehicle_id,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_year,
        v.vehicle_color,
        v.vehicle_serial,
        v.vehicle_tag,
        v.vehicle_mileage,
        e.employee_id,
        e.employee_first_name,
        e.employee_last_name,
        os.order_status,
        s.service_id,
        s.service_name,
        s.service_description,
        osrv.service_completed
      FROM orders o
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN customer_info c ON o.customer_id = c.customer_id
      LEFT JOIN customer_identifier ci ON ci.customer_id = c.customer_id
      LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
      LEFT JOIN employee_info e ON o.employee_id = e.employee_id
      LEFT JOIN order_status os ON os.order_id = o.order_id
      LEFT JOIN order_services osrv ON osrv.order_id = o.order_id
      LEFT JOIN common_services s ON osrv.service_id = s.service_id
      WHERE o.order_id = ? OR o.order_hash = ?
      `,
      [idOrHash, idOrHash]
    );

  

    // Normalize single-object case
    const rowArray = Array.isArray(rows) ? rows : [rows];

    if (rowArray.length === 0 || !rowArray[0]) {
      console.warn(`No order found for ID/hash: ${idOrHash}`);
      return null;
    }

    const baseOrder = rowArray[0];

    const services = rowArray
      .filter(r => r.service_id)
      .map(r => ({
        service_id: r.service_id,
        service_name: r.service_name,
        service_description: r.service_description,
        service_completed: r.service_completed
      }));

    return {
      orderId: baseOrder.order_id,
      orderHash: baseOrder.order_hash,
      orderDate: baseOrder.order_date,
      orderDescription: baseOrder.order_description,
      orderTotalPrice: baseOrder.order_total_price,
      estimatedCompletionDate: baseOrder.estimated_completion_date,
      completionDate: baseOrder.completion_date,
      additionalRequest: baseOrder.additional_request,
      notesForInternalUse: baseOrder.notes_for_internal_use,
      notesForCustomer: baseOrder.notes_for_customer,
      additionalRequestsCompleted: baseOrder.additional_requests_completed,
      customerId: baseOrder.customer_id,
      customerFirstName: baseOrder.customer_first_name,
      customerLastName: baseOrder.customer_last_name,
      customerEmail: baseOrder.customer_email,
      customerPhoneNumber: baseOrder.customer_phone_number,
      vehicleId: baseOrder.vehicle_id,
      vehicleMake: baseOrder.vehicle_make,
      vehicleModel: baseOrder.vehicle_model,
      vehicleYear: baseOrder.vehicle_year,
      vehicleColor: baseOrder.vehicle_color,
      vehicleSerial: baseOrder.vehicle_serial,
      vehicleTag: baseOrder.vehicle_tag,
      vehicleMileage: baseOrder.vehicle_mileage,
      employeeId: baseOrder.employee_id,
      employeeFirstName: baseOrder.employee_first_name,
      employeeLastName: baseOrder.employee_last_name,
      orderStatus: baseOrder.order_status,
      services
    };

  } catch (error) {
    console.error(`Error fetching order with ID/hash ${idOrHash}:`, error);
    throw new Error("An error occurred while retrieving the order");
  }
};








async function getOrderById(id) {
  try {
    // Query to get order details
    const orderQuery = `SELECT * FROM orders WHERE order_hash = ?`;
    const orderResult = await pool.query(orderQuery, [id]);
    if (orderResult.length === 0) {
      return null; // No order found
    }

    const order = orderResult;
    // Query to get associated services
    console.log("order", order[0].order_id);

    const OrderID = order[0].order_id;

    const servicesQuery = `
      SELECT * FROM order_services
      WHERE order_id = ?
    `;
    const servicesResult = await pool.query(servicesQuery, [OrderID]);
    console.log("serial", servicesResult);
    order[0].order_services = servicesResult || [];
    console.log("last ", order);

    const orderInfoQuery = `
    SELECT estimated_completion_date, completion_date FROM order_info
    WHERE order_id = ?
  `;
    const orderInfoResult = await pool.query(orderInfoQuery, [OrderID]);
    // console.log("ser",servicesResult)
    order[0].estimated_completion_date =
      orderInfoResult[0].estimated_completion_date || "";
    order[0].completion_date = orderInfoResult[0].completion_date || "";
    // order.push(servicesResult)
    console.log("info_result ", orderInfoResult);

    const orderStatusQuery = `
  SELECT order_status FROM order_status
  WHERE order_id = ?
`;
    const orderStatusResult = await pool.query(orderStatusQuery, [OrderID]);
    console.log("orderstatus", orderStatusResult);
    order[0].order_status = orderStatusResult[0]?.order_status;

    return order;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw new Error("An error occurred while retrieving the order");
  }
}

async function getOrderByCustomerId(id) {
  try {
    // Query to get order details
    const orderQuery = `SELECT 
    orders.order_date, 
    orders.order_hash, 
    orders.active_order, 
    order_info.order_total_price, 
    order_info.estimated_completion_date, 
    employee_info.employee_first_name, 
    employee_info.employee_last_name, 
    customer_vehicle_info.vehicle_make, 
    customer_vehicle_info.vehicle_serial, 
    common_services.service_name,
    common_services.service_description
FROM 
    orders
INNER JOIN 
    order_info ON orders.order_id = order_info.order_id
INNER JOIN 
    employee_info ON orders.employee_id = employee_info.employee_id
INNER JOIN 
    customer_vehicle_info ON orders.customer_id = customer_vehicle_info.customer_id
INNER JOIN 
    order_services ON orders.order_id = order_services.order_id
INNER JOIN 
    common_services ON order_services.service_id = common_services.service_id
WHERE 
    orders.customer_id = ?;
`;
    const orderResult = await pool.query(orderQuery, [id]);

    return orderResult;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw new Error("An error occurred while retrieving the order");
  }
}
async function updateOrder(orderData, order_id) {
  try {
    const {
      order_description,
      estimated_completion_date,
      completion_date,
      order_services,
      order_status,
    } = orderData;

    // Validate required fields
    if (!order_id || !order_description) {
      throw new Error("Order ID and description are required");
    }

    // Validate order_services
    if (!Array.isArray(order_services) || order_services.length === 0) {
      throw new Error("Order services must be a non-empty array");
    }

    const updateOrderQuery = `
      UPDATE orders
      SET order_description = ?
      WHERE order_id = ?
    `;
    const result = await pool.query(updateOrderQuery, [
      order_description,
      order_id,
    ]);
    console.log("result for the first order service:", result);

    if (result.affectedRows === 0) {
      throw new Error(`Order with ID ${id} not found`);
    }

    const orderInfoQuery = `
      UPDATE order_info
      SET estimated_completion_date = ?, 
          completion_date = ?
          WHERE order_id = ?
    `;
    const resultTwo = await pool.query(orderInfoQuery, [
      estimated_completion_date || null, // Replace undefined with null
      completion_date || null, // Replace undefined with null
      order_id,
    ]);
    // console.log("resultTwo:",resultTwo)

    const deleteOrderServicesQuery = `
      DELETE FROM order_services WHERE order_id = ?
    `;
    await pool.query(deleteOrderServicesQuery, [order_id]);
    console.log("deleteOrderServicesQuery:", deleteOrderServicesQuery);
    for (const service of order_services) {
      // Verify that service_id exists in common_services
      const serviceCheckQuery = `
          SELECT service_id FROM common_services WHERE service_id = ?
          
        `;
      const serviceCheckResult = await pool.query(serviceCheckQuery, [
        service.service_id,
      ]);

      if (
        !Array.isArray(serviceCheckResult) ||
        serviceCheckResult.length === 0
      ) {
        throw new Error(
          `Service with ID ${service.service_id} does not exist in common_services`
        );
      }

      const serviceCompletedValue = service.service_completed ? 1 : 0;
      // Insert or update order_service
      const orderServiceQuery = `
      INSERT INTO order_services (order_id, service_id, service_completed)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          service_completed = VALUES(service_completed)
    `;
      const orderServiceResult = await pool.query(orderServiceQuery, [
        order_id,
        service.service_id,
        serviceCompletedValue,
      ]);

      console.log("OrderServiceResult:", orderServiceResult);
      if (orderServiceResult.affectedRows === 0) {
        throw new Error("Failed to create or update order service");
      }
    }

    // Update or insert order status
    const statusExistsQuery = `
      SELECT order_status_id FROM order_status WHERE order_id = ?
    `;
    const statusExistsResult = await pool.query(statusExistsQuery, [order_id]);

    if (statusExistsResult.length > 0) {
      // If status exists, update it
      const updateStatusQuery = `
        UPDATE order_status
        SET order_status = ?
        WHERE order_id = ?
      `;
      const updateStatusResult = await pool.query(updateStatusQuery, [
        order_status,
        order_id,
      ]);
      if (updateStatusResult.affectedRows === 0) {
        throw new Error("Failed to update order status");
      }
    } else {
      // If status does not exist, insert it
      const insertStatusQuery = `
        INSERT INTO order_status (order_id, order_status)
        VALUES (?, ?)
      `;
      const insertStatusResult = await pool.query(insertStatusQuery, [
        order_id,
        order_status,
      ]);
      if (insertStatusResult.affectedRows === 0) {
        throw new Error("Failed to insert order status");
      }
    }

    return { message: "Order updated successfully" };
  } catch (error) {
    throw new Error(error);
  }
}


async function getOrderAllDetail(orderHash) {
  try {
    console.log("Received request with order_hash:", orderHash);

    // Query to get basic order details
    const orderQuery = `
            SELECT 
                orders.order_id, 
                orders.order_hash, 
                orders.customer_id, 
                orders.employee_id, 
                orders.vehicle_id, 
                orders.order_date, 
                orders.order_description,
                order_info.order_total_price,
                order_info.estimated_completion_date,
                order_info.completion_date,
                order_info.additional_request,
                order_info.notes_for_internal_use,
                order_info.notes_for_customer,
                employee_info.employee_first_name,
                employee_info.employee_last_name,
                customer_vehicle_info.vehicle_make,
                customer_vehicle_info.vehicle_serial,
                order_status.order_status,
                customer_info.customer_first_name,
                customer_info.customer_last_name,
                customer_info.active_customer_status
                
            FROM orders
            INNER JOIN order_info ON orders.order_id = order_info.order_id
            INNER JOIN employee_info ON orders.employee_id = employee_info.employee_id
            INNER JOIN customer_vehicle_info ON orders.vehicle_id = customer_vehicle_info.vehicle_id
            INNER JOIN order_status ON orders.order_id = order_status.order_id
            INNER JOIN customer_info ON orders.customer_id = customer_info.customer_id
            WHERE orders.order_hash = ?
        `;

    const queryResult = await pool.query(orderQuery, [orderHash]);

    console.log(" Result:", queryResult);
    console.log(typeof queryResult);

    if (!Array.isArray(queryResult) || queryResult.length === 0) {
      throw new Error("No order found with the provided hash.");
    }

    const order = queryResult[0];


    // Query to get associated services
    const servicesQuery = `
            SELECT 
                common_services.service_name,
                common_services.service_description,
                order_services.service_completed
            FROM order_services
            INNER JOIN common_services ON order_services.service_id = common_services.service_id
            WHERE order_services.order_id = ?
        `;
    const [servicesResult] = await pool.query(servicesQuery, [order.order_id]);

    console.log("Services result:", servicesResult);

    // Attach services to the order details
    const orderDetails = {
      orderId: order.order_id,
      orderHash: order.order_hash,
      customerId: order.customer_id,
      customerFirstName: order.customer_first_name,
      customerLastName: order.customer_last_name,
      customerActiveStatus: order.active_customer_status,
      employeeId: order.employee_id,
      vehicleId: order.vehicle_id,
      orderDate: order.order_date,
      activeOrder: order.active_order,
      orderDescription: order.order_description,
      orderTotalPrice: order.order_total_price,
      estimatedCompletionDate: order.estimated_completion_date,
      completionDate: order.completion_date,
      additionalRequest: order.additional_request,
      notesForInternalUse: order.notes_for_internal_use,
      notesForCustomer: order.notes_for_customer,
      additionalRequestsCompleted: order.additional_requests_completed,
      employeeFirstName: order.employee_first_name,
      employeeLastName: order.employee_last_name,
      vehicleMake: order.vehicle_make,
      vehicleSerial: order.vehicle_serial,
      orderStatus: order.order_status,
      services: servicesResult || [], 
    };

    console.log("Processed order details:", orderDetails);

    return orderDetails;
  } catch (error) {
    console.error("Error fetching order details with hash", orderHash, error);
    throw new Error("An error occurred while retrieving the order details");
  }
}
module.exports ={
checkCustomerExists,
checkVehicle,
checkEmployeeExists,
checkService,
createOrders,
getAllOrders,
getOrderDetailById,
getOrderById,
getOrderByCustomerId,
updateOrder,
getOrderAllDetail
}
