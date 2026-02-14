import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoIosGlobe } from "react-icons/io";
import { CiMobile2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import "./ContactSection.scss";

import { MdMailOutline } from "react-icons/md";

import flag1 from "../../assets/images/flag1.svg";
import flag2 from "../../assets/images/flag2.svg";
import { Link } from "react-router-dom";

const ContactSection = () => {
  useEffect(() => {
    // Initialize AOS without the global offset
    AOS.init({
      duration: 1000,
      easing: "ease",
      once: false,
      delay: 500,
    });

    AOS.refresh(); // Refresh AOS to apply changes
  }, []);

  return (
    <div className="contactSection">
      <div className="contactSection-left-cont">
        <div
          className="contactSection-card"
          // data-aos="fade-right"
          // data-aos-offset="1400"
        >
          <div className="contactSection-left">
            <MdMailOutline className="contactSection-icon" />
          </div>
          <div className="contactSection-right">
            <h1>Our Mail</h1>
            <p>Support@tkproductionfilm.com</p>
            <a href="mailto:Support@tkproductionfilm.com" className="mail-link">
              <span>Mail Us</span>
            </a>
          </div>
        </div>

        <div
          className="contactSection-card"
          // data-aos="fade-right"
          // data-aos-offset="1400"
        >
          <div className="contactSection-left">
            <CiMobile2 className="contactSection-icon" />
          </div>
          <div className="contactSection-right">
            <h1>Book Us</h1>

            <p>+447884537171</p>
            <span>
              <a
                href="https://wa.me/447884537171"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                Call Now
              </a>
            </span>

            <p>+919725621316</p>
            <span>
              <a
                href="https://wa.me/919725621316"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                Call Now
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="contactSection-right-cont">
        <div
          className="contactSection-card"
          // data-aos="fade-right"
          // data-aos-offset="1400"
        >
          <div className="contactSection-left">
            <IoLocationOutline className="contactSection-icon" />
          </div>
          <div className="contactSection-right address-tk">
            <h1>Address</h1>
            <div className="address">
              <p>
                Head Office in London <img src={flag1} alt="uk flag" loading="lazy" /> :
              </p>
              <span>506a Ladymargret Road Southall ub1 2np</span>
            </div>

            <div className="address">
              <p>
                Branch Office India
                <img src={flag2} alt="india flag" loading="lazy" /> :
              </p>
              <div className="sm-address">
                <span>
                  Nathani complex blue stars building 6th floor 604 near
                  millenium hospital kausa mumbra thane 400612
                </span>
              </div>
            </div>

            <div className="address">
              <p>
                2nd. Branch Office India
                <img src={flag2} alt="" /> :{" "}
              </p>
              <div className="sm-address">
                <span>Main bazar Near.sbi bank Diu (362520)</span>
              </div>
              <Link to="/contact-us#map">
                <span className="view-map">View Map</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
