const api_url = import.meta.env.VITE_API_URL;

// POST - create customer
const createCustomer = async (formData, token) => {
  const response = await fetch(`${api_url}/api/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  return response.json();
};

// GET - all customers
const getAllCustomers = async (token, offset) => {
  const response = await fetch(`${api_url}/api/customers/${offset}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  return response.json();
};

// GET - customer orders by ID
const getCustomerOrderbyId = async (id, token) => {
  const response = await fetch(`${api_url}/api/order/customer/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  return response.json();
};

// PUT - update customer
const updateCustomer = async (formData, token) => {
  const response = await fetch(`${api_url}/api/customer/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  return response.json();
};
// src/services/customerService.js (partial update)
export async function deleteCustomer(token, id) {
  try {
    const url = `${api_url}/api/customer/delete/${id}`; 
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.status || `HTTP error ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    return { success: false, error: error.message };
  }
}

// GET - single customer
const singleCustomer = async (ID, token) => {
  const response = await fetch(`${api_url}/api/customer/single/${ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  return response.json();
};

// Format date
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} | ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// GET - total customers
const totalNofCustomers = async (token) => {
  const response = await fetch(`${api_url}/api/total_customers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  const data = await response.json();
  return data.customers.num;
};

// Search customers
const searchedCustomers = async (word, token) => {
  const response = await fetch(`${api_url}/api/searched_customer/${word}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  const data = await response.json();
  return data.customers;
};

// Search customer vehicles
const searchCustomerVehicles = async (customerId, token, searchQuery) => {
  const response = await fetch(`${api_url}/api/customer-vehicle/search/${customerId}?query=${encodeURIComponent(searchQuery)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  return response.json();
};

export default {
  createCustomer,
  getAllCustomers,
  getCustomerOrderbyId,
  updateCustomer,
  singleCustomer,
  formatDate,
  totalNofCustomers,
  searchedCustomers,
  searchCustomerVehicles,
  deleteCustomer
};
