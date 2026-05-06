import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../main";
import "./HomeReels.scss";

const parseInstagramReelCode = (url = "") => {
  const match = String(url).match(/instagram\.com\/reel\/([^/?#]+)/i);
  return match ? match[1] : "";
};

const getEmbedInfo = (link = "") => {
  const trimmed = String(link || "").trim();
  if (!trimmed) return { type: "unknown", embedUrl: "" };

  const reelCode = parseInstagramReelCode(trimmed);
  if (reelCode) {
    return {
      type: "instagram",
      embedUrl: `https://www.instagram.com/reel/${reelCode}/embed`,
    };
  }

  // YouTube shorts / watch / youtu.be
  let videoId = "";
  if (/youtu\.be\//i.test(trimmed)) {
    videoId = trimmed.split("youtu.be/")[1]?.split(/[?#&]/)[0] || "";
  } else if (/youtube\.com\/shorts\//i.test(trimmed)) {
    videoId = trimmed.split("/shorts/")[1]?.split(/[?#&]/)[0] || "";
  } else if (/youtube\.com\/watch\?v=/i.test(trimmed)) {
    videoId = trimmed.split("v=")[1]?.split("&")[0] || "";
  }
  if (videoId) {
    return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${videoId}` };
  }

  return { type: "unknown", embedUrl: "" };
};

const HomeReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${baseUrl}/reels/all-reels`);
        setReels(Array.isArray(data?.reels) ? data.reels : []);
      } catch (error) {
        setReels([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const items = useMemo(() => (Array.isArray(reels) ? reels.slice(0, 6) : []), [reels]);

  return (
    <div className="homeReels">
      <div className="homeReels-head">
        <p className="homeReels-kicker">REELS</p>
        <h2>Highlights in Motion</h2>
        <p className="homeReels-subtitle">
          Short, romantic moments — watch directly here.
        </p>
      </div>

      {loading ? (
        <p className="homeReels-state">Loading reels...</p>
      ) : items.length === 0 ? (
        <p className="homeReels-state">No reels added yet.</p>
      ) : (
        <div className="homeReels-grid">
          {items.map((reel) => {
            const info = getEmbedInfo(reel?.link);
            const canEmbed = Boolean(info.embedUrl);
            return (
              <div key={reel?._id || reel?.link} className="reelCard">
                {canEmbed ? (
                  <div className="reelFrame">
                    <iframe
                      src={info.embedUrl}
                      title="Reel"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="reelFallback">
                    <p>Open reel</p>
                    <a href={reel?.link} target="_blank" rel="noreferrer">
                      {reel?.link}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomeReels;

