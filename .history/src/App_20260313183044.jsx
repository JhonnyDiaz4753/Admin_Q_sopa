import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./theme.css";
import AdminLayout from "./components/AdminLayout";
import Dashboard   from "./components/Dashboard/Dashboard";
import heroImg from './assets/hero.png'
import './App.css'


const Placeholder = ({ name }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", height: "40vh", gap: 12,
    color: "var(--text-3)"
  }}>
    <span className="material-symbols-outlined" style={{ fontSize: 48 }}>construction</span>
    <p style={{ fontSize: 15 }}>{name} — próximamente</p>
  </div>
);
function App() {
 
  return (
      <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index                   element={<Dashboard />} />
          <Route path="pos"              element={<Placeholder name="POS / Caja" />} />
          <Route path="productos"        element={<Placeholder name="Productos" />} />
          <Route path="categorias"       element={<Placeholder name="Categorías" />} />
          <Route path="ingredientes"     element={<Placeholder name="Ingredientes" />} />
          <Route path="ventas"           element={<Placeholder name="Historial de ventas" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
   
}

export default App
