import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart dari backend kalau user login
  useEffect(() => {
    if (user?.role === "buyer") {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await api.get("/cart");
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product_id, quantity = 1) => {
    try {
      const data = await api.post("/cart", { product_id, quantity });
      if (data.message && !data.items) {
        return { success: false, message: data.message };
      }
      setItems(data.items || []);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateQty = async (product_id, quantity) => {
    try {
      const data = await api.patch("/cart", { product_id, quantity });
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (product_id) => {
    try {
      await api.delete(`/cart/${product_id}`);
      setItems((prev) => prev.filter((i) => i.product_id._id !== product_id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  const total = items.reduce(
    (sum, i) => sum + (i.product_id?.price || 0) * i.quantity,
    0,
  );
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        total,
        count,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
