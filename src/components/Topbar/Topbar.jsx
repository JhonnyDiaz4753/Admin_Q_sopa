import "./Topbar.css";
import { useTheme } from "../../hooks/useTheme";

export default function Topbar({ title, onMobileMenu }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="topbar">
      {/* Mobile menu btn */}
      <button className="topbar-menu-btn" onClick={onMobileMenu} aria-label="menu">
        <span className="material-symbols-outlined">menu</span>
      </button>

      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-actions">
        {/* Theme toggle */}
        <button className="topbar-btn" onClick={toggle} title={theme === "dark" ? "Modo claro" : "Modo oscuro"}>
          <span className="material-symbols-outlined">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Notifications placeholder */}
        <button className="topbar-btn" title="Notificaciones">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}