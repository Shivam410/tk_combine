import "./Sidebar.scss";
import logo from "../../assets/images/logo2.png";
import { RxDashboard } from "react-icons/rx";
import { MdHomeMax } from "react-icons/md";
import { FaRegImage } from "react-icons/fa";
import { GrGroup, GrContact } from "react-icons/gr";
import { MdMiscellaneousServices } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { IoAlbumsOutline } from "react-icons/io5";
import { AiOutlineMobile } from "react-icons/ai";
import { VscPreview } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";

import { baseUrl } from "../../main";
import { IoVideocamOutline } from "react-icons/io5";

import axios from "axios";
import { toast } from "react-hot-toast";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, dispatch } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", icon: <RxDashboard />, label: "Dashboard" },
  ];

  const contentItems = [
    { path: "/home-banner", icon: <MdHomeMax />, label: "Home Banner" },
    {
      path: "/mobile-banner",
      icon: <AiOutlineMobile />,
      label: "Mobile Banner",
    },

    { path: "/photo-album", icon: <IoAlbumsOutline />, label: "Photo Album" },
    { path: "/portfolio", icon: <FaRegImage />, label: "Portfolio" },
    { path: "/teams", icon: <GrGroup />, label: "Teams" },
    { path: "/reviews", icon: <VscPreview />, label: "Reviews" },
    { path: "/services", icon: <MdMiscellaneousServices />, label: "Services" },

    { path: "/messages", icon: <GrContact />, label: "Contact Messages" },

    {
      path: "/contact-2-messages",
      icon: <GrContact />,
      label: "Contact 2 Messages",
    },

    {
      path: "/wedding-cinematography-videos",
      icon: <IoVideocamOutline size={17} />,
      label: "Wedding Cinematography",
    },

    {
      path: "/pre-wedding-film-videos",
      icon: <IoVideocamOutline />,
      label: "Pre Wedding Film",
    },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/auth/logout`, {}, { withCredentials: true });

      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout. Try again!");
    }
  };

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderNavItem = ({ path, icon, label }) => (
    <Link to={path} key={path} onClick={handleNavClick}>
      <div
        className={`sidebar-option ${
          location.pathname === path ? "active" : ""
        }`}
      >
        <span className="sidebar-icon">{icon}</span>
        <p>{label}</p>
      </div>
    </Link>
  );

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
          <div className="sidebar-brand">
            <h2>Admin Panel</h2>
            <p>Content Management</p>
          </div>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} type="button">
          <IoClose />
        </button>
      </div>

      <div className="sidebar-contents">
        <div className="sidebar-section">
          <p className="sidebar-section-title">Overview</p>
          {menuItems.map(renderNavItem)}
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title">Content</p>
          {contentItems.map(renderNavItem)}
        </div>

        {user && (
          <button className="logout-btn" onClick={handleLogout} type="button">
            Logout
            <IoLogOutOutline className="login-icon" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
