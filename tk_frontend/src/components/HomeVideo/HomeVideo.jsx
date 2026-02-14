import { Link } from "react-router-dom";
import "./HomeVideo.scss";

const HomeVideo = () => {
  const link = "https://www.youtube.com/watch?v=TkX1fn7XBO8";

  const getYouTubeEmbedUrl = (url) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="homeVideo">
      <div className="videoWrapper">
        <iframe
          src={getYouTubeEmbedUrl(link)}
          title="YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div> 
    
    <div className="homeVideo-btn">
    <Link to={"/wedding-cinematography"} className="more-video-btn">Click here for more videos</Link>

    </div>
    </div>
  );
};

export default HomeVideo;
