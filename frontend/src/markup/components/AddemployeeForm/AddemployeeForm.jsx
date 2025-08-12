import React, { useState } from 'react'
import employeeService from '../../../Services/employee.service'

import { useAuth } from '../../../Context/AuthContext' 

const Addemployee = () => {
const[employee_email,setEmail]=useState('')
const [employee_first_name, setFirstName]=useState('')
const [employee_last_name,setLastName]=useState('')
const [employee_phone,setPhoneNumber]=useState('')
const[employee_password,setPassword]=useState('')
const[active_employee,setActive_employee]=useState(1)
const[company_role_id,setCompany_role_id]=useState(1)

const[emailError,setEmailError]=useState('')
const [firstNameRequired,setFirstNameRequired]=useState('')
const [passwordError, setPasswordError]=useState('')
const [success, setSuccess]=useState(false)
const [serverError, setServerError]=useState('')


  let loggedInEmployeeToken = '';
  // Destructure the auth hook and get the token 
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    loggedInEmployeeToken = employee.employee_token;
  }

const handleSubmit =(event)=>{
  event.preventDefault()

  //flag
  let valid =true
  if(!employee_first_name){
  setFirstNameRequired('First name is required')
  valid = false;
  }else{
    setFirstNameRequired('')
  }

  // Email is required
    if (!employee_email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!employee_email.includes('@')) {
      setEmailError('Invalid email format');
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(employee_email)) {
        setEmailError('Invalid email format');
        valid = false;
      } else {
        setEmailError('');
      }
    }
    if(!employee_password||employee_password.length<8){
      setPasswordError("Password must be at least 8 characters long")
      valid=false;
    }
    if(!valid){
      return;
    }
    const formData={
      employee_email,
      employee_first_name,
      employee_last_name,
      employee_phone,
      employee_password,
      active_employee,
      company_role_id
    };
    const newEmployee = employeeService.createEmployee(formData, loggedInEmployeeToken)
     
    newEmployee.then((response) => response.json())
    .then((data)=>{
     
      if(data.error){
         setServerError(data.error)
        
      }else{
        setSuccess(true)
        setServerError('')

        setTimeout(()=>{
          window.location.href="/";
        },3000)
      }
    })
     .catch((error) => {
    const resMessage =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();

    setServerError(resMessage);
    })
}
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

                    <div className="form-group col-md-12">
                       {serverError && <div className="validation-error" role="alert">{serverError}</div>}
                      <input
                        type="email" value={employee_email}
                        name="employee_email" onChange={event=>setEmail(event.target.value)}
                        placeholder="Employee Email"
                        required
                        className="form-control"
                      />
                       {emailError && <div className="validation-error" role="alert">{emailError}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_first_name" value={employee_first_name} onChange={event=>setFirstName(event.target.value)}
                        placeholder="Employee First Name"  
                        required
                        className="form-control"
                      />
                        {firstNameRequired && <div className="validation-error" role="alert">{firstNameRequired}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_last_name" value={employee_last_name} onChange={event =>setLastName(event.target.value)}
                        placeholder="Employee Last Name"
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_phone" value={employee_phone}
                        placeholder="Employee Phone (251-99-00-00-00)" onChange={event=>setPhoneNumber(event.target.value)}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <select
                        name="employee_role" value={company_role_id} onChange={event=>setCompany_role_id(event.target.value)}
                        required
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
                        name="employee_password" value={employee_password} onChange={event=>setPassword(event.target.value)}
                        placeholder="Employee Password"
                        className="form-control"
                        required
                      />
                       {passwordError && <div className="validation-error" role="alert">{passwordError}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <button className="theme-btn btn-style-one" type="submit" data-loading-text="Please wait..."><span>Add employee</span></button>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default Addemployee