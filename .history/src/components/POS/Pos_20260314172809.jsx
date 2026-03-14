import { useState, useEffect } from "react";
import "./POS.css";
import { getProducts, getCategories, createSale } from "../../services/api";

const TAX_RATE = 0.10;

const PAYMENT_METHODS = [
  { key: "CASH",     label: "Efectivo",      icon: "payments"       },
  { key: "CARD",     label: "Tarjeta",       icon: "credit_card"    },
  { key: "TRANSFER", label: "Transferencia", icon: "account_balance" },
];

export default function POS() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart,       setCart]       = useState([]);
  const [search,     setSearch]     = useState("");
  const [activeCat,  setActiveCat]  = useState("all");
  const [payment,    setPayment]    = useState("CASH");
  const [received,   setReceived]   = useState("");
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [receipt,    setReceipt]    = useState(null);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => { setProducts(prods); setCategories(cats); })
      .finally(() => setLoading(false));
  }, []);

  // ── Filtrado ──────────────────────────────────────────────
  const filtered = products.filter(p => {
    const matchCat  = activeCat === "all" || String(p.category?.id) === String(activeCat);
    const matchName = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchName && p.active !== false;
  });

  // ── Carrito ───────────────────────────────────────────────
  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => {
      const next = prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i);
      return next.filter(i => i.qty > 0);
    });
  };

  const removeFromCart = id => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  // ── Totales ───────────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = subtotal * TAX_RATE;
  const total    = subtotal + tax;
  const change   = payment === "CASH" && received ? Math.max(0, Number(received) - total) : 0;

  // ── Finalizar venta ───────────────────────────────────────
  const handleCheckout = async () => {
    if (!cart.length) return;
    setSaving(true);
    try {
      const saleData = {
        paymentMethod: payment,
        items: cart.map(i => ({ productId: i.id, quantity: i.qty })),
      };
      const sale = await createSale(saleData);
      setReceipt({ ...sale, cartSnapshot: cart, subtotal, tax, total, payment, received: Number(received), change });
      clearCart();
      setReceived("");
    } catch (e) {
      alert("Error al registrar la venta: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Montos rápidos ────────────────────────────────────────
  const quickAmounts = [...new Set([
    Math.ceil(total / 5000)  * 5000,
    Math.ceil(total / 10000) * 10000,
    Math.ceil(total / 20000) * 20000,
  ])].filter(v => v >= total).slice(0, 3);

  if (receipt) return <Receipt receipt={receipt} onNew={() => setReceipt(null)} />;

  return (
    <div className="pos-shell">
      {/* ── LEFT: productos ── */}
      <div className="pos-left">
        <div className="pos-search-bar">
          <span className="material-symbols-outlined">search</span>
          <input placeholder="Buscar producto..." value={search}
            onChange={e => setSearch(e.target.value)} className="pos-search-input" />
          {search && (
            <button className="pos-search-clear" onClick={() => setSearch("")}>
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Categorías */}
        <div className="pos-cats">
          <button className={`pos-cat-btn ${activeCat === "all" ? "active" : ""}`} onClick={() => setActiveCat("all")}>
            <span className="material-symbols-outlined">grid_view</span>
            Todos
          </button>
          {categories.map(c => (
            <button key={c.id}
              className={`pos-cat-btn ${String(activeCat) === String(c.id) ? "active" : ""}`}
              onClick={() => setActiveCat(c.id)}>
              <span className="material-symbols-outlined">{c.icon || "category"}</span>
              {c.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="pos-loading"><span className="spinner" /></div>
        ) : (
          <div className="pos-grid">
            {filtered.length === 0 && (
              <div className="pos-empty">
                <span className="material-symbols-outlined">search_off</span>
                <p>Sin productos</p>
              </div>
            )}
            {filtered.map(p => {
              const inCart = cart.find(i => i.id === p.id);
              return (
                <button key={p.id} className={`pos-product-card ${inCart ? "in-cart" : ""}`} onClick={() => addToCart(p)}>
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} className="pos-product-img" loading="lazy"/>
                    : <div className="pos-product-img-placeholder">
                        <span className="material-symbols-outlined">restaurant</span>
                      </div>
                  }
                  {inCart && <span className="pos-cart-badge">{inCart.qty}</span>}
                  <div className="pos-product-info">
                    <span className="pos-product-name">{p.name}</span>
                    <span className="pos-product-price">${p.price?.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── RIGHT: carrito ── */}
      <div className="pos-right">
        <div className="pos-cart-header">
          <h3>Orden actual</h3>
          {cart.length > 0 && (
            <button className="pos-clear-btn" onClick={clearCart}>
              <span className="material-symbols-outlined">delete_sweep</span>
            </button>
          )}
        </div>

        <div className="pos-cart-items">
          {cart.length === 0 && (
            <div className="pos-cart-empty">
              <span className="material-symbols-outlined">shopping_cart</span>
              <p>Toca un producto para agregar</p>
            </div>
          )}
          {cart.map(item => (
            <div key={item.id} className="pos-cart-item">
              <div className="pos-cart-item-info">
                <span className="pos-cart-item-name">{item.name}</span>
                <span className="pos-cart-item-price">${(item.price * item.qty).toLocaleString()}</span>
              </div>
              <div className="pos-cart-item-controls">
                <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                <span className="qty-value">{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
                <button className="qty-btn remove" onClick={() => removeFromCart(item.id)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pos-totals">
          <div className="pos-total-row"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
          <div className="pos-total-row"><span>IVA (10%)</span><span>${tax.toFixed(0)}</span></div>
          <div className="pos-total-row total"><span>Total</span><span>${total.toLocaleString()}</span></div>
        </div>

        <div className="pos-payment-methods">
          {PAYMENT_METHODS.map(m => (
            <button key={m.key} className={`pos-pay-btn ${payment === m.key ? "active" : ""}`} onClick={() => setPayment(m.key)}>
              <span className="material-symbols-outlined">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {payment === "CASH" && (
          <div className="pos-cash-section">
            <label className="pos-cash-label">Monto recibido</label>
            <input type="number" className="pos-cash-input" value={received}
              onChange={e => setReceived(e.target.value)} placeholder="0" />
            <div className="pos-quick-amounts">
              {quickAmounts.map(a => (
                <button key={a} className="pos-quick-btn" onClick={() => setReceived(String(a))}>
                  ${a.toLocaleString()}
                </button>
              ))}
            </div>
            {received && Number(received) >= total && (
              <div className="pos-change">
                <span>Cambio</span>
                <span className="pos-change-amount">${change.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        <button className="pos-checkout-btn" onClick={handleCheckout}
          disabled={!cart.length || saving || (payment === "CASH" && received && Number(received) < total)}>
          {saving ? "Procesando..." : (
            <><span className="material-symbols-outlined">check_circle</span> Finalizar venta</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Recibo ────────────────────────────────────────────────────────────────────
function Receipt({ receipt, onNew }) {
  const date = new Date().toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
  return (
    <div className="receipt-wrapper">
      <div className="receipt">
        <div className="receipt-header">
          <span className="material-symbols-outlined receipt-icon">receipt_long</span>
          <h2>Venta registrada</h2>
          <p className="receipt-date">{date}</p>
          <p className="receipt-id">Orden #{receipt.id}</p>
        </div>
        <div className="receipt-items">
          {receipt.cartSnapshot.map((item, i) => (
            <div key={i} className="receipt-item">
              <span>{item.name} × {item.qty}</span>
              <span>${(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="receipt-totals">
          <div className="receipt-row"><span>Subtotal</span><span>${receipt.subtotal.toLocaleString()}</span></div>
          <div className="receipt-row"><span>IVA (10%)</span><span>${receipt.tax.toFixed(0)}</span></div>
          <div className="receipt-row total"><span>Total</span><span>${receipt.total.toLocaleString()}</span></div>
          {receipt.payment === "CASH" && receipt.received > 0 && (
            <div className="receipt-row change"><span>Cambio</span><span>${receipt.change.toLocaleString()}</span></div>
          )}
        </div>
        <div className="receipt-payment">
          <span className="material-symbols-outlined">
            {receipt.payment === "CASH" ? "payments" : receipt.payment === "CARD" ? "credit_card" : "account_balance"}
          </span>
          <span>{receipt.payment === "CASH" ? "Efectivo" : receipt.payment === "CARD" ? "Tarjeta" : "Transferencia"}</span>
        </div>
        <button className="pos-checkout-btn" onClick={onNew} style={{ marginTop: 20 }}>
          <span className="material-symbols-outlined">add_circle</span>
          Nueva venta
        </button>
      </div>
    </div>
  );
}