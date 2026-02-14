import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import { IoMdMenu, IoMdClose } from "react-icons/io";

import "./MobileBurger.scss";

import { IoHomeOutline } from "react-icons/io5";

import { FaRegImage } from "react-icons/fa";

import { FaRegUser } from "react-icons/fa";

import { IoMdPhonePortrait } from "react-icons/io";

import { MdOutlineMiscellaneousServices } from "react-icons/md";

import { FaChevronRight } from "react-icons/fa";
import useServices from "../../hooks/useServices";

const MobileBurger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const [scroll, setScroll] = useState(false);
  const { services } = useServices();

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const location = useLocation();

  const homeClass = location.pathname === "/" ? "mobile-class" : "";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`mobile-burger-menu ${scroll ? "scrolled" : ""} ${homeClass}`}
    >
      {/* Mobile Menu Button */}
      <button onClick={() => setIsOpen(true)} className="mobile-menu-btn">
        <IoMdMenu size={35} className="burger-line" />
      </button>

      {/* Fullscreen Overlay */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        {/* Sliding Menu Panel */}
        <Dialog.Panel
          className={`mobile-menu ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button onClick={() => setIsOpen(false)} className="close-btn">
            <IoMdClose size={28} />
          </button>

          {/* Navigation Links */}
          <nav className="menu-links">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="burger-link"
            >
              <IoHomeOutline className="nav-icon" />
              Home
            </Link>
            <Link
              to="/portfolio"
              onClick={() => setIsOpen(false)}
              className="burger-link"
            >
              <FaRegImage className="nav-icon" />
              Portfolio
            </Link>

            <Link
              to="/about-us"
              onClick={() => setIsOpen(false)}
              className="burger-link"
            >
              <FaRegUser className="nav-icon" />
              About Us
            </Link>
            <Link
              to="/contact-us"
              onClick={() => setIsOpen(false)}
              className="burger-link"
            >
              <IoMdPhonePortrait className="nav-icon" />
              Contact Us
            </Link>

            <div
              className="burger-link burger-services"
              onClick={toggleServices}
            >
              <div className="services-menu">
                <div className="burger-link-left">
                  <MdOutlineMiscellaneousServices className="nav-icon" />
                  Services
                </div>
                <FaChevronRight
                  className={`chevron ${isServicesOpen ? "rotate" : ""}`}
                />
              </div>

              <div className={`services-links ${isServicesOpen ? "open" : ""}`}>
                {services.map((service) => (
                  <Link
                    to={`${service.link}`}
                    className="services-link"
                    key={service.link}
                    onClick={() => setIsOpen(false)}
                  >
                    {service.service_name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default MobileBurger;
