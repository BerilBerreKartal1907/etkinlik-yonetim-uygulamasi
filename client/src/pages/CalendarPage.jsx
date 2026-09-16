import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getPublicEvents } from "../services/eventService";
import PublicNavbar from "../components/PublicNavbar";

export default function CalendarPage() {
  const navigate = useNavigate();

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getPublicEvents();

        const mapped = data.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
        }));

        setCalendarEvents(mapped);
      } catch (error) {
        setErrorMessage("Etkinlikler yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  function handleEventClick(clickInfo) {
    navigate(`/etkinlik/${clickInfo.event.id}`);
  }

  function formatTime(date) {
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }

  function renderEventContent(eventInfo) {
    const start = eventInfo.event.start;
    const end = eventInfo.event.end;

    return (
      <div className="px-1">
        <div className="fw-semibold small">{eventInfo.event.title}</div>
        {start && end && (
          <div className="small" style={{ opacity: 0.85 }}>
            {formatTime(start)} - {formatTime(end)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <PublicNavbar />

      <div className="container-fluid px-4">
        <h2 className="mb-4">Takvim</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
            <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            eventDisplay="block"
            locale="tr"
            height="auto"
            buttonText={{ today: "Bugün" }}
          />
        )}
      </div>
    </div>
  );
}