import React, { useState } from "react";
import AdminMenu from "../../../components/AdminMenu/AdminMenu";
import CustomerList from "../../../components/Admin/CustomerList/CustomerList";

function Customers() {

  return(
    <div>
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side px-5">
          <CustomerList />
        </div>
      </div>
    </div>
    </div>
  );

}
export default Customers;
