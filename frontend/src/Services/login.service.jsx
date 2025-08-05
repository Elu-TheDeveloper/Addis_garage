const api_url = import.meta.env.VITE_API_URL;

const logIn = async (formData) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/employee/login`, requestOptions);
  return response;
};
const LogOut=()=>{
localStorage.removeItem("employee");
}
const loginService = { logIn, LogOut };

export default loginService;
