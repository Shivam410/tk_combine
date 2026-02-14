import { useEffect, useState } from "react";
import "./HomeBanner.scss";

import { Link } from "react-router-dom";
import axios from "axios";

import { baseUrl } from "../../main";
import toast from "react-hot-toast";

const HomeBanner = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/home-banner/all-home-banners`
        );
        console.log(data);
        if (data && data.homeBanner) {
          setAllData(data.homeBanner);
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
      const { data } = await axios.delete(`${baseUrl}/home-banner/${id}`);

      if (data) {
        toast.success(data.message);
      }
      setAllData((prev) => prev.filter((homeBanner) => homeBanner._id !== id));

      toast.success(data.message);
    } catch (error) {
      console.error("Error deleting home banner:", error);
      toast.error("Failed to delete home banner!");
    }
  };

  return (
    <div className="portfolio">
      <div className="portfolio-top">
        <h1>Home Banner</h1>
        <Link to={"/new-home-banner"}>
          <button>Add New Home Banner</button>
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

export default HomeBanner;
