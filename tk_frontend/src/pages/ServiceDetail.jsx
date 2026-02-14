import "./ServicesPage/Service.scss";

import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { FaCheck } from "react-icons/fa";

import ServiceContact from "../components/ServiceContact/ServiceContact";
import Loader from "../components/Loader/Loader";
import SEO from "../SEO/SEO";
import { baseUrl } from "../main";
import { serviceimages } from "../assets/data";

const fetchServiceBySlug = async (slug) => {
  if (!navigator.onLine) {
    throw new Error("NETWORK_ERROR");
  }

  const { data } = await axios.get(`${baseUrl}/services/${slug}`);
  return data?.serviceImages;
};

const ServiceDetail = () => {
  const contentRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const { serviceSlug } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dynamic-service", serviceSlug],
    queryFn: () => fetchServiceBySlug(serviceSlug),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!serviceSlug,
  });

  if (isError) {
    if (error?.name === "AxiosError") {
      const isNetworkError =
        !error.response ||
        error.message.includes("ECONNRESET") ||
        error.response?.data?.message === "read ECONNRESET";

      if (isNetworkError) {
        setTimeout(() => {
          toast.error("Network error. Please check your connection.");
        }, 100);
      }
    }
  }

  const location = useLocation();
  const siteBaseUrl = import.meta.env.VITE_BASE_URL || "https://tkproductionfilm.com";
  const fullUrl = `${siteBaseUrl}${location.pathname}`;

  const title = data?.serviceName || "Service";
  const images = data?.images || [];
  const description = data?.description || "";
  const whatWeOffer = data?.whatWeOffer || [];
  const howItWorks = data?.howItWorks || [];

  return (
    <div className="service">
      <SEO
        title={`${title} | TK Production Film`}
        description={`Explore ${title} by TK Production Film.`}
        keywords={`${title}, TK Production Film, photography service`}
        url={fullUrl}
      />

      <div className="service-top-banner">
        <div className="service-banner">
          <div className="service-banner-desc">
            <h1>{title}</h1>
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
                  <p>{error?.response?.data?.message || error.message}</p>
                  <button onClick={refetch}>Retry</button>
                </div>
              </div>
            )}

            {images.length > 0 ? (
              <div className="services-img-slide">
                <Swiper
                  modules={[EffectFade, Autoplay]}
                  effect="fade"
                  loop={true}
                  speed={1200}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="services-slide"
                >
                  {images.map((item, index) => (
                    <SwiperSlide key={index} className="service_slide">
                      <img src={item} loading="lazy" alt={title} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              !isLoading && <p>No images available</p>
            )}

            <div className="service-images">
              <h2>Our {title} Gallery</h2>
              <hr />

              <div className="service-image-cards">
                {(images.length > 0 ? images : serviceimages.map((item) => item.img)).map(
                  (item, index) => (
                    <div className="service-image-card" key={index}>
                      <img
                        src={item}
                        alt="service image"
                        loading="lazy"
                        onClick={() => setSelectedImg(item)}
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <h1>{title} by TK Production Film</h1>
            <p>{description || (
              <>
              We capture your most valuable moments with creativity and care, delivering
              high-quality visuals tailored to your event.
              </>
            )}</p>
          </div>

          <div className="service-steps-container">
            {whatWeOffer.length > 0 && (
              <div className="service-services">
                <h1>What We Offer</h1>
                <ul>
                  {whatWeOffer.map((item, index) => (
                    <li key={`${item}-${index}`}>
                      <FaCheck className="check-icon" />
                      <div className="services-desc">
                        <p>{item}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {howItWorks.length > 0 && (
              <div className="service-steps">
                <h1>How It Works?</h1>
                <ul>
                  {howItWorks.map((item, index) => (
                    <li key={`${item}-${index}`}>
                      <p>{String(index + 1).padStart(2, "0")}</p>
                      <p>
                        <span>{item}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="bottom-desc">Contact us to book this service.</p>
        </div>
        <hr />
      </div>

      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="Fullscreen Preview" loading="lazy" />
          <span className="close-btn" onClick={() => setSelectedImg(null)}>
            x
          </span>
        </div>
      )}

      <div className="service-contact">
        <ServiceContact />
      </div>
    </div>
  );
};

export default ServiceDetail;
