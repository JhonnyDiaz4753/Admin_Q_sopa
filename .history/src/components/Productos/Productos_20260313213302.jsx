import { useState, useEffect } from "react";
import CrudPage from "../shared/CrudPage";
import Modal    from "../shared/Modal";
import "../shared/CrudPage.css";
import "../shared/Modal.css";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from "../../services/api";

const EMPTY = { name_products: "", description: "", price: "", imge_url: "", active: true, category_id: "" };

export default function Productos() {
  const [rows, setRows]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [editId, setEditId]     = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => { setRows(prods); setCategories(cats); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = rows.filter(r =>
    r.name_products?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal("form"); };
  const openEdit = row => {
    setForm({
      name_products: row.name_products ?? "",
      description:   row.description ?? "",
      price:         row.price ?? "",
      imge_url:      row.imge_url ?? "",
      active:        row.active ?? true,
      category_id:   row.category_id ?? "",
    });
    setEditId(row.id_products);
    setModal("form");
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      editId ? await updateProduct(editId, payload) : await createProduct(payload);
      setModal(null);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    await deleteProduct(confirmDel);
    setConfirmDel(null);
    load();
  };

  const getCatName = id => categories.find(c => c.id === id)?.name ?? "—";

  return (
    <>
      <CrudPage title="Productos" onAdd={openAdd} addLabel="Nuevo producto" search={search} onSearch={setSearch}>
        <table className="crud-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>Cargando...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6}>
                <div className="table-empty">
                  <span className="material-symbols-outlined">restaurant_menu</span>
                  <p>Sin productos</p>
                </div>
              </td></tr>
            )}
            {!loading && filtered.map(row => (
              <tr key={row.id_products}>
                <td>
                  {row.imge_url
                    ? <img src={row.imge_url} alt={row.name_products} className="thumb" />
                    : <div className="thumb-placeholder"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>image</span></div>
                  }
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{row.name_products}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.description}</div>
                </td>
                <td style={{ color: "var(--text-2)" }}>{getCatName(row.category_id)}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent)" }}>${row.price?.toLocaleString()}</td>
                <td>
                  {row.active
                    ? <span className="badge-active">● Activo</span>
                    : <span className="badge-inactive">● Inactivo</span>}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="action-btn edit" onClick={() => openEdit(row)} title="Editar">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="action-btn delete" onClick={() => setConfirmDel(row.id_products)} title="Eliminar">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CrudPage>

      {modal === "form" && (
        <Modal title={editId ? "Editar producto" : "Nuevo producto"} onClose={() => setModal(null)}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input className="form-input" required value={form.name_products} onChange={e => setForm(f => ({ ...f, name_products: e.target.value }))} placeholder="Truffle Royale" />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción del producto..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio *</label>
                <input className="form-input" type="number" min="0" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="14500" />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-select" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                  <option value="">Sin categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">URL de imagen</label>
              <input className="form-input" value={form.imge_url} onChange={e => setForm(f => ({ ...f, imge_url: e.target.value }))} placeholder="https://..." />
              {form.imge_url && (
                <img src={form.imge_url} alt="preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginTop: 8, border: "1px solid var(--border)" }} onError={e => e.target.style.display = "none"} />
              )}
            </div>
            <div className="form-toggle">
              <label className="toggle-switch">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                <span className="toggle-slider" />
              </label>
              <span className="toggle-label">{form.active ? "Activo" : "Inactivo"}</span>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Eliminar producto" onClose={() => setConfirmDel(null)}>
          <p style={{ color: "var(--text-2)", marginBottom: 20 }}>¿Seguro que deseas eliminar este producto?</p>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
          </div>
        </Modal>
      )}
    </>
  );
}