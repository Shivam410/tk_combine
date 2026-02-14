import { useEffect, useState } from "react";
import "./Teams.scss";

import Table from "../../components/Table/Table";

import { Link } from "react-router-dom";
import axios from "axios";

import { baseUrl } from "../../main";

const Teams = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const { data } = await axios.get(`${baseUrl}/team/all-teams`);

        setRowData(
          data.teams.map((item) => ({
            id: item._id,
            name: item.name,
            title: item.title,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching home banners:", error);
      }
    };

    fetchData();
  }, []);

  const columnDefs = [
    {
      headerName: "User ID",
      field: "id",
      flex: 1,
      cellStyle: { textAlign: "center" },
      headerClass: "header-center",
    },
    {
      headerName: "Name",
      field: "name",
      flex: 2,
      cellStyle: { textAlign: "center" },
      headerClass: "header-center",
    },
    {
      headerName: "Title",
      field: "title",
      flex: 1,
      cellStyle: { textAlign: "center" },
      headerClass: "header-center",
    },
    {
      headerName: "Joining Date",
      field: "createdAt",
      flex: 1,
      cellStyle: { textAlign: "center" },
      headerClass: "header-center",
    },
  ];

  return (
    <div className="teams">
      <div className="teams-top">
        <h1>Teams</h1>
        <Link to={"/new-team-member"}>
          <button>Add New Team Member</button>
        </Link>
      </div>
      <Table rowData={rowData} columnDefs={columnDefs} tableLink="teams" />
    </div>
  );
};

export default Teams;
