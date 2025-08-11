import React from "react";
import EditCustomerForm from "../../../components/Admin/CustomerForm/EditCustomer";
import AdminMenu from "../../../components/Admin/AdminMenu/AdminMenu";

function EditCustomer(props) {
  const customer = {
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    phone: "555-555-5555",
    active: true,
  };

  const handleSave = (updatedCustomer) => {
    console.log("Updated Customer:", updatedCustomer);
  };

  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <EditCustomerForm customer={customer} onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCustomer;
