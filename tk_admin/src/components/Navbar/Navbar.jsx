import "./Navbar.scss";

import { useContext } from "react";
import { Context } from "../../context/Context";

import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";

import { Link } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { user } = useContext(Context);
  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());
  const userName = user?.user?.name || "Admin User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button type="button" className="menu-trigger" onClick={onMenuClick}>
          <HiOutlineMenuAlt2 />
        </button>

        <div className="date">
          <p>Control Center</p>
          <div className="date-row">
            <FaRegCalendarAlt />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      <Link to={"/profile"} className="navbar-right">
        <div className="usericon">{userInitial}</div>

        <div className="user-desc">
          <p>{userName}</p>
          <p>Administrator</p>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
