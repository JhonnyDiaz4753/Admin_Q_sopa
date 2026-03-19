import { useState, useEffect, useRef } from "react";
import { login } from "../../services/api";
import "./Login.css";
import { useTheme } from "../../hooks/useTheme";
import logo from "../../assets/logo_Q-spoa.jpg";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const { theme, toggle } = useTheme();
  const [blocked, setBlocked] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (countdown <= 0) {
      if (blocked) {
        setBlocked(false);
        setError(null);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setBlocked(false);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [countdown]);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blocked) return;
    setLoading(true);
    setError(null);
    setRemaining(null);

    try {
      const data = await login(form.username, form.password);

      if (data.token) {
        localStorage.setItem("admin-token", data.token);
        onLogin();
      } else if (data.blocked) {
        setBlocked(true);

        setCountdown((data.minutesRemaining ?? 15) * 60);
        setError(null);
      } else {
        setError(data.error ?? "Credenciales inválidas");
        if (data.attemptsRemaining !== undefined) {
          setRemaining(data.attemptsRemaining);
        }
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <button
        className="theme-toggle"
        onClick={toggle}
        title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
      >
        <span className="material-symbols-outlined">
          {theme === "dark" ? "light_mode" : "dark_mode"}
        </span>
      </button>

      <div className="login-card">
        <div className="login-brand">
          <img
            src={logo}
            alt="Q-SPOA"
            className="login-logo"
            fetchpriority="high"
            loading="eager"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              className="form-input"
              required
              autoFocus
              disabled={blocked}
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              required
              disabled={blocked}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="••••••••"
            />
          </div>
          {/* Error normal con intentos restantes */}
          {error && !blocked && (
            <div className="login-error">
              <span className="material-symbols-outlined">error</span>
              <div>
                <div>{error}</div>
                {remaining !== null && (
                  <div className="login-attempts">
                    {remaining === 1
                      ? "⚠️ Último intento antes del bloqueo"
                      : `${remaining} intento(s) restante(s)`}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Bloqueado */}
          {blocked && (
            <div className="login-blocked">
              <span className="material-symbols-outlined">lock</span>
              <div>
                <div className="login-blocked-title">Cuenta bloqueada</div>
                <div className="login-blocked-sub">
                  Se desbloqueará automáticamente en{" "}
                  {formatCountdown(countdown)}
                </div>
              </div>
            </div>
          )}

          <button className="login-btn" disabled={loading || blocked}>
            {loading ? (
              "Verificando..."
            ) : blocked ? (
              <span className="login-btn-blocked">
                <span className="material-symbols-outlined">lock</span>
                Bloqueado — {formatCountdown(countdown)}
              </span>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
