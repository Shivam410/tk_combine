import "./SingleContact.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const SingleContact = () => {
  const navigate = useNavigate();

  const [singleData, setSingleData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/contact/${id}`);
        setSingleData(data?.contact);
      } catch (error) {
        console.error("Error fetching single data:", error);
      }
    };

    fetchSingleData();
  }, [id]);

  const deleteSingleData = async () => {
    try {
      const { data } = await axios.delete(`${baseUrl}/contact/${id}`);
      toast.success(data.message);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="singleContact">
      <div className="singleContact-top">
        <Link onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="singleContact-icon" /> Contact
            Message
          </h1>
        </Link>

        <div className="singleContact-top-btns">
          <button onClick={deleteSingleData}>
            <Link>Delete </Link>
          </button>
        </div>
      </div>

      <div className="singleContact-content">
        <div className="singleContact-content-desc">
          <p>Name : </p>
          <p>{singleData.name}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>Email : </p>
          <p>{singleData.email}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>Subject : </p>
          <p>{singleData.subject}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>Message :</p>
          <p>{singleData.message}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleContact;
