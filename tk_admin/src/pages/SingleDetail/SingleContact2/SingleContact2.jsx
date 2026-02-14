import "./SingleContact2.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";

const SingleContact2 = () => {
  const navigate = useNavigate();

  const [singleData, setSingleData] = useState({});
  const { id } = useParams();

  const [eventDetails, setEventDetails] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // "2 Jan 2023"
  };
  

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/contact2/contact-2/${id}`);
        console.log(data);
        setSingleData(data?.contact);
        setEventDetails(data?.contact?.eventDetail);
      } catch (error) {
        console.error("Error fetching single data:", error);
      }
    };

    fetchSingleData();
  }, [id]);

  const deleteSingleData = async () => {
    try {
      const { data } = await axios.delete(
        `${baseUrl}/contact2/contact-2/${id}`
      );
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
          <p>
            {singleData.firstName} {singleData.lastName}
          </p>
        </div>

        <div className="singleContact-content-desc">
          <p>Email : </p>
          <p>{singleData.email}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>Phone Number : </p>
          <p>{singleData.phoneNumber}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>Location : </p>
          <p>{singleData.location}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>Event Date : </p>
          <p>{formatDate(singleData.eventDate)}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>Services Needed : </p>
          {singleData?.servicesNeeded?.map((item, index) => (
            <p>{item},</p>
          ))}
        </div>

        <div className="singleContact-content-desc">
          <p>Wedding Type : </p>
          <p>{singleData.weddingType}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>How Did You Hear? : </p>
          <p>{singleData.howDidYouHear}</p>
        </div>

        <div className="singleContact-content-desc">
          <p>Message : </p>
          <p>{singleData.message}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleContact2;
