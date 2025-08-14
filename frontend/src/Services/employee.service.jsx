const api_url = import.meta.env.VITE_API_URL;

const createEmployee = async (formData, token) => {
  const response = await fetch(`${api_url}/api/employee`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: "Invalid server response" };
  }

  return { status: response.status, data };
};



const getAllEmployees = async (token) => {
  try {
    const response = await fetch(`${api_url}/api/employee`, {
    headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return { status: 500, data: { message: "Failed to fetch employees" } };
  }
};
async function deleteEmployee(loggedInEmployeeToken, id) {
  try {
    const url = `${api_url}/api/employee/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        "x-access-token": loggedInEmployeeToken,
        "Content-Type": "application/json",
      },
    });

    // Check for HTTP errors
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP error ${response.status}`);
    }

    // Try parsing JSON, fallback to text
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false, error: error.message };
  }
}







export default  {createEmployee,getAllEmployees,deleteEmployee}
