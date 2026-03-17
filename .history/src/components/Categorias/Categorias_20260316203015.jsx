import { useState, useEffect } from "react";
import CrudPage from "../shared/CrudPage";
import Modal    from "../shared/Modal";
import "../shared/CrudPage.css";
import "../shared/Modal.css";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/api";
import { toast } from 'react-toastify';

const EMPTY = { name: "", description: "", icon: "", active: true };

export default function Categorias() {
  const [rows, setRows]       = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | "add" | "edit"
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [editId, setEditId]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = () => {
    setLoading(true);
    getCategories().then(setRows).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = rows.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal("form"); };
  const openEdit = row => {
    setForm({ name: row.name ?? "", description: row.description ?? "", icon: row.icon ?? "", active: row.active ?? true });
    setEditId(row.id);
    setModal("form");
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      editId ? await updateCategory(editId, form) : await createCategory(form);
      setModal(null);
      load();
      toast.success(`Categoría ${editId ? "actualizada" : "creada"} con éxito`);
    } finally {
       setSaving(false); 
      toast.error(`Error al ${editId ? "actualizar" : "crear"} la categoría`);
    }
  };

  const handleDelete = async () => {
    await deleteCategory(confirmDel);
    setConfirmDel(null);
    load();
    toast.success("Categoría eliminada con éxito");
  };

  return (
    <>
      <CrudPage title="Categorías" onAdd={openAdd} addLabel="Nueva categoría" search={search} onSearch={setSearch}>
        <table className="crud-table">
          <thead>
            <tr>
              <th>Icono</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>Cargando...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5}>
                <div className="table-empty">
                  <span className="material-symbols-outlined">category</span>
                  <p>Sin categorías</p>
                </div>
              </td></tr>
            )}
            {!loading && filtered.map(row => (
              <tr key={row.id}>
                <td>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-element)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--accent)" }}>{row.icon || "category"}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{row.name}</td>
                <td style={{ color: "var(--text-2)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.description ?? "—"}</td>
                <td>
                  {row.active
                    ? <span className="badge-active">● Activa</span>
                    : <span className="badge-inactive">● Inactiva</span>}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="action-btn edit" onClick={() => openEdit(row)} title="Editar">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="action-btn delete" onClick={() => setConfirmDel(row.id)} title="Eliminar">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CrudPage>

      {/* Form modal */}
      {modal === "form" && (
        <Modal title={editId ? "Editar categoría" : "Nueva categoría"} onClose={() => setModal(null)}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Hamburguesas" />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción de la categoría..." />
            </div>
            <div className="form-group">
              <label className="form-label">Icono (Material Symbols)</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="lunch_dining" />
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--bg-element)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--accent)" }}>{form.icon || "category"}</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>Busca iconos en fonts.google.com/icons</span>
            </div>
            <div className="form-toggle">
              <label className="toggle-switch">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                <span className="toggle-slider" />
              </label>
              <span className="toggle-label">{form.active ? "Activa" : "Inactiva"}</span>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm delete */}
      {confirmDel && (
        <Modal title="Eliminar categoría" onClose={() => setConfirmDel(null)}>
          <p style={{ color: "var(--text-2)", marginBottom: 20 }}>¿Seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer.</p>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
          </div>
        </Modal>
      )}
    </>
  );
}