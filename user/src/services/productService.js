import { api } from "./api";

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/products${query ? `?${query}` : ""}`);
};

export const getProductById = async (id) => {
  return api.get(`/products/${id}`);
};