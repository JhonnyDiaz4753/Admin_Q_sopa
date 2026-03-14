import { useState, useEffect } from "react";
import CrudPage from "../shared/CrudPage";
import Modal    from "../shared/Modal";
import "../shared/CrudPage.css";
import "../shared/Modal.css";
import { getIngredientsList, createIngredient, updateIngredient, deleteIngredient } from "../../services/api";

// Campos reales de la API: id, name, description, active
const EMPTY = { name: "", description: "", active: true };

export default function Ingredientes() {
  const [rows, setRows]       = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [editId, setEditId]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = () => {
    setLoading(true);
    getIngredientsList().then(setRows).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = rows.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal("form"); };

  const openEdit = row => {
    setForm({
      name:        row.name        ?? "",
      description: row.description ?? "",
      active:      row.active      ?? true,
    });
    setEditId(row.id);
    setModal("form");
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      editId
        ? await updateIngredient(editId, form)
        : await createIngredient(form);
      setModal(null);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    await deleteIngredient(confirmDel);
    setConfirmDel(null);
    load();
  };

  return (
    <>
      <CrudPage title="Ingredientes" onAdd={openAdd} addLabel="Nuevo ingrediente" search={search} onSearch={setSearch}>
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>Cargando...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4}>
                <div className="table-empty">
                  <span className="material-symbols-outlined">grocery</span>
                  <p>Sin ingredientes</p>
                </div>
              </td></tr>
            )}
            {!loading && filtered.map(row => (
              <tr key={row.id}>
                <td style={{ fontWeight: 500 }}>{row.name}</td>
                <td style={{ color: "var(--text-2)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {row.description || "—"}
                </td>
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

      {modal === "form" && (
        <Modal title={editId ? "Editar ingrediente" : "Nuevo ingrediente"} onClose={() => setModal(null)}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input className="form-input" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Pan brioche" />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descripción del ingrediente..." />
            </div>
            <div className="form-toggle">
              <label className="toggle-switch">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                <span className="toggle-slider" />
              </label>
              <span className="toggle-label">{form.active ? "Activo" : "Inactivo"}</span>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Eliminar ingrediente" onClose={() => setConfirmDel(null)}>
          <p style={{ color: "var(--text-2)", marginBottom: 20 }}>¿Seguro que deseas eliminar este ingrediente?</p>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
          </div>
        </Modal>
      )}
    </>
  );
}