import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./theme.css";
import AdminLayout  from "./components/AdminLayout";
import Dashboard    from "./components/Dashboard/Dashboard";
import Categorias   from "./components/Categorias/Categorias";
import Productos    from "./components/Productos/Productos";
import Ingredientes from "./components/Ingredientes/Ingredientes";
import POS          from "./components/POS/POS";
import Ventas       from "./components/Ventas/Ventas";
import Login        from "./components/Login/Login";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();

  // Verifica si ya hay token guardado al cargar la app
  const [auth, setAuth] = useState(
    () => !!localStorage.getItem("admin-token")
  );

  const handleLogin = () => setAuth(true);

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setAuth(false);
  };

  // Si no está autenticado → pantalla de login
  if (!auth) {
    return (
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme={theme}
        />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // Si está autenticado → app completa
  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme={theme}
      />
      <Routes>
        <Route element={<AdminLayout onLogout={handleLogout} />}>
          <Route index               element={<Dashboard />}    />
          <Route path="pos"          element={<POS />}          />
          <Route path="productos"    element={<Productos />}    />
          <Route path="categorias"   element={<Categorias />}   />
          <Route path="ingredientes" element={<Ingredientes />} />
          <Route path="ventas"       element={<Ventas />}       />
        </Route>
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  );
}

export default App;