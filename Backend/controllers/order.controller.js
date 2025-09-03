const orderService = require("../services/order.service");
const pool = require("../config/db.config");

async function createOrder(req, res) {
  try {
    const orderData = req.body;

    // Validate the presence of required fields in the request body
    const requiredFields = [
      "customer_id",
      "employee_id",
      "vehicle_id",
      "order_status",
      "order_total_price",
      "order_description",
      "estimated_completion_date",
      "order_services",
      
    ];

    for (const field of requiredFields) {
      if (orderData[field] === undefined) {
        return res.status(400).json({ error: `Field ${field} is required` });
      }
    }

    if (
      !Array.isArray(orderData.order_services) ||
      orderData.order_services.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Field 'order_services' must be a non-empty array" });
    }


    const result = await orderService.createOrders(orderData);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
}

//Get All Orders
async function getAllOrders(req, res) {
  try {
    const { limit, sortby, completed } = req.query;
    const orders = await orderService.getAllOrders({
      limit,
      sortby,
      completed,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//Get orders by ID
async function getOrderDetailById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderDetailById(id);

    if (!order || order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error in getOrderDetailById:", error);
    res.status(500).json({ error: "An error occurred while retrieving the order" });
  }
}

// Get single order by CUSTOMER_ID
async function getOrderByCustomerId(req, res) {
  try {
    const { customerid } = req.params;
    const order = await orderService.getOrderByCustomerId(customerid);
    
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the order" });
  }
}
//Get Orders By ID
async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the order" });
  }
}
const getOrderAllDetail = async (req, res) => {
  const { order_hash } = req.params;

  console.log("Received request with order_hash:", order_hash); // Log the received hash

  if (!order_hash) {
    console.log("No order_hash provided in the request");
    return res.status(400).json({ message: "Order hash is required" });
  }

  try {
    const orderDetails = await orderService.getOrderAllDetail(order_hash);

    if (!orderDetails) {
      console.log("No order details found for the provided hash");
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(orderDetails);
  } catch (error) {
    console.error(
      `Error fetching order details with hash ${order_hash}:`,
      error
    );
    res.status(500).json({
      message: "An error occurred while retrieving the order details",
    });
  }
};
async function updateOrder(req, res) {
  try {
    const { order_id } = req.params; // Ensure order_id is obtained from params
    const orderData = req.body;

    const requiredFields = [
      "order_description",
      "estimated_completion_date",
      "completion_date",
      "order_services",
    ];

    for (const field of requiredFields) {
      if (orderData[field] === undefined) {
        return res.status(400).json({ error: `Field ${field} is required` });
      }
    }

    if (
      !Array.isArray(orderData.order_services) ||
      orderData.order_services.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Field 'order_services' must be a non-empty array" });
    }
    console.log("orderData:", orderData);
    console.log("order_id:", order_id);
    
    const result = await orderService.updateOrder(orderData,order_id );
    res.status(200).json(result);
    
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the order" });
  }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderDetailById,
    getOrderById,
    getOrderAllDetail,
    getOrderByCustomerId,
    updateOrder

}