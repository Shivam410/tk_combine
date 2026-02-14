import { weddingSlider } from "../../assets/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./WeddingType.scss";
import { Link } from "react-router-dom";

const WeddingType = () => {
  return (
    <div className="weddingType">
      <div className="weddingType-top">
        <h1>Our Beautiful Wedding Types</h1>
        <p>
          Capturing love in every tradition, preserving memories for a lifetime
        </p>
      </div>

      <div className="weddingType-swiper">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={5}
          speed={1000}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          breakpoints={{
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
        >
          {weddingSlider.map((item, index) => (
            <SwiperSlide key={index} className="type-slider">
              <div className="weddingType-card">
                <div className="weddingType-card-img">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="weddingType-desc">
                  <Link to={"/hindu-wedding"}>
                    <h3>{item.title}</h3>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="custom-pagination"></div>
      </div>
    </div>
  );
};

export default WeddingType;
