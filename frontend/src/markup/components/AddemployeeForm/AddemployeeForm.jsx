import React, { useState } from 'react';
import employeeService from '../../../services/employee.service';
import { useAuth } from '../../../context/AuthContext';

const Addemployee = () => {
  const [employee_email, setEmail] = useState('');
  const [employee_first_name, setFirstName] = useState('');
  const [employee_last_name, setLastName] = useState('');
  const [employee_phone, setPhoneNumber] = useState('');
  const [employee_password, setPassword] = useState('');
  const [active_employee] = useState(1);
  const [company_role_id, setCompany_role_id] = useState(1);

  const [emailError, setEmailError] = useState('');
  const [firstNameRequired, setFirstNameRequired] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  let loggedInEmployeeToken = '';
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    loggedInEmployeeToken = employee.employee_token;
  }

 const handleSubmit = async (event) => {
  event.preventDefault();

  let valid = true;  

  // Validation
  if (!employee_first_name) {
    setFirstNameRequired('First name is required');
    valid = false;
  } else {
    setFirstNameRequired('');
  }

  if (!employee_email) {
    setEmailError('Email is required');
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(employee_email)) {
    setEmailError('Invalid email format');
    valid = false;
  } else {
    setEmailError('');
  }

  if (!employee_password || employee_password.length < 8) {
    setPasswordError('Password must be at least 8 characters long');
    valid = false;
  } else {
    setPasswordError('');
  }

  if (!valid) return;  

  const formData = {
    employee_email,
    employee_first_name,
    employee_last_name,
    employee_phone,
    employee_password,
    active_employee,
    company_role_id,
  };

  try {
    const res = await employeeService.createEmployee(formData, loggedInEmployeeToken);

    if (res.status === 201) {
      setSuccess(true);
      setServerError('');
      // Redirect after 3 seconds so user sees success message
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } else {
      setServerError(res.data.message || 'Failed to create employee');
      setSuccess(false);
    }
  } catch (error) {
    setServerError('Network error. Please try again.');
    setSuccess(false);
  }
};

  return (
    <section className="contact-section eloo">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Adding Employee</h2>
        </div>

        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    {success && (
                      <div
                        className="success-message"
                        role="alert"
                        style={{ color: 'green', fontWeight: 'bold', marginBottom: '15px' }}
                      >
                        Employee successfully added! Redirecting...
                      </div>
                    )}

                    {serverError && (
                      <div className="validation-error" role="alert" style={{ color: 'red' }}>
                        {serverError}
                      </div>
                    )}

                    <div className="form-group col-md-12">
                      <input
                        type="email"
                        value={employee_email}
                        name="employee_email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Employee Email"
                        className="form-control"
                      />
                      {emailError && <div className="validation-error">{emailError}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_first_name"
                        value={employee_first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Employee First Name"
                        className="form-control"
                      />
                      {firstNameRequired && <div className="validation-error">{firstNameRequired}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_last_name"
                        value={employee_last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Employee Last Name"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_phone"
                        value={employee_phone}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Employee Phone (251-99-00-00-00)"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <select
                        name="employee_role"
                        value={company_role_id}
                        onChange={(e) => setCompany_role_id(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Select Role</option>
                        <option value="1">Employee</option>
                        <option value="2">Manager</option>
                        <option value="3">Admin</option>
                      </select>
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="employee_password"
                        value={employee_password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Employee Password"
                        className="form-control"
                      />
                      {passwordError && <div className="validation-error">{passwordError}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <button className="theme-btn btn-style-one" type="submit">
                        <span>Add employee</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Addemployee;
