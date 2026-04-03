import "./ServicesPage/Service.scss";

import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import bgImage from '../assets/images/service-details-banner.png';

import { FaCheck } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";

import ServiceContact from "../components/ServiceContact/ServiceContact";
import Loader from "../components/Loader/Loader";
import SEO from "../SEO/SEO";
import { baseUrl } from "../main";
import { useScrollContext } from "../context/ScrollContext";
import {
  getResponsiveImageSet,
  optimizeImageUrl,
} from "../utils/imageOptimization";

const fetchServiceByIdAndSlug = async (slug, serviceId) => {
  if (!navigator.onLine) {
    throw new Error("NETWORK_ERROR");
  }

  if (serviceId) {
    try {
      const { data } = await axios.get(`${baseUrl}/services/${slug}/${serviceId}`);
      return data?.serviceImages;
    } catch (error) {
      if (error?.response?.status !== 404) {
        throw error;
      }
    }
  }

  const { data } = await axios.get(`${baseUrl}/services/${slug}`);
  return data?.serviceImages;
};

const fetchAllServices = async () => {
  const { data } = await axios.get(`${baseUrl}/services`);
  return data?.services || [];
};

const normalizeOffer = (offer = {}) => ({
  id: offer?._id || offer?.id || `${offer?.title || offer?.offerTitle}-${offer?.price || offer?.offerPrice}`,
  title: offer?.offerTitle || offer?.title || offer?.name || "",
  description: offer?.offerDescription || offer?.description || offer?.details || "",
  price: offer?.offerPrice ?? offer?.price ?? offer?.finalPrice ?? offer?.discountedPrice ?? null,
  serviceSlug: offer?.serviceSlug || offer?.service?.slug || "",
  serviceName: offer?.serviceName || offer?.service?.serviceName || "",
  serviceId:
    offer?.serviceId ||
    offer?.service?._id ||
    (typeof offer?.service === "string" ? offer.service : ""),
  isActive: offer?.isActive ?? offer?.active ?? true,
});

const fetchServiceOffers = async (serviceSlug) => {
  if (!serviceSlug) return [];

  const endpoints = [
    `${baseUrl}/offers?serviceSlug=${encodeURIComponent(serviceSlug)}`,
    `${baseUrl}/offers/service/${encodeURIComponent(serviceSlug)}`,
    `${baseUrl}/special-offers?serviceSlug=${encodeURIComponent(serviceSlug)}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const { data } = await axios.get(endpoint);
      const rawOffers =
        data?.offers ||
        data?.specialOffers ||
        data?.data ||
        data?.results ||
        [];

      if (Array.isArray(rawOffers)) {
        return rawOffers.map(normalizeOffer);
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        continue;
      }
    }
  }

  return [];
};

const includesText = (source, target) =>
  String(source || "").trim().toLowerCase() === String(target || "").trim().toLowerCase();

const toServiceLink = (service) => {
  const slug = service?.slug || "";
  if (service?._id) {
    return `/service/${service._id}/${slug}`;
  }
  return `/${slug}`;
};

const ServiceDetail = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const { serviceId, serviceSlug } = useParams();
  const { setSkipScroll } = useScrollContext();
  const queryClient = useQueryClient();

  const {
    data: serviceData,
    isLoading: isServiceLoading,
    isFetching: isServiceFetching,
    isError: isServiceError,
    error: serviceError,
    refetch: refetchService,
  } = useQuery({
    queryKey: ["dynamic-service", serviceId, serviceSlug],
    queryFn: () => fetchServiceByIdAndSlug(serviceSlug, serviceId),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
    retry: false,
    enabled: !!serviceSlug,
  });

  const {
    data: allServices = [],
    isLoading: isServicesLoading,
  } = useQuery({
    queryKey: ["all-services-sidebar"],
    queryFn: fetchAllServices,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const { data: fetchedOffers = [] } = useQuery({
    queryKey: ["service-offers", serviceSlug],
    queryFn: () => fetchServiceOffers(serviceSlug),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!serviceSlug,
  });

  useEffect(() => {
    if (!isServiceError || serviceError?.name !== "AxiosError") {
      return;
    }

    const isNetworkError =
      !serviceError.response ||
      serviceError.message.includes("ECONNRESET") ||
      serviceError.response?.data?.message === "read ECONNRESET";

    if (isNetworkError) {
      toast.error("Network error. Please check your connection.");
    }
  }, [isServiceError, serviceError]);

  const location = useLocation();
  const siteBaseUrl = import.meta.env.VITE_BASE_URL || "https://tkproductionfilm.com";
  const fullUrl = `${siteBaseUrl}${location.pathname}`;

  const title = serviceData?.serviceName || "Service";
  const images = serviceData?.images || [];
  const description = serviceData?.description || "";
  const whatWeOffer = serviceData?.whatWeOffer || [];
  const howItWorks = serviceData?.howItWorks || [];
  const showInitialLoader = isServiceLoading && !serviceData;

  const inlineOffers = (serviceData?.offers || serviceData?.specialOffers || []).map(
    normalizeOffer
  );

  const serviceOffers = [...inlineOffers, ...fetchedOffers].filter((offer, index, list) => {
    if (!offer?.title || offer?.isActive === false) return false;

    const belongsToService =
      includesText(offer.serviceSlug, serviceSlug) ||
      includesText(offer.serviceName, title) ||
      includesText(offer.serviceId, serviceId) ||
      includesText(offer.serviceId, serviceData?._id) ||
      (!offer.serviceSlug && !offer.serviceName && !offer.serviceId);

    if (!belongsToService) return false;

    return list.findIndex((item) => item.id === offer.id) === index;
  });

  const prefetchService = (service) => {
    if (!service?.slug) return;
    queryClient.prefetchQuery({
      queryKey: ["dynamic-service", service?._id, service.slug],
      queryFn: () => fetchServiceByIdAndSlug(service.slug, service?._id),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <div className="service">
      <SEO
        title={`${title} | TK Production Film`}
        description={`Explore ${title} by TK Production Film.`}
        keywords={`${title}, TK Production Film, photography service`}
        url={fullUrl}
      />

      {/* --- NEW HERO SECTION --- */}
    {/* --- NEW HERO SECTION --- */}
      <div 
        className="service-hero"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, #fafafa 0%, rgba(255,255,255,0) 40%),
            linear-gradient(to top, #fafafa 0%, rgba(255,255,255,0) 30%),
            url(${bgImage})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="service-hero-content">
          <span className="hero-subtitle">SERVICE EXCELLENCE</span>
          {/* You can replace the text below with {title} if you want it to be dynamic */}
          <h1 className="hero-title">The Art of <br/> Beginning.</h1>
          <hr className="hero-divider" />
        </div>
      </div>

      <div className="service-container">
        <div className="service-layout">
          <aside className="service-sidebar">
            <h3>All Services</h3>
            <p className="service-sidebar-subtitle">Browse and switch quickly</p>

            <div className="service-sidebar-list">
              {isServicesLoading ? (
                <div className="service-sidebar-loader">
                  <Loader loaderSize="serviceLoader" />
                </div>
              ) : allServices.length > 0 ? (
                allServices.map((service) => (
                  <Link
                    key={service._id}
                    to={toServiceLink(service)}
                    className={`service-sidebar-link ${
                      service._id === serviceId || service.slug === serviceSlug ? "active" : ""
                    }`}
                    onClick={() => setSkipScroll(true)}
                    onMouseEnter={() => prefetchService(service)}
                  >
                    <span>{service.serviceName}</span>
                    <MdKeyboardArrowRight />
                  </Link>
                ))
              ) : (
                <p className="service-sidebar-empty">No services available.</p>
              )}
            </div>
          </aside>

          <div className="service-container-content">
            <div className={`service-content-wrap ${isServiceFetching && serviceData ? "is-switching" : ""}`}>
              <div
                key={serviceData?._id || serviceSlug}
                className="service-content-switch"
              >
                <div className="service-container-content-top">
                  {showInitialLoader && (
                    <div className="service-loader-container">
                      <Loader loaderSize="serviceLoader" />
                    </div>
                  )}

                  {isServiceError && (
                    <div className="service-error-container">
                      <div className="service-error-desc">
                        <p>{serviceError?.response?.data?.message || serviceError.message}</p>
                        <button onClick={refetchService}>Retry</button>
                      </div>
                    </div>
                  )}

                  <p className="service-intro-desc" style={{ marginTop: '20px' }}>
                    {description || (
                    <>
                    We capture your most valuable moments with creativity and care, delivering
                    high-quality visuals tailored to your event.
                    </>
                  )}
                  </p>

                  {images.length > 0 && (
                    <div className="service-images" style={{ minWidth: 0, overflow: 'hidden', width: '100%' }}>
                      <h2>{title} Gallery</h2>
                      <hr />

                      <Swiper
                        modules={[Navigation, Pagination, Keyboard]}
                        navigation
                        pagination={{ clickable: true }}
                        keyboard={{ enabled: true }}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                          640: { slidesPerView: 2 },
                          1024: { slidesPerView: 3 },
                        }}
                        className="service-gallery-slider"
                      >
                        {images.map((item, index) => (
                          <SwiperSlide key={`${item}-${index}`} className="service-gallery-slide">
                            <button
                              type="button"
                              className="service-image-card"
                              onClick={() => setSelectedImg(item)}
                              aria-label={`Open ${title} gallery image ${index + 1}`}
                            >
                              <img
                                src={optimizeImageUrl(item, { width: 1200 })}
                                srcSet={getResponsiveImageSet(item, [420, 640, 900, 1200])}
                                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw"
                                alt={`${title} gallery ${index + 1}`}
                                loading="lazy"
                                decoding="async"
                              />
                            </button>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}

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

                {serviceOffers.length > 0 && (
                  <div className="promo-banner-wrapper" style={{ minWidth: 0, overflow: 'hidden', width: '100%' }}>
                    <h2 className="promo-banner-title">🔥 Exclusive Offers</h2>
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={20}
                      slidesPerView={1}
                      autoplay={{ delay: 4000, disableOnInteraction: false }}
                      pagination={{ clickable: true, dynamicBullets: true }}
                      className="promo-banner-slider"
                    >
                      {serviceOffers.map((offer) => (
                        <SwiperSlide key={offer.id}>
                          <div className="promo-offer-slide">
                            <div className="promo-content">
                              
                              <div className="promo-text-wrap">
                                <span className="promo-badge">Limited Deal</span>
                                <h3>{offer.title}</h3>
                                {offer.description && <p>{offer.description}</p>}
                              </div>

                              <div className="promo-action-wrap">
                                {offer.price !== null && offer.price !== "" && (
                                  <div className="promo-price">
                                    Starting at <br/><span>£. {offer.price}</span>
                                  </div>
                                )}
                                <button 
                                  className="promo-btn" 
                                  onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}
                                >
                                  Book Now
                                </button>
                              </div>

                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}

                <p className="bottom-desc">Contact us to book this service.</p>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <img
            src={optimizeImageUrl(selectedImg, { width: 2200 })}
            alt="Fullscreen Preview"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
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
