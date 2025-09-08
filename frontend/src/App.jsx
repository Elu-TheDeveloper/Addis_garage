// App.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './markup/pages/Home';
import Login from './markup/pages/Login';
import Addemployee from './markup/pages/admin/Employee/Addemployee';
import Employees from './markup/pages/admin/Employee/Employees';
import EditEmployee from './markup/pages/admin/Employee/EditEmployee';
import EmployeeProfile from './markup/pages/admin/Employee/EmployeeProfile';
import Customer from './markup/pages/admin/Customers/Customers';
import CustomerForm from './markup/pages/admin/Customers/CustomerForm';
import EditCustomer from './markup/components/Admin/CustomerForm/EditCustomer';
import PrivateAuthRoute from './markup/components/Auth/PrivateAuth';
import Unauthorized from './markup/pages/Unauthorized';
import EditVehicle from './markup/pages/admin/Vehicle/EditVehicle';
import CreateOrder from './markup/components/Admin/Orders/CreateOrder';
import UpdateOrderPage from './markup/pages/admin/Orders/UpdateOrderPage';
import SingleOrderPage from './markup/pages/admin/Orders/SingleOrderPage';
import CreateOrderPage from "./markup/pages/admin/Orders/CreateOrderPage"
import Header from './markup/components/Header/Header';
import Footer from './markup/components/Footer/Footer';
import AdminDashBoard from './markup/components/Admin/AdminDashBoard/AdminDashBoard';
import Vehicle from "./markup/pages/admin/Vehicle/Vehicle"
import './assets/assets_from_template/css/bootstrap.css';
import './assets/assets_from_template/css/style.css';
import './assets/assets_from_template/css/responsive.css';
import './assets/assets_from_template/css/color.css';
import './assets/styles/custom.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/admin/add-employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Addemployee />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AdminDashBoard />
            </PrivateAuthRoute>
          }
        />        
        <Route path="/admin/create-order" element={<CreateOrderPage />} />
        <Route path="admin/order/:orderId" element={<UpdateOrderPage />} />
        <Route
          path="/admin/order-single/:customer_id"
          element={
              <SingleOrderPage />} />
        <Route path="/admin/order/:ID/:vID" element={<CreateOrder />} />
        <Route path="/admin/edit-vehicle/:id" element={<EditVehicle />} />
        <Route path="/admin/customers/:id" element={<Vehicle />} />
     
        <Route
          path="/admin/employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Employees />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/employee/edit/:id"
          element={
            <PrivateAuthRoute roles={[3]}>
              <EditEmployee />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/employee-profile/:id"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <EmployeeProfile />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <Customer />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <CustomerForm />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/customer"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Customer />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/edit-customer/:customerId"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <EditCustomer />
            </PrivateAuthRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;