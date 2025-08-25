import React from 'react'
import React from "react";
import AdminMenu from "../../../components/AdminMenu/AdminMenu";
import AllOrders from "../../../components/Admin/Orders/AllOrders";
const AllOrdersPage = () => {
  return (
      <div>
        <div>
            <div className="container-fluid admin-pages">
                <div className="row">
                    <div className="col-md-3 admin-left-side">
                      <AdminMenu />
                    </div>
                    <div className="col-md-9 admin-right-side">
                      <AllOrders />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AllOrdersPage