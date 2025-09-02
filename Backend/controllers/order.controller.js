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


//Get Orders By ID

module.exports = {
    createOrder,
    getAllOrders,
    getOrderDetailById

}