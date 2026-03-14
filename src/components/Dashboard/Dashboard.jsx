import "./Dashboard.css";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/api";

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + "18", color }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><span className="spinner" /></div>;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard icon="receipt_long" label="Total ventas"   value={stats?.totalSales ?? 0}           color="#ec1313" />
        <StatCard icon="payments"     label="Ingresos"       value={`$${stats?.totalRevenue ?? "0.00"}`} color="#22c55e" />
        <StatCard icon="percent"      label="Impuestos"      value={`$${stats?.totalTax ?? "0.00"}`}    color="#f59e0b" />
        <StatCard icon="trending_up"  label="Productos top"  value={stats?.topProducts?.length ?? 0}    color="#3b82f6" />
      </div>

      {/* Top productos */}
      {stats?.topProducts?.length > 0 && (
        <div className="top-products-card">
          <h3 className="card-title">Productos más vendidos</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p, i) => (
                <tr key={i}>
                  <td><span className="rank">#{i + 1}</span></td>
                  <td>{p.name}</td>
                  <td>{p.quantitySold}</td>
                  <td className="revenue">${p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!stats && (
        <div className="empty-state">
          <span className="material-symbols-outlined">bar_chart</span>
          <p>Sin datos aún. Registra tu primera venta en el POS.</p>
        </div>
      )}
    </div>
  );
}