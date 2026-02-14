import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../../main";
import "./Video.scss";

const Video1 = () => {
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/wedding-cinematography/all-videos`
        );
        if (data && data.videos) {
          setAllData(data.videos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchData();
  }, []);

  const deleteVideo = async (id) => {
    if (!id) return;
    try {
      const { data } = await axios.delete(
        `${baseUrl}/wedding-cinematography/${id}`
      );
      if (data) {
        toast.success(data.message);
      }
      setAllData((prev) => prev.filter((video) => video._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video!");
    }
  };

  const getYouTubeThumbnail = (link) => {
    let videoId = "";
    if (link.includes("youtu.be/")) {
      videoId = link.split("youtu.be/")[1].split("?")[0];
    } else if (link.includes("youtube.com/watch?v=")) {
      videoId = link.split("v=")[1].split("&")[0];
    }
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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

    // Update the state with the new order
    setAllData(newData);

    // Create an array of ordered video IDs
    const orderedIds = newData.map((item) => item._id);

    // Send the updated order to the backend
    try {
      const response = await axios.put(
        `${baseUrl}/wedding-cinematography/reorder`,
        { orderedIds }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error updating video order:", error);
      toast.error("Failed to update video order!");
    }
  };

  return (
    <div className="video">
      <div className="video-top">
        <h1>Wedding Cinematography Videos</h1>
        <Link to={"/wedding-cinematography/new-video"}>
          <button>Add New Video</button>
        </Link>
      </div>

      <div className="video-imgs">
        {allData?.map((item, index) => (
          <div
            key={item._id}
            className="video-img"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <img src={getYouTubeThumbnail(item.link)} alt="YouTube Thumbnail" />
            <div className="video-img-desc">
              <button onClick={() => deleteVideo(item._id)}>
                Delete Video
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Video1;
