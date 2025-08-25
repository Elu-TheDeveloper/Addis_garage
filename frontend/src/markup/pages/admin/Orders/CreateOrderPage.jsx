import React, { useState } from 'react';
import CreateOrder from '../../../components/Admin/Orders/CreateNewOrder';
import AdminMenu from '../../../components/AdminMenu/AdminMenu';
const CreateOrderPage = () => {
  return (
     <div>
        <div>
            <div className="container-fluid admin-pages">
                <div className="row">
                    <div className="col-md-3 admin-left-side">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9 admin-right-side px-5">
                        <CreateOrder />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateOrderPage