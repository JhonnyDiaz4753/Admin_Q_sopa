import { useState } from "react";
import { login } from "../../services/api";
import "./Login.css";
import { useTheme } from "../../hooks/useTheme";
import logo from "../../assets/logo_Q-spoa.jpg";
export default function Login({ onLogin }) {
  const [form,  setForm]  = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
  <button className="theme-toggle" onClick={toggle} title={theme === "dark" ? "Modo claro" : "Modo oscuro"}>
    <span className="material-symbols-outlined">
      {theme === "dark" ? "light_mode" : "dark_mode"}
    </span>
  </button>

  <div className="login-card">
    <div className="login-brand">
      <img src={logo} alt="Q-SPOA" className="login-logo" />
    </div>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Usuario</label>
        <input className="form-input" required
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          placeholder="admin" />
      </div>
      <div className="form-group">
        <label className="form-label">Contraseña</label>
        <input className="form-input" type="password" required
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          placeholder="••••••••" />
      </div>
      {error && <p className="login-error">{error}</p>}
      <button className="btn btn-primary login-btn" disabled={loading}>
        {loading ? "Verificando..." : "Ingresar"}
      </button>
    </form>
  </div>
</div>
  );
}