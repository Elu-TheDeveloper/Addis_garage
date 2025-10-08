import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee } = useAuth();

  const [employeeDetails, setEmployeeDetails] = useState(null); // null while loading
  const [loading, setLoading] = useState(true);

  const [performanceData] = useState({
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Performance",
        backgroundColor: "#8a9e1aff",
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 2,
        data: [65, 59, 80, 81],
      },
    ],
  });

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!employee?.employee_token) {
        console.error("No token available");
        setLoading(false);
        return;
      }

      try {
        const response = await employeeService.getSingleEmployee(id, employee.employee_token);
        console.log("Employee service response:", response);

        if (response.status === 200) {
          // Backend may return { singleEmployee: [...] } or direct object
          const empData =
            response.data.singleEmployee?.length > 0
              ? response.data.singleEmployee[0]
              : response.data;
          setEmployeeDetails(empData);
        } else {
          console.warn("Unauthorized or no data");
          navigate("/not-authorized");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmployeeDetails();
  }, [employee, id, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date) ? "-" : date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleName = (roleId) => {
    switch (roleId) {
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

  if (loading) {
    return <div className="loading">Loading employee data...</div>;
  }

  if (!employeeDetails) {
    return <div className="error">Employee data not available.</div>;
  }

  return (
    <section className="profile-section">
      <div className="profile-container">
        <div className="profile-header">
          <Avatar
            name={`${employeeDetails.employee_first_name || ""} ${employeeDetails.employee_last_name || ""}`}
            size="150"
            round={true}
          />
          <h2>
            {employeeDetails.employee_first_name || "-"} {employeeDetails.employee_last_name || "-"}
          </h2>
          <p>{getRoleName(employeeDetails.company_role_id)}</p>
        </div>

        <div className="profile-details">
          <div className="detail-item"><strong>Employee ID:</strong> {employeeDetails.employee_id || "-"}</div>
          <div className="detail-item"><strong>Email:</strong> {employeeDetails.employee_email || "-"}</div>
          <div className="detail-item"><strong>Phone:</strong> {employeeDetails.employee_phone || "-"}</div>
          <div className="detail-item"><strong>Status:</strong> {employeeDetails.active_employee ? "Active" : "Inactive"}</div>
          <div className="detail-item"><strong>Date of Employed:</strong> {formatDate(employeeDetails.added_date)}</div>
          <div className="detail-item"><strong>Vacation Days Remaining:</strong> 10</div>
          <div className="detail-item"><strong>Sick Leave Remaining:</strong> 5</div>
          <div className="detail-item"><strong>Salary Details:</strong> $75,000 per year</div>
          <div className="detail-item"><strong>Remaining Vacation Balance:</strong> 4.25 days</div>
        </div>

        <div className="performance-chart">
          <h3>Performance Metrics</h3>
          <Bar
            data={performanceData}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: "Quarterly Performance" },
                legend: { display: true, position: "right" },
              },
              scales: { x: { type: "category" }, y: { beginAtZero: true } },
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default EmployeeProfile;
