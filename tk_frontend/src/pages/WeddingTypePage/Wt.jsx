import { useEffect, useState } from "react";
import axios from "axios";
import "./Wt.scss";

const Wt = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const ids = [1, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90]; // Use different IDs
        const mixedImages = ids.map((id, index) => {
          const width = index % 2 === 0 ? 800 : 400; // Alternate width
          const height = index % 3 === 0 ? 600 : 300; // Alternate height
          return {
            id,
            src: `https://picsum.photos/id/${id}/${width}/${height}`,
            alt: `Image ${id} (${width}x${height})`,
          };
        });

        setImages(mixedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="wt">
      <div className="wt-banner">
        <div className="wt-banner-desc">
          <h1>Hindu Wedding</h1>
        </div>
      </div>

      <div className="wt-title">
        <h1>Experience the Beauty of a Traditional Hindu Wedding Gallery</h1>
        <p>
          Step into the vibrant world of Hindu weddings through our stunning
          gallery. Explore the timeless beauty and rich traditions captured in
          every frame.
        </p>
      </div>

      <div className="wt-imgs">
        {images.length > 0 ? (
          images.map((img, index) => (
            <div key={index} className="wt-img-card">
              <img src={img.src} alt={img.alt} />
            </div>
          ))
        ) : (
          <p>Loading images...</p>
        )}
      </div>
    </div>
  );
};

export default Wt;
