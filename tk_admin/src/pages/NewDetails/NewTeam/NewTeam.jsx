import "./NewTeam.scss";

import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { useRef, useState } from "react";

import AddImg from "../../../assets/images/addImg.svg";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../../main";

const NewTeam = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 500 * 1024;

      if (file.size > maxSize) {
        toast.error("Image size should be less than 500 KB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const addTeamMember = async () => {
    if (!file || !title || !name) {
      toast.error("Please fill all fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("title", title);
      formData.append("image", file);

      const { data } = await axios.post(`${baseUrl}/team/new-team`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);

        const teamMemberId = data.team?._id;

        if (teamMemberId) {
          navigate(`/team/${teamMemberId}`);
        }
      }
    } catch (error) {
      console.error("Error adding Team:", error);
      toast.error("Failed to add team member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newTeam">
      <div className="newTeam-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="newTeam-icon" />
            New Team Member
          </h1>
        </Link>
        <div className="newTeam-top-btns">
          <button disabled={loading} onClick={addTeamMember}>
            {loading ? "Adding Team Member..." : "Add Team Member"}
          </button>
        </div>
      </div>

      <div className="newTeam-contents">
        <div className="newTeam-contents-top">
          <h1>Team Member Image</h1>
        </div>

        <div className="newTeam-contents-card">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected Portfolio"
              className="portfolio-img"
            />
          ) : (
            <div className="add-img-portfolio">
              <img src={AddImg} alt="" className="add-portfolio-img" />
              <p>Add Team Member Image</p>
            </div>
          )}

          <div className="portfolio-btn">
            <button onClick={handleButtonClick}>
              <FaPlus className="change-icon" /> Add Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>
          <div className="newTeam-contents-card-desc">
            <div className="update-content">
              <span>Name: </span>{" "}
              <input
                type="text"
                placeholder="Enter name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="update-content">
              <span>Title: </span>
              <input
                type="text"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTeam;
