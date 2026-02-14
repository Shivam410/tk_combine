import { useState, useEffect } from "react";
import "./Video.scss";
import { TbPlayerPlayFilled } from "react-icons/tb";

const getYouTubeID = (url) => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

const fallbackLevels = ["maxresdefault", "hqdefault", "mqdefault", "default"];

const Video = ({ videoUrl, videoSize }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  const videoId = getYouTubeID(videoUrl);
  if (!videoId) return <p>Invalid YouTube URL</p>;

  useEffect(() => {
    let currentIndex = 0;

    const tryLoadThumbnail = () => {
      if (currentIndex >= fallbackLevels.length) return;

      const testUrl = `https://img.youtube.com/vi/${videoId}/${fallbackLevels[currentIndex]}.jpg`;

      const img = new Image();
      img.src = testUrl;
      img.onload = () => {
        // YouTube placeholders are usually 120x90
        if (img.width > 120 && img.height > 90) {
          setThumbnailUrl(testUrl);
        } else {
          currentIndex++;
          tryLoadThumbnail();
        }
      };
      img.onerror = () => {
        currentIndex++;
        tryLoadThumbnail();
      };
    };

    tryLoadThumbnail();
  }, [videoId]);

  return (
    <div className="video-container">
      {!isPlaying ? (
        <div className="thumbnail" onClick={() => setIsPlaying(true)}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="YouTube Thumbnail"
              loading="lazy"
            />
          ) : (
            <p>Loading thumbnail...</p>
          )}
          <div className={`player ${videoSize}`}>
            <TbPlayerPlayFilled className="player-icon" />
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      )}
    </div>
  );
};

export default Video;
