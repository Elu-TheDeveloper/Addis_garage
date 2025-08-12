import React, { useRef, useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import employeeService from "../../../../services/employee.service";
import { useAuth } from "../../../../context/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
function EditEmployeeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [employee_first_name, setFirstName] = useState("");
  const [employee_last_name, setLastName] = useState("");
  const [employee_phone, setPhoneNumber] = useState("");
  const [employee_email, setEmail] = useState("");
  const [company_role_id, setCompany_role_id] = useState(1);
  const [active_employee, setActiveEmployee] = useState(false);
  const [employee1, setEmployee1] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  // Spinner handler state
  const [spin, setSpinner] = useState(false);

  // Refs
  const firstNameDom = useRef();
  const lastNameDom = useRef();
  const phoneNumberDom = useRef();
  const emailDom = useRef();
  const companyRoleIdDom = useRef();
  const checkboxDOM = useRef();

  // Create a variable to hold the user's token
  let loggedInEmployeeToken = "";
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    loggedInEmployeeToken = employee.employee_token;
  }

  // Value trackers
  const firstNameTracker = () => setFirstName(firstNameDom.current.value);
  const lastNameTracker = () => setLastName(lastNameDom.current.value);
  const phoneNumberTracker = () => setPhoneNumber(phoneNumberDom.current.value);
  const emailTracker = () => setEmail(emailDom.current.value);
  const companyRoleIdTracker = () =>
    setCompany_role_id(companyRoleIdDom.current.value);
  const activeEmployeeTracker = () =>
    setActiveEmployee(checkboxDOM.current.checked);

  // Fetch employee data using useEffect
  useEffect(() => {
    const employeeData = location.state?.employee;
    if (employeeData) {
      setFirstName(employeeData.employee_first_name);
      setLastName(employeeData.employee_last_name);
      setPhoneNumber(employeeData.employee_phone);
      setEmail(employeeData.employee_email);
      setCompany_role_id(employeeData.company_role_id);
      setEmployee1(employeeData);
      checkboxDOM.current.checked = employeeData.active_employee;
      setActiveEmployee(employeeData.active_employee);
    } else {
      const fetchData = async () => {
        try {
          const data = await employeeService.singleEmployee(
            id,
            loggedInEmployeeToken
          );
          if (data.status !== 200) {
            setApiError(true);
            if (data.status === 403) {
              setApiErrorMessage("Please login again");
            } else if (data.status === 401) {
              setApiErrorMessage("You are not authorized to view this page");
            } else {
              setApiErrorMessage("Please try again later");
            }
          } else {
            const employeeData = data.data.singleEmployee[0];
            setFirstName(employeeData.employee_first_name);
            setLastName(employeeData.employee_last_name);
            setPhoneNumber(employeeData.employee_phone);
            setEmail(employeeData.employee_email);
            setCompany_role_id(employeeData.company_role_id);
            setEmployee1(employeeData);
            checkboxDOM.current.checked = employeeData.active_employee;
            setActiveEmployee(employeeData.active_employee);
          }
        } catch (error) {
          setApiError(true);
          setApiErrorMessage("An error occurred while fetching data.");
        }
      };
      fetchData();
    }
  }, [id, location.state, loggedInEmployeeToken]);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      employee_id: id,
      employee_first_name,
      employee_last_name,
      employee_phone,
      employee_email,
      company_role_id,
      active_employee: active_employee ? 1 : 0, 
    };

    try {
      setSpinner(true);
      const data = await employeeService.updateEmployee(
        formData,
        loggedInEmployeeToken
      );

      if (data.status === 200) {
        setServerMsg("Redirecting To Employees page...");
        setTimeout(() => {
          setSpinner(false);
          setServerMsg("");
          navigate("/admin/employees");
        }, 500);
      }
    } catch (error) {
      setServerMsg("Failed to update employee. Please try again.");
      setSpinner(false);
    }
  }

  return (
    <>
      <section className="contact-section">
        <div className="auto-container">
          <div className="contact-title">
            <h2>Edit: {employee1.employee_email || ""}</h2>
          </div>
          <div className="row clearfix">
            <div className="form-column col-lg-7">
              <div className="inner-column">
                <div className="contact-form">
                  <form onSubmit={handleSubmit}>
                    <div className="row clearfix">
                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          name="employee_first_name"
                          placeholder="Employee first name"
                          ref={firstNameDom}
                          value={employee_first_name}
                          onChange={firstNameTracker}
                          required
                        />
                      </div>
                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          name="employee_last_name"
                          placeholder="Employee last name"
                          required
                          ref={lastNameDom}
                          value={employee_last_name}
                          onChange={lastNameTracker}
                        />
                      </div>
                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          name="employee_phone"
                          placeholder="Employee phone (555-555-5555)"
                          ref={phoneNumberDom}
                          required
                          value={employee_phone}
                          onChange={phoneNumberTracker}
                        />
                      </div>
                      <div className="form-group col-md-12">
                        <input
                          type="email"
                          name="employee_email"
                          placeholder="Employee email"
                          ref={emailDom}
                          required
                          value={employee_email}
                          onChange={emailTracker}
                        />
                      </div>
                      <div className="form-group col-md-12">
                        <select
                          name="employee_role"
                          className="custom-select-box"
                          ref={companyRoleIdDom}
                          value={company_role_id}
                          onChange={companyRoleIdTracker}
                          required
                        >
                          <option value="1">Employee</option>
                          <option value="2">Manager</option>
                          <option value="3">Admin</option>
                        </select>
                      </div>
                      <div className="form-group col-md-12 form-contro">
                        <h5 htmlFor="completed">Active Employee</h5>
                        <input
                          value={active_employee}
                          onChange={activeEmployeeTracker}
                          ref={checkboxDOM}
                          type="checkbox"
                          name="completed"
                          className=""
                        />
                      </div>
                      <div className="form-group col-md-12">
                        <button
                          className="theme-btn btn-style-one"
                          type="submit"
                          data-loading-text="Please wait..."
                        >
                          <span>
                            {spin ? (
                              <BeatLoader color="white" size={8} />
                            ) : (
                              "Update Employee"
                            )}
                          </span>
                        </button>
                        {serverMsg && (
                          <div
                            className="validation-error"
                            style={{
                              color: "green",
                              fontSize: "100%",
                              fontWeight: "600",
                              padding: "25px",
                            }}
                            role="alert"
                          >
                            {serverMsg}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                  {apiError && (
                    <div className="validation-error" role="alert">
                      {apiErrorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditEmployeeForm;

