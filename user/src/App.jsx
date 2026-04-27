import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { OrderProvider } from "./context/OrderContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoriteProvider>
          <OrderProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </OrderProvider>
        </FavoriteProvider>
      </CartProvider>
    </AuthProvider>
  );
}