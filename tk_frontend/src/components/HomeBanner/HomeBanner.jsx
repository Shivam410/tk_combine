import "./HomeBanner.scss";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { BsArrowUpRight } from "react-icons/bs";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../main";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-hot-toast";
import { bigBanner } from "../../assets/data";
import { Link } from "react-router-dom";

const HomeBanner = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  const [initialized, setInitialized] = useState(false);
  // ✅ Function to fetch banners with better error handling
  const fetchBanners = async () => {
    try {
      const apiUrl = isMobile
        ? `${baseUrl}/mobile/all-mobile-banners`
        : `${baseUrl}/home-banner/all-home-banners`;

      const { data } = await axios.get(apiUrl);
      return data.homeBanner;
    } catch (error) {
      // ✅ Handle specific error types
      if (error.response) {
        // Server responded with a status outside 2xx
        console.error("Server Error:", error.response);
        throw new Error(
          error.response.status >= 500
            ? "Server error! Please try again later."
            : "Failed to load banners!"
        );
      } else if (error.request) {
        // No response from the server (Network issue)
        console.error("Network Error:", error.request);
        throw new Error("Network error! Check your internet connection.");
      } else {
        // Unknown error
        console.error("Unknown Error:", error.message);
        throw new Error("Unexpected error occurred!");
      }
    }
  };

  // ✅ Use React Query to fetch banners
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["homeBanners", isMobile],
    queryFn: fetchBanners,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // ✅ Handle Resize for Mobile/Desktop Switch
  useEffect(() => {
    const handleResize = () => {
      const isMobileNow = window.innerWidth <= 480;
      if (isMobileNow !== isMobile) {
        setIsMobile(isMobileNow);
        refetch();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, refetch]);

  // ✅ Loading State
  if (isLoading) return <Loader />;

  // ✅ Error State Handling
  if (isError) {
    toast.error(error.message || "Failed to load banners.");
    return (
      <div className="error-container">
        <div className="error-container-desc">
          <p>{error.message}</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="homeBanner">
      <Swiper
        modules={[EffectFade, Pagination, Navigation, Autoplay]}
        effect="fade"
        loop={true}
        speed={1200}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="swiper-container"
      >
        {bigBanner?.length > 0 ? (
          bigBanner.map((slide, index) => (
            <SwiperSlide key={index} className="slide">
              <div className="homeBanner-imgs">
                <img src={slide.image} alt="Banner" loading="lazy" />
              </div>
              <Link to={slide.link}>
                <div
                  className={`homeBanner-desc ${
                    initialized && index === activeIndex ? "animate" : ""
                  }`}
                >
                  <h1>{slide.title}</h1>
                  <p>{slide.desc}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <p>No banners available</p>
        )}
      </Swiper>

      <div className="swiper-button-prev">Prev</div>
      <div className="swiper-button-next">Next</div>
      <div className="swiper-pagination"></div>
    </div>
  );
};

export default HomeBanner;
