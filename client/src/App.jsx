import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import EventListPage from "./pages/EventListPage";
import EventDetailPage from "./pages/EventDetailPage";
import CalendarPage from "./pages/CalendarPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import EventManagementPage from "./pages/EventManagementPage";
import EventFormPage from "./pages/EventFormPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Herkese Açık Sayfalar */}
        <Route path="/" element={<EventListPage />} />
        <Route path="/etkinlik/:id" element={<EventDetailPage />} />
        <Route path="/takvim" element={<CalendarPage />} />

        {/* Yönetim Paneli - Giriş Gerektirmeyen */}
        <Route path="/kayit" element={<RegisterPage />} />
        <Route path="/giris" element={<LoginPage />} />

        {/* Yönetim Paneli - Giriş Gerektiren */}
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panel/profil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panel/etkinlikler"
          element={
            <ProtectedRoute>
              <EventManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panel/etkinlikler/form"
          element={
            <ProtectedRoute>
              <EventFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panel/etkinlikler/form/:id"
          element={
            <ProtectedRoute>
              <EventFormPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;