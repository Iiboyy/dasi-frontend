import { createContext, useContext, useState } from "react";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const addOrder = (orderData) => {
    const withTime = { ...orderData, createdAt: Date.now() };
    setOrders(prev => [withTime, ...prev]);
  };

  const cancelOrder = (orderNumber) => {
    setOrders(prev => prev.map(o => {
      if (o.orderNumber !== orderNumber) return o;
      const elapsed = Date.now() - o.createdAt;
      const oneDay = 24 * 60 * 60 * 1000;
      if (elapsed > oneDay) return o; // lewat 1x24 jam, tidak bisa batalkan
      return { ...o, status: "Dibatalkan" };
    }));
  };

  const canCancel = (order) => {
    if (order.status === "Dibatalkan" || order.status === "Selesai") return false;
    const elapsed = Date.now() - order.createdAt;
    const oneDay = 24 * 60 * 60 * 1000;
    return elapsed <= oneDay;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, cancelOrder, canCancel }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);