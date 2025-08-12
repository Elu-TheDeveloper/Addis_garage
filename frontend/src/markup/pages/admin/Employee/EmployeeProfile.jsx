import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import Avatar from "react-avatar";
import { useParams, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import employeeService from "../../../../services/employee.service";
import "./EmployeeProfile.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee } = useAuth();
  console.log(employee);

  const [employeeDetails, setEmployeeDetails] = useState({});
  const [performanceData, setPerformanceData] = useState({
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Performance",
        backgroundColor: "#FBA617",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [65, 59, 80, 81],
      },
    ],
  });

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await employeeService.singleEmployee(
          employee.employee_token,
          id
        );
        if (
          response &&
          response.singleEmployee &&
          response.singleEmployee.length > 0
        ) {
          setEmployeeDetails(response.singleEmployee[0]);
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    if (id && employee && employee.employee_token) {
      if (
        employee.employee_id === parseInt(id) ||
        employee.employee_role === 3
      ) {
        fetchEmployeeDetails();
      } else {
        navigate("/not-authorized"); // Redirect to a not authorized page
      }
    }
  }, [employee, id, navigate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getRoleName = () => {
    switch (employeeDetails.company_role_id) {
      case 1:
        return "Employee";
      case 2:
        return "Manager";
      case 3:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  return (
    <section className="profile-section">
      <div className="profile-container">
        <div className="profile-header">
          <Avatar
            name={`${employeeDetails.employee_first_name} ${employeeDetails.employee_last_name}`}
            size="150"
            round={true}
          />
          <h2>
            {employeeDetails.employee_first_name}{" "}
            {employeeDetails.employee_last_name}
          </h2>
          <p>{getRoleName()}</p>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <strong>Employee ID:</strong> {employeeDetails.employee_id}
          </div>
          <div className="detail-item">
            <strong>Email:</strong> {employeeDetails.employee_email}
          </div>
          <div className="detail-item">
            <strong>Phone:</strong> {employeeDetails.employee_phone}
          </div>
          <div className="detail-item">
            <strong>Status:</strong>{" "}
            {employeeDetails.active_employee ? "Active" : "Inactive"}
          </div>
          <div className="detail-item">
            <strong>Date of Employed:</strong>{" "}
            {formatDate(employeeDetails.added_date)}
          </div>
          <div className="detail-item">
            <strong>Vacation Days Remaining:</strong> 10
          </div>
          <div className="detail-item">
            <strong>Sick Leave Remaining:</strong> 5
          </div>
          <div className="detail-item">
            <strong>Salary Details:</strong> $75,000 per year
          </div>
          <div className="detail-item">
            <strong>Remaining Vacation Balance:</strong> 4.25 days
          </div>
        </div>

        <div className="performance-chart">
          <h3>Performance Metrics</h3>
          <Bar
            data={performanceData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Quarterly Performance",
                },
                legend: {
                  display: true,
                  position: "right",
                },
              },
              scales: {
                x: {
                  type: "category",
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default EmployeeProfile;
