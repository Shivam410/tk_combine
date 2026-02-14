import "../Service.scss";
import { FaCheck } from "react-icons/fa";
import ServiceContact from "../../../components/ServiceContact/ServiceContact";
import { service4Data, service4Steps } from "../../../assets/servicesData";

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
    `${baseUrl}/services/baby-shower-photography/67de7198aa6520fad7a06675`
  );
  return data?.serviceImages?.images;
};

const Service8 = () => {
  const contentRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["service-8"],
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
        title="Baby Shower Photography | TK Production Film - Cherish Precious Moments"
        description="Capture the joy and beauty of your baby shower with professional photography by TK Production Film. Book your session today and create timeless memories!"
        keywords="baby shower photography, maternity event photos, baby celebration pictures, professional baby shower images, TK Production Film"
        url={fullUrl}
      />

      <div className="service-top-banner">
        <div className="service-banner">
          <div className="service-banner-desc">
            <h1>Baby Shower Photography</h1>
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

            {data && data?.length > 0 ? (
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
              <h2>Our Baby Shower Photography Gallery</h2>
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
            <h1>Baby Shower Photography by TK Production Film</h1>
            <p>
              Celebrate new beginnings with TK Production Film! We capture the
              joy, love, and excitement of your baby shower with elegance and
              creativity.
            </p>
          </div>
          <div className="service-steps-container">
            <div className="service-services">
              <h1>What We Offer</h1>
              <ul>
                {service4Data.map((item) => (
                  <li key={item.title}>
                    <FaCheck className="check-icon" />
                    <div className="services-desc">
                      <p>{item.title} :&nbsp;</p>
                      <p>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="service-steps">
              <h1>How It Works?</h1>
              <ul>
                {service4Steps.map((item) => (
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
            Let us make your baby shower memories last forever!
          </p>

          <hr />
        </div>
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

export default Service8;
