import "./UpdateSingleTeams.scss";
import portfolio_img from "../../../assets/images/1.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const UpdateSingleTeams = () => {
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
        const { data } = await axios.get(`${baseUrl}/team/${id}`);
        setFormData({
          title: data?.team?.title || "",
          name: data?.team?.name || "",
          image: data?.team?.image || portfolio_img,
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
      file: file,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      toast.error("You can't update the team member without a title");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("You can't update the team member without a name");
      return;
    }

    setLoading(true);

    try {
      const updatedFormData = new FormData();
      updatedFormData.append("title", formData.title);
      updatedFormData.append("name", formData.name);

      // ✅ Append the image file only if it exists
      if (formData.file) {
        updatedFormData.append("image", formData.file);
      }

      const { data } = await axios.put(
        `${baseUrl}/team/${id}`,
        updatedFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updateSingleTeams">
      <div className="updateSingleTeams-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="team-icon" />
            Update Team Member
          </h1>
        </Link>
        <div className="updateSingleTeams-top-btns">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating Team Member..." : "Update Team Member"}
          </button>
        </div>
      </div>

      <div className="updateSingleTeams-contents">
        <div className="updateSingleTeams-contents-top">
          <h1>Team Member</h1>
        </div>

        <div className="updateSingleTeams-contents-card">
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
          <div className="updateSingleTeams-contents-card-desc">
            <div className="update-content">
              <span>Name: </span>{" "}
              <input
                type="text"
                name="name"
                placeholder="Enter name..."
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="update-content">
              <span>Title: </span>{" "}
              <input
                type="text"
                name="title"
                placeholder="Enter title..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSingleTeams;
