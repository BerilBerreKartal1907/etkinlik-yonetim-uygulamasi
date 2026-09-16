import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicEvents } from "../services/eventService";
import PublicNavbar from "../components/PublicNavbar";

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getPublicEvents();
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

  function getDayMonth(value) {
    const date = new Date(value);
    const day = date.toLocaleDateString("tr-TR", { day: "2-digit" });
    const month = date.toLocaleDateString("tr-TR", { month: "short" }).replace(".", "");
    return { day, month };
  }

  return (
    <div>
      <PublicNavbar />

      <div className="container-fluid px-4">
                <div className="page-header">
          <div className="page-header-icon">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
            >
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M3 9h18" />
              <path d="M8 2v4M16 2v4" />
              <path d="M8 13l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="page-header-title">Etkinlik Yönetimi</h2>
            <p className="page-header-subtitle">
              Kayıtlı tüm etkinlikleri buradan takip edebilir, detaylarını inceleyebilirsiniz.
            </p>
          </div>
        </div>

        <h5 className="mb-3">Yaklaşan Etkinlikler</h5>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : events.length === 0 ? (
          <p>Henüz yaklaşan bir etkinlik yok.</p>
        ) : (
          <div className="row">
            {events.map((event) => {
              const { day, month } = getDayMonth(event.startDate);

              return (
                <div className="col-md-4 mb-4" key={event.id}>
                  <div className="card h-100">
                    {event.imageUrl && (
                      <div className="event-card-image-wrap">
                        <img
                          src={event.imageUrl}
                          className="card-img-top"
                          alt={event.title}
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <div className="event-date-badge">
                          <span className="day">{day}</span>
                          <span className="month">{month}</span>
                        </div>
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="card-text">{event.shortDescription}</p>
                      <p className="text-muted small">
                        {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
                      </p>
                      <Link to={`/etkinlik/${event.id}`} className="btn btn-primary mt-auto">
                        Detayları Gör
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}