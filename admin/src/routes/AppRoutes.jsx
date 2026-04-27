import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import Produk from "../pages/products/ProductList";
import AddProduct from "../pages/products/AddProduct";
import EditProduct from "../pages/products/EditProduct";

import Kategori from "../pages/categories/Category";
import AddCategory from "../pages/categories/AddCategory";
import EditCategory from "../pages/categories/EditCategory";

import Pesanan from "../pages/orders/OrderPage";
import Pembayaran from "../pages/payments/PaymentPage";
import Pengguna from "../pages/users/UserPage";
import Ulasan from "../pages/reviews/ReviewPage";
import Profile from "../pages/profile/ProfilePage";

import Signin from "../signin/signin"; //

const AppRoutes = () => {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<Signin />} />

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* PRODUCTS */}
      <Route path="/products" element={<Produk />} />
      <Route path="/products/add" element={<AddProduct />} />
      <Route path="/products/edit/:id" element={<EditProduct />} />

      {/* CATEGORIES */}
      <Route path="/categories" element={<Kategori />} />
      <Route path="/categories/add" element={<AddCategory />} />
      <Route path="/categories/edit/:id" element={<EditCategory />} />

      {/* OTHERS */}
      <Route path="/orders" element={<Pesanan />} />
      <Route path="/payments" element={<Pembayaran />} />
      <Route path="/users" element={<Pengguna />} />
      <Route path="/reviews" element={<Ulasan />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;