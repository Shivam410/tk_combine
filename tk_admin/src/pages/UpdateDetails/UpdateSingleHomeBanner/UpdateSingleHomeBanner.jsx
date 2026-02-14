import "./UpdateSingleHomeBanner.scss";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const UpdateSingleHomeBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    bannerTitle: "",
    bannerDetails: [],
  });

  const [deleteIndex, setDeleteIndex] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/home-banner/${id}`);
        setFormData({
          bannerTitle: data?.homeBanner?.bannerTitle || "",
          bannerDetails: data?.homeBanner?.bannerDetails || [],
        });
      } catch (error) {
        console.error("Error fetching single data:", error);
      }
    };

    fetchSingleData();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      bannerTitle: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!formData.bannerTitle.trim()) {
      toast.error("You can't update the banner without a Banner title.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put(
        `${baseUrl}/home-banner/${id}`,
        formData
      );
      toast.success(data.message);

      navigate(-1);
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update the banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const updatedBannerDetails = formData.bannerDetails.filter(
      (_, i) => i !== index
    );

    try {
      await axios.put(`${baseUrl}/home-banner/${id}`, {
        bannerTitle: formData.bannerTitle,
        bannerDetails: formData.bannerDetails,
      });

      setFormData((prev) => ({
        ...prev,
        bannerDetails: updatedBannerDetails,
      }));

      toast.success("Banner detail deleted successfully!");
      setDeleteIndex(null);
    } catch (error) {
      console.error("Error deleting banner detail:", error);
      toast.error("Failed to delete the banner detail.");
    }
  };

  return (
    <div className="updateSingleHomeBanner">
      <div className="updateSingleHomeBanner-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="homeBanner-icon" /> Update Home
            Banner
          </h1>
        </Link>
        <div className="updateSingleHomeBanner-top-btns">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating Home Banner..." : "Update Confirm"}
          </button>
        </div>
      </div>

      <div className="updateSingleHomeBanner-contents">
        <div className="updateSingleHomeBanner-contents-top">
          <h1>Banner Title :</h1>
          <input
            type="text"
            placeholder="Enter banner title"
            value={formData.bannerTitle}
            onChange={handleInputChange}
          />
        </div>

        <div className="updateSingleHomeBanner-contents-cards">
          {formData.bannerDetails.map((item, index) => (
            <div key={index} className="updateSingleHomeBanner-contents-card">
              <img src={item.image} alt="img" />
              <div className="updateSingleHomeBanner-contents-card-desc">
                <div className="updateSingleHomeBanner-contents-card-top">
                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>
                </div>
                <button onClick={() => setDeleteIndex(index)}>Delete</button>
              </div>

              {deleteIndex === index && (
                <div className="deleteCard">
                  <div className="deleteCard-desc">
                    <h2>Sure to delete this Banner?</h2>
                    <div className="deleteCard-desc-btns">
                      <button onClick={() => handleDelete(index)}>Yes</button>
                      <button onClick={() => setDeleteIndex(null)}>No</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateSingleHomeBanner;
