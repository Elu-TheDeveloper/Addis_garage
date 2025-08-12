import React from 'react'
import { useAuth } from '../../../../context/AuthContext'
import LoginForm from '../../../components/LoginForm/LoginForm'
const Employees = () => {
    const { isLoggedin, isAdmin } = useAuth();
    
    if (isLoggedin) {
        if (isAdmin) {
          return (
            <div>
              <h1>Employees Page</h1>
            </div>
          );
        } else {
          return (
            <div>
              <h1>You are not authorized to access this page</h1>
            </div>
          );
        }
      } else {
        return (
          <div>
            <LoginForm />
          </div>
        );
      }
    
    }

export default Employees