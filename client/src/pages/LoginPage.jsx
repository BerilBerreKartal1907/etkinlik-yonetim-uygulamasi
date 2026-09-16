import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, getProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (formData.email.trim() === "" || formData.password.trim() === "") {
      setErrorMessage("Mail adresi ve parola alanları zorunludur.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginUser(formData);

      // Backend sadece userId döndürüyor; ad-soyad bilgisini
      // hemen ardından profil endpoint'inden çekip context'e ekliyoruz.
      const profile = await getProfile(result.userId);

      login({
        userId: result.userId,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });

      navigate("/panel");
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      setErrorMessage(backendMessage || "Giriş sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: "480px", marginTop: "60px" }}>
      <h2 className="mb-4">Giriş Yap</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

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
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <p className="mt-3 text-center">
        Hesabın yok mu? <Link to="/kayit">Kayıt Ol</Link>
      </p>
    </div>
  );
}