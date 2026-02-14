import "./InstaFeed.scss";
import { useEffect, useState } from "react";
import axios from "axios";

const InstaFeed = () => {
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const posts = [
          "https://www.instagram.com/p/DGNkBj4tTd5/?img_index=1",
          "https://www.instagram.com/p/CNDv9xPj3bX/?img_index=1",
          "https://www.instagram.com/p/CZBk3xgj7/?img_index=1",
          "https://www.instagram.com/p/CXb9xXGj9/?img_index=1",
          "https://www.instagram.com/p/CQb9XGxj2/?img_index=1",
        ];

        const imageUrls = await Promise.all(
          posts.map(async (url) => {
            try {
              const { data } = await axios.get(`http://localhost:3000/api/instagram?url=${encodeURIComponent(url)}`);
              return data.imageUrl;
            } catch (error) {
              console.error(`Failed to fetch: ${url}`, error);
              return null;
            }
          })
        );

        setImages(imageUrls.filter((url) => url !== null));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="instaFeed">
      <div className="instaFeed-top">
        <h3>
          FOLLOW ON INSTAGRAM{" "}
          <a
            href="https://www.instagram.com/tk_production_film/"
            target="_blank"
            rel="noreferrer"
            className="insta-ac"
          >
            @tk_production_film
          </a>
        </h3>
      </div>

      <div className="instaFeed-gallery">
        {images.map((img, index) => (
          <a
            key={index}
            href={`https://www.instagram.com/p/${img.split('/')[4]}`}
            target="_blank"
            rel="noreferrer"
            className="insta-img"
          >
            <img src={img} alt={`Instagram ${index}`} loading="lazy" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default InstaFeed;
