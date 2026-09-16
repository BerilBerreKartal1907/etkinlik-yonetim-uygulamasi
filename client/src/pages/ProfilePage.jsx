import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/authService";
import AdminLayout from "../components/AdminLayout";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile(user.userId);

        setFormData({
          email: profile.email,
          // Form gereksinimine göre parola diğer alanlar gibi
          // her zaman gerçek değeriyle dolu geliyor.
          newPassword: profile.password,
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthDate: profile.birthDate.split("T")[0],
        });
      } catch (error) {
        setErrorMessage("Profil bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user.userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Frontend tarafında boş alan kontrolü
    const hasEmptyField = Object.values(formData).some((value) => value.trim() === "");

    if (hasEmptyField) {
      setErrorMessage("Lütfen tüm alanları doldurunuz.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId: user.userId,
        email: formData.email,
        newPassword: formData.newPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
      };

      const result = await updateProfile(payload);
      setSuccessMessage(result.message);

      updateUser({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      setErrorMessage(backendMessage || "Güncelleme sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
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
      <div style={{ maxWidth: "480px" }}>
        <h2 className="mb-4">Profil</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Mail Adresi</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Parola</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <div className="form-text">En az 8 karakter, büyük-küçük harf ve rakam içermelidir.</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Ad</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Soyad</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Doğum Tarihi</label>
            <input
              type="date"
              className="form-control"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Bilgileri Güncelle"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}