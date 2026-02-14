import "./Getintouch.scss";
import overlay1 from "../../assets/images/overlay1.png";
import ContactSection from "../ContactSection/ContactSection";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../main";

const Getintouch = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${baseUrl}/contact/submit-contact`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="getintouch">
      <div className="getintouch-overlay-wrapper">
        <div className="getintouch-overlay">
          <img src={overlay1} alt="Overlay" loading="lazy" />
        </div>
      </div>

      <div className="getintouch-content">
        <h1>Get In Touch</h1>
        <p>Contact us for a great photography session & beautiful captured moments</p>

        <form className="getintouch-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="text" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
          </div>
          <div className="form-group">
            <textarea name="message" placeholder="Your Message" rows="5" required value={formData.message} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Sending..." : "Send Mail"}
          </button>
        </form>
      </div>

      <div className="contact-getintouch">
        <ContactSection />
      </div>
    </div>
  );
};

export default Getintouch;
