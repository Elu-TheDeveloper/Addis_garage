import React, { useEffect, useState } from "react";
import { Table, Pagination, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { HiMiniChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi2";
import { useAuth } from "../../../../context/AuthContext";
import customerService from "../../../../services/customer.service";

const CustomerList = () => {
  const [offset, setOffset] = useState(0);
  const [last, setLast] = useState(0);
  const [search, setSearch] = useState([]);
  const [val, setValue] = useState("");
  const [customers, setCustomers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const { employee } = useAuth();
  const token = employee?.employee_token;

  const handleSearchCustomer = async () => {
    try {
      const data = await customerService.searchedCustomers(val, token);
      setSearch(data || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const customersData = async () => {
    try {
      const data = await customerService.getAllCustomers(token, offset);
      const l = await customerService.totalNofCustomers(token);
      setLast(l);
      if (data && data.customers) {
        setCustomers(data.customers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Fetching customers error:", error);
      setCustomers([]);
    }
  };

  const First = () => setOffset(0);
  const Next = () => setOffset((prev) => Math.min(prev + 10, last - 10));
  const Previous = () => setOffset((prev) => Math.max(prev - 10, 0));
  const Last = () => {
    const res = last % 10;
    setOffset(res === 0 ? last - 10 : last - res);
  };

  const handleDelete = async () => {
    const res = await customerService.deleteCustomer(token, customerToDelete.customer_id);
    if (res.status === "Customer successfully deleted!") {
      customersData();
      setShowDeleteModal(false);
    }
    setCustomerToDelete(null);
  };

  const handleShowDeleteModal = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setCustomerToDelete(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (val) {
      handleSearchCustomer();
    }
  }, [offset, val, token]);

  useEffect(() => {
    if (employee && token) {
      customersData();
    }
  }, [employee, token, offset]);

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Customers</h2>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <input
            type="search"
            className="form-control w-50 w-md-25"
            placeholder="Search for customers using first name, last name, email address, or phone number"
            value={val}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <Table responsive striped bordered hover className="modern-table border">
            <thead>
              <tr>
                <th>Active</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added Date</th>
                <th>Edit/Delete/View</th>
              </tr>
            </thead>
            <tbody>
              {(val ? search : customers).map((customer) => (
                <tr key={customer.customer_id}>
                  <td className={customer.active_customer_status ? "text-success" : "text-danger"}>
                    <h6 className="py-0 my-0 mx-3 font-weight-bold">
                      {customer.active_customer_status ? "Yes" : "No"}
                    </h6>
                  </td>
                  <td>{customer.customer_first_name}</td>
                  <td>{customer.customer_last_name}</td>
                  <td>{customer.customer_email}</td>
                  <td>{customer.customer_phone_number}</td>
                  <td>{customerService.formatDate(customer.customer_added_date)}</td>
                  <td>
                    <div className="action-icons">
                      <Link to={`/admin/edit-customer/${customer.customer_id}`} state={{ customer }}>
                        <FaEdit title="Edit" />
                      </Link>
                      <Link to={`/admin/customers/${customer.customer_id}`} state={{ customer }}>
                        <FiExternalLink title="View" />
                      </Link>
                      <Link onClick={() => handleShowDeleteModal(customer)}>
                        <i className="fas fa-trash-alt danger" title="Delete"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Pagination className="justify-content-center custom-pagination">
          <Pagination.Prev onClick={Previous} disabled={offset === 0} />
          <Pagination.Item onClick={First} disabled={offset === 0}>
            <HiMiniChevronDoubleLeft /> First
          </Pagination.Item>
          <Pagination.Item onClick={Previous} disabled={offset === 0}>
            <HiChevronLeft /> Previous
          </Pagination.Item>
          <Pagination.Item onClick={Next} disabled={offset >= last - 10}>
            <HiChevronRight /> Next
          </Pagination.Item>
          <Pagination.Item onClick={Last} disabled={offset >= last - 10}>
            Last <HiChevronDoubleRight />
          </Pagination.Item>
          <Pagination.Next onClick={Next} disabled={offset >= last - 10} />
        </Pagination>
      </div>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>
            {customerToDelete
              ? `${customerToDelete.customer_first_name} ${customerToDelete.customer_last_name}`
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
    </section>
  );
};

export default CustomerList;