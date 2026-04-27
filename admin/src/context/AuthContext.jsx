import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
try {
const savedUser = localStorage.getItem("admin_user");
const token = localStorage.getItem("admin_token");
  if (savedUser && token) {
    setUser(JSON.parse(savedUser));
  }
} catch (err) {
  console.log("Auth init error:", err);
  localStorage.clear();
}

setLoading(false);

}, []);

const login = async (email, password) => {
try {
const res = await api.post("/auth/signin", {
email,
password,
});
  const data = res.data;

  const token = data.token;

  if (!token) {
    return { success: false, message: "Token tidak ada" };
  }

  if (data.role !== "admin") {
    return { success: false, message: "Admin only" };
  }

  localStorage.setItem("admin_token", token);
  localStorage.setItem("admin_user", JSON.stringify(data));

  setUser(data);

  return { success: true };
} catch (error) {
  return {
    success: false,
    message:
      error.response?.data?.message || "Login gagal",
  };
}
};

const logout = () => {
localStorage.clear();
setUser(null);
};

return (
<AuthContext.Provider value={{ user, login, logout, loading }}>
{children}
</AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);
