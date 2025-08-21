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
    employee_image: "",
  });

  useEffect(() => {
    if (employee) {
      setEmployeeDetails({
        employee_id: employee.id || "",
        employee_email: employee.email || "",
        employee_first_name: employee.first_name || "",
        employee_last_name: employee.last_name || "",
        employee_phone: employee.phone || "",
        company_role_id: employee.role || 1,
        active_employee: employee.active !== undefined ? employee.active : 1,
        date_of_employeed: employee.date_of_employed || "",
        employee_image: employee.employee_image || "",
      });
    }
  }, [employee]);

  const getRoleName = () => {
    switch (employeeDetails.company_role_id) {
      case 1: return "Employee";
      case 2: return "Manager";
      case 3: return "Admin";
      default: return "Unknown";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                    src={employeeDetails.employee_image || "/default-avatar.png"}
                    alt="Profile"
                  />
                </figure>
              </div>
            </div>
          </div>
          {/* Profile Details Column */}
          <div className="form-column col-lg-7">
            <div className="profile-details">
              <div className="detail-item"><strong>Employee ID:</strong> {employeeDetails.employee_id}</div>
              <div className="detail-item"><strong>Email:</strong> {employeeDetails.employee_email}</div>
              <div className="detail-item"><strong>First Name:</strong> {employeeDetails.employee_first_name}</div>
              <div className="detail-item"><strong>Last Name:</strong> {employeeDetails.employee_last_name}</div>
              <div className="detail-item"><strong>Phone:</strong> {employeeDetails.employee_phone}</div>
              <div className="detail-item"><strong>Role:</strong> {getRoleName()}</div>
              <div className="detail-item"><strong>Status:</strong> {employeeDetails.active_employee ? "Active" : "Inactive"}</div>
              <div className="detail-item"><strong>Date of Employed:</strong> {formatDate(employeeDetails.date_of_employeed)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmployeeProfile;
