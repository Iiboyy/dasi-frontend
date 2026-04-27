import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Orders from "../pages/Orders";
import Favorites from "../pages/Favorites";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Profile from "../pages/Profile";
import ProductDetail from "../pages/productDetail";
import AllProducts from "../pages/AllProducts";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

export default function AppRoutes() {
  const [page, setPage] = useState("home");
  const [previousPage, setPreviousPage] = useState("home");
  const [navSearch, setNavSearch] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState(null);

  const navigate = (target, data = null) => {
    if (target === "product-detail") setPreviousPage(page);
    setPage(target);
    if (target !== "home" && target !== "all-products") setNavSearch("");
    if (target === "order-success" && data) setOrderData(data);
    if (target === "product-detail" && data) setSelectedProduct(data);
    if (target === "checkout" && data?.selectedItems)
      setCheckoutItems(data.selectedItems);
    if (target !== "checkout") setCheckoutItems(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home onNavigate={navigate} searchQuery={navSearch} />;
      case "all-products":
        return <AllProducts onNavigate={navigate} searchQuery={navSearch} />;
      case "orders":
        return <Orders onNavigate={navigate} />;
      case "favorites":
        return <Favorites onNavigate={navigate} />;
      case "cart":
        return <Cart onNavigate={navigate} />;
      case "checkout":
        return <Checkout onNavigate={navigate} />;
      case "order-success":
        return <OrderSuccess onNavigate={navigate} orderData={orderData} />;
      case "profile":
        return <Profile onNavigate={navigate} />;
      case "product-detail":
        return (
          <ProductDetail
            product={selectedProduct}
            onNavigate={navigate}
            previousPage={previousPage}
          />
        );
      case "login":
        return <Login onNavigate={navigate} />;
      case "register":
        return <Register onNavigate={navigate} />;
      case "forgot-password":
        return <ForgotPassword onNavigate={navigate} />;
      case "checkout":
        return <Checkout onNavigate={navigate} checkoutItems={checkoutItems} />;
      default:
        return <Home onNavigate={navigate} searchQuery={navSearch} />;
    }
  };

  if (["login", "register", "forgot-password"].includes(page)) {
    return renderPage();
  }

  return (
    <MainLayout
      activePage={page}
      onNavigate={navigate}
      navSearch={navSearch}
      setNavSearch={setNavSearch}
    >
      {renderPage()}
    </MainLayout>
  );
}
