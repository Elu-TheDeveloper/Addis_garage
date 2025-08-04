const api_url = import.meta.env.VITE_API_URL;
const createEmployee =async (formData) => {
    const requestOptions ={
        method: 'POST',
        headers: {'Content-Type':"application/json"},
        body: JSON.stringify(formData)
    }
    const response =await fetch(`${api_url}/api/employee`,requestOptions)
    return response;
}
const employeeService ={
    createEmployee
}
export default employeeService;