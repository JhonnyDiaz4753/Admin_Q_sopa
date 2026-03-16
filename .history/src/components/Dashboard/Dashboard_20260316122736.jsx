import "./Dashboard.css";
import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { getDashboardStats, getWeeklyData, getMonthComparison, getRevenueByCategory } from "../../services/api";

// ── Colores para la torta ─────────────────────────────────────
const PIE_COLORS = ["#ec1313", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#06b6d4"];

// ── Tooltip personalizado ─────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = "$" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "10px 14px", fontSize: 13,
    }}>
      <p style={{ color: "var(--text-2)", marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {prefix}{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + "18", color }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, loading }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
      </div>
      {loading
        ? <div className="chart-loading"><span className="spinner" /></div>
        : children
      }
    </div>
  );
}

export default function Dashboard() {
  const [stats,      setStats]      = useState(null);
  const [weekly,     setWeekly]     = useState([]);
  const [comparison, setComparison] = useState(null);
  const [byCategory, setByCategory] = useState([]);
  const [loading,    setLoading]    = useState({ stats: true, weekly: true, comparison: true, category: true });

  const setDone = key => setLoading(l => ({ ...l, [key]: false }));

  useEffect(() => {
    getDashboardStats()
      .then(setStats).catch(() => {}).finally(() => setDone("stats"));
    getWeeklyData()
      .then(setWeekly).catch(() => {}).finally(() => setDone("weekly"));
    getMonthComparison()
      .then(setComparison).catch(() => {}).finally(() => setDone("comparison"));
    getRevenueByCategory()
      .then(setByCategory).catch(() => {}).finally(() => setDone("category"));
  }, []);

  const revChange = comparison?.revenueChange ?? 0;
  const revSign   = revChange >= 0 ? "+" : "";
  const revColor  = revChange >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div className="dashboard">

      {/* ── Stats cards ── */}
      <div className="stats-grid">
        <StatCard icon="receipt_long" label="Ventas totales"
          value={stats?.totalSales ?? "—"} color="#ec1313"
          sub={`${comparison?.thisCount ?? 0} este mes`} />
        <StatCard icon="payments" label="Ingresos totales"
          value={`$${Number(stats?.totalRevenue ?? 0).toLocaleString()}`} color="#22c55e"
          sub={comparison ? `${revSign}${revChange}% vs mes anterior` : null} />
        <StatCard icon="percent" label="IVA recaudado"
          value={`$${Number(stats?.totalTax ?? 0).toLocaleString()}`} color="#f59e0b" />
        <StatCard icon="trending_up" label="Productos top"
          value={stats?.topProducts?.length ?? "—"} color="#3b82f6" />
      </div>

      {/* ── Fila 1: línea semanal + torta categorías ── */}
      <div className="charts-row">

        {/* Ventas últimos 7 días */}
        <ChartCard
          title="Ventas últimos 7 días"
          subtitle="Ingresos diarios de la semana"
          loading={loading.weekly}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weekly} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "var(--text-3)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-3)", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={45} />
              <Tooltip content={<CustomTooltip prefix="$" />} />
              <Line type="monotone" dataKey="total" name="Ingresos"
                stroke="#ec1313" strokeWidth={2.5} dot={{ r: 4, fill: "#ec1313", strokeWidth: 0 }}
                activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="count" name="Ventas"
                stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span style={{ color: "#ec1313" }}>● Ingresos</span>
            <span style={{ color: "#3b82f6" }}>● N° ventas</span>
          </div>
        </ChartCard>

        {/* Ingresos por categoría */}
        <ChartCard
          title="Ingresos por categoría"
          subtitle="Últimos 30 días"
          loading={loading.category}
        >
          {byCategory.length === 0
            ? <div className="chart-empty"><span className="material-symbols-outlined">pie_chart</span><p>Sin datos aún</p></div>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={80} innerRadius={45}
                    paddingAngle={3}>
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, "Ingresos"]}
                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }} />
                  <Legend iconType="circle" iconSize={8}
                    formatter={v => <span style={{ color: "var(--text-2)", fontSize: 12 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </ChartCard>
      </div>

      {/* ── Fila 2: comparativa meses ── */}
      <ChartCard
        title="Comparativa mensual"
        subtitle={comparison ? `${comparison.thisMonth} vs ${comparison.prevMonth}` : ""}
        loading={loading.comparison}
      >
        {!comparison
          ? <div className="chart-empty"><span className="material-symbols-outlined">bar_chart</span><p>Sin datos</p></div>
          : (
            <div className="comparison-layout">
              {/* Barras comparativas */}
              <ResponsiveContainer width="60%" height={180}>
                <BarChart
                  data={[
                    { name: comparison.prevMonth, ventas: comparison.prevCount, ingresos: Number(comparison.prevTotal) },
                    { name: comparison.thisMonth, ventas: comparison.thisCount, ingresos: Number(comparison.thisTotal) },
                  ]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--text-3)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-3)", fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={45} />
                  <Tooltip content={<CustomTooltip prefix="$" />} />
                  <Bar dataKey="ingresos" name="Ingresos" fill="#ec1313" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  <Bar dataKey="ventas"   name="N° ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>

              {/* Métricas rápidas */}
              <div className="comparison-metrics">
                <div className="metric-item">
                  <span className="metric-label">Este mes</span>
                  <span className="metric-value">${Number(comparison.thisTotal).toLocaleString()}</span>
                  <span className="metric-count">{comparison.thisCount} ventas</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-item">
                  <span className="metric-label">Mes anterior</span>
                  <span className="metric-value">${Number(comparison.prevTotal).toLocaleString()}</span>
                  <span className="metric-count">{comparison.prevCount} ventas</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-item">
                  <span className="metric-label">Variación</span>
                  <span className="metric-value" style={{ color: revColor }}>
                    {revSign}{revChange}%
                  </span>
                  <span className="metric-count" style={{ color: revColor }}>
                    {revChange >= 0 ? "↑ subió" : "↓ bajó"}
                  </span>
                </div>
              </div>
            </div>
          )
        }
      </ChartCard>

      {/* ── Top productos ── */}
      {stats?.topProducts?.length > 0 && (
        <div className="top-products-card">
          <h3 className="card-title">Productos más vendidos</h3>
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Producto</th><th>Cantidad</th><th>Ingresos</th></tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p, i) => (
                <tr key={i}>
                  <td><span className="rank">#{i + 1}</span></td>
                  <td>{p.name}</td>
                  <td>{p.quantitySold}</td>
                  <td className="revenue">${Number(p.revenue).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}