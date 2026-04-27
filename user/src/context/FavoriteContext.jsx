import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user?.role === "buyer") fetchFavorites();
    else setFavorites([]);
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const data = await api.get("/favorites");
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (product) => {
    try {
      await api.post("/favorites", { product_id: product._id });
      await fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  const isFavorite = (id) => favorites.some(f => f.product_id?._id === id || f.product_id === id);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorite = () => useContext(FavoriteContext);