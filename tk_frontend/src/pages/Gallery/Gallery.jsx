import "./Gallery.scss";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../../main";
import SEO from "../../SEO/SEO";
import { useLocation } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const Gallery = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const cardsPerPage = 20;
  const location = useLocation();

  const offset = currentPage * cardsPerPage;

  // ✅ Fetch Portfolio with Error Handling
  const fetchPortfolios = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/portfolio/all-portfolios`);
      return data.portfolios;
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response);
        throw new Error(
          error.response.status >= 500
            ? "Server error! Please try again later."
            : "Failed to load portfolios!"
        );
      } else if (error.request) {
        console.error("Network Error:", error.request);
        throw new Error("Network error! Check your internet connection.");
      } else {
        console.error("Unknown Error:", error.message);
        throw new Error("Unexpected error occurred!");
      }
    }
  };

  // ✅ Use React Query for data fetching
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["portfolios"],
    queryFn: fetchPortfolios,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const currentCards = data ? data.slice(offset, offset + cardsPerPage) : [];

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  };

  const baseUrl =
    import.meta.env.VITE_BASE_URL || "https://tkproductionfilm.com";
  const fullUrl = `${baseUrl}${location.pathname}`;

  return (
    <div className="gallery">
      <SEO
        title="Gallery | TK Production Film - Best Photography & Cinematography"
        description="Explore the stunning gallery of TK Production Film showcasing top-quality images from weddings, pre-weddings, engagements, baby showers, birthdays, and more. Book your service today!"
        keywords="photography gallery, wedding images, pre-wedding photos, engagement portraits, baby shower pictures, birthday event gallery, TK Production Film gallery"
        url={fullUrl}
      />

      <div className="gallery-top-banner">
        <div className="gallery-banner">
          <div className="gallery-banner-desc">
            <h1>Portfolio</h1>
          </div>
        </div>
      </div>

      <div className="gallery-container">
        <div className="gallery-container-top">
          <h1> Our Portfolio</h1>
          <p>TK Production Films - All of your beautiful memories</p>
        </div>

        {/* ✅ Show Loader inside Main Section */}
        {isLoading ? (
          <div className="gallery-loader-container">
            <Loader loaderSize="galleryLoader" />
          </div>
        ) : isError ? (
          <div className="error-container">
            <p>{error.message}</p>
            <button onClick={() => refetch()}>Retry</button>
          </div>
        ) : currentCards.length > 0 ? (
          <>
            <div className="gallery-cards">
              {currentCards.map((item, index) => (
                <div key={index} className="gallery-card">
                  <img
                    src={item.image}
                    alt="portfolio image"
                    onClick={() => setSelectedImg(item.image)}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <ReactPaginate
              previousLabel={
                <span className="prev-icon">
                  <FaChevronLeft />
                </span>
              }
              nextLabel={
                <span className="next-icon">
                  <FaChevronRight />
                </span>
              }
              pageCount={Math.ceil(data.length / cardsPerPage)}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              breakLabel=".........."
            />
          </>
        ) : (
          <p>No portfolios available</p>
        )}
      </div>

      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="Fullscreen Preview" loading="lazy" />
          <span className="close-btn" onClick={() => setSelectedImg(null)}>
            ×
          </span>
        </div>
      )}
    </div>
  );
};

export default Gallery;
