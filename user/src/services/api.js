const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = (isFormData = false) => ({
  ...(!isFormData && { "Content-Type": "application/json" }),
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: headers(),
    });
    return res.json();
  },

  post: async (endpoint, body, isFormData = false) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: headers(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return res.json();
  },

  patch: async (endpoint, body, isFormData = false) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: headers(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: headers(),
    });
    return res.json();
  },
};