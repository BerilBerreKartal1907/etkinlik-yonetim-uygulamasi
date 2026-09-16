import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicNavbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          Etkinlik Yönetimi
        </Link>

        <div className="d-flex align-items-center">
          <Link className="btn btn-outline-light btn-sm me-2" to="/">
            Etkinlikler
          </Link>
          <Link className="btn btn-outline-light btn-sm me-2" to="/takvim">
            Takvim
          </Link>

          {isAuthenticated ? (
            <Link className="btn btn-primary btn-sm" to="/panel">
              Yönetim Paneli
            </Link>
          ) : (
            <Link className="btn btn-primary btn-sm" to="/giris">
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}