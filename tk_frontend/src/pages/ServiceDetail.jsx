import "./ServicesPage/Service.scss";

import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

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

const fetchServiceBySlug = async (slug) => {
  if (!navigator.onLine) {
    throw new Error("NETWORK_ERROR");
  }

  const { data } = await axios.get(`${baseUrl}/services/${slug}`);
  return data?.serviceImages;
};

const fetchAllServices = async () => {
  const { data } = await axios.get(`${baseUrl}/services`);
  return data?.services || [];
};

const ServiceDetail = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const { serviceSlug } = useParams();
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
    queryKey: ["dynamic-service", serviceSlug],
    queryFn: () => fetchServiceBySlug(serviceSlug),
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
  const heroImage = images[0];
  const galleryImages = images.slice(1);
  const description = serviceData?.description || "";
  const whatWeOffer = serviceData?.whatWeOffer || [];
  const howItWorks = serviceData?.howItWorks || [];
  const showInitialLoader = isServiceLoading && !serviceData;

  const prefetchService = (slug) => {
    if (!slug) return;
    queryClient.prefetchQuery({
      queryKey: ["dynamic-service", slug],
      queryFn: () => fetchServiceBySlug(slug),
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

      <div className="service-top-banner">
        <div className="service-banner">
          <div className="service-banner-desc">
            <h1>{title}</h1>
          </div>
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
                    to={`/${service.slug}`}
                    className={`service-sidebar-link ${
                      service.slug === serviceSlug ? "active" : ""
                    }`}
                    onClick={() => setSkipScroll(true)}
                    onMouseEnter={() => prefetchService(service.slug)}
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

                  {heroImage ? (
                    <div className="service-hero-image">
                      <img
                        src={optimizeImageUrl(heroImage, { width: 1800 })}
                        srcSet={getResponsiveImageSet(heroImage, [640, 960, 1366, 1800])}
                        sizes="(max-width: 1200px) 100vw, 72vw"
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                        alt={title}
                        onClick={() => setSelectedImg(heroImage)}
                      />
                    </div>
                  ) : (
                    !isServiceLoading && <p>No images available</p>
                  )}

                  {galleryImages.length > 0 && (
                    <div className="service-images">
                      <h2>{title} Gallery</h2>
                      <hr />

                      <div className="service-image-cards">
                        {galleryImages.map((item, index) => (
                          <div className="service-image-card" key={index}>
                            <img
                              src={optimizeImageUrl(item, { width: 1200 })}
                              srcSet={getResponsiveImageSet(item, [420, 640, 900, 1200])}
                              sizes="(max-width: 768px) 50vw, 25vw"
                              alt={`${title} gallery`}
                              loading="lazy"
                              decoding="async"
                              onClick={() => setSelectedImg(item)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
