import { useEffect, useState } from "react";
import "./Dashboard.scss";
import axios from "axios";
import { baseUrl } from "../../main";

import { Link } from "react-router-dom";

const Dashboard = () => {
  const [totalMember, setTotalMember] = useState("");
  const [totalMessages, setTotalMessages] = useState("");
  const [totalMessages2, setTotalMessages2] = useState("");
  const [totalVisitors, setTotalVisitors] = useState(""); // New state for visitors

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          teamResponse,
          contactResponse,
          contact2Response,
          visitorResponse,
        ] = await Promise.all([
          axios.get(`${baseUrl}/team/all-teams`),
          axios.get(`${baseUrl}/contact/all-contacts`),
          axios.get(`${baseUrl}/contact2/all-contact2`),
          axios.get(`${baseUrl}/visitors/count`), // Fetch visitor count
        ]);

        setTotalMember(teamResponse.data.teams.length);
        setTotalMessages(contactResponse.data.contacts.length);
        setTotalMessages2(contact2Response.data.contacts.length);
        setTotalVisitors(visitorResponse.data.count); // Set visitor count
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        
        <div className="dashboard-top-cards">
          {/* ✅ Total Visitors */}
          <div className="dashboard-top-card">
            <h3>Total Visitors</h3>
            <div className="dashboard-top-card-desc">
              <h1>{totalVisitors}</h1>
              <span>
                <span className="line-break">/</span>Visitors
              </span>
            </div>
          </div>

          {/* ✅ Total Contact Messages */}
          <Link to={"/messages"}>
            <div className="dashboard-top-card">
              <h3>Total Contact Messages</h3>
              <div className="dashboard-top-card-desc">
                <h1>{totalMessages + totalMessages2}</h1>
                <span>
                  <span className="line-break">/</span>Messages
                </span>
              </div>
            </div>
          </Link>

          {/* ✅ Total Team Members */}
          <Link to={"/teams"}>
            <div className="dashboard-top-card">
              <h3>Total Team Members</h3>
              <div className="dashboard-top-card-desc">
                <h1>{totalMember}</h1>
                <span>
                  <span className="line-break">/</span>Members
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
