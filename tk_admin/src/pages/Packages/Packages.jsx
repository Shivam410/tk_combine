import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../main";
import "./Packages.scss";

const emptyForm = {
  title: "",
  priceText: "",
  order: 0,
  descriptionBlocksText: "",
  includesText: "",
};

const toLines = (value) =>
  String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const isEditing = Boolean(editingId);

  const sortedPackages = useMemo(() => {
    const copy = Array.isArray(packages) ? [...packages] : [];
    copy.sort((a, b) => {
      const orderA = Number(a?.order ?? 0);
      const orderB = Number(b?.order ?? 0);
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
    });
    return copy;
  }, [packages]);

  const loadPackages = async () => {
    const { data } = await axios.get(`${baseUrl}/packages`);
    setPackages(data?.packages || []);
  };

  const bootstrap = async () => {
    try {
      setLoading(true);
      await loadPackages();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const onChangeField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormState(emptyForm);
    setImageFile(null);
    setImagePreview("");
  };

  const validateForm = () => {
    if (!formState.title.trim()) {
      toast.error("Package title is required");
      return false;
    }
    return true;
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("title", formState.title.trim());
    formData.append("priceText", formState.priceText.trim());
    formData.append("order", String(formState.order ?? 0));

    toLines(formState.descriptionBlocksText).forEach((line) =>
      formData.append("descriptionBlocks", line)
    );
    toLines(formState.includesText).forEach((line) =>
      formData.append("includes", line)
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const formData = buildFormData();

      if (isEditing) {
        const { data } = await axios.put(`${baseUrl}/packages/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(data?.message || "Package updated");
      } else {
        const { data } = await axios.post(`${baseUrl}/packages`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(data?.message || "Package created");
      }

      await loadPackages();
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save package");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg?._id || "");
    setFormState({
      title: pkg?.title || "",
      priceText: pkg?.priceText || "",
      order: pkg?.order ?? 0,
      descriptionBlocksText: Array.isArray(pkg?.descriptionBlocks)
        ? pkg.descriptionBlocks.join("\n")
        : "",
      includesText: Array.isArray(pkg?.includes) ? pkg.includes.join("\n") : "",
    });
    setImageFile(null);
    setImagePreview(pkg?.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm("Delete this package?");
    if (!ok) return;

    try {
      setDeletingId(id);
      const { data } = await axios.delete(`${baseUrl}/packages/${id}`);
      toast.success(data?.message || "Package deleted");
      setPackages((prev) => prev.filter((pkg) => pkg?._id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete package");
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="packages-page">
      <div className="packages-page-top">
        <h1>Packages</h1>
      </div>

      <div className="packages-form-card">
        <h2>{isEditing ? "Update Package" : "Create Package"}</h2>
        <form className="packages-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Title</label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) => onChangeField("title", e.target.value)}
                placeholder="e.g. Silver Wedding Package"
              />
            </div>

            <div className="form-field">
              <label>Price Text</label>
              <input
                type="text"
                value={formState.priceText}
                onChange={(e) => onChangeField("priceText", e.target.value)}
                placeholder="e.g. Starts at Rs. 49,999"
              />
            </div>

            <div className="form-field">
              <label>Order</label>
              <input
                type="number"
                value={formState.order}
                onChange={(e) => onChangeField("order", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Description Blocks (one per line)</label>
            <textarea
              rows={4}
              value={formState.descriptionBlocksText}
              onChange={(e) => onChangeField("descriptionBlocksText", e.target.value)}
              placeholder={"A short intro line\nAnother highlight line"}
            />
          </div>

          <div className="form-field">
            <label>Includes (one per line)</label>
            <textarea
              rows={4}
              value={formState.includesText}
              onChange={(e) => onChangeField("includesText", e.target.value)}
              placeholder={"2 Photographers\n1 Cinematographer\nAlbum + Raw Data"}
            />
          </div>

          <div className="form-field">
            <label>Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Package preview" />
              </div>
            ) : null}
          </div>

          <div className="packages-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Update Package" : "Create Package"}
            </button>
            {isEditing && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="packages-table-wrap">
        {loading ? (
          <p className="table-state">Loading packages...</p>
        ) : sortedPackages.length === 0 ? (
          <p className="table-state">No packages added yet.</p>
        ) : (
          <table className="packages-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Order</th>
                <th>Price</th>
                <th>Blocks</th>
                <th>Includes</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPackages.map((pkg, index) => (
                <tr key={pkg?._id || `${pkg?.title}-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    {pkg?.image ? (
                      <img className="thumb" src={pkg.image} alt={pkg?.title || "Package"} />
                    ) : (
                      <span className="muted">-</span>
                    )}
                  </td>
                  <td>{pkg?.title || "-"}</td>
                  <td>{pkg?.order ?? 0}</td>
                  <td>{pkg?.priceText ? pkg.priceText : "-"}</td>
                  <td>{Array.isArray(pkg?.descriptionBlocks) ? pkg.descriptionBlocks.length : 0}</td>
                  <td>{Array.isArray(pkg?.includes) ? pkg.includes.length : 0}</td>
                  <td>{pkg?.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="update-btn" onClick={() => handleEdit(pkg)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        disabled={deletingId === pkg?._id}
                        onClick={() => handleDelete(pkg?._id)}
                      >
                        {deletingId === pkg?._id ? "Deleting..." : "Delete"}
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

export default Packages;

