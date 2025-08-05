const EmployeeAuthHeader = async()=>{
const employee = await JSON.parse(localStorage.getItem('employee'));
  if (employee && employee.employee_token) {
    // console.log("Inside employeeAuthHeader if statement");
    const decodedToken = await decodeTokenPayload(employee.employee_token);
    // console.log(decodedToken);
    employee.employee_role = decodedToken.employee_role;
    employee.employee_id = decodedToken.employee_id;
    employee.employee_first_name = decodedToken.employee_first_name;
    return employee;
  } else {
    return {};
  }
}
const decodeTokenPayload = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
};
export default EmployeeAuthHeader;