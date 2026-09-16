import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "../context/AuthContext";
import { getEventDetail, saveEvent, deleteEvent, uploadImage } from "../services/eventService";
import AdminLayout from "../components/AdminLayout";

export default function EventFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescriptionHtml: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadEvent() {
      try {
        const data = await getEventDetail(id);

        setFormData({
          title: data.title,
          shortDescription: data.shortDescription ?? "",
          longDescriptionHtml: data.longDescriptionHtml,
          imageUrl: data.imageUrl ?? "",
          startDate: data.startDate.slice(0, 16),
          endDate: data.endDate.slice(0, 16),
          isActive: true,
        });
      } catch (error) {
        setErrorMessage("Etkinlik bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [id, isEditMode]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleLongDescriptionChange(value) {
    setFormData((prev) => ({ ...prev, longDescriptionHtml: value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage("");

    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      setErrorMessage(backendMessage || "Resim yüklenirken bir hata oluştu.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

        if (formData.title.trim() === "") {
      setErrorMessage("Etkinlik başlığı zorunludur.");
      return;
    }

    if (formData.startDate === "") {
      setErrorMessage("Başlangıç tarihi ve zamanı zorunludur.");
      return;
    }

    if (formData.endDate === "") {
      setErrorMessage("Bitiş tarihi ve zamanı zorunludur.");
      return;
    }

    if (formData.shortDescription.trim() === "") {
      setErrorMessage("Kısa açıklama zorunludur.");
      return;
    }

    if (formData.longDescriptionHtml.trim() === "" || formData.longDescriptionHtml === "<p><br></p>") {
      setErrorMessage("Uzun açıklama zorunludur.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        id: isEditMode ? Number(id) : null,
        title: formData.title,
        shortDescription: formData.shortDescription,
        longDescriptionHtml: formData.longDescriptionHtml,
        imageUrl: formData.imageUrl || null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        createdByUserId: user.userId,
      };

      await saveEvent(payload);
      navigate("/panel/etkinlikler");
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      setErrorMessage(backendMessage || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Bu etkinliği silmek istediğinize emin misiniz?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(id);
      navigate("/panel/etkinlikler");
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      setErrorMessage(backendMessage || "Silme sırasında bir hata oluştu.");
    }
  }

  function handleCancel() {
    navigate("/panel/etkinlikler");
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <p>Yükleniyor...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: "700px" }}>
        <h2 className="mb-4">{isEditMode ? "Etkinlik Düzenle" : "Yeni Etkinlik"}</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Etkinlik Başlığı</label>
            <input
              type="text"
              className="form-control"
              name="title"
              maxLength={255}
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Başlangıç Tarihi ve Zamanı</label>
            <input
              type="datetime-local"
              className="form-control"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Bitiş Tarihi ve Zamanı</label>
            <input
              type="datetime-local"
              className="form-control"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Etkinlik Resmi (jpg, jpeg, png - max 2MB)</label>
            <input
              type="file"
              className="form-control"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
            />
            {isUploadingImage && <div className="form-text">Resim yükleniyor...</div>}
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Önizleme"
                style={{ maxWidth: "200px", marginTop: "10px", display: "block" }}
              />
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Kısa Açıklama</label>
            <textarea
              className="form-control"
              name="shortDescription"
              maxLength={512}
              rows={3}
              value={formData.shortDescription}
              onChange={handleChange}
            />
            <div className="form-text">{formData.shortDescription.length} / 512 karakter</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Uzun Açıklama</label>
            <ReactQuill
              theme="snow"
              value={formData.longDescriptionHtml}
              onChange={handleLongDescriptionChange}
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isActive">
              Aktif
            </label>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>

            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              İptal
            </button>

            {isEditMode && (
              <button type="button" className="btn btn-danger ms-auto" onClick={handleDelete}>
                Sil
              </button>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}