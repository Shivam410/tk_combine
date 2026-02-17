import "./ServiceIndex.scss";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../main";

const ServiceIndex = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseUrl}/services`);
      setServices(data?.services || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this service?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      let data;
      try {
        const response = await axios.delete(`${baseUrl}/services/${id}`);
        data = response.data;
      } catch (primaryError) {
        if (primaryError?.response?.status !== 404) {
          throw primaryError;
        }
        // Backward-compatible fallback for older route patterns.
        const fallbackResponse = await axios.delete(`${baseUrl}/services/by-id/${id}`);
        data = fallbackResponse.data;
      }
      toast.success(data?.message || "Service deleted successfully");
      setServices((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="service-index">
      <div className="service-index-top">
        <h1>Services</h1>
        <Link to="/services/new" className="add-service-btn">
          + Add Service
        </Link>
      </div>

      <div className="service-index-table-wrap">
        {loading ? (
          <p className="table-state">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="table-state">No services found.</p>
        ) : (
          <table className="service-index-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Service Name</th>
                <th>Slug</th>
                <th>Images</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service._id}>
                  <td>{index + 1}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.slug}</td>
                  <td>{service.images?.length || 0}</td>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="view-btn"
                        onClick={() => navigate(`/services/view/${service._id}`)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="update-btn"
                        onClick={() => navigate(`/services/${service._id}`)}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(service._id)}
                        disabled={deletingId === service._id}
                      >
                        {deletingId === service._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ServiceIndex;
