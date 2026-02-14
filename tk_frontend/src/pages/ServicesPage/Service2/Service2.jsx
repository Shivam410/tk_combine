import "../Service2.scss";

import ServiceContact from "../../../components/ServiceContact/ServiceContact";
import { service1Steps } from "../../../assets/servicesData";

import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import Video from "../../../components/Video/Video";
import { useEffect } from "react";
import { baseUrl } from "../../../main";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import SEO from "../../../SEO/SEO";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchService = async () => {
  if (!navigator.onLine) {
    throw new Error("NETWORK_ERROR");
  }

  const { data } = await axios.get(
    `${baseUrl}/wedding-cinematography/all-videos`
  );
  return data?.videos;
};

const Service2 = () => {
  const contentRef = useRef(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["service-2"],
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
        title="Wedding Cinematography | TK Production Film - Capture Your Love Story in Motion"
        description="Relive your wedding day with TK Production Film's cinematic wedding cinematography. We create stunning, high-quality wedding films that capture every emotion. Book now!"
        keywords="wedding cinematography, cinematic wedding films, professional wedding videography, TK Production Film, wedding day videos, cinematic love stories"
        url={fullUrl}
      />

      <div className="service2-top-banner">
        <div className="service2-banner">
          <div className="service2-banner-desc">
            <h1>Wedding Cinematography</h1>
          </div>
        </div>
      </div>

      <div className="service2-container">
        <div className="service2-container-content" ref={contentRef}>
          <div className="service2-container-content-top">
            {/* <div className="services-img-slide">
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
                      <Video videoUrl={item.link} videoSize="wedding" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div> */}

            <div className="service-films">
              <h2>Wedding Cinematography Videos</h2>
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

            <h1>Wedding Cinematography by TK Production Film</h1>
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

          <div className="service2-steps-container">
            <div className="service2-steps">
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

          <hr />
        </div>
      </div>
      <div className="service-contact">
        <ServiceContact />
      </div>
    </div>
  );
};

export default Service2;
