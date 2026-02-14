import "../Service2.scss";
import { FaCheck } from "react-icons/fa";
import ServiceContact from "../../../components/ServiceContact/ServiceContact";
import { service2Data, service2Steps } from "../../../assets/servicesData";

import { useRef } from "react";
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
import Video from "../../../components/Video/Video";
import { useLocation } from "react-router-dom";

const fetchService = async () => {
  if (!navigator.onLine) {
    throw new Error("NETWORK_ERROR");
  }

  const { data } = await axios.get(`${baseUrl}/pre-wedding-film/all-videos`);
  return data?.videos;
};

const Service3 = () => {
  const contentRef = useRef(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["service-3"],
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
    <div className="service2">
      <SEO
        title="Pre-Wedding Film | TK Production Film - Capture Your Love Story Before the Big Day"
        description="Create magical memories with TK Production Film's pre-wedding films. Cinematic, romantic, and beautifully captured moments that tell your unique love story. Book now!"
        keywords="pre-wedding film, pre-wedding shoot, cinematic pre-wedding, romantic love story films, TK Production Film, couple shoot videos"
        url={fullUrl}
      />

      <div className="service2-top-banner">
        <div className="service2-banner">
          <div className="service2-banner-desc">
            <h1>Pre Wedding Film</h1>
          </div>
        </div>
      </div>

      <div className="service2-container">
        <div className="service2-container-content" ref={contentRef}>
          <div className="service2-container-content-top">
            {/* {(imagesLoading || videosLoading) && (
              <div className="service2-loader-container">
                <Loader loaderSize="serviceLoader" />
              </div>
            )}

            {(imagesError || videosError) && (
              <div className="service2-error-container">
                <div className="service2-error-desc">
                  <p>{imagesError ? imgError.message : vidError.message}</p>
                  <button
                    onClick={() => {
                      refetchImages();
                      refetchVideos();
                    }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {serviceImages && serviceImages.length > 0 && (
              <div className="services-img-slide">
                <Swiper
                  modules={[EffectFade, Autoplay]}
                  effect="fade"
                  loop={true}
                  speed={1200}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="services-slide"
                >
                  {serviceImages.map((item, index) => (
                    <SwiperSlide key={index} className="service_slide">
                      <img src={item} loading="lazy" alt="services" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )} */}

            <div className="service-films">
              <h2>Pre-Wedding Film</h2>
              <hr />
              <div className="service-videos">
                {data?.length > 0 &&
                  data?.map((item, index) => (
                    <div className="service-video" key={index}>
                      <Video videoUrl={item.link} videoSize="wedding" />
                    </div>
                  ))}
              </div>

              <div className="subscribe-btn">
                <p>
                  Subscribe to our YouTube channel for more stunning wedding
                  films and exclusive content!
                </p>

                <a
                  href="https://www.youtube.com/@tkproductionfilm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sub-btn"
                >
                  Subscribe
                </a>
              </div>
            </div>

            <h1>Pre Wedding Film by TK Production Film</h1>
            <p>
              At TK Production Film, we turn your love story into a cinematic
              pre-wedding masterpiece. With 16+ years of expertise, we capture
              your chemistry in stunning locations—from lush forests to vibrant
              cities like Lisbon, Portugal.
            </p>
          </div>

          <div className="service2-steps-container">
            <div className="service2-services">
              <h1>What We Offer</h1>
              <ul>
                {service2Data.map((item) => (
                  <li key={item.title}>
                    <FaCheck className="check-icon" />
                    <div className="services-desc">
                      <p>{item.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="service2-steps">
              <h1>How It Works?</h1>
              <ul>
                {service2Steps.map((item) => (
                  <li key={item.no}>
                    <p>{item.no}</p>
                    <p>
                      <span>{item.title}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="bottom-desc">
            Let’s make your pre-wedding moments magical!
          </p>
          <hr />
        </div>
      </div>

      <div className="service-contact">
        <ServiceContact />
      </div>
    </div>
  );
};

export default Service3;
