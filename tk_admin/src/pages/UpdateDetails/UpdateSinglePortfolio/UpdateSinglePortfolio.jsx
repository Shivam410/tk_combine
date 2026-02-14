import "./UpdateSinglePortfolio.scss";
import portfolio_img from "../../../assets/images/1.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import { toast } from "react-hot-toast";

const UpdateSinglePortfolio = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/portfolio/${id}`);
        setFormData({
          title: data?.portfolio?.title || "",
          name: data?.portfolio?.name || "",
          image: data?.portfolio?.image || portfolio_img,
        });
      } catch (error) {
        console.error("Error fetching single portfolio:", error);
      }
    };

    fetchSingleData();
  }, [id]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tk-site");
    formData.append("cloud_name", "ddmucrojh");
    formData.append("folder", "tk-production-images/portfolio");

    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/ddmucrojh/image/upload`,
        formData
      );
      return data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      toast.error("Image upload failed.");
      return null;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show temporary preview
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: previewUrl }));

    // Upload to Cloudinary
    const uploadedImageUrl = await uploadToCloudinary(file);
    if (uploadedImageUrl) {
      setFormData((prev) => ({ ...prev, image: uploadedImageUrl }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      toast.error("You can't update the portfolio without title");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("You can't update the portfolio without name");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put(`${baseUrl}/portfolio/${id}`, formData);
      if (data.success) {
        toast.success(data.message);
      }
      navigate(-1);
    } catch (error) {
      console.error("Error updating portfolio:", error);
      toast.error("Failed to update portfolio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updateSinglePortfolio">
      <div className="updateSinglePortfolio-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="portfolio-icon" />
            Update Portfolio
          </h1>
        </Link>
        <div className="updateSinglePortfolio-top-btns">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating portfolio..." : "Update Confirm"}
          </button>
        </div>
      </div>

      <div className="updateSinglePortfolio-contents">
        <div className="updateSinglePortfolio-contents-top">
          <h1>Portfolio Content</h1>
        </div>

        <div className="updateSinglePortfolio-contents-card">
          <img src={formData.image} alt="Selected Portfolio" />

          <div className="portfolio-btn">
            <button onClick={handleButtonClick}>
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
          <div className="updateSinglePortfolio-contents-card-desc">
            <div className="update-content">
              <span>Title: </span>
              <input
                type="text"
                name="title"
                placeholder="Enter title..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="update-content">
              <span>Name: </span>
              <input
                type="text"
                name="name"
                placeholder="Enter name..."
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSinglePortfolio;
