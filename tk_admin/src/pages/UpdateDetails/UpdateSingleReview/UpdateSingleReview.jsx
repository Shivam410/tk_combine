import "./UpdateSingleReview.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const UpdateSingleReview = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    review: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/review/${id}`);
        setFormData({
          name: data?.review?.name || "",
          review: data?.review?.review || "",
          image: data?.review?.image || "",
          file: null,
        });
      } catch (error) {
        toast.error("Failed to fetch review details.");
      }
    };

    fetchSingleData();
  }, [id]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 200 KB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
      file,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.review.trim()) {
      toast.error("Name and review are required.");
      return;
    }

    setLoading(true);

    try {
      const updatedFormData = new FormData();
      updatedFormData.append("name", formData.name);
      updatedFormData.append("review", formData.review);

      if (formData.file) {
        updatedFormData.append("image", formData.file);
      }

      const { data } = await axios.put(`${baseUrl}/review/${id}`, updatedFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message || "Review updated successfully");
        navigate(`/review/${id}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updateSingleReview">
      <div className="updateSingleReview-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="review-icon" />
            Update Review
          </h1>
        </Link>
        <div className="updateSingleReview-top-btns">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating Review..." : "Update Review"}
          </button>
        </div>
      </div>

      <div className="updateSingleReview-contents-card">
        <div className="review-form-grid">
          <div className="review-upload-card" onClick={handleButtonClick}>
            {formData.image ? (
              <img src={formData.image} alt="Selected Review" className="portfolio-img" />
            ) : null}

            <div className="portfolio-btn">
              <button onClick={handleButtonClick} type="button">
                <FaPlus className="change-icon" /> Change Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
          </div>

          <div className="updateSingleReview-contents-card-desc">
            <div className="update-content">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter reviewer name..."
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="text-area">
              <label>Review</label>
              <textarea
                name="review"
                placeholder="Write review..."
                value={formData.review}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSingleReview;
