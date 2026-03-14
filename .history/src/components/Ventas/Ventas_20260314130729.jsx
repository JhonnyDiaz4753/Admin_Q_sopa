import { useState, useEffect } from "react";
import "./Ventas.css";
import "../shared/Modal.css";
import Modal from "../shared/Modal";
import { getSales, getSaleById } from "../../services/api";

const PAY_ICONS = { CASH: "payments", CARD: "credit_card", TRANSFER: "account_balance" };
const PAY_LABELS = { CASH: "Efectivo", CARD: "Tarjeta", TRANSFER: "Transferencia" };

export default function Ventas() {
  const [sales,   setSales]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [detail,  setDetail]  = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getSales()
      .then(setSales)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sales.filter(s =>
    String(s.id).includes(search) ||
    PAY_LABELS[s.paymentMethod]?.toLowerCase().includes(search.toLowerCase())
  );

  const openDetail = async (id) => {
    setLoadingDetail(true);
    setDetail({ id });
    try {
      const data = await getSaleById(id);
      setDetail(data);
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = iso => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
  };

  // ── Totales resumen ──
  const totalRevenue = sales.reduce((s, v) => s + Number(v.total  ?? 0), 0);
  const totalTax     = sales.reduce((s, v) => s + Number(v.tax    ?? 0), 0);

  return (
    <>
      <div className="ventas-page">
        {/* Resumen */}
        <div className="ventas-summary">
          <div className="ventas-stat">
            <span className="material-symbols-outlined" style={{ color: "var(--accent)" }}>receipt_long</span>
            <div>
              <span className="ventas-stat-label">Total ventas</span>
              <span className="ventas-stat-value">{sales.length}</span>
            </div>
          </div>
          <div className="ventas-stat">
            <span className="material-symbols-outlined" style={{ color: "#22c55e" }}>payments</span>
            <div>
              <span className="ventas-stat-label">Ingresos</span>
              <span className="ventas-stat-value">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
          <div className="ventas-stat">
            <span className="material-symbols-outlined" style={{ color: "#f59e0b" }}>percent</span>
            <div>
              <span className="ventas-stat-label">IVA recaudado</span>
              <span className="ventas-stat-value">${totalTax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="ventas-toolbar">
          <div className="crud-search" style={{ flex: 1 }}>
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              className="search-input"
              placeholder="Buscar por # orden o método de pago..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="crud-table-wrap">
          <table className="crud-table">
            <thead>
              <tr>
                <th># Orden</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>Cargando...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7}>
                  <div className="table-empty">
                    <span className="material-symbols-outlined">receipt_long</span>
                    <p>Sin ventas registradas</p>
                  </div>
                </td></tr>
              )}
              {!loading && filtered.map(sale => (
                <tr key={sale.id}>
                  <td><span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>#{sale.id}</span></td>
                  <td style={{ color: "var(--text-2)", fontSize: 12.5 }}>{formatDate(sale.date)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--text-3)" }}>
                        {PAY_ICONS[sale.paymentMethod] ?? "payments"}
                      </span>
                      <span>{PAY_LABELS[sale.paymentMethod] ?? sale.paymentMethod}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>${Number(sale.subtotal).toLocaleString()}</td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-2)" }}>${Number(sale.tax).toLocaleString()}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#22c55e" }}>${Number(sale.total).toLocaleString()}</td>
                  <td>
                    <button className="action-btn view" onClick={() => openDetail(sale.id)} title="Ver detalle">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalle */}
      {detail && (
        <Modal title={`Detalle orden #${detail.id}`} onClose={() => setDetail(null)}>
          {loadingDetail ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <span className="spinner" />
            </div>
          ) : (
            <div className="detail-modal">
              <div className="detail-meta">
                <div className="detail-meta-item">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <span>{formatDate(detail.date)}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="material-symbols-outlined">{PAY_ICONS[detail.paymentMethod] ?? "payments"}</span>
                  <span>{PAY_LABELS[detail.paymentMethod] ?? detail.paymentMethod}</span>
                </div>
              </div>

              {detail.items?.length > 0 && (
                <div className="detail-items">
                  <span className="detail-section-title">Productos</span>
                  {detail.items.map((item, i) => (
                    <div key={i} className="detail-item">
                      <div>
                        <span className="detail-item-name">{item.product?.name_products ?? `Producto #${item.product?.id_products}`}</span>
                        <span className="detail-item-qty">× {item.quantity}</span>
                      </div>
                      <span className="detail-item-price">${Number(item.subtotal).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="detail-totals">
                <div className="detail-total-row"><span>Subtotal</span><span>${Number(detail.subtotal).toLocaleString()}</span></div>
                <div className="detail-total-row"><span>IVA (10%)</span><span>${Number(detail.tax).toLocaleString()}</span></div>
                <div className="detail-total-row grand"><span>Total</span><span>${Number(detail.total).toLocaleString()}</span></div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}