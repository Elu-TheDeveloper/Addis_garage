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

const employeeService = {
  createEmployee,
};

export default employeeService;
