import "./OurCore.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../../main";
import Loader from "../../components/Loader/Loader";

const fetchTeams = async () => {
  if (!navigator.onLine) {
    throw new Error("NETWORK_ERROR");
  }

  const { data } = await axios.get(`${baseUrl}/team/all-teams`);
  return data?.teams;
};

const OurCore = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (isError) {
    console.log("🔴 Error Object:", error);
    if (error.name === "AxiosError") {
      const isNetworkError =
        !error.response ||
        error.message.includes("ECONNRESET") ||
        error.response?.data?.message === "read ECONNRESET";

      if (isNetworkError) {
        setTimeout(() => {
          toast.error("🚫 Network error. Please check your connection.");
        }, 100);
      } else {
        console.error("❗ Server Error:", error.response?.status);
      }
    }
  }

  return (
    <div className="ourCore">
      {/* ✅ Title and description always visible */}
      <div className="ourCore-top">
        <h1>Our Team</h1>
        <p>
          At <span className="bold-text">TK Production Film</span>, we’re
          passionate about capturing your precious memories, preserving your
          love, and celebrating every beautiful moment of life.
        </p>
      </div>

      {/* ✅ Show Loader below title and description */}
      {isLoading ? (
        <Loader loaderSize="teamLoader" />
      ) : isError ? (
        <div className="error-container">
          <div className="error-container-desc">
            <p>{error.message}</p>
            <button onClick={() => refetch()}>Retry</button>
          </div>
        </div>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          navigation={{
            prevEl: ".custom-prev",
            nextEl: ".custom-next",
          }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop={true}
          speed={1200}
          modules={[Navigation, Autoplay]}
          className="ourCore-slider"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            400: { slidesPerView: 1.5, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 2.5, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
        >
          {data?.length > 0 ? (
            data?.map((member, index) => (
              <SwiperSlide key={index} className="ourCore-slider-card">
                <img
                  src={member.image}
                  alt={member.title || "Team Member"}
                  loading="lazy"
                />
                <h2>{member.name}</h2>
                <p>{member.title}</p>
              </SwiperSlide>
            ))
          ) : (
            <p>No team members available</p>
          )}
        </Swiper>
      )}

      {/* ✅ Custom navigation buttons with React Icons */}
      <div className="custom-prev">
        <BsArrowLeft className="core-icon" />
      </div>
      <div className="custom-next">
        <BsArrowRight className="core-icon" />
      </div>
    </div>
  );
};

export default OurCore;
