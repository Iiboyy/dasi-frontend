import { api } from "./api";

export const getAllProducts = () => api.get("/admin/products");
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);