import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import "./AdminLayout.css";

const TITLES = {
  "/":            "Dashboard",
  "/pos":         "POS / Caja",
  "/productos":   "Productos",
  "/categorias":  "Categorías",
  "/ingredientes":"Ingredientes",
  "/ventas":      "Historial de ventas",
};

export default function AdminLayout() {
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "Admin";

  return (
    <div className="admin-shell">
      {/* Overlay móvil */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
      />

      <div className={`admin-main ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar
          title={title}
          onMobileMenu={() => setMobileOpen(o => !o)}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}