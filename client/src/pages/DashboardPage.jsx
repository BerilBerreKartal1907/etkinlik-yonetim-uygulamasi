import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getManagementEvents } from "../services/eventService";
import AdminLayout from "../components/AdminLayout";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, upcoming: 0, inactive: 0, thisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const events = await getManagementEvents();
        const now = new Date();

        const total = events.length;
        const upcoming = events.filter(
          (e) => new Date(e.startDate) > now && e.isActive
        ).length;
        const inactive = events.filter((e) => !e.isActive).length;
        const thisMonth = events.filter((e) => {
          const created = new Date(e.createdAt);
          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        }).length;

        setStats({ total, upcoming, inactive, thisMonth });
      } catch (error) {
        // İstatistikler kritik değil, sessizce geç
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <h2>Hoş geldin, {user?.firstName} {user?.lastName}</h2>

      {!isLoading && (
        <div className="row mt-4 mb-2">
          <div className="col-6 col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Toplam Etkinlik</div>
            </div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-value">{stats.upcoming}</div>
              <div className="stat-label">Yaklaşan</div>
            </div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-value">{stats.inactive}</div>
              <div className="stat-label">Pasif</div>
            </div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-value">{stats.thisMonth}</div>
              <div className="stat-label">Bu Ay Eklenen</div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-2">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profil</h5>
              <p className="card-text">Kendi bilgilerini görüntüle ve güncelle.</p>
              <Link to="/panel/profil" className="btn btn-primary">
                Profile Git
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Etkinlik Yönetimi</h5>
              <p className="card-text">Etkinlikleri listele, ekle, düzenle veya sil.</p>
              <Link to="/panel/etkinlikler" className="btn btn-primary">
                Etkinliklere Git
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}