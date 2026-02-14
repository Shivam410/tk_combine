import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Contact.scss";
import { IoIosArrowDown } from "react-icons/io";
import { selectOptions, weddingtype } from "../../assets/data";
import ContactSection from "../../components/ContactSection/ContactSection";

import toast from "react-hot-toast";
import { baseUrl } from "../../main";
import { useLocation } from "react-router-dom";
import SEO from "../../SEO/SEO";

const Contact = () => {
  const [openSelect, setOpenSelect] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [weddingOption, setWeddingOption] = useState("");
  const [weddingType, setWedingType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    eventDate: "",
    servicesNeeded: [],
    weddingType: "",
    howDidYouHear: "",
    message: "",
  });

  const location = useLocation();
  const selectRef = useRef(null);
  const weddingRef = useRef(null);

  // Scroll to map if hash is present
  useEffect(() => {
    if (location.hash === "#map") {
      document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // Close select dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpenSelect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenSelect = () => {
    setOpenSelect((prev) => !prev);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsValid(true);
    setOpenSelect(false);
  };

  const handleWeddingSelection = (option) => {
    setWeddingOption(option);
    setIsValid(true);
    setWedingType(false);
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add the selected service to the array
      setFormData((prevData) => ({
        ...prevData,
        servicesNeeded: [...prevData.servicesNeeded, value],
      }));
    } else {
      // Remove the unselected service from the array
      setFormData((prevData) => ({
        ...prevData,
        servicesNeeded: prevData.servicesNeeded.filter(service => service !== value),
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOption || !weddingOption) {
      setIsValid(false);
      setErrorMessage(
        "Please select both wedding type and how you heard about us."
      );
      return;
    }

    if (formData.servicesNeeded.length === 0) {
      setIsValid(false);
      setErrorMessage("Please select at least one service.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${baseUrl}/contact2/new-contact2`, {
        ...formData,
        howDidYouHear: selectedOption,
        weddingType: weddingOption,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          location: "",
          eventDate: "",
          servicesNeeded: [],
          weddingType: "",
          howDidYouHear: "",
          message: "",
        });
        setSelectedOption("");
        setWeddingOption("");
      } else {
        toast.error(response.data.message || "Submission failed!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const baseUrl =
    import.meta.env.VITE_BASE_URL || "https://tkproductionfilm.com";
  const fullUrl = `${baseUrl}${location.pathname}`;

  return (
    <div className="contact">
      <SEO
        title="Contact Us | TK Production Film - Get in Touch with Our Experts"
        description="Reach out to TK Production Film for professional photography and cinematography services. Contact us via phone, email, or visit our offices in London and India. Book your session today!"
        keywords="Contact TK Production Film, photography services contact, cinematography inquiries, London office contact, India branch contact, book photography session"
        url={fullUrl}
      />

      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-desc">We'd love to hear about your event</p>

      <div className="contact-card-form">
        <div className="premium-contact-card">
          <form className="premium-contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Name Fields */}
              <div className="form-group floating-label">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <label className="form-label">First Name</label>
                <span className="required-asterisk">*</span>
              </div>
              <div className="form-group floating-label">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <label className="form-label">Last Name</label>
                <span className="required-asterisk">*</span>
              </div>
              {/* Contact Fields */}
              <div className="form-group floating-label">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <label className="form-label">Email</label>
                <span className="required-asterisk">*</span>
              </div>
              <div className="form-group floating-label">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <label className="form-label">Phone Number</label>
                <span className="required-asterisk">*</span>
              </div>
              {/* Event Section */}
              <div className="section-header">
                <h3>Event Details</h3>
                <div className="divider"></div>
              </div>
              <div className="form-group floating-label">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <label className="form-label">Location</label>
                <span className="required-asterisk">*</span>
              </div>
              <div className="form-group floating-label">
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="form-input"
                />
                <label className="form-label">Event Date</label>
                <span className="required-asterisk">*</span>
              </div>
              {/* Services Checkbox */}
              <div className="form-group services-group">
                <label className="services-label">Services Needed</label>
                <div className="checkbox-container">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="servicesNeeded"
                      value="videographer"
                      onChange={handleCheckboxChange}
                      className="checkbox-input"
                      checked={formData.servicesNeeded.includes("videographer")}
                    />
                    <span className="custom-checkbox"></span>
                    Videographer
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="servicesNeeded"
                      value="photographer"
                      onChange={handleCheckboxChange}
                      className="checkbox-input"
                      checked={formData.servicesNeeded.includes("photographer")}
                    />
                    <span className="custom-checkbox"></span>
                    Photographer
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="servicesNeeded"
                      value="both"
                      onChange={handleCheckboxChange}
                      className="checkbox-input"
                      checked={formData.servicesNeeded.includes("both")}
                    />
                    <span className="custom-checkbox"></span>
                    Both
                  </label>
                </div>
              </div>
              {/* Wedding Type Dropdown */}
              <div className="form-group custom-select" ref={weddingRef}>
                <label className="select-label">
                  Wedding Type
                  <span className="required-asterisk">*</span>
                </label>
                <div className="select-wrapper">
                  <div
                    className={`select-header ${!isValid ? "error" : ""}`}
                    onClick={() => setWedingType(!weddingType)}
                  >
                    <span className="select-value">
                      {weddingOption || "Select wedding type"}
                    </span>
                    <IoIosArrowDown
                      className={`select-icon ${weddingType ? "open" : ""}`}
                    />
                  </div>
                  {weddingType && (
                    <div className="select-options">
                      {weddingtype.map((item, index) => (
                        <div
                          key={index}
                          className="select-option"
                          onClick={() => handleWeddingSelection(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!isValid && (
                  <div className="error-message">
                    Please select a wedding type
                  </div>
                )}
              </div>
              {/* Referral Dropdown */}
              <div className="form-group custom-select" ref={selectRef}>
                <label className="select-label">
                  How did you hear about us?
                  <span className="required-asterisk">*</span>
                </label>
                <div className="select-wrapper">
                  <div
                    className={`select-header ${!isValid ? "error" : ""}`}
                    onClick={handleOpenSelect}
                  >
                    <span className="select-value">
                      {selectedOption || "Select an option"}
                    </span>
                    <IoIosArrowDown
                      className={`select-icon ${openSelect ? "open" : ""}`}
                    />
                  </div>
                  {openSelect && (
                    <div className="select-options">
                      {selectOptions.map((item, index) => (
                        <div
                          key={index}
                          className="select-option"
                          onClick={() => handleSelectOption(item.option)}
                        >
                          {item.option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!isValid && (
                  <div className="error-message">Please select an option</div>
                )}
              </div>
              {/* Message Field */}
              <div className="form-group floating-label full-width">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-input textarea"
                  rows="4"
                />
                <label className="form-label">Your Message</label>
                <span className="required-asterisk">*</span>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>

            {errorMessage && <div className="form-error">{errorMessage}</div>}
          </form>
        </div>
      </div>

      <div className="contact2-section">
        <ContactSection />
      </div>

      <div className="contact-maps" id="map">
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2482.050124371573!2d-0.3746104233785356!3d51.53064047181858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTHCsDMxJzUwLjMiTiAwwrAyMicxOS4zIlc!5e0!3m2!1sen!2sin!4v1740658248032!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3731.805801551631!2d70.98298267524812!3d20.71810908085459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDQzJzA1LjIiTiA3MMKwNTknMDguMCJF!5e0!3m2!1sen!2sin!4v1740658269472!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
