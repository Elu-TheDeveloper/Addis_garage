import React, { useState, useEffect } from "react";
import { Table, Pagination, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./EmployeeList.css";
import { useAuth } from "../../../../context/AuthContext";
import { format } from "date-fns";
import employeeService from "../../../../services/employee.service";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [showActiveEmployees, setShowActiveEmployees] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const employeesPerPage = 10;
  const { employee } = useAuth();

 const getAllEmployees = async (showInactive = false) => {
  try {
    const res = await employeeService.getAllEmployees(
      employee.employee_token,
      showInactive
    );

    if (res.status === 200) {
      setEmployees(res.data.employees);
    } else {
      setApiError(true);
      if (res.status === 401) {
        setApiErrorMessage("Please login again");
      } else if (res.status === 403) {
        setApiErrorMessage("You are not authorized to view this page");
      } else {
        setApiErrorMessage("Please try again later");
      }
    }
  } catch (err) {
    console.error(err);
    setApiError(true);
    setApiErrorMessage("An error occurred while fetching the employees");
  }
};


  useEffect(() => {
    getAllEmployees();
  }, [employee]);

const handleDelete = async () => {
  const token = employee.employee_token;
  const id = employeeToDelete.employee_id;

  const res = await employeeService.deleteEmployee(token, id);

  if (res.success && res.data.message === "Employee successfully deleted!") {
    getAllEmployees();
    setShowDeleteModal(false);
  } else {
    setApiError(true);
    setApiErrorMessage(res.error || res.data.status || "Failed to delete employee");
  }
};


const handleToggle = async () => {
  setShowActiveEmployees((prev) => {
    const newShowActive = !prev;
    const showInactive = !newShowActive;
    setCurrentPage(1);
   
    getAllEmployees(showInactive); 
    return newShowActive;
  });
};
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setEmployeeToDelete(null);
    setShowDeleteModal(false);
  };

  const filteredEmployees = employees.filter((employee) => {
    const isActive = showActiveEmployees
      ? employee.active_employee
      : !employee.active_employee;
    const matchesSearch =
      `${employee.employee_first_name} ${employee.employee_last_name} ${employee.employee_email} ${employee.employee_phone}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return isActive && matchesSearch;
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : (
        <section className="contact-section">
          <div className="containerr">
            <div className="row">
              <div className="col-12">
                <div className="contact-title">
                  <h2>Employees</h2>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <button onClick={handleToggle} className="btn btn-danger">
                    {showActiveEmployees ? "Show Inactive" : "Show Active"}
                  </button>
                  <input
                    type="search"
                    className="form-control w-50 w-md-25"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="table-responsive">
                  <Table
                  responsive
                  striped
                  bordered
                  hover
                  className="modern-table border"
                >
                  <thead>
                    <tr>
                      <th>Active</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Added Date</th>
                      <th>Role</th>
                      <th>Edit/Delete/View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.map((employee) => (
                      <tr key={employee.employee_id}>
                        <td
                          className={`border ${
                            employee.active_employee
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          <h6 className="py-0 my-0 mx-3 font-weight-bold">
                            {employee.active_employee ? "Yes" : "No"}
                          </h6>
                        </td>
                        <td>{employee.employee_first_name}</td>
                        <td>{employee.employee_last_name}</td>
                        <td>{employee.employee_email}</td>
                        <td>{employee.employee_phone}</td>
                        <td>
                          {format(
                            new Date(employee.added_date),
                            "MM-dd-yyyy | HH:mm"
                          )}
                        </td>
                        <td>{employee.company_role_name}</td>
                        <td>
                          <div className="action-icons">
                            <Link
                              to={`/admin/employee/edit/${employee.employee_id}`}
                              state={{ employee }}
                            >
                              <i className="fas fa-edit" title="Edit"></i>
                            </Link>
                            {/* <Link
                              to={`/admin/employee-profile/${employee.employee_id}`}
                              state={{ employee }}
                            >
                              <i className="fas fa-eye" title="View"></i>
                            </Link> */}
                            <Link
                              onClick={() => handleShowDeleteModal(employee)}
                            >
                              <i
                                className="fas fa-trash-alt danger"
                                title="Delete"
                              ></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                </div>
                
                <Pagination className="justify-content-center custom-pagination">
                  <Pagination.Prev
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from(
                    {
                      length: Math.ceil(
                        filteredEmployees.length / employeesPerPage
                      ),
                    },
                    (_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    )
                  )}
                  <Pagination.Next
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredEmployees.length / employeesPerPage)
                    }
                  />
                </Pagination>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>
            {employeeToDelete
              ? `${employeeToDelete.employee_first_name} ${employeeToDelete.employee_last_name}`
              : ""}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeesList;
