const api_url = import.meta.env.VITE_API_URL;

async function getServiceList() {
  try {
    const response = await fetch(`${api_url}/api/services-all`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    return result.data; // ✅ return array of services only
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

async function createService(serviceData) {
  const response = await fetch(`${api_url}/api/service`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serviceData),
  });
  if (!response.ok) throw new Error("Failed to create service");
  const result = await response.json();
  // ✅ no result.data, return the constructed object
  return {
    service_id: result.service_id,
    ...serviceData,
  };
}

async function updateService(service_id, service_name, service_description) {
  const response = await fetch(`${api_url}/api/service-update/${service_id}`, {
    method: "PUT", // update should be PUT or PATCH
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service_name, service_description }),
  });

  if (!response.ok) throw new Error("Failed to update service");

  const result = await response.json();
  return result; // depending on backend, this might be updated object or status
}





async function deleteService(service_id) {
  try {
    const response = await fetch(`${api_url}/api/deleteservice/${service_id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete service");

    // If backend returns 204 No Content, don’t try to parse JSON
    if (response.status === 204) {
      return { status: "success", message: "Service deleted successfully" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Delete service error:", error);
    throw error;
  }
}


const serviceService = {
  getServiceList,
  createService,
  updateService,
  deleteService,
};

export default serviceService;