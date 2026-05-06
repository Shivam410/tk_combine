import "./NewDriveLink.scss";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const NewDriveLink = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addItem = async () => {
    if (!imageFile || !link) {
      toast.error("Please choose thumbnail and add Google Drive link");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("link", link);

      const { data } = await axios.post(`${baseUrl}/drive-links/new`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success(data.message);
        navigate(`/drive-links`);
      }
    } catch (error) {
      console.error("Error adding drive link:", error);
      toast.error("Failed to add.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newDriveLink">
      <div className="newDriveLink-top">
        <Link onClick={() => navigate(-1)} className="back-link">
          <h1>
            <RiArrowLeftWideFill className="portfolio-icon" />
            New Drive Link
          </h1>
        </Link>
        <div className="newDriveLink-top-btns">
          <button disabled={loading} onClick={addItem} className="add-drive-link-btn" type="button">
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      <div className="newDriveLink-content">
        <h1>Thumbnail + Google Drive Link</h1>

        <div className="drive-fields">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              setPreviewUrl(file ? URL.createObjectURL(file) : "");
            }}
          />
          <input
            type="text"
            placeholder="Google Drive link (https://drive.google.com/...)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {previewUrl ? (
          <div className="thumb-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NewDriveLink;
