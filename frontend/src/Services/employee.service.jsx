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



const getAllEmployees = async (token, showInactive = false) => {
  try {
    console.log('Service executing with token:', token, 'showInactive:', showInactive);
    const url = `${api_url}/api/employee${showInactive ? '?showInactive=true' : ''}`;
    console.log('Fetching from URL:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
      },
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
const updateEmployee = async (formData, loggedInEmployeeToken) => {
  try {
    const response = await fetch(`${api_url}/api/employee/update`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${loggedInEmployeeToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("TOKEN RECEIVED:", loggedInEmployeeToken);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error("Failed to update employee:", error);
    return { status: 500, data: { message: "Failed to update employee" } };
  }
};






export async function deleteEmployee(token, id) {
  try {
    const url = `${api_url}/api/employee/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false, error: error.message };
  }
}










export default  {createEmployee,getAllEmployees,deleteEmployee,updateEmployee}
