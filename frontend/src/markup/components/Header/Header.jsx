import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import loginService from "../../../services/login.service";
import { useAuth } from "../../../context/AuthContext";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Header.css";

const Header = () => {
  const { isLoggedin, setIsLogged, employee } = useAuth(); // ✅ fixed: match context
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  const updateMedia = () => {
    setIsMobile(window.innerWidth < 1200);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const LogOut = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      loginService.LogOut();
      setIsLogged(false);
      navigate("/login");
    }
  };

  const handleAdminClick = (event) => {
    event.preventDefault();
    navigate("/admin");
  };

  const isAdmin = employee?.employee_role === 3;
  console.log("is user admin", isAdmin);

  return (
    <div>
      <header className="main-header header-style-one">
        {/* Top bar */}
        <div className="header-top">
          <div className="auto-container">
            <div className="inner-container">
              <div className="left-column">
                <div className="text">Enjoy the Beso while we fix your car</div>
                <div className="office-hour">
                  Monday - Saturday 7:00AM - 6:00PM
                </div>
              </div>
              <div className="right-column d-flex">
                {isLoggedin ? (
                  <div className="link-btn">
                    <button onClick={handleAdminClick} className="account-btn">
                      <strong>Welcome {employee?.employee_first_name}!</strong>
                    </button>
                  </div>
                ) : (
                  <div className="phone-number">
                    Schedule Appointment: <strong>1800 456 7890</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Header main */}
        <div className="header-upper">
          <div className="auto-container">
            <div className="inner-container d-flex justify-content-between align-items-center">
              {/* ✅ Logo + Hamburger menu (on left) */}
              <div className="logo-box left-box d-flex align-items-center">
                <div className="logo">
                  <Link to="/">
                    <img src={logo} alt="Logo" />
                  </Link>
                </div>

                {isMobile && (
                  <div className="hamburger-container ms-3">
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        id="dropdown-hamburger"
                        className="hamburger-toggle"
                        as="div"
                      >
                        <div className="hamburger-icon">
                          <span className="hamburger-line"></span>
                          <span className="hamburger-line"></span>
                          <span className="hamburger-line"></span>
                        </div>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/">
                          Home
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/about">
                          About Us
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/services">
                          Services
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/contact">
                          Contact Us
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              </div>

              {/* ✅ Main menu for desktop */}
              <div className="right-column d-flex align-items-center">
                <div className="nav-outer">
                  {!isMobile && (
                    <nav className="main-menu navbar-expand-md navbar-light">
                      <div
                        className="collapse navbar-collapse show clearfix"
                        id="navbarSupportedContent"
                      >
                        <ul className="navigation navbar-nav">
                          <li>
                            <Link to="/">Home</Link>
                          </li>
                          <li>
                            <Link to="/about">About Us</Link>
                          </li>
                          <li>
                            <Link to="/services">Services</Link>
                          </li>
                          <li>
                            <Link to="/contact">Contact Us</Link>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  )}
                </div>

                {/* ✅ Login / Logout */}
                {isLoggedin ? (
                  <div className="signing-btn ms-3">
                    <Link
                      to="/"
                      className="theme-btn btn-style-one blue"
                      onClick={LogOut}
                    >
                      Log out
                    </Link>
                  </div>
                ) : (
                  <div className="signing-btn ms-3">
                    <Link to="/login" className="theme-btn btn-style-one">
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
