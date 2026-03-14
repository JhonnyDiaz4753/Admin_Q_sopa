const BASE = "http://localhost:8080"; 



const req = (url, opts = {}) =>
  fetch(`${BASE}${url}`, { headers: { "Content-Type": "application/json" }, ...opts })
    .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); });

const get  = url        => req(url);
const post = (url, body) => req(url, { method: "POST",   body: JSON.stringify(body) });
const put  = (url, body) => req(url, { method: "PUT",    body: JSON.stringify(body) });
const del  = url        => req(url, { method: "DELETE" });

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