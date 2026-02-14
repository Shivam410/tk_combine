import "./NewReview.scss";

import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { useRef, useState } from "react";

import AddImg from "../../../assets/images/addImg.svg";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../../main";

const NewReview = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 200 * 1024;

      if (file.size > maxSize) {
        toast.error("Image size should be less than 200 KB");
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

  const addReview = async () => {
    if (!file || !review || !name) {
      toast.error("Please fill all fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("review", review);
      formData.append("image", file);

      const { data } = await axios.post(
        `${baseUrl}/review/new-review`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success(data.message);

        const reviewId = data.reviewData?._id;

        if (reviewId) {
          navigate(`/review/${reviewId}`);
        }
      }
    } catch (error) {
      console.error("Error adding reiew:", error);
      toast.error("Failed to add review member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newReview">
      <div className="newReview-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="newReview-icon" />
            New Review
          </h1>
        </Link>
        <div className="newReview-top-btns">
          <button disabled={loading} onClick={addReview}>
            {loading ? "Adding Review..." : "Add Review"}
          </button>
        </div>
      </div>

      <div className="newReview-contents">
        <div className="newReview-contents-top">
          <h1>Review Image</h1>
        </div>

        <div className="newReview-contents-card">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected Portfolio"
              className="portfolio-img"
            />
          ) : (
            <div className="add-img-portfolio">
              <img src={AddImg} alt="" className="add-portfolio-img" />
              <p>Add Review Image</p>
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
          <div className="newReview-contents-card-desc">
            <div className="update-content">
              <span>Name: </span>{" "}
              <input
                type="text"
                placeholder="Enter name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="text-area">
              <span>Revie: </span>
              <textarea
                type="text"
                placeholder="Add Review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReview;
