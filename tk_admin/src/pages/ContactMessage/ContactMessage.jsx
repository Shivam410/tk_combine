import { useEffect, useState } from "react";
import "./ContactMessage.scss";
import Table from "../../components/Table/Table";
import axios from "axios";

import { baseUrl } from "../../main";

const ContactMessage = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/contact/all-contacts`);

        setRowData(
          data.contacts.map((item) => ({
            id: item._id,
            name: item.name,
            email: item.email,
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
      headerName: "Message ID",
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
      headerName: "Email",
      field: "email",
      flex: 1,
      cellStyle: { textAlign: "center" },
      headerClass: "header-center",
    },
    {
      headerName: "Date",
      field: "createdAt",
      flex: 1,
      cellStyle: { textAlign: "center" },
      headerClass: "header-center",
    },
  ];

  return (
    <div className="contactMessage">
      <h1>Contact Messages</h1>
      <Table rowData={rowData} columnDefs={columnDefs} tableLink="contact" />
    </div>
  );
};

export default ContactMessage;
