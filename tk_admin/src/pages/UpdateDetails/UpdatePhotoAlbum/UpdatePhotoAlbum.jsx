import "./UpdatePhotoAlbum.scss";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const UpdatePhotoAlbum = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [photoAlbum, setPhotoAlbum] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSingleAlbum = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/photoAlbum/${id}`);
        setPhotoAlbum(data?.album?.images || []); //
      } catch (error) {
        console.error("Error fetching photo album:", error);
      }
    };

    fetchSingleAlbum();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(`${baseUrl}/photoAlbum/${id}`, {
        images: photoAlbum, // Ensure the key matches your backend schema
      });
      toast.success(data.message);
      navigate(-1); // Go back after successful update
    } catch (error) {
      console.error("Error updating album:", error);
      toast.error("Failed to update the photo album.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    const updatedAlbumDetails = photoAlbum.filter((_, i) => i !== index);
    setPhotoAlbum(updatedAlbumDetails);
    setDeleteIndex(null);
    toast.success("Image removed from album (Not yet saved)");
  };

  return (
    <div className="updatePhotoAlbum">
      <div className="updatePhotoAlbum-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="updatePhotoAlbum-icon" /> Update
            Photo Album
          </h1>
        </Link>
        <div className="updatePhotoAlbum-top-btns">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating Album..." : "Update Confirm"}
          </button>
        </div>
      </div>

      <div className="updatePhotoAlbum-contents">
        <div className="updatePhotoAlbum-contents-cards">
          {photoAlbum.map((item, index) => (
            <div key={index} className="updatePhotoAlbum-contents-card">
              <img src={item} alt="Photo" />

              <button onClick={() => setDeleteIndex(index)}>Delete</button>

              {deleteIndex === index && (
                <div className="deleteCard">
                  <div className="deleteCard-desc">
                    <h2>Sure to delete this photo?</h2>
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

export default UpdatePhotoAlbum;
