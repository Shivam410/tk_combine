import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../../main";
import "./Reels.scss";

const Reels = () => {
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/reels/all-reels`);
        if (data && data.reels) {
          setAllData(data.reels);
        }
      } catch (error) {
        console.error("Error fetching reels:", error);
      }
    };
    fetchData();
  }, []);

  const deleteReel = async (id) => {
    if (!id) return;
    try {
      const { data } = await axios.delete(`${baseUrl}/reels/${id}`);
      if (data) {
        toast.success(data.message);
      }
      setAllData((prev) => prev.filter((reel) => reel._id !== id));
    } catch (error) {
      console.error("Error deleting reel:", error);
      toast.error("Failed to delete reel!");
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
      const response = await axios.put(`${baseUrl}/reels/reorder`, { orderedIds });
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error updating reel order:", error);
      toast.error("Failed to update reel order!");
    }
  };

  return (
    <div className="reels">
      <div className="reels-top">
        <h1>Reels</h1>
        <Link to={"/reels/new-reel"}>
          <button>Add New Reel</button>
        </Link>
      </div>

      <div className="reels-cards">
        {allData?.map((item, index) => (
          <div
            key={item._id}
            className="reels-card"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <p className="reels-link" title={item.link}>
              {item.link}
            </p>
            <div className="reels-actions">
              <a href={item.link} target="_blank" rel="noreferrer">
                Open
              </a>
              <button onClick={() => deleteReel(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;

