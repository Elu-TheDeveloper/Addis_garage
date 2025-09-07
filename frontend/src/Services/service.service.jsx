const api_url = import.meta.env.VITE_API_URL;

async function getServiceList() {
  try {
    const response = await fetch(`${api_url}/api/services-all`); // Changed from /api/services to /api/services-all
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

const serviceService = {
  getServiceList,
};

export default serviceService;