# ⚙️ Admin Q_sopa — Panel de Administración para Restaurante

Panel de gestión completo para restaurantes. Permite administrar el menú, gestionar pedidos con un POS integrado y analizar el rendimiento del negocio a través de un dashboard con métricas de ventas en tiempo real.

🔗 **Demo en vivo:** [admin-q-sopa.vercel.app](https://admin-q-sopa.vercel.app)  
👥 **App del cliente:** [Q_sopa](https://github.com/JhonnyDiaz4753/Q_sopa)

---

## ✨ Funcionalidades

### 🍽 Gestión del menú
- Agregar, editar y eliminar platos
- Gestionar ingredientes por plato
- Organizar platos por categorías
- Los cambios se reflejan en tiempo real en la app del cliente

### 🧾 POS — Punto de Venta
- Registro de pedidos en mesa
- Generación de facturas por pedido
- Flujo completo de cobro

### 📊 Dashboard de ventas
- **Ingresos por categoría** — qué secciones del menú generan más ventas
- **Ventas últimos 7 días** — tendencia semanal
- **Ingresos diarios de la semana** — comparativo día a día
- **Comparativa mensual** — rendimiento mes a mes
- **Resumen últimos 30 días** — vista general del período

---

## 🖼 Capturas de pantalla

| Dashboard | POS | Gestión de menú |
|---|---|---|
| ![dashboard] | ![pos] | ![menu] |
|<img width="1904" height="915" alt="Captura de pantalla 2026-03-17 133820" src="https://github.com/user-attachments/assets/f1d3bbc7-bee0-4bf9-a03d-ddfdfccfaeaf" />| <img width="1915" height="945" alt="Captura de pantalla 2026-03-20 104544" src="https://github.com/user-attachments/assets/dfd68e27-f731-43b5-833b-cb2d0059380a" /> | |
---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Estilos | CSS (diseño propio) |
| Lenguaje | JavaScript (ES6+) |
| Backend | Spring Boot (Java) |
| Base de datos | PostgreSQL |
| BaaS | Supabase |
| Despliegue frontend | Vercel |

---

## 🏗 Arquitectura del sistema

```
┌─────────────────────┐     ┌─────────────────────┐
│   Q_sopa (cliente)  │     │  Admin_Q_sopa (admin)│
│   React + Vite      │     │  React + Vite        │
└────────┬────────────┘     └──────────┬───────────┘
         │                             │
         └──────────┬──────────────────┘
                    ▼
         ┌──────────────────────┐
         │   API REST           │
         │   Spring Boot (Java) │
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │   PostgreSQL         │
         │   Supabase (cloud)   │
         └──────────────────────┘
```

---

## 🚀 Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/JhonnyDiaz4753/Admin_Q_sopa.git
cd Admin_Q_sopa

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con la URL de tu API

# 4. Iniciar en desarrollo
npm run dev
```

> ⚠️ Este panel requiere que el backend en Spring Boot esté corriendo. Ver repositorio de la API para instrucciones.

---

## ⚙️ Variables de entorno

```env
VITE_API_URL=https://tu-api-backend.com
```

---

## 📁 Estructura del proyecto

```
src/
├── components/      # Componentes reutilizables (tablas, cards, formularios)
├── pages/           # Vistas: Dashboard, Menú, POS, Categorías
├── assets/          # Imágenes y recursos
└── App.jsx          # Componente raíz y rutas
```

---

## 👨‍💻 Autor

**Jhonny Díaz** — Ingeniero de Sistemas  
📍 Cali, Colombia  
🔗 [LinkedIn](https://www.linkedin.com/in/jhonny-diaz-centeno-567225378)  
🐙 [GitHub](https://github.com/JhonnyDiaz4753)
