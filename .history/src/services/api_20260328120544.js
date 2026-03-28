const BASE = "https://api-node-qsopa.vercel.app";

const getToken = () => localStorage.getItem("admin-token");

// ── Un solo sistema de fetch que siempre envía el token ──────
const req = async (url, opts = {}) => {
  const res = await fetch(`${BASE}${url}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      ...opts.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("admin-token");
    window.location.href = "/";
    throw new Error("No autorizado");
  }

  if (!res.ok) throw new Error(res.statusText);

  const text = await res.text();
  if (!text || text.trim() === "") return null;
  try { return JSON.parse(text); } catch { return null; }
};

const get  = url         => req(url);
const post = (url, body) => req(url, { method: "POST",   body: JSON.stringify(body) });
const put  = (url, body) => req(url, { method: "PUT",    body: JSON.stringify(body) });
const del  = url         => req(url, { method: "DELETE" });

// ── Auth (sin token) ─────────────────────────────────────────
export const login = (username, password) =>
  fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then(r => r.json());

// ── Categorías ───────────────────────────────────────────────
export const getCategories  = ()      => get("/categories");
export const createCategory = data    => post("/categories", data);
export const updateCategory = (id, d) => put(`/categories/${id}`, d);
export const deleteCategory = id      => del(`/categories/${id}`);

// ── Productos ────────────────────────────────────────────────
export const getProducts           = ()      => get("/products");
export const getProductsByCategory = id      => get(`/products/category/${id}`);
export const createProduct         = data    => post("/products", data);
export const updateProduct         = (id, d) => put(`/products/${id}`, d);
export const deleteProduct         = id      => del(`/products/${id}`);
export const getProductById        = id      => get(`/products/${id}`);

// ── Ingredientes globales ────────────────────────────────────
export const getIngredientsList = ()      => get("/ingredients");
export const createIngredient   = data    => post("/ingredients", data);
export const updateIngredient   = (id, d) => put(`/ingredients/${id}`, d);
export const deleteIngredient   = id      => del(`/ingredients/${id}`);

// ── Ingredientes por producto ────────────────────────────────
export const getProductIngredients   = prodId      => get(`/products/${prodId}/ingredients`);
export const addProductIngredient    = (prodId, ingredientId) => post(`/products/${prodId}/ingredients/${ingredientId}`, {});
export const removeProductIngredient = (prodId, id)=> del(`/products/${prodId}/ingredients/${id}`);

// ── Ventas ───────────────────────────────────────────────────
export const getSales    = ()    => get("/api/sales");
export const getSaleById = id    => get(`/api/sales/${id}`);
export const createSale  = data  => post("/api/sales", data);

// ── Dashboard ────────────────────────────────────────────────
export const getDashboardStats    = () => get("/api/dashboard/stats");
export const getWeeklyData        = () => get("/api/dashboard/weekly");
export const getMonthComparison   = () => get("/api/dashboard/comparison");
export const getRevenueByCategory = () => get("/api/dashboard/by-category");