import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/panel">
          Etkinlik Yönetimi - Panel
        </Link>
      </div>
    </nav>
  );
}