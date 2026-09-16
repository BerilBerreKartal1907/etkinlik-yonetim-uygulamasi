import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getManagementEvents } from "../services/eventService";
import AdminLayout from "../components/AdminLayout";

export default function EventManagementPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getManagementEvents();
        setEvents(data);
      } catch (error) {
        setErrorMessage("Etkinlikler yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  function formatDateTime(value) {
    const date = new Date(value);
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Etkinlik Yönetimi</h2>
        <Link to="/panel/etkinlikler/form" className="btn btn-success">
          + Yeni Etkinlik
        </Link>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : events.length === 0 ? (
        <p>Henüz kayıtlı etkinlik yok.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Ekleyen</th>
              <th>Kayıt Zamanı</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} style={{ cursor: "pointer" }}>
                <td>
                  <Link
                    to={`/panel/etkinlikler/form/${event.id}`}
                    className="text-decoration-none"
                  >
                    {event.title}
                  </Link>
                </td>
                <td>{formatDateTime(event.startDate)}</td>
                <td>{formatDateTime(event.endDate)}</td>
                <td>{event.createdByUserFullName}</td>
                <td>{formatDateTime(event.createdAt)}</td>
                <td>
                  {event.isActive ? (
                    <span className="badge bg-success">Aktif</span>
                  ) : (
                    <span className="badge bg-secondary">Pasif</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}