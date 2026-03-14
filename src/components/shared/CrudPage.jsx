import "./CrudPage.css";

export default function CrudPage({ title, onAdd, addLabel = "Agregar", children, search, onSearch }) {
  return (
    <div className="crud-page">
      <div className="crud-toolbar">
        <div className="crud-search">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            className="search-input"
            placeholder={`Buscar ${title.toLowerCase()}...`}
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary crud-add-btn" onClick={onAdd}>
          <span className="material-symbols-outlined">add</span>
          {addLabel}
        </button>
      </div>
      <div className="crud-table-wrap">{children}</div>
    </div>
  );
}