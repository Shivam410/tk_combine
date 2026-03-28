import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./Offers.scss";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const normalizeOffer = (offer = {}) => ({
  id: offer?._id || offer?.id || "",
  serviceId:
    offer?.serviceId ||
    offer?.service?._id ||
    (typeof offer?.service === "string" ? offer.service : ""),
  serviceName: offer?.serviceName || offer?.service?.serviceName || "",
  serviceSlug: offer?.serviceSlug || offer?.service?.slug || "",
  title: offer?.offerTitle || offer?.title || offer?.name || "",
  description: offer?.offerDescription || offer?.description || offer?.details || "",
  price: offer?.offerPrice ?? offer?.price ?? offer?.finalPrice ?? "",
  isActive: offer?.isActive ?? offer?.active ?? true,
  createdAt: offer?.createdAt || null,
});

const endpointCandidates = {
  list: [`${apiBaseUrl}/offers`, `${apiBaseUrl}/special-offers`],
  create: [`${apiBaseUrl}/offers/new`, `${apiBaseUrl}/offers`, `${apiBaseUrl}/special-offers/new`, `${apiBaseUrl}/special-offers`],
  update: (id) => [`${apiBaseUrl}/offers/${id}`, `${apiBaseUrl}/special-offers/${id}`],
  remove: (id) => [`${apiBaseUrl}/offers/${id}`, `${apiBaseUrl}/special-offers/${id}`],
};

const attemptRequest = async (requestConfigs = []) => {
  let lastError;
  for (const config of requestConfigs) {
    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404 || status === 405) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }
  throw lastError || new Error("No matching offer endpoint found");
};

const emptyForm = {
  serviceId: "",
  offerTitle: "",
  offerDescription: "",
  offerPrice: "",
  isActive: true,
};

const Offers = () => {
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [formState, setFormState] = useState(emptyForm);

  const selectedService = useMemo(
    () => services.find((service) => service._id === formState.serviceId),
    [services, formState.serviceId]
  );

  const loadServices = async () => {
    const { data } = await axios.get(`${apiBaseUrl}/services`);
    setServices(data?.services || []);
  };

  const loadOffers = async () => {
    const response = await attemptRequest(
      endpointCandidates.list.map((url) => ({ method: "get", url }))
    );
    const rawOffers =
      response?.data?.offers ||
      response?.data?.specialOffers ||
      response?.data?.data ||
      response?.data?.results ||
      [];
    setOffers(Array.isArray(rawOffers) ? rawOffers.map(normalizeOffer) : []);
  };

  const bootstrap = async () => {
    try {
      setLoading(true);
      await Promise.all([loadServices(), loadOffers()]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const resetForm = () => {
    setFormState(emptyForm);
    setEditingOfferId(null);
  };

  const onChangeField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formState.serviceId) {
      toast.error("Please select a service");
      return false;
    }
    if (!formState.offerTitle.trim()) {
      toast.error("Offer title is required");
      return false;
    }
    if (!formState.offerDescription.trim()) {
      toast.error("Offer description is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = {
      serviceId: selectedService?._id || formState.serviceId,
      serviceName: selectedService?.serviceName || "",
      serviceSlug: selectedService?.slug || "",
      offerTitle: formState.offerTitle.trim(),
      offerDescription: formState.offerDescription.trim(),
      isActive: Boolean(formState.isActive),
    };

    if (String(formState.offerPrice).trim() !== "") {
      payload.offerPrice = String(formState.offerPrice).trim();
    }

    try {
      setSaving(true);
      if (editingOfferId) {
        await attemptRequest(
          endpointCandidates.update(editingOfferId).map((url) => ({
            method: "put",
            url,
            data: payload,
          }))
        );
        toast.success("Offer updated successfully");
      } else {
        await attemptRequest(
          endpointCandidates.create.map((url) => ({
            method: "post",
            url,
            data: payload,
          }))
        );
        toast.success("Offer created successfully");
      }

      resetForm();
      await loadOffers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingOfferId(offer.id);
    setFormState({
      serviceId: offer.serviceId || "",
      offerTitle: offer.title || "",
      offerDescription: offer.description || "",
      offerPrice: offer.price ?? "",
      isActive: Boolean(offer.isActive),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (offerId) => {
    const confirmed = window.confirm("Are you sure you want to delete this offer?");
    if (!confirmed) return;

    try {
      setDeletingId(offerId);
      await attemptRequest(
        endpointCandidates.remove(offerId).map((url) => ({
          method: "delete",
          url,
        }))
      );
      setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
      if (editingOfferId === offerId) {
        resetForm();
      }
      toast.success("Offer deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete offer");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="offers-page">
      <div className="offers-page-top">
        <h1>Special Offers</h1>
      </div>

      <div className="offers-form-card">
        <h2>{editingOfferId ? "Update Offer" : "Create Offer"}</h2>
        <form className="offers-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Service</label>
            <select
              value={formState.serviceId}
              onChange={(event) => onChangeField("serviceId", event.target.value)}
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Offer Title</label>
            <input
              type="text"
              value={formState.offerTitle}
              onChange={(event) => onChangeField("offerTitle", event.target.value)}
              placeholder="e.g. Festive Wedding Combo"
            />
          </div>

          <div className="form-field">
            <label>Offer Description</label>
            <textarea
              rows={4}
              value={formState.offerDescription}
              onChange={(event) => onChangeField("offerDescription", event.target.value)}
              placeholder="Write offer details and inclusions..."
            />
          </div>

          <div className="form-field">
            <label>Offer Price (Optional)</label>
            <input
              type="text"
              value={formState.offerPrice}
              onChange={(event) => onChangeField("offerPrice", event.target.value)}
              placeholder="e.g. 24999"
            />
          </div>

          <div className="form-checkbox">
            <input
              id="offer-active"
              type="checkbox"
              checked={Boolean(formState.isActive)}
              onChange={(event) => onChangeField("isActive", event.target.checked)}
            />
            <label htmlFor="offer-active">Active Offer</label>
          </div>

          <div className="offers-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingOfferId ? "Update Offer" : "Create Offer"}
            </button>
            {editingOfferId && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="offers-table-wrap">
        {loading ? (
          <p className="table-state">Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="table-state">No offers added yet.</p>
        ) : (
          <table className="offers-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => (
                <tr key={offer.id || `${offer.title}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{offer.serviceName || "-"}</td>
                  <td>{offer.title || "-"}</td>
                  <td>{offer.description || "-"}</td>
                  <td>{offer.price !== "" && offer.price !== null ? `Rs. ${offer.price}` : "-"}</td>
                  <td>
                    <span className={`status-badge ${offer.isActive ? "active" : "inactive"}`}>
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="update-btn" onClick={() => handleEdit(offer)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        disabled={deletingId === offer.id}
                        onClick={() => handleDelete(offer.id)}
                      >
                        {deletingId === offer.id ? "Deleting..." : "Delete"}
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

export default Offers;
