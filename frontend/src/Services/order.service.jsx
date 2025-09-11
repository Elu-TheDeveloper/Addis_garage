const api_url = import.meta.env.VITE_API_URL;

const ordersService = {
  // Fetch all orders
  getAllOrders: async (token) => {
    try {
      const response = await fetch(`${api_url}/orders`, {
        method: "GET",
        headers: { "x-access-token": token },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Update an order
  updateOrder: async (orderData, token) => {
    try {
      const response = await fetch(`${api_url}/update/${orderData.order_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Fetch single order by ID (fixed to singular)
  getOrderById: async (token, id) => {
    try {
      const response = await fetch(`${api_url}/order/${id}`, { 
        method: "GET",
        headers: { "x-access-token": token },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  },

  // Fetch order detail by ID
  getOrderDetailById: async (token, id) => {
    try {
      const response = await fetch(`${api_url}/order_detail/${id}`, { 
        method: "GET",
        headers: { "x-access-token": token },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching order detail:", error);
      throw error;
    }
  },

  // Fetch all order details by hash
  getOrderAllDetail: async (token, hash) => {
    try {
      const response = await fetch(`${api_url}/order/details/${hash}`, { 
        method: "GET",
        headers: { "x-access-token": token },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching all order details:", error);
      throw error;
    }
  },
};

export default ordersService;
