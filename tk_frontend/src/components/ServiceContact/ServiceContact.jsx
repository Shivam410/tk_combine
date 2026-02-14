import "./ServiceContact.scss";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../main";

const ServiceContact = () => {
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
      const response = await axios.post(
        `${baseUrl}/contact/submit-contact`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

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
    <div className="serviceContact">
      <div className="serviceContact-left">
        <div className="serviceContact-left-top">
          <h1>Get In Touch</h1>
          <p className="serviceContact-left-desc">
            Contact us for a great photography session & beautiful captured
            moments
          </p>
        </div>

        <div className="serviceContact-left-desc">
          <p>Call Us For Query</p>
          <p>+447884537171</p>
          <span>
              <a
                href="https://wa.me/447884537171"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                Call Now
              </a>
            </span>
          <p className="s2-no">+919725621316</p>
          <span>
              <a
                href="https://wa.me/919725621316"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                Call Now
              </a>
            </span>
        </div>

        <div className="serviceContact-left-desc">
          <p>SEND US EMAIL</p>
          <p>Support@tkproductionfilm.com</p>
        </div>
      </div>

      <div className="serviceContact-right">
        <form className="serviceContact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Sending..." : "Send Mail"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceContact;
