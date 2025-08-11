import React from "react";
import AddCustomerForm from "../../../components/Admin/CustomerForm/CustomerForm";
import AdminMenu from "../../AdminMenu/AdminMenu";

function CustomerForm(props) {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <AddCustomerForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;
