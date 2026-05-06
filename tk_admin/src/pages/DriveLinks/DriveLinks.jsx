import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../../main";
import "./DriveLinks.scss";

const DriveLinks = () => {
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/drive-links/all`);
        if (data?.driveLinks) setAllData(data.driveLinks);
      } catch (error) {
        console.error("Error fetching drive links:", error);
      }
    };
    fetchData();
  }, []);

  const deleteItem = async (id) => {
    if (!id) return;
    try {
      const { data } = await axios.delete(`${baseUrl}/drive-links/${id}`);
      toast.success(data?.message || "Deleted");
      setAllData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting drive link:", error);
      toast.error("Failed to delete!");
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, index) => {
    const draggedIndex = e.dataTransfer.getData("draggedIndex");
    const newData = [...allData];
    const [draggedItem] = newData.splice(draggedIndex, 1);
    newData.splice(index, 0, draggedItem);

    setAllData(newData);

    const orderedIds = newData.map((item) => item._id);

    try {
      const response = await axios.put(`${baseUrl}/drive-links/reorder`, { orderedIds });
      if (response.data.success) toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating drive link order:", error);
      toast.error("Failed to update order!");
    }
  };

  return (
    <div className="driveLinks">
      <div className="driveLinks-top">
        <h1>Drive Links</h1>
        <Link to={"/drive-links/new"}>
          <button>Add New</button>
        </Link>
      </div>

      <div className="driveLinks-cards">
        {allData?.map((item, index) => (
          <div
            key={item._id}
            className="driveLinks-card"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="driveLinks-meta">
              <img src={item.thumbnail} alt="Thumbnail" />
              <div className="driveLinks-text">
                <p className="driveLinks-link" title={item.link}>
                  {item.link}
                </p>
              </div>
            </div>
            <div className="driveLinks-actions">
              <a href={item.link} target="_blank" rel="noreferrer">
                Open
              </a>
              <button onClick={() => deleteItem(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriveLinks;

