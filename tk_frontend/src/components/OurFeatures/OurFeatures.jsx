import "./OurFeatures.scss";

import React, { useState, useEffect, useRef } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { TiArrowRight } from "react-icons/ti";
import { gsap } from "gsap";
import { featuresData } from "../../assets/data";
import { Link } from "react-router-dom";

const OurFeatures = () => {
  const [hoveredItem, setHoveredItem] = useState(featuresData[0] || null);
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (hoveredItem && imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 2, ease: "power2.out" }
      );
    }
  }, [hoveredItem]);

  return (
    <div className="ourFeatures">
      <div className="ourFeatures-mobile">
        <h1 className="ourFeatures-mobile-title">Why choose Us</h1>
        <div className="ourFeatures-mobile-cards">
          {featuresData.map((feature) => (
            <div className="ourFeatures-mobile-desc" key={feature.title}>
              <h1>{feature.title}</h1>
              <p>{feature.cardContent.description}</p>
              <Link to={"/about-us"}>
                <button>Read More</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Left Section */}
      <div className="ourFeatures-left">
        <h1>Why choose Us</h1>
        <div className="ourFeatures-left-desc">
          <ul>
            {featuresData.map((item) => (
              <li
                
                key={item.title}
                onMouseEnter={() => setHoveredItem(item)}
                className={hoveredItem?.title === item.title ? "active" : ""}
              >
                <BsArrowUpRight className="up-arrow" />
                {item.title}

                {/* Hover Card */}
                {hoveredItem?.title === item.title && (
                  <div className={`ourFeatures-left-card ${hoveredItem?.card_fit || ""}`} ref={cardRef}>
                    <p>{hoveredItem?.cardContent?.description}</p>
                    <Link to={"/about-us"}>
                      <span className="read-more">
                        {hoveredItem?.cardContent?.readMore}
                        <TiArrowRight className="right-arrow" />
                      </span>
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div className="ourFeatures-right">
        <div className="ourFeatures-right-img">
          <img ref={imgRef} src={hoveredItem?.image} alt="Feature" style={{ opacity: 0 }} loading="lazy"/>
        </div>
      </div>
    </div>
  );
};

export default OurFeatures;
