import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Frontend tarafında basit boş alan kontrolü
    const hasEmptyField = Object.values(formData).some((value) => value.trim() === "");

    if (hasEmptyField) {
      setErrorMessage("Lütfen tüm alanları doldurunuz.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerUser(formData);
      setSuccessMessage(result.message);

      setTimeout(() => {
        navigate("/giris");
      }, 1500);
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      setErrorMessage(backendMessage || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: "480px", marginTop: "60px" }}>
      <h2 className="mb-4">Kullanıcı Kayıt</h2>

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
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="form-text">En az 8 karakter, büyük-küçük harf ve rakam içermelidir.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Parola Tekrar</label>
          <input
            type="password"
            className="form-control"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
          />
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
          {isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
      </form>

      <p className="mt-3 text-center">
        Zaten hesabın var mı? <Link to="/giris">Giriş Yap</Link>
      </p>
    </div>
  );
}