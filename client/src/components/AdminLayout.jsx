import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/giris");
  }

  return (
    <div>
      <AdminNavbar />

      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-md-3 col-lg-2 mb-4">
            <div className="admin-sidebar">
              <div className="admin-sidebar-title">Yönetim Paneli</div>
              <nav className="nav flex-column">
                <NavLink to="/panel" end className="admin-sidebar-link">
                  Ana Sayfa
                </NavLink>
                <NavLink to="/panel/etkinlikler" end className="admin-sidebar-link">
                  Etkinlik Yönetimi
                </NavLink>
                <NavLink to="/panel/etkinlikler/form" className="admin-sidebar-link">
                  Yeni Etkinlik
                </NavLink>
                <NavLink to="/panel/profil" end className="admin-sidebar-link">
                  Profil
                </NavLink>
                <NavLink to="/" className="admin-sidebar-link">
                  Ziyaretçi Görünümü
                </NavLink>
              </nav>
              <button
                className="btn btn-outline-danger btn-sm w-100 mt-3"
                onClick={handleLogout}
              >
                Güvenli Çıkış
              </button>
            </div>
          </div>

          <div className="col-md-9 col-lg-10">{children}</div>
        </div>
      </div>
    </div>
  );
}