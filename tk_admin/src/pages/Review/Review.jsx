import { useEffect, useState } from "react";
import "./Review.scss";

import Table from "../../components/Table/Table";

import { Link } from "react-router-dom";
import axios from "axios";

import { baseUrl } from "../../main";

const Review = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/review/all-reviews`);

        setRowData(
          data.reviews.map((item) => ({
            id: item._id,
            name: item.name,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchData();
  }, []);

  const columnDefs = [
    {
      headerName: "ID",
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
      headerName: "Date",
      field: "createdAt",
      flex: 1,
      cellStyle: { textAlign: "center" },
      headerClass: "header-center",
    },
  ];

  return (
    <div className="review">
      <div className="review-top">
        <h1>Reviews</h1>
        <Link to={"/new-review"}>
          <button>Add New Review</button>
        </Link>
      </div>
      <Table rowData={rowData} columnDefs={columnDefs} tableLink="review" />
    </div>
  );
};

export default Review;
