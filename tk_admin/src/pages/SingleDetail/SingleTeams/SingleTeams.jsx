import "./SingleTeams.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const SingleTeams = () => {
  const navigate = useNavigate();

  const [singleData, setSingleData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/team/${id}`);
        setSingleData(data?.team);
        console.log(data);
      } catch (error) {
        console.error("Error fetching single data:", error);
      }
    };

    fetchSingleData();
  }, [id]);

  const deleteSingleData = async () => {
    try {
      const { data } = await axios.delete(`${baseUrl}/team/${id}`);
      toast.success(data.message);
      navigate("/teams");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="singleTeams">
      <div className="singleTeams-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="teams-icon" /> Team
          </h1>
        </Link>

        <div className="singleTeams-top-btns">
          <Link to={`/update-team-member/${id}`} className="update-btn">
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

      <div className="singleTeams-contents">
        <div className="singleTeams-contents-top">
          <h1>Team Member</h1>
        </div>

        <div className="singleTeams-contents-card">
          <img src={singleData.image} alt="" />
          <div className="singleTeams-contents-card-desc">
            <h2>{singleData.name}</h2>
            <p>{singleData.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTeams;
