import "./NewReel.scss";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const NewReel = () => {
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addLink = async () => {
    if (!link) {
      toast.error("Please add reel link");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${baseUrl}/reels/new-reel`, { link });

      if (data.success) {
        toast.success(data.message);
        navigate(`/reels`);
      }
    } catch (error) {
      console.error("Error adding reel:", error);
      toast.error("Failed to add reel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newReel">
      <div className="newReel-top">
        <Link onClick={() => navigate(-1)} className="back-link">
          <h1>
            <RiArrowLeftWideFill className="portfolio-icon" />
            New Reel
          </h1>
        </Link>
        <div className="newReel-top-btns">
          <button disabled={loading} onClick={addLink} className="add-reel-btn">
            {loading ? "Adding reel link..." : "Add Reel Link"}
          </button>
        </div>
      </div>

      <div className="newReel-content">
        <h1>Reel Link</h1>

        <div className="reel-link">
          <input
            type="text"
            placeholder="Paste Instagram Reel / YouTube Short link..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default NewReel;

