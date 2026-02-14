import "./Sidebar.scss";
import logo from "../../assets/images/logo2.png";
import { RxDashboard } from "react-icons/rx";
import { MdHomeMax } from "react-icons/md";
import { FaRegImage } from "react-icons/fa";
import { GrGroup, GrContact } from "react-icons/gr";
import { MdMiscellaneousServices } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import { IoAlbumsOutline } from "react-icons/io5";
import { RiArrowRightSLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { AiOutlineMobile } from "react-icons/ai";
import { VscPreview } from "react-icons/vsc";

import { baseUrl } from "../../main";
import { IoVideocamOutline } from "react-icons/io5";

import axios from "axios";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const { user, dispatch } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  const [openServices, setOpenServices] = useState(false);
  const [allService, setAllService] = useState([]);

  useEffect(() => {
    const allServices = async () => {
      const { data } = await axios.get(`${baseUrl}/services`);
      setAllService(data?.services);
    };
    allServices();
  }, []);

  const menuItems = [
    { path: "/", icon: <RxDashboard />, label: "Dashboard" },
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
      await axios.post(`${baseUrl}/auth/logout`, { withCredentials: true });

      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout. Try again!");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="sidebar-contents">
        {menuItems.map(({ path, icon, label }) => (
          <Link to={path} key={path}>
            <div
              className={`sidebar-option ${
                location.pathname === path ? "active" : ""
              }`}
            >
              {icon}
              <p>{label}</p>
            </div>
          </Link>
        ))}

        <div className="sidebar-services">
          <div
            className="sidebar-option-services"
            onClick={() => setOpenServices(!openServices)}
          >
            <div className="sidebar-option-services-left">
              <MdMiscellaneousServices className="sidebar-icon" />
              <p>Services</p>
            </div>
            <RiArrowRightSLine className="sidebar-right" />
          </div>

          {openServices && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openServices ? "auto" : 0,
                opacity: openServices ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="services-links"
            >
              <ul>
                <Link to="/services/new">
                  <li>+ Add New Service</li>
                </Link>
                {allService.length > 0 ? (
                  allService.map((service) => {
                    return (
                      <Link key={service._id} to={`/services/${service._id}`}>
                        <li>{service.serviceName}</li>
                      </Link>
                    );
                  })
                ) : (
                  <p>No services available</p>
                )}
              </ul>
            </motion.div>
          )}
        </div>

        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
            <IoLogOutOutline className="login-icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
