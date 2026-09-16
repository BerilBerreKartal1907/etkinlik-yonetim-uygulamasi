import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventDetail } from "../services/eventService";
import PublicNavbar from "../components/PublicNavbar";

export default function EventDetailPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadEvent() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getEventDetail(id);
        setEvent(data);
      } catch (error) {
        setErrorMessage("Etkinlik bulunamadı.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [id]);

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

  if (isLoading) {
    return (
      <div>
        <PublicNavbar />
        <div className="container-fluid px-4">Yükleniyor...</div>
      </div>
    );
  }

  if (errorMessage || !event) {
    return (
      <div>
        <PublicNavbar />
        <div className="container-fluid px-4">
          <div className="alert alert-danger">{errorMessage || "Etkinlik bulunamadı."}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PublicNavbar />

      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-md-8">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="img-fluid rounded mb-3"
                style={{ height: "260px", width: "100%", objectFit: "cover" }}
              />
            )}

            <h2>{event.title}</h2>
            <p className="text-muted">
              {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
            </p>

            <div
              className="mt-4"
              style={{ overflowWrap: "break-word", hyphens: "auto" }}
              dangerouslySetInnerHTML={{ __html: event.longDescriptionHtml }}
            />
          </div>

          <div className="col-md-4">
            <h5 className="mb-3">Diğer Etkinlikler</h5>

            {event.recentEvents.length === 0 ? (
              <p className="text-muted">Başka etkinlik bulunmuyor.</p>
            ) : (
              <ul className="list-unstyled">
                {event.recentEvents.map((recentEvent) => (
                  <li key={recentEvent.id} className="mb-3">
                    <Link
                      to={`/etkinlik/${recentEvent.id}`}
                      className="text-decoration-none"
                    >
                      <div className="card">
                        {recentEvent.imageUrl && (
                          <img
                            src={recentEvent.imageUrl}
                            className="card-img-top"
                            alt={recentEvent.title}
                            style={{ height: "100px", objectFit: "cover" }}
                          />
                        )}
                        <div className="card-body p-2">
                          <p className="mb-0 small fw-bold">{recentEvent.title}</p>
                          <p className="mb-0 small text-muted">
                            {formatDateTime(recentEvent.startDate)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}