import { useEffect, useState } from "react";
import "./PhotoAlbum.scss";

import { Link } from "react-router-dom";
import axios from "axios";

import { baseUrl } from "../../main";
import toast from "react-hot-toast";

const PhotoAlbum = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/photoAlbum/all-photo-album`
        );
        if (data && data.photoAlbum) {
          setAllData(data.photoAlbum);
        }
      } catch (error) {
        console.error("Error fetching home banners:", error);
      }
    };

    fetchData();
  }, []);

  const deleteImage = async (id) => {
    if (!id) return;

    try {
      const { data } = await axios.delete(`${baseUrl}/photoAlbum/${id}`);

      if (data) {
        toast.success(data.message);
      }
      setAllData((prev) => prev.filter((photoAlbum) => photoAlbum._id !== id));

      toast.success(data.message);
    } catch (error) {
      console.error("Error deleting photoAlbum:", error);
      toast.error("Failed to delete photoAlbum!");
    }
  };

  return (
    <div className="portfolio">
      <div className="portfolio-top">
        <h1>Portfolio</h1>
        <Link to={"/new-photo-album"}>
          <button>Add New Photo Album</button>
        </Link>
      </div>

      <div className="portfolio-imgs">
        {allData?.length > 0 &&
          allData.map((item, index) => (
            <div className="portfolio-img" key={index}>
              <img src={item.image} alt="" />

              <div className="portfolio-img-desc">
                <button onClick={() => setSelectedImg(item.image)}>
                  Full View
                </button>
                <button onClick={() => deleteImage(item._id)}>
                  Delete Image
                </button>
              </div>
            </div>
          ))}
      </div>

      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="Fullscreen Preview" loading="lazy" />
          <span className="close-btn" onClick={() => setSelectedImg(null)}>
            ×
          </span>
        </div>
      )}
    </div>
  );
};

export default PhotoAlbum;
