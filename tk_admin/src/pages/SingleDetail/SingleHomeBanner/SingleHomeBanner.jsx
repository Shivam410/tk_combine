import "./SingleHomeBanner.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const SingleHomeBanner = () => {
  const navigate = useNavigate();

  const [singleData, setSingleData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/home-banner/${id}`);
        setSingleData(data?.homeBanner);
      } catch (error) {
        console.error("Error fetching single data:", error);
      }
    };

    fetchSingleData();
  }, [id]);

  const deleteSingleData = async (id) => {
    try {
      const { data } = await axios.delete(`${baseUrl}/home-banner/${id}`);
      console.log(data);
      toast.success(data.message);
      navigate(-1);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="singleHomeBanner">
      <div className="singleHomeBanner-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="homeBanner-icon" /> Home Banner
          </h1>
        </Link>

        <div className="singleHomeBanner-top-btns">
          <Link to={`/update-home-banner/${id}`} className="update-btn">
            Update
          </Link>
          <Link onClick={() => deleteSingleData(singleData._id)} className="update-btn">
            Delete
          </Link>
        </div>
      </div>

      <div className="singleHomeBanner-contents">
        <div className="singleHomeBanner-contents-top">
          <h1>
            <span>Banner Title :</span> {singleData?.bannerTitle}
          </h1>
        </div>

        <div className="singleHomeBanner-contents-cards">
          {singleData?.bannerDetails &&
            singleData.bannerDetails.length > 0 &&
            singleData.bannerDetails.map((item) => (
              <div className="singleHomeBanner-contents-card" key={item._id}>
                <img src={item.image} alt={item.title} />
                <div className="singleHomeBanner-contents-card-desc">
                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingleHomeBanner;
