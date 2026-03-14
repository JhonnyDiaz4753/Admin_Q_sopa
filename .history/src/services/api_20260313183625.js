const BASE = "http://apiqsp-production.up.railway.app";

const get  = url => fetch(`${BASE}${url}`).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); });
const post = (url, body) => fetch(`${BASE}${url}`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); });
const put  = (url, body) => fetch(`${BASE}${url}`, { method:"PUT",  headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); });
const del  = url => fetch(`${BASE}${url}`, { method:"DELETE" }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); });

// Categorías
export const getCategories    = ()      => get("/categories");
export const createCategory   = (data)  => post("/categories", data);
export const updateCategory   = (id, d) => put(`/categories/${id}`, d);
export const deleteCategory   = (id)    => del(`/categories/${id}`);

// Productos
export const getProducts      = ()      => get("/products");
export const getProductsByCategory = id => get(`/products/category/${id}`);
export const createProduct    = (data)  => post("/products", data);
export const updateProduct    = (id, d) => put(`/products/${id}`, d);
export const deleteProduct    = (id)    => del(`/products/${id}`);

// Ingredientes
export const getIngredients       = (productId) => get(`/products/${productId}/ingredients`);
export const addIngredient        = (productId, data) => post(`/products/${productId}/ingredients`, data);
export const deleteIngredient     = (productId, ingId) => del(`/products/${productId}/ingredients/${ingId}`);

// Ventas
export const getSales         = ()      => get("/api/sales");
export const getSaleById      = (id)    => get(`/api/sales/${id}`);
export const createSale       = (data)  => post("/api/sales", data);

// Dashboard
export const getDashboardStats = ()     => get("/api/dashboard/stats");