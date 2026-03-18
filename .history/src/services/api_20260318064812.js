const BASE = "https://api-q-sp.onrender.com"; 



const req = (url, opts = {}) =>
  fetch(`${BASE}${url}`, { headers: { "Content-Type": "application/json" }, ...opts })
    .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); });

// Intenta parsear JSON solo si hay contenido
const parseResponse = async r => {
  if (!r.ok) throw new Error(r.statusText);
  const text = await r.text();
  return text ? JSON.parse(text) : true;
};
 
const get  = url         => fetch(`${BASE}${url}`).then(parseResponse);
const post = (url, body) => fetch(`${BASE}${url}`, { method: "POST",   headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(parseResponse);
const put  = (url, body) => fetch(`${BASE}${url}`, { method: "PUT",    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(parseResponse);
const del  = url         => fetch(`${BASE}${url}`, { method: "DELETE" }).then(parseResponse);
 
// ── Categorías ──────────────────────────────────────────────
export const getCategories    = ()       => get("/categories");
export const createCategory   = data     => post("/categories", data);
export const updateCategory   = (id, d)  => put(`/categories/${id}`, d);
export const deleteCategory   = id       => del(`/categories/${id}`);

// ── Productos ───────────────────────────────────────────────
// Campos DB: id_products, name_products, imge_url, category_id
export const getProducts           = ()       => get("/products");
export const getProductsByCategory = id       => get(`/products/category/${id}`);
export const createProduct         = data     => post("/products", data);
export const updateProduct         = (id, d)  => put(`/products/${id}`, d);
export const deleteProduct         = id       => del(`/products/${id}`);
export const getProductById        = id       => get(`/products/${id}`);

// ── Ingredientes (globales) ─────────────────────────────────
// Campos DB: id_ingredients, name_ingredients
export const getIngredientsList  = ()        => get("/ingredients");
export const createIngredient    = data      => post("/ingredients", data);
export const updateIngredient    = (id, d)   => put(`/ingredients/${id}`, d);
export const deleteIngredient    = id        => del(`/ingredients/${id}`);

// ── Ingredientes por producto ───────────────────────────────
export const getProductIngredients    = prodId       => get(`/products/${prodId}/ingredients`);
export const addProductIngredient     = (prodId, d)  => post(`/products/${prodId}/ingredients`, d);
export const removeProductIngredient  = (prodId, id) => del(`/products/${prodId}/ingredients/${id}`);

// ── Ventas ──────────────────────────────────────────────────
export const getSales      = ()    => get("/api/sales");
export const getSaleById   = id    => get(`/api/sales/${id}`);
export const createSale    = data  => post("/api/sales", data);

// ── Dashboard ───────────────────────────────────────────────
export const getDashboardStats = () => get("/api/dashboard/stats");
export const getWeeklyData        = () => get("/api/dashboard/weekly");
export const getMonthComparison   = () => get("/api/dashboard/comparison");
export const getRevenueByCategory = () => get("/api/dashboard/by-category");