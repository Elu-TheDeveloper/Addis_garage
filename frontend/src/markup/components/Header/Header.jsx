import logo from '../../../assets/images/logo.png'
import {Link} from 'react-router-dom'
import loginService from '../../../Services/login.service'
import {useAuth} from '../../../context/AuthContext'
const Header = () => {

const {isLoggedin, setIsLogged, employee}=useAuth()

//Logout Event handler
const LogOut = () =>{
loginService.LogOut()
    setIsLogged(false)
}
  return (
    <div>
 {/* <!-- Main Header --> */}
    <header className="main-header header-style-one">

        {/* <!-- Header Top --> */}
        <div className="header-top">
            <div className="auto-container">
                <div className="inner-container">
                    <div className="left-column">
                        <div className="text">Enjoy The  beso while we fix your car</div>
                        <div className="office-hour">Monday - Saturday 7:00AM - 6:00PM</div>
                    </div>
                    <div className="right-column">

                        <div className="right-column">
                       {isLoggedin ? (
  <div className="link-btn">

    <div className="phone-number">
      <strong>Welcome {employee?.employee_first_name}</strong>
    </div>
  </div>
) : (
   <div className="phone-number">Schedule Your Appontment Today : <strong>1800 456 7890</strong></div>
)}
                    </div>
                       
                    </div>
                </div>
            </div>
        </div>
{/* 
        <!-- Header Upper --> */}
        <div className="header-upper">
            <div className="auto-container">
                <div className="inner-container">
                    {/* <!--Logo--> */}
                    <div className="logo-box">
                        <div className="logo"><a href="#home"><img src={logo} alt=""/></a></div>
                    </div>
                    <div className="right-column">
                        {/* <!--Nav Box--> */}
                        <div className="nav-outer">
                            {/* <!--Mobile Navigation Toggler--> */}
                            <div className="mobile-nav-toggler"><img src="assets/images/icons/icon-bar.png" alt=""/></div>
{/* 
                            <!-- Main Menu --> */}
                            <nav className="main-menu navbar-expand-md navbar-light">
                                <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                                    <ul className="navigation">
                                        <li className="dropdown"><a href="/index">Home</a>
                                          
                                        </li>
                                        <li className="dropdown"><a href="about">About Us</a>
                                        </li>
                                        <li className="dropdown"><a href="/service">Services</a>
                                        </li>
                                        
                                        <li><a href="/contact">Contact Us</a></li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <div className="search-btn"></div>
                        {isLoggedin ?(
                            <div className="Link-btn">
                                <Link to ="/login" className='theme-btn
                                btn-style-one blue
                                btn-style-one blue' onClick={LogOut}>Logout</Link>
                            </div>

                        ):(
                            <div className='Link-btn'>
                                <Link to ="/login" className='theme-btn btn-style-one'>Login</Link>
                            </div>
                        )}
                    </div>                        
                </div>
            </div>
        </div>
        {/* <!--End Header Upper--> */}
{/* 
        <!-- Sticky Header  --> */}
        <div className="sticky-header">
            {/* <!-- Header Upper --> */}
            <div className="header-upper">
                <div className="auto-container">
                    <div className="inner-container">
                        {/* <!--Logo--> */}
                        <div className="logo-box">
                            <div className="logo"><a href="/index"><img src="assets/images/logo.png" alt=""/></a></div>
                        </div>
                        <div className="right-column">
                            {/* <!--Nav Box--> */}
                            <div className="nav-outer">
                                {/* <!--Mobile Navigation Toggler--> */}
                                <div className="mobile-nav-toggler"><img src="assets/images/icons/icon-bar.png" alt=""/></div>

                                {/* <!-- Main Menu --> */}
                                <nav className="main-menu navbar-expand-md navbar-light">
                                </nav>
                            </div>
                            <div className="search-btn"></div>
                            <div className="link-btn"><a href="#" className="theme-btn btn-style-one">Login</a></div>
                        </div>                        
                    </div>
                </div>
            </div>
            {/* <!--End Header Upper--> */}
        </div>
        {/* <!-- End Sticky Menu --> */}

        {/* <!-- Mobile Menu  --> */}
        <div className="mobile-menu">
            <div className="menu-backdrop"></div>
            <div className="close-btn"><span className="icon flaticon-remove"></span></div>
            
            <nav className="menu-box">
                <div className="nav-logo"><a href="index.html"><img src="assets/images/logo-two.png" alt="" title=""/></a></div>
                <div className="menu-outer"></div>

				<div className="social-links">
					<ul className="clearfix">
						<li><a href="#"><span className="fab fa-twitter"></span></a></li>
						<li><a href="#"><span className="fab fa-facebook-square"></span></a></li>
						<li><a href="#"><span className="fab fa-pinterest-p"></span></a></li>
						<li><a href="#"><span className="fab fa-instagram"></span></a></li>
						<li><a href="#"><span className="fab fa-youtube"></span></a></li>
					</ul>
                </div>
            </nav>
        </div>
        {/* <!-- End Mobile Menu --> */}

        <div className="nav-overlay">
            <div className="cursor"></div>
            <div className="cursor-follower"></div>
        </div>
    </header>
    {/* <!-- End Main Header --> */}
    
    </div>
  )
}

export default Header