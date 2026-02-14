import { useEffect } from "react";
import axios from "axios";
import "./Homepage.scss";

import HomeBanner from "../../components/HomeBanner/HomeBanner";
import OurService from "../../components/OurService/OurService";
import ClientReview from "../../components/ClientReview/ClientReview";
import Getintouch from "../../components/Getintouch/Getintouch";
import AboutAgency from "../../components/AboutAgency/AboutAgency";
import OurFeatures from "../../components/OurFeatures/OurFeatures";
import OurCore from "../../components/OurCore/OurCore";
import OurPorfolio from "../../components/OurPorfolio/OurPorfolio";
import FollowSection from "../../components/FollowSection/FollowSection";
import PhotoAlbums from "../../components/PhotoAlbums/PhotoAlbums";

import { baseUrl } from "../../main";
import SEO from "../../SEO/SEO";
import { useLocation, Link } from "react-router-dom";
import HomeVideo from "../../components/HomeVideo/HomeVideo";

const Homepage = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        if (baseUrl && baseUrl !== "https://tkproductionfilm.com") {
          await axios.post(`${baseUrl}/visitors/increment`);
        }
      } catch (error) {
        console.error("Error tracking visitor", error);
      }
    };

    trackVisitor();
  }, []);

  const location = useLocation();
  const fullUrl = `${baseUrl}${location.pathname}`;

  return (
    <div className="homepage">
      <SEO
        title="TK Production Film | Best Photography & Cinematography Services"
        description="Capture your special moments with TK Production Film - expert wedding, pre-wedding, engagement, and event photography. Book your service today!"
        keywords="photography, cinematography, wedding photography, pre-wedding film, baby shower photography, birthday photography, civil marriage photos, engagement portraits, TK Production Film"
        url={fullUrl}
      />

      <section className="homepage-hero">
        <HomeBanner />
      </section>

      <div className="homepage-shell">
        <section className="homepage-intro reveal-up">
          <p className="eyebrow">Luxury Wedding Storytelling</p>
          <div className="intro-grid">
            <h2>Crafted imagery for timeless celebrations</h2>
            <div className="intro-content">
              <p>
                We design cinematic photographs and films with a calm, elegant
                direction. Every frame is composed to preserve emotion, detail,
                and atmosphere with a premium editorial finish.
              </p>
              <Link to="/contact-us" className="luxury-btn">
                Book Your Session
              </Link>
            </div>
          </div>
        </section>

        <section className="homepage-section reveal-up">
          <OurService />
        </section>

        <section className="homepage-section reveal-up">
          <PhotoAlbums />
        </section>

        <section className="homepage-section reveal-up">
          <HomeVideo />
        </section>

        <section className="homepage-section reveal-up">
          <AboutAgency />
        </section>

        <section className="homepage-section reveal-up">
          <OurFeatures />
        </section>

        <section className="homepage-section reveal-up">
          <OurCore />
        </section>

        <section className="homepage-section reveal-up">
          <OurPorfolio />
        </section>
      </div>

      <section className="homepage-wide-section reveal-up">
        <ClientReview />
      </section>

      <section className="homepage-shell reveal-up">
        <Getintouch />
      </section>

      <section className="homepage-shell reveal-up follow-wrap">
        <FollowSection />
      </section>
    </div>
  );
};

export default Homepage;
