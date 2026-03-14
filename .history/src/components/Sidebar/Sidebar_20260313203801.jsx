import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../assets/hero.png"; // ajusta la ruta a tu logo

const NAV = [
  { to: "/",           icon: "dashboard",       label: "Dashboard"   },
  { to: "/pos",        icon: "point_of_sale",   label: "POS / Caja"  },
  { to: "/productos",  icon: "restaurant_menu", label: "Productos"   },
  { to: "/categorias", icon: "category",        label: "Categorías"  },
  { to: "/ingredientes",icon:"grocery",         label: "Ingredientes"},
  { to: "/ventas",     icon: "receipt_long",    label: "Historial"   },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src={logo} alt="logo" className="sidebar-logo" />
          {!collapsed && <span className="sidebar-name">Q-SP Admin</span>}
        </div>
        <button className="sidebar-toggle" onClick={onToggle} aria-label="toggle sidebar">
          <span className="material-symbols-outlined">
            {collapsed ? "menu_open" : "menu"}
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            title={collapsed ? item.label : ""}
          >
            <span className="material-symbols-outlined nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {!collapsed && <span className="nav-indicator" />}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!collapsed && <span className="sidebar-version">v1.0.0</span>}
      </div>
    </aside>
  );
}