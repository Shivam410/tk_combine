import "./FollowSection.scss";

import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const FollowSection = () => {
  return (
    <div className="followSection">
    
      <h1>FOLLOW US ON</h1>

      <div className="followSection-cards">
        <a
          href="https://www.facebook.com/tkproductionfilm?mibextid=wwXIfr&rdid=shqDkdh9xtXyGSgN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F163hvW8GX9%2F%3Fmibextid%3DwwXIfr#"
          target="_blank"
          className="followSection-card"
        >
          <FaFacebook className="followSection-icon" />
          <p>Facebook</p>
        </a>

        <a
          href="https://www.instagram.com/tk_production_film/?igsh=dmg3cm5tdXBxN3R1&utm_source=qr#"
          target="_blank"
          className="followSection-card"
        >
          <FaInstagram className="followSection-icon" />
          <p>Instagram</p>
        </a>

        <a
          href="https://www.youtube.com/@tkproductionfilm"
          target="_blank"
          className="followSection-card"
        >
          <FaYoutube className="followSection-icon" />
          <p>Youtube</p>
        </a>

        <a
          href="https://www.tiktok.com/@takproductionsltd?_t=ZN-8uBFBGxMNMc&_r=1"
          target="_blank"
          className="followSection-card"
        >
          <FaTiktok className="followSection-icon" />
          <p>TikTok</p>
        </a>
      </div>
    </div>
  );
};

export default FollowSection;
