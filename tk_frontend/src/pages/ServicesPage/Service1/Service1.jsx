import "../Service.scss";

import ServiceContact from "../../../components/ServiceContact/ServiceContact";
import { service1Steps } from "../../../assets/servicesData";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../../../main";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader/Loader";
import SEO from "../../../SEO/SEO";
import { serviceimages } from "../../../assets/data";
import { useLocation } from "react-router-dom";

const fetchService = async () => {
  if (!navigator.onLine) {
    throw new Error("NETWORK_ERROR");
  }

  const { data } = await axios.get(
    `${baseUrl}/services/wedding-photography/67de708faa6520fad7a06667`
  );
  return data?.serviceImages?.images;
};

const Service1 = () => {
  const contentRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["service-1"],
    queryFn: fetchService,
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

  const location = useLocation();
  const baseUrl =
    import.meta.env.VITE_BASE_URL || "https://tkproductionfilm.com";
  const fullUrl = `${baseUrl}${location.pathname}`;

  return (
    <div className="service">
      <SEO
        title="Wedding Photography | TK Production Film - Capture Your Special Moments"
        description="Discover the magic of your wedding day with TK Production Film's expert wedding photography services. We capture every special moment with creativity and passion. Book now!"
        keywords="wedding photography, wedding photographer, professional wedding photos, TK Production Film, wedding day memories, creative wedding shots"
        url={fullUrl}
      />

      <div className="service-top-banner">
        <div className="service-banner">
          <div className="service-banner-desc">
            <h1>Wedding Photography</h1>
          </div>
        </div>
      </div>

      <div className="service-container">
        <div className="service-container-content" ref={contentRef}>
          <div className="service-container-content-top">
            {isLoading && (
              <div className="service-loader-container">
                <Loader loaderSize="serviceLoader" />
              </div>
            )}

            {isError && (
              <div className="service-error-container">
                <div className="service-error-desc">
                  <p>{error.message}</p>
                  <button onClick={refetch}>Retry</button>
                </div>
              </div>
            )}

            {data && data.length > 0 ? (
              <div className="services-img-slide">
                <Swiper
                  modules={[EffectFade, Autoplay]}
                  effect="fade"
                  loop={true}
                  speed={1200}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="services-slide"
                >
                  {data?.map((item, index) => (
                    <SwiperSlide key={index} className="service_slide">
                      <img src={item} loading="lazy" alt="services" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              !isLoading && <p>No images available</p>
            )}

            <div className="service-images">
              <h2>Our Wedding Photography Gallery</h2>
              <hr />

              <div className="service-image-cards">
                {serviceimages.map((item, index) => (
                  <div className="service-image-card" key={index}>
                    <img
                      src={item.img}
                      alt="service image"
                      loading="lazy"
                      onClick={() => setSelectedImg(item.img)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <h1>Wedding Photography by TK Production Film</h1>
            <p>
              Capture your love story with TK Production Film. Led by Taufeq
              Khan with 16+ years and 800+ weddings, we create timeless memories
              through stunning photography and cinematic films.
            </p>
            <p>
              We specialize in turning your wedding day into a visual
              masterpiece. From the soft glances during the vows to the joyous
              laughter at the reception, our team captures every moment with
              artistry and precision. Whether you love candid shots that reveal
              raw emotions, traditional portraits that honor timeless elegance,
              or editorial-style images with a modern flair, we tailor our
              approach to your unique style. Using top-tier equipment and
              creative techniques, we ensure every detail—your dress, the
              flowers, the smiles—shines through in vibrant, high-quality photos
              you’ll cherish forever.
            </p>
          </div>

          <div className="service-steps-container">
            <div className="service-steps">
              <h1>How It Works?</h1>
              <ul>
                {service1Steps.map((item) => (
                  <li key={item.no}>
                    <p>{item.no}</p>
                    <p>
                      <span>{item.title}</span> {item.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="bottom-desc">
            Let us make your special day unforgettable!
          </p>
        </div>
        <hr />
      </div>

      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="Fullscreen Preview" loading="lazy" />
          <span className="close-btn" onClick={() => setSelectedImg(null)}>
            ×
          </span>
        </div>
      )}

      <div className="service-contact">
        <ServiceContact />
      </div>
    </div>
  );
};

export default Service1;
