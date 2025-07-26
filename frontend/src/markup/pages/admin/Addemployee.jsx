import React from 'react'
import AdminMenu from '../../components/AdminMenu/AdminMenu'
import AddemployeeForm from '../../components/AddemployeeForm/AddemployeeForm'

const Addemployee = () => {

  
  return (
   <div>
    <div className="container-fluid admin-pages">
<div className="row">
  <div className="col-md-3 admin-left-side">
<AdminMenu/>
  </div>
  <div className="col-md-9 admin-left-side">
<AddemployeeForm/>
  </div>
</div>
    </div>
   </div>
  )
}

export default Addemployee