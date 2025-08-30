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
module.exports = {
    createOrder
}