import { useEffect, useState } from "react";
import "./Dashboard.scss";
import axios from "axios";
import { baseUrl } from "../../main";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [totalMember, setTotalMember] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalMessages2, setTotalMessages2] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);

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
          axios.get(`${baseUrl}/visitors/count`),
        ]);

        setTotalMember(teamResponse.data.teams.length);
        setTotalMessages(contactResponse.data.contacts.length);
        setTotalMessages2(contact2Response.data.contacts.length);
        setTotalVisitors(visitorResponse.data.count);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const metrics = [
    {
      title: "Total Visitors",
      value: totalVisitors,
      suffix: "Visitors",
    },
    {
      title: "Total Contact Messages",
      value: totalMessages + totalMessages2,
      suffix: "Messages",
      link: "/messages",
    },
    {
      title: "Total Team Members",
      value: totalMember,
      suffix: "Members",
      link: "/teams",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="dashboard-top-cards">
          {metrics.map((metric) => {
            const card = (
              <article className="dashboard-top-card" key={metric.title}>
                <h3>{metric.title}</h3>
                <div className="dashboard-top-card-desc">
                  <h1>{metric.value}</h1>
                  <span>
                    <span className="line-break">/</span>
                    {metric.suffix}
                  </span>
                </div>
              </article>
            );

            if (metric.link) {
              return (
                <Link to={metric.link} key={metric.title} className="card-link">
                  {card}
                </Link>
              );
            }

            return card;
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
