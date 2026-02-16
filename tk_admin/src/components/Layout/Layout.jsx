import "./Layout.scss";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="layout-container">
        <div className="layout-left">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="layout-right">
          <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          <div className="layout-content">
            <Outlet />
          </div>
        </div>
      </div>
      <div
        className="layout-overlay"
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />
    </div>
  );
};

export default Layout;
