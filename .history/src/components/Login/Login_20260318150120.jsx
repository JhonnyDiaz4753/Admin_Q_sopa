export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      <div className="login-card">

        <div className="login-header">
          <div className="login-brand">Q-SP</div>
          <p className="login-subtitle">Panel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar"}
          </button>

        </form>
      </div>
    </div>
  );
}