const api_url = import.meta.env.VITE_API_URL;
console.log("API URL:", api_url);
console.log("API URL raw:", JSON.stringify(api_url));
const ordersService = {
  // Fetch all orders
  getAllOrders: async (token) => {
    try {
      console.log("Fetching orders from:", `${api_url}/orders`); // Debug
      console.log("Using token:", token); // Debug
      const response = await fetch(`${api_url}/orders`, {
        method: "GET",
       headers: {
          "x-access-token": token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Update an order
  updateOrder: async (orderData, token) => {
    try {
      const response = await fetch(`${api_url}/api/order/${orderData.order_id}`, {
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

      const data = await response.json();
      console.log(orderData);
      return data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Fetch order by ID
  getOrderById: async (token, id) => {
    try {
      const response = await fetch(`${api_url}/api/order/${id}`, {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
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
      const response = await fetch(`${api_url}/api/order_detail/${id}`, {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
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
      const response = await fetch(`${api_url}/api/order/details/${hash}`, {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
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
