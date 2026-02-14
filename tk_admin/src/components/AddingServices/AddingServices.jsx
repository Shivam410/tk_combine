import { useRef, useState, useCallback, useEffect } from "react";
import "./AddingServices.scss";
import { FaPlus } from "react-icons/fa";
import addImg from "../../assets/images/addImg.svg";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";

const toMultiline = (list = []) => list.join("\n");

const parseMultiline = (text = "") =>
  text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const AddingServices = ({ title, path, serviceId, isCreate = false }) => {
  const [serviceImages, setServicesImage] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [whatWeOfferText, setWhatWeOfferText] = useState("");
  const [howItWorksText, setHowItWorksText] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const loadService = useCallback(async () => {
    if (isCreate) return;

    const getUrl = serviceId
      ? `${baseUrl}/services/by-id/${serviceId}`
      : `${baseUrl}/services${path}`;

    try {
      const { data } = await axios.get(getUrl);
      const service = data?.serviceImages;
      setSingleData(service?.images || []);
      setServiceName(service?.serviceName || "");
      setDescription(service?.description || "");
      setWhatWeOfferText(toMultiline(service?.whatWeOffer || []));
      setHowItWorksText(toMultiline(service?.howItWorks || []));
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to fetch service details.");
    }
  }, [isCreate, path, serviceId]);

  useEffect(() => {
    loadService();
  }, [loadService]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const maxSize = 300 * 1024;
    const validFiles = [];

    files.forEach((selectedFile) => {
      if (selectedFile.size > maxSize) {
        toast.error(`${selectedFile.name}: image size should be less than 300 KB`);
        return;
      }

      validFiles.push({
        image: URL.createObjectURL(selectedFile),
        file: selectedFile,
      });
    });

    if (validFiles.length) {
      setServicesImage((prev) => [...prev, ...validFiles]);
    }

    event.target.value = "";
  }, []);

  const handleRemovePhoto = useCallback((index) => {
    setServicesImage((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDelete = (index) => {
    setSingleData((prev) => prev.filter((_, i) => i !== index));
    setDeleteIndex(null);
    toast.success("Image removed from gallery (not saved yet)");
  };

  const handleSave = async () => {
    if (!serviceName.trim()) {
      toast.error("Service name is required.");
      return;
    }

    if (serviceImages.length === 0 && singleData.length === 0) {
      toast.error("Please add at least one image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      serviceImages.forEach((photo) => {
        formData.append("images", photo.file);
      });

      singleData.forEach((imageUrl) => {
        formData.append("images", imageUrl);
      });

      formData.append("serviceName", serviceName.trim());
      formData.append("description", description.trim());
      parseMultiline(whatWeOfferText).forEach((item) => {
        formData.append("whatWeOffer", item);
      });
      parseMultiline(howItWorksText).forEach((item) => {
        formData.append("howItWorks", item);
      });

      if (isCreate) {
        const response = await axios.post(`${baseUrl}/services/new`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.data?.success) {
          toast.success(response.data.message || "Service created successfully");
          const createdServiceId = response?.data?.service?._id;
          if (createdServiceId) {
            navigate(`/services/${createdServiceId}`);
          }
        }
      } else {
        const updateUrl = serviceId
          ? `${baseUrl}/services/${serviceId}`
          : `${baseUrl}/services/${path}`;

        const response = await axios.put(updateUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.data?.success) {
          toast.success(response.data.message || "Service updated successfully");
          setServicesImage([]);
          await loadService();
        }
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error(error?.response?.data?.message || "Failed to save service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addingServices">
      <div className="addingServices-top">
        <Link to="#" onClick={() => navigate(-1)}>
          <h1>
            <RiArrowLeftWideFill className="addingServices-icon" /> {title}
          </h1>
        </Link>

        <div className="addingServices-top-btns">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : isCreate ? "Create" : "Update"}
          </button>
        </div>
      </div>

      <div className="service1-content">
        <div className="service1-content-card">
          <div style={{ width: "100%", marginBottom: "16px" }}>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Service name"
              style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Service description"
              rows={4}
              style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
            />

            <textarea
              value={whatWeOfferText}
              onChange={(e) => setWhatWeOfferText(e.target.value)}
              placeholder="What We Offer (one line per point)"
              rows={5}
              style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
            />

            <textarea
              value={howItWorksText}
              onChange={(e) => setHowItWorksText(e.target.value)}
              placeholder="How It Works (one line per step)"
              rows={5}
              style={{ width: "100%", padding: "10px" }}
            />
          </div>

          <div className="service1-content-left" onClick={handleClick} role="button" tabIndex={0}>
            <img src={addImg} alt="Add Photo" className="addimage" />
            <p>Select multiple images</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <div className="photo-add-btn">
            <button onClick={handleClick} className="image-add-btn" type="button">
              <FaPlus className="add-icon" /> Add Images
            </button>
          </div>
        </div>
      </div>

      <div className="getting-photos">
        {singleData.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo} alt="Photo" className="photo-thumb" />
            <div className="added-photos-btn">
              <button
                className="delete-btn"
                onClick={() => setDeleteIndex(index)}
                aria-label="Delete Photo"
              >
                Delete
              </button>
            </div>

            {deleteIndex === index && (
              <div className="deleteCard">
                <div className="deleteCard-desc">
                  <h2>Sure to delete this photo?</h2>
                  <div className="deleteCard-desc-btns">
                    <button onClick={() => handleDelete(index)}>Yes</button>
                    <button onClick={() => setDeleteIndex(null)}>No</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="added-photos">
        {serviceImages.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo.image} alt="Photo" className="photo-thumb" />
            <div className="added-photos-btn">
              <button
                className="delete-btn"
                onClick={() => handleRemovePhoto(index)}
                aria-label="Delete Photo"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddingServices;
