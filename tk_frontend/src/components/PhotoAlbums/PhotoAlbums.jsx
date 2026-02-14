import "./PhotoAlbums.scss";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../../main";
import Loader from "../../components/Loader/Loader";

const fetchBanner = async () => {
  if (!navigator.onLine) {
    throw new Error("NETWORK_ERROR");
  }

  const { data } = await axios.get(`${baseUrl}/photoAlbum/all-photo-album`);
  return data?.photoAlbum;
};

const PhotoAlbums = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["photo-album"],
    queryFn: fetchBanner,
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
    <div className="photoAlbums">
      <h1>Photo Albums</h1>
      <p className="photoAlbums-desc">
        Collection of photos - All of Our Best Works
      </p>
      {isLoading ? (
        <Loader loaderSize="photoAlbumLoader" />
      ) : isError ? (
        <div className="error-container">
          <div className="error-container-desc">
            <p>{error.message}</p>
            <button onClick={() => refetch()}>Retry</button>
          </div>
        </div>
      ) : (
        <div className="photoAlbums-cards">
          <Swiper
            slidesPerView={2}
            centeredSlides={false}
            spaceBetween={20}
            loop={true}
            speed={2500}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay, Navigation]}
            className="photoAlbums-slider album-swiper"
            navigation={{
              nextEl: ".pa-swiper-next",
              prevEl: ".pa-swiper-prev",
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
            }}
          >
            {data?.length > 0 ? (
              data.map((album, index) => (
                <SwiperSlide key={album._id} className="photoAlbums-card">
                  <div className="photoAlbums-card-content">
                    <img
                      src={album.image}
                      alt={album.title || "Album Image"}
                      loading="lazy"
                    />
                    <div
                      className={`homeBanner-desc ${
                        index === activeIndex ? "animate" : ""
                      }`}
                    />
                  </div>
                </SwiperSlide>

                
              ))
            ) : (
              <p>No photo albums available</p>
            )}
          </Swiper>

          <div className="pa-swiper-prev">❮</div>
        <div className="pa-swiper-next">❯</div>
        </div>
      )}
    </div>
  );
};

export default PhotoAlbums;
