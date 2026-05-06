import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../main";
import defaultPackageImage from "../../assets/images/bg16.jpg";
import "./Packages.scss";

const normalizePackage = (pkg = {}) => ({
  id: pkg?._id || pkg?.id || "",
  title: pkg?.title || "",
  descriptionBlocks: Array.isArray(pkg?.descriptionBlocks) ? pkg.descriptionBlocks : [],
  includes: Array.isArray(pkg?.includes) ? pkg.includes : [],
  priceText: pkg?.priceText || "",
  image: pkg?.image || "",
  order: Number(pkg?.order ?? 0),
});

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPackages = async () => {
    const { data } = await axios.get(`${baseUrl}/packages`);
    const raw = data?.packages || [];
    const normalized = Array.isArray(raw) ? raw.map(normalizePackage) : [];
    normalized.sort((a, b) => a.order - b.order);
    setPackages(normalized);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);
        await loadPackages();
      } catch (error) {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const sections = useMemo(() => packages, [packages]);

  return (
    <div className="packages-page">
      <header className="packages-hero">
        <div className="packages-hero-inner">
          <p className="packages-hero-kicker">OUR PACKAGES</p>
          <h1 className="packages-hero-title">Wedding Packages</h1>
          <p className="packages-hero-subtitle">
            A minimal, luxury-first way to choose your story.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="packages-state">
          <p>Loading packages...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="packages-state">
          <p>No packages available right now.</p>
        </div>
      ) : (
        <section className="packages-list">
          {sections.map((pkg, index) => (
            <article
              key={pkg.id || `${pkg.title}-${index}`}
              className={`package-section ${index % 2 === 1 ? "reverse" : ""}`}
            >
              <div className="package-copy">
                <div className="package-copy-inner">
                  <div className="package-badge">
                    <span className="package-badge-icon" aria-hidden="true" />
                    <span className="package-badge-text">PACKAGE</span>
                  </div>

                  <h2 className="package-title">{(pkg.title || "Package").toUpperCase()}</h2>

                  <div className="package-blocks">
                    {(pkg.descriptionBlocks.length ? pkg.descriptionBlocks : ["Tailored coverage with a timeless finish."]).slice(0, 4).map(
                      (block, idx) => (
                        <p key={`${pkg.id}-block-${idx}`}>{block}</p>
                      )
                    )}
                  </div>

                  {pkg.priceText ? (
                    <p className="package-price">{pkg.priceText}</p>
                  ) : null}

                  {pkg.includes.length ? (
                    <ul className="package-includes">
                      {pkg.includes.slice(0, 6).map((item, idx) => (
                        <li key={`${pkg.id}-inc-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>

              <div className="package-image">
                <div
                  className="package-image-inner"
                  style={{
                    backgroundImage: `url(${pkg.image || defaultPackageImage})`,
                  }}
                  role="img"
                  aria-label={`${pkg.title || "Wedding"} package image`}
                />
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Packages;
