import "./SingleReview.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const SingleReview = () => {
  const navigate = useNavigate();

  const [singleData, setSingleData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/review/${id}`);
        setSingleData(data?.review);
        console.log(data);
      } catch (error) {
        console.error("Error fetching single data:", error);
      }
    };

    fetchSingleData();
  }, [id]);

  const deleteSingleData = async () => {
    try {
      const { data } = await axios.delete(`${baseUrl}/review/${id}`);
      toast.success(data.message);
      navigate("/reviews");
    } catch (error) {
      console.log(error);
      toast.error("Faled to delte Review");
    }
  };

  return (
    <div className="singleReview">
      <div className="singleReview-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="review-icon" /> Review
          </h1>
        </Link>

        <div className="singleReview-top-btns">
          <Link to={`/review/${id}`} className="update-btn">
            Update
          </Link>
          <Link
            onClick={() => deleteSingleData(singleData._id)}
            className="update-btn"
          >
            Delete
          </Link>
        </div>
      </div>

      <div className="singleReview-contents">
        <div className="singleReview-contents-card">
          <img src={singleData?.image} alt="" />
          <div className="singleReview-contents-card-desc">
            <h2>{singleData.name}</h2>
            <p>
              {singleData.review} Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Aperiam quidem hic rem repudiandae modi possimus
              et quos pariatur quod, qui illo facere consectetur voluptatum
              necessitatibus eius neque, commodi non, impedit est? Ullam
              consequatur id neque perferendis, perspiciatis hic obcaecati
              suscipit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleReview;
