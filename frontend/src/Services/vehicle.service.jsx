const api_url = import.meta.env.VITE_API_URL;

const AddVehicle = async (formData, token) => {
  try {
    const response = await fetch(`${api_url}/api/vehicle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("AddVehicle response:", data);
    return data;
  } catch (error) {
    console.error("Error in AddVehicle:", error);
    throw error;
  }
};

const getVehicleInfoPerCustomer = async (customer_id, token) => {
  try {
    const response = await fetch(`${api_url}/api/vehicle/${customer_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("getVehicleInfoPerCustomer response:", data);

    // backend returns data.result as array
    const vehicles = Array.isArray(data.result) ? data.result : data.result ? [data.result] : [];

    return { result: vehicles }; // <-- return object with `result` array
  } catch (error) {
    console.error("Error in getVehicleInfoPerCustomer:", error);
    throw error;
  }
};




const getVehicleInfo = async (vehicle_id, token) => {
  try {
    const response = await fetch(`${api_url}/api/vehicle-single/${vehicle_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("getVehicleInfo response:", data);

    // Backend returns object in data.data
    return data?.data || null;
  } catch (error) {
    console.error("Error in getVehicleInfo:", error);
    return null;
  }
};




const updateVehicle = async (formData, token) => {
  try {
    const response = await fetch(`${api_url}/api/vehicle/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error in updateVehicle:", error);
    throw error;
  }
};



const hasServiceOrder = async (ID, token) => {
  try {
    const response = await fetch(`${api_url}/api/vehicle_order/${ID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("hasServiceOrder response:", data);
    let result = data?.result?.length;
    return result;
  } catch (error) {
    console.error("Error in hasServiceOrder:", error);
    throw error;
  }
};

const vehicleService = {
  AddVehicle,
  getVehicleInfo,
  getVehicleInfoPerCustomer,
  updateVehicle,
  hasServiceOrder,
};

export default vehicleService;