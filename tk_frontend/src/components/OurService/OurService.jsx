import { TiArrowRight } from "react-icons/ti";
import "./OurService.scss";


import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import overlay1 from "../../assets/images/overlay1.png";
import useServices from "../../hooks/useServices";

import {Link} from "react-router-dom"

const OurService = () => {
  const { services } = useServices();
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease",
      once: false,
      delay: 500,
    });

    AOS.refresh();
  }, []);

  return (
    <div className="ourService">
      <div className="ourService-top">
        <h1>Our Services</h1>
        <div className="ourService-top-right">
          <p>
          At <span className="bold-text">TK Production Film</span>, we capture life’s precious moments with elegance. From engagements to weddings, birthdays to graduations, and baby showers to civil marriages, our personalized photography services ensure every milestone is beautifully preserved. Let us turn your special moments into timeless memories you'll cherish forever.
          </p>

            <Link to={"/wedding-photography"} className="read-more">
            Read More <TiArrowRight className="right-arrow" />

            </Link>
        </div>
      </div>

      <div className="overlay">
        <img src={overlay1} alt="overlay image" loading="lazy" />
      </div>

      <div className="ourService-bottom">
        <div className="ourService-top-cards">
          {services.map((item , index) => (
            <Link to={item.link} key={index}>
              <div className="ourService-top-card" data-aos="fade-right">
                <img src={item.img} alt="service image" loading="lazy" />

                <div className="ourService-top-card-desc">
                  <h1>{item.service_name}</h1>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurService;
