import { useState, useEffect, useCallback } from "react";
import CrudPage from "../shared/CrudPage";
import Modal    from "../shared/Modal";
import "../shared/CrudPage.css";
import "../shared/Modal.css";
import "./Productos.css";
import {
  getProducts, getCategories, createProduct, updateProduct, deleteProduct,
  getIngredientsList, getProductIngredients, addProductIngredient, removeProductIngredient,
} from "../../services/api";
import { toast } from "react-toastify";

const EMPTY = { name: "", description: "", price: "", imageUrl: "", active: true, categoryId: "" };
const TABS  = ["general", "ingredientes"];

export default function Productos() {
  const [rows, setRows]             = useState([]);
  const [categories, setCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [editId, setEditId]         = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [activeTab, setActiveTab]   = useState("general");

  // Ingredientes del producto que se está editando
  const [prodIngredients, setProdIngredients]     = useState([]);
  const [loadingIngr, setLoadingIngr]             = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [addingIngr, setAddingIngr]               = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getProducts(), getCategories(), getIngredientsList()])
      .then(([prods, cats, ingrs]) => {
        setRows(prods);
        setCategories(cats);
        setAllIngredients(ingrs);
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const loadProdIngredients = useCallback(async (prodId) => {
    setLoadingIngr(true);
    console.log('[Ingredientes] Cargando ingredientes del producto id:', prodId);
    try {
      const data = await getProductIngredients(prodId);
      console.log('[Ingredientes] Respuesta cruda de la API:', data);
      setProdIngredients(Array.isArray(data) ? data : []);
    } catch(err) {
      console.error('[Ingredientes] Error al cargar:', err);
      setProdIngredients([]);
    } finally {
      setLoadingIngr(false);
    }
  }, []);

  const filtered = rows.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setProdIngredients([]);
    setSelectedIngredientId("");
    setActiveTab("general");
    setModal("form");
  };

  const openEdit = row => {
    setForm({
      name:        row.name        ?? "",
      description: row.description ?? "",
      price:       row.price       ?? "",
      imageUrl:    row.imageUrl    ?? "",
      active:      row.active      ?? true,
      categoryId:  row.category?.id ?? "",
    });
    setEditId(row.id);
    setSelectedIngredientId("");
    setActiveTab("general");
    setModal("form");
    loadProdIngredients(row.id);
  };

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

 const handleSave = async e => {
  e.preventDefault();
  setSaving(true);
  try {
    const payload = {
      name:        form.name,
      description: form.description,
      price:       Number(form.price),
      imageUrl:    form.imageUrl,
      active:      form.active,
      category: form.categoryId ? { id: Number(form.categoryId) } : null,
    };

    if (editId) {
      // Editar → cierra el modal como antes
      await updateProduct(editId, payload);
      setModal(null);
      load();
      toast.success("Producto actualizado con éxito");
    } else {
      // Crear → pasa al tab de ingredientes con el producto recién creado
      const created = await createProduct(payload);
      load();
      toast.success("Producto creado. Ahora asigna sus ingredientes");
      setEditId(created.id);
      setProdIngredients([]);
      setSelectedIngredientId("");
      setActiveTab("ingredientes");
    }
  } catch(err) {
    toast.error("Error al guardar el producto: " + err.message);
  } finally { setSaving(false); }
};

  const handleDelete = async () => {
    await deleteProduct(confirmDel);
    setConfirmDel(null);
    load();
    toast.success("Producto eliminado con éxito");
  };

  const handleAddIngredient = async () => {
    if (!selectedIngredientId) return;
    const alreadyAdded = prodIngredients.some(i => String(i.id) === String(selectedIngredientId));
    if (alreadyAdded) {
      toast.warning("Este ingrediente ya está asociado al producto");
      return;
    }
    setAddingIngr(true);
 
const ingredientId = Number(selectedIngredientId);
console.log('[Ingredientes] Añadiendo ingrediente — productoId:', editId, '| ingredientId:', ingredientId);
try {
  const res = await addProductIngredient(editId, ingredientId);
      console.log('[Ingredientes] Respuesta al añadir:', res);
      await loadProdIngredients(editId);
      setSelectedIngredientId("");
      toast.success("Ingrediente añadido");
    } catch(err) {
      console.error('[Ingredientes] Error al añadir:', err);
      toast.error("Error al añadir ingrediente: " + err.message);
    } finally { setAddingIngr(false); }
  };

  const handleRemoveIngredient = async (ingrId) => {
    console.log('[Ingredientes] Eliminando ingrediente — productoId:', editId, '| ingredienteId:', ingrId);
    try {
      await removeProductIngredient(editId, ingrId);
      setProdIngredients(prev => prev.filter(i => i.id !== ingrId));
      toast.success("Ingrediente eliminado");
    } catch(err) {
      console.error('[Ingredientes] Error al eliminar:', err);
      toast.error("Error al quitar ingrediente: " + err.message);
    }
  };

  // Ingredientes disponibles = todos menos los ya asociados
  const availableIngredients = allIngredients.filter(
    i => !prodIngredients.some(pi => pi.id === i.id)
  );

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
              <tr key={row.id}>
                <td>
                  {row.imageUrl
                    ? <img src={row.imageUrl} alt={row.name} className="thumb" loading="lazy" />
                    : <div className="thumb-placeholder"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>image</span></div>
                  }
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{row.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {row.description}
                  </div>
                </td>
                <td style={{ color: "var(--text-2)" }}>{row.category?.name ?? "—"}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent)" }}>
                  ${row.price?.toLocaleString()}
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
        <Modal title={editId ? "Editar producto" : "Nuevo producto"} onClose={() => setModal(null)}>
          {/* Tabs — solo visibles al editar */}
          {editId && (
            <div className="prod-tabs">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`prod-tab ${activeTab === tab ? "prod-tab--active" : ""}`}
                  onClick={() => handleTabChange(tab)}
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    {tab === "general" ? "info" : "grocery"}
                  </span>
                  {tab === "general" ? "General" : "Ingredientes"}
                  {tab === "ingredientes" && prodIngredients.length > 0 && (
                    <span className="prod-tab-badge">{prodIngredients.length}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── TAB GENERAL ── */}
          {activeTab === "general" && (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-input" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Truffle Royale" />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-textarea" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción del producto..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio *</label>
                  <input className="form-input" type="number" min="0" required
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="14500" />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" value={form.categoryId}
                    onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                    <option value="">Sin categoría</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URL de imagen</label>
                <input className="form-input" value={form.imageUrl}
                  onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..." />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="preview"
                    style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginTop: 8, border: "1px solid var(--border)" }}
                    onError={e => e.target.style.display = "none"} />
                )}
              </div>
              <div className="form-toggle">
                <label className="toggle-switch">
                  <input type="checkbox" checked={form.active}
                    onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                  <span className="toggle-slider" />
                </label>
                <span className="toggle-label">{form.active ? "Activo" : "Inactivo"}</span>
              </div>
              {!editId && (
                <div className="prod-info-hint">
                  <span className="material-symbols-outlined">info</span>
                  Podrás añadir ingredientes después de guardar el producto.
                </div>
              )}
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          )}

          {/* ── TAB INGREDIENTES ── */}
          {activeTab === "ingredientes" && (
            <div className="ingr-tab">
              {/* Selector para añadir */}
              <div className="ingr-add-row">
                <select
                  className="form-select"
                  value={selectedIngredientId}
                  onChange={e => setSelectedIngredientId(e.target.value)}
                  disabled={addingIngr}
                >
                  <option value="">Seleccionar ingrediente...</option>
                  {availableIngredients.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-primary ingr-add-btn"
                  onClick={handleAddIngredient}
                  disabled={!selectedIngredientId || addingIngr}
                >
                  <span className="material-symbols-outlined">add</span>
                  {addingIngr ? "Añadiendo..." : "Añadir"}
                </button>
              </div>

              {/* Lista de ingredientes actuales */}
              {loadingIngr ? (
                <div className="ingr-loading">
                  <span className="material-symbols-outlined ingr-loading-icon">hourglass_top</span>
                  Cargando ingredientes...
                </div>
              ) : prodIngredients.length === 0 ? (
                <div className="ingr-empty">
                  <span className="material-symbols-outlined">grocery</span>
                  <p>Sin ingredientes asociados</p>
                  <span>Usa el selector de arriba para añadir</span>
                </div>
              ) : (
                <ul className="ingr-list">
                  {prodIngredients.map(ingr => (
                    <li key={ingr.id} className="ingr-item">
                      <div className="ingr-info">
                        <span className="material-symbols-outlined ingr-icon">grocery</span>
                        <div>
                          <div className="ingr-name">{ingr.name}</div>
                          {ingr.description && (
                            <div className="ingr-desc">{ingr.description}</div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="action-btn delete"
                        title="Quitar ingrediente"
                        onClick={() => handleRemoveIngredient(ingr.id)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cerrar</button>
              </div>
            </div>
          )}
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