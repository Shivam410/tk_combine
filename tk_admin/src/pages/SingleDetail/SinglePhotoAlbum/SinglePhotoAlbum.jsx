import "./SinglePhotoAlbum.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const SinglePhotoAlbum = () => {
  const navigate = useNavigate();

  const [singleData, setSingleData] = useState({});
  const { id } = useParams();


  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/photoAlbum/${id}`);
        setSingleData(data?.album?.images);
      } catch (error) {
        console.error("Error fetching single data:", error);
      }
    };

    fetchSingleData();
  }, [id]);

  const deleteSingleData = async () => {
    try {
      const { data } = await axios.delete(`${baseUrl}/photoAlbum/${id}`);
      toast.success(data.message);
      navigate(-1);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  console.log(singleData[0])

  return (
    <div className="photoAlbum">
      <div className="photoAlbum-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="homeBanner-icon" /> Photo ALbum
          </h1>
        </Link>

        <div className="photoAlbum-top-btns">
          <Link to={`/update-photo-album/${id}`} className="update-btn">
            Update
          </Link>
          <Link onClick={deleteSingleData} className="update-btn">
            Delete
          </Link>
        </div>
      </div>

      <div className="photoAlbum-contents">
        <div className="photoAlbum-contents-top">
          <h1>
            Album Images
          </h1>
        </div>

        <div className="photoAlbum-contents-cards">
          {singleData &&
            singleData.length > 0 &&
            singleData.map((item) => (
              <div className="photoAlbum-contents-card" key={item._id}>
                <img src={item} alt={item} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePhotoAlbum;
