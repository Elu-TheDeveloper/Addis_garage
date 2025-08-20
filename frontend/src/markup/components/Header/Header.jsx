import logo from '../../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import loginService from '../../../Services/login.service'
import { useAuth } from '../../../context/AuthContext'
// import "../Header/Header.css"

const Header = () => {
  const { isLoggedin, setIsLogged, employee } = useAuth()

  // Logout Event handler
  const LogOut = () => {
    loginService.LogOut()
    setIsLogged(false)
  }

  return (
    <header className="main-header header-style-one">

      {/* <!-- Header Top --> */}
      <div className="header-top">
        <div className="auto-container">
          <div className="inner-container">
            <div className="left-column">
              <div className="text">Enjoy The beso while we fix your car</div>
              <div className="office-hour">Monday - Saturday 7:00AM - 6:00PM</div>
            </div>
            <div className="right-column">
              {isLoggedin ? (
                <div className="phone-number">
                  <strong>Welcome {employee?.employee_first_name}</strong>
                </div>
              ) : (
                <div className="phone-number">
                  Schedule Your Appointment Today : <strong>1800 456 7890</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Header Upper --> */}
      <div className="header-upper">
        <div className="auto-container">
          <div className="inner-container">
            {/* <!--Logo--> */}
            <div className="logo-box">
              <div className="logo"><a href="/index"><img src={logo} alt="logo" /></a></div>
            </div>
            <div className="right-column">
              {/* <!--Nav Box--> */}
              <div className="nav-outer">
                <nav className="main-menu navbar-expand-md navbar-light">
                  <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                    <ul className="navigation">
                      <li><a href="/index">Home</a></li>
                      <li><a href="/about">About Us</a></li>
                      <li><a href="/service">Services</a></li>
                      <li><a href="/contact">Contact Us</a></li>
                    </ul>
                  </div>
                </nav>
              </div>

              {/* Login / Logout button */}
              {isLoggedin ? (
                <div className="Link-btn">
                  <Link
                    to="/login"
                    className="theme-btn btn-style-one blue"
                    onClick={LogOut}
                  >
                    Logout
                  </Link>
                </div>
              ) : (
                <div className="Link-btn">
                  <Link to="/login" className="theme-btn btn-style-one">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Sticky Header --> */}
      <div className="sticky-header">
        <div className="header-upper">
          <div className="auto-container">
            <div className="inner-container">
              {/* <!--Logo--> */}
              <div className="logo-box">
                <div className="logo"><a href="/index"><img src={logo} alt="logo" /></a></div>
              </div>
              <div className="right-column">
                <div className="nav-outer">
                  <nav className="main-menu navbar-expand-md navbar-light"></nav>
                </div>

                {/* Login / Logout button for sticky header */}
                {isLoggedin ? (
                  <div className="Link-btn">
                    <Link
                      to="/login"
                      className="theme-btn btn-style-one blue"
                      onClick={LogOut}
                    >
                      Logout
                    </Link>
                  </div>
                ) : (
                  <div className="Link-btn">
                    <Link to="/login" className="theme-btn btn-style-one">
                      Login
                    </Link>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </header>
  )
}

export default Header
