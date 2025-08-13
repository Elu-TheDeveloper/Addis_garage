import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

function EmployeeProfile() {
  const { employee } = useAuth();
  const [employeeDetails, setEmployeeDetails] = useState({
    employee_id: "",
    employee_email: "",
    employee_first_name: "",
    employee_last_name: "",
    employee_phone: "",
    company_role_id: 1,
    active_employee: 1,
    date_of_employeed: "",
  });

  useEffect(() => {
    if (employee) {
      setEmployeeDetails({
        employee_id: employee.employee_id,
        employee_email: employee.employee_email,
        employee_first_name: employee.employee_first_name,
        employee_last_name: employee.employee_last_name,
        employee_phone: employee.employee_phone,
        company_role_id: employee.employee_role, 
        active_employee: employee.active_employee,
        date_of_employeed: employee.date_of_employeed,
      });
    }
  }, [employee]);

  const getRoleName = () => {
    let role = "";
    switch (
      employeeDetails.company_role_id // Corrected to use `company_role_id`
    ) {
      case 1:
        role = "Employee";
        break;
      case 2:
        role = "Manager";
        break;
      case 3:
        role = "Admin";
        break;
      default:
        role = "Unknown";
    }
    return role;
  };

  return (
    <section className="profile-section">
      <div className="auto-container">
        <div className="profile-title">
          <h2>Employee Profile</h2>
        </div>
        <div className="row clearfix">
          {/* Profile Image Column */}
          <div className="form-column col-lg-5">
            <div className="inner-column">
              <div className="profile-image">
                <figure className="image">
                  <img
                    src="/path/to/employee/profile/image.jpg"
                    alt="Profile"
                  />
                </figure>
              </div>
            </div>
          </div>
          {/* Profile Details Column */}
          <div className="form-column col-lg-7">
            {/* Employee Details */}
            <div className="profile-details">
              <div className="detail-item">
                <strong>Employee ID:</strong> {employeeDetails.employee_id}
              </div>
              <div className="detail-item">
                <strong>Email:</strong> {employeeDetails.employee_email}
              </div>
              <div className="detail-item">
                <strong>First Name:</strong>{" "}
                {employeeDetails.employee_first_name}
              </div>
              <div className="detail-item">
                <strong>Last Name:</strong> {employeeDetails.employee_last_name}
              </div>
              <div className="detail-item">
                <strong>Phone:</strong> {employeeDetails.employee_phone}
              </div>
              <div className="detail-item">
                <strong>Role:</strong> {getRoleName()}
              </div>
              <div className="detail-item">
                <strong>Status:</strong>{" "}
                {employeeDetails.active_employee ? "Active" : "Inactive"}
              </div>
              <div className="detail-item">
                <strong>Date of Employeed:</strong>{" "}
                {employeeDetails.date_of_employeed}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmployeeProfile;
