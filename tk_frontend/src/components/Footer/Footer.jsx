import { Link } from "react-router-dom";
import "./Footer.scss";

import logo from "../../assets/images/logo2.png";
import { BsArrowUpRight } from "react-icons/bs";
import { footerLinks } from "../../assets/data";
import useServices from "../../hooks/useServices";

import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  const { services } = useServices();
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-inner">
            <div className="row">
              <div className="row1">
                <div className="footer-widget">
                  <ul>
                    {footerLinks.map((item , index) => (
                      <li key={index}>
                        <Link to={item.link}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="row2">
                <div className="row2-widget">
                  <div className="footer-logo">
                    <img src={logo} alt="logo image" loading="lazy" />
                  </div>
                  <h6 className="row2-title">
                    Contact us for a great photography <br /> session &
                    beautiful captured moments
                  </h6>
                  <div className="row2-input">
                    <Link to={"/contact-us"}>
                      <button className="book-kimono">
                        Book Us Now
                        <span className="arrows">
                          <BsArrowUpRight className="up-arrow first-arrow" />
                          <BsArrowUpRight className="up-arrow second-arrow" />
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="row3">
                <div className="footer-widget">
                  <ul>
                    {services.map((item , index) => (
                      <li key={index}>
                        <Link to={item.link}>{item.service_name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            TK Production Films all rights reserved Devloped and Design by&nbsp;
            <a
              href="https://www.Wingstarnarketing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="star-link"
            >
              Star Marketing
            </a>
          </p>

          <div className="footer-icons">
            <a
              href="https://www.facebook.com/tkproductionfilm?mibextid=wwXIfr&rdid=shqDkdh9xtXyGSgN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F163hvW8GX9%2F%3Fmibextid%3DwwXIfr#"
              target="_blank"
            >
              <FaFacebook className="footer-icon facebook" />
            </a>

            <a
              href="https://www.instagram.com/tk_production_film/?igsh=dmg3cm5tdXBxN3R1&utm_source=qr#"
              target="_blank"
            >
              <FaInstagram className="footer-icon insta" />
            </a>

            <a href="https://www.youtube.com/@tkproductionfilm" target="_blank">
              <FaYoutube className="footer-icon youtube" />
            </a>

            <a
              href="https://www.tiktok.com/@takproductionsltd?_t=ZN-8uBFBGxMNMc&_r=1"
              target="_blank"
            >
              <FaTiktok className="footer-icon tiktok" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
