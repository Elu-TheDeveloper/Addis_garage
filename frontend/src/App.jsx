import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './markup/pages/Home'
import Login from './markup/pages/Login'
import Addemployee from './markup/pages/admin/Employee/Addemployee'
import Employees from './markup/pages/admin/Employee/Employees'
import EditEmployee from './markup/pages/admin/Employee/EditEmployee'
import EmployeeProfile from './markup/pages/admin/Employee/EmployeeProfile'
import Customer from "./markup/pages/admin/Customers/Customers"
import CustomerForm from './markup/pages/admin/Customers/CustomerForm'
import EditCustomer from './markup/components/Admin/CustomerForm/EditCustomer'
import Orders from './markup/pages/admin/Orders'
import PrivateAuthRoute from './markup/components/Auth/PrivateAuth'
import "./assets/assets_from_template/css/bootstrap.css"
import "./assets/assets_from_template/css/style.css"
import "./assets/assets_from_template/css/responsive.css"
import "./assets/assets_from_template/css/color.css"
import Unauthorized from './markup/pages/Unauthorized'

//Custom CSS
import "./assets/styles/custom.css"

//Header
import Header from "../src/markup/components/Header/Header"
//footer
import Footer from "../src/markup/components/Footer/Footer"
function App() {

  return (
    <>
   <Header/>
  <Routes>
  <Route path="/" element = {<Home/>}/>
  <Route path="/Login" element ={<Login/>}/>
  
  <Route path="/unauthorized" element ={<Unauthorized/>}/>
   <Route path="admin/employee" element ={<Employees/>}/>
   {/* <Route path="admin/add-employee" element ={<Addemployee/>}/> */}
<Route path="/admin/orders" element ={
  
  <PrivateAuthRoute roles ={[1,2,3]}>

<Orders/>
</PrivateAuthRoute>
} />


<Route path="/admin/add-employee" element ={
  <PrivateAuthRoute roles ={[3]}>
<Addemployee/>
</PrivateAuthRoute>

} />

   <Route
          path="admin/employee/edit/:id"
          element={
            <PrivateAuthRoute roles={[3]}>
              <EditEmployee />
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
          path="admin/employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Employees />
            </PrivateAuthRoute>
          }
        />


         <Route
          path="/admin/employee-profile/:id"
          element={<EmployeeProfile />}
        />
         <Route
          path="/admin/edit-customer/:customerId"
          element={<EditCustomer />}
        />
 <Route
          path="/admin/add-customer"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <CustomerForm />
            </PrivateAuthRoute>
          }
        />
<Route path="/admin/customer" element ={
  
  <PrivateAuthRoute roles ={[2,3]}>

<Customer/>
</PrivateAuthRoute>

} />
</Routes>
<Footer/>
 </>
  )
}

export default App

