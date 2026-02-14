import "./Navbar.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo2.png";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { menuImgs } from "../../assets/data";
import MobileBurger from "../MobileBurger/MobileBurger";
import useServices from "../../hooks/useServices";

import { RxCross1 } from "react-icons/rx";
import { FaInstagram } from "react-icons/fa";

import { CiMail } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { SlScreenSmartphone } from "react-icons/sl";

import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const location = useLocation();
  const [openFollowCard, setOpenFollowCard] = useState(false);
  const { services } = useServices();

  const openSocialCard = () => {
    setOpenFollowCard((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const midPoint = window.innerHeight / 1; // Mid-point of the viewport

      if (currentScrollY > midPoint) {
        // Scrolling down past mid-point
        if (currentScrollY > lastScrollY) {
          setNavbarVisible(false); // Hide navbar
        } else {
          setNavbarVisible(true); // Show navbar when scrolling up
        }
      } else {
        setNavbarVisible(true); // Always show navbar above mid-point
      }

      setLastScrollY(currentScrollY); // Update last scroll position
      setScroll(currentScrollY > 50); // For scrolled class (optional)
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const homeClass = location.pathname === "/" ? "home-class" : "";

  return (
    <>
      <nav
        className={`navbar ${scroll ? "scrolled" : ""}  ${homeClass} ${
          navbarVisible ? "navbar-visible" : "navbar-hidden"
        }`}
      >
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src={logo} alt="Company Logo" loading="lazy" />
          </Link>
        </div>

        {/* Right: Navigation Links */}
        <ul className={`navbar-right ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink
              to="/"
              className={`nav-link ${
                location.pathname === "/" ? "active-link" : ""
              }`}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/portfolio"
              className={`nav-link ${
                location.pathname === "/portfolio" ? "active-link" : ""
              }`}
            >
              Portfolio
            </NavLink>
          </li>

          {/* Services Dropdown */}
          <li
            className="dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="name-link">
              Services <IoIosArrowDown className="dropdown-icon" />
            </span>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                {services.map((service) => (
                  <li key={service.service_name}>
                    <Link
                      to={service.link}
                      className={`dropdown-item ${
                        location.pathname === service.link ? "active-link" : ""
                      }`}
                    >
                      {service.service_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <NavLink
              to="/about-us"
              className={`nav-link ${
                location.pathname === "/about-us" ? "active-link" : ""
              }`}
            >
              About Us
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact-us"
              className={`nav-link ${
                location.pathname === "/contact-us" ? "active-link" : ""
              }`}
            >
              Contact Us
            </NavLink>
          </li>
        </ul>

        <div className="mobile-nav-menu">
          <div className="social-burger" onClick={openSocialCard}>
            <div className="nav-social" >
              <div className="nav-social-menu">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div className="mobile-burger">
            <MobileBurger />
          </div>
        </div>
      </nav>

      {openFollowCard && (
        <div
          key={openFollowCard}
          className={`nav-social-card ${openFollowCard ? "active" : "hidden"}`}
        >
          <button onClick={openSocialCard}>
            Close <RxCross1 className="cross-icon" />
          </button>

          <div className="nav-social-logo">
            <img src={logo} alt="logo image" loading="lazy" />
          </div>
          <div className="nav-social-desc">
            <h6>TK Production Films</h6>
            <div className="inside-insta-logo">
              <a
                href="https://www.instagram.com/tk_production_film/?igsh=dmg3cm5tdXBxN3R1&utm_source=qr#"
                target="_blank"
              >
                <FaInstagram className="insta-icon" />
                Instagram
              </a>
            </div>

            <div className="insta-gallery">
              {menuImgs.map((item) => (
                <div className="gallery-img">
                  <img src={item.image} alt="insta-image" loading="lazy" />
                </div>
              ))}
            </div>

            <div className="nav-social-media">
              <div className="nav-social-media-item">
                <CiMail className="social-media-icon" />
                <span>Support@tkproductionfilm.com</span>
              </div>

              <div className="nav-social-media-item">
                <CiLocationOn className="social-media-icon" />
                <span>506a Ladymargret Road Southall ub1 2np</span>
              </div>

              <div className="nav-social-media-item call-item">
                <SlScreenSmartphone className="social-media-icon" />
                <div className="social-media-icon-top">
                  <div className="social-media-icon-item">
                    <span>+447884537171</span>
                    <span className="whatsapp-link">
                      <a
                        href="https://wa.me/447884537171"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Call Now
                      </a>
                    </span>
                  </div>

                  <div className="social-media-icon-item">
                    <span>+919725621316</span>
                    <span className="whatsapp-link">
                      <a
                        href="https://wa.me/919725621316"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Call Now
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-social-follow">
              <h6>// Follow Us</h6>
              <div className="nav-social-follow-icons">
                <a
                  href="https://www.facebook.com/tkproductionfilm?mibextid=wwXIfr&rdid=shqDkdh9xtXyGSgN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F163hvW8GX9%2F%3Fmibextid%3DwwXIfr#"
                  target="_blank"
                >
                  <FaFacebook className="nav-social-follow-icon facebook" />
                </a>

                <a
                  href="https://www.instagram.com/tk_production_film/?igsh=dmg3cm5tdXBxN3R1&utm_source=qr#"
                  target="_blank"
                >
                  <FaInstagram className="nav-social-follow-icon insta" />
                </a>

                <a
                  href="https://www.youtube.com/@tkproductionfilm"
                  target="_blank"
                >
                  <FaYoutube className="nav-social-follow-icon youtube" />
                </a>

                <a
                  href="https://www.tiktok.com/@takproductionsltd?_t=ZN-8uBFBGxMNMc&_r=1"
                  target="_blank"
                >
                  <FaTiktok className="nav-social-follow-icon tiktok" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
