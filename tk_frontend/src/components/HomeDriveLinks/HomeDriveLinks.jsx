import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../main";
import "./HomeDriveLinks.scss";

const HomeDriveLinks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${baseUrl}/drive-links/all`);
        setItems(Array.isArray(data?.driveLinks) ? data.driveLinks : []);
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showItems = useMemo(() => (Array.isArray(items) ? items.slice(0, 6) : []), [items]);

  return (
    <div className="homeDriveLinks">
      <div className="homeDriveLinks-head">
        <p className="homeDriveLinks-kicker">VIDEOS</p>
        <h2>Watch the full films</h2>
        <p className="homeDriveLinks-subtitle">
          Tap a thumbnail to open the video in Google Drive.
        </p>
      </div>

      {loading ? (
        <p className="homeDriveLinks-state">Loading...</p>
      ) : showItems.length === 0 ? (
        <p className="homeDriveLinks-state">No videos added yet.</p>
      ) : (
        <div className="homeDriveLinks-grid">
          {showItems.map((item) => (
            <a
              key={item?._id || item?.link}
              className="driveThumb"
              href={item.link}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Google Drive link"
            >
              <span
                className="driveThumb-bg"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
                aria-hidden="true"
              />
              <span className="driveThumb-overlay" aria-hidden="true">
                <span className="driveThumb-open">Open</span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeDriveLinks;

