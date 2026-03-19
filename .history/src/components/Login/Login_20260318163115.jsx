import { useState } from "react";
import { login } from "../../services/api";
import { useTheme } from "../../hooks/useTheme";
import "./Login.css";
import logo from "../../assets/logo_Q-spoa.jpg";

 
export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, toggle } = useTheme();
 
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(form.username, form.password);
      if (data.token) {
        localStorage.setItem("admin-token", data.token);
        onLogin();
      } else {
        setError(data.error ?? "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="login-wrapper">
 
      {/* ── Theme toggle ── */}
      <button
        className="theme-toggle"
        onClick={toggle}
        title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
        type="button"
      >
        {theme === "dark" ? (
  <img src={logo} alt="logo" className="sidebar-logo" />
        ) : (
  <img src={logo} alt="logo" className="sidebar-logo" />
        )}
      </button>
 
      <div className="login-card">
 
        {/* ── Header ── */}
        <div className="login-header">
          <div className="login-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19ZM5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5ZM21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39ZM14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63C15.32 5.85 16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46Z"/>
            </svg>
          </div>
          <h1 className="login-brand"> Q SOPA POS</h1>
          <p className="login-subtitle">Iniciar sesión como administrador</p>
        </div>
 
        <form onSubmit={handleSubmit} className="login-form">
 
          {/* Username */}
          <div className="form-group">
            <label>NOMBRE DE USUARIO DE ADMINISTRADOR</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Introduzca su nombre de usuario"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
              />
            </div>
          </div>
 
          {/* Password */}
          <div className="form-group">
            <div className="form-group-header">
              <label>CLAVE DE SEGURIDAD</label>
              
            </div>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
 
          {error && <div className="login-error">{error}</div>}
 
          <button className="login-btn" disabled={loading}>
            {loading ? "Verificando..." : <><span>Acceder</span><span className="btn-arrow">→</span></>}
          </button>
        </form>
 
        {/* Footer */}
        <div className="login-footer">
          <a href="#" className="footer-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            SUPPORT
          </a>
          <a href="#" className="footer-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            SECURITY POLICY
          </a>
        </div>
      </div>
 
      {/* System status */}
      <div className="system-status">
        <span className="status-dot"></span>
        SYSTEM STATUS: OPERATIONAL
      </div>
    </div>
  );
}