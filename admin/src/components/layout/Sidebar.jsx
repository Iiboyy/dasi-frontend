import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faBagShopping,
faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../lib/api";

const Sidebar = () => {
const [user, setUser] = useState(null);

useEffect(() => {
const fetchUser = async () => {
try {
const res = await api.get("/users/me");
setUser(res.data);
} catch (error) {
console.log("Gagal ambil user", error?.response?.data || error.message);
setUser(null);
}
};

fetchUser();

}, []);

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col">

      {/* Logo */}
      <div className="h-20 border-b px-6 flex items-center">
        <div className="bg-blue-500 text-white p-2 rounded-lg">
          <FontAwesomeIcon icon={faBagShopping} className="text-white text-lg" />
        </div>
        <div className="ml-3">
          <h1 className="font-bold text-lg">DASI</h1>
          <p className="text-sm text-blue-500">Admin Panel</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">

        <p className="text-xs text-gray-400 uppercase">Utama</p>

        <NavLink to="/" className={({ isActive }) =>
          `block p-2 rounded ${
            isActive ? "bg-blue-100 text-blue-500" : "hover:bg-blue-50 hover:text-blue-500"
          }`
        }>
          Dashboard
        </NavLink>

        <div className="border-t my-4" />

        <p className="text-xs text-gray-400 uppercase">Katalog</p>

        <NavLink to="/products" className={({ isActive }) =>
          `block p-2 rounded ${
            isActive ? "bg-blue-100 text-blue-500" : "hover:bg-blue-50 hover:text-blue-500"
          }`
        }>
          Produk
        </NavLink>

        <NavLink to="/categories" className={({ isActive }) =>
          `block p-2 rounded ${
            isActive ? "bg-blue-100 text-blue-500" : "hover:bg-blue-50 hover:text-blue-500"
          }`
        }>
          Kategori
        </NavLink>

        <div className="border-t my-4" />

        <p className="text-xs text-gray-400 uppercase">Transaksi</p>

        <NavLink to="/orders" className={({ isActive }) =>
          `block p-2 rounded ${
            isActive ? "bg-blue-100 text-blue-500" : "hover:bg-blue-50 hover:text-blue-500"
          }`
        }>
          Pesanan
        </NavLink>

        <NavLink to="/payments" className={({ isActive }) =>
          `block p-2 rounded ${
            isActive ? "bg-blue-100 text-blue-500" : "hover:bg-blue-50 hover:text-blue-500"
          }`
        }>
          Pembayaran
        </NavLink>

        <div className="border-t my-4" />

        <p className="text-xs text-gray-400 uppercase">Pengguna</p>

        <NavLink to="/users" className={({ isActive }) =>
          `block p-2 rounded ${
            isActive ? "bg-blue-100 text-blue-500" : "hover:bg-blue-50 hover:text-blue-500"
          }`
        }>
          Pengguna
        </NavLink>

        <NavLink to="/reviews" className={({ isActive }) =>
          `block p-2 rounded ${
            isActive ? "bg-blue-100 text-blue-500" : "hover:bg-blue-50 hover:text-blue-500"
          }`
        }>
          Ulasan
        </NavLink>

      </nav>

      {/* User */}
      <NavLink to="/profile">
        <div className="p-4 border-t flex items-center gap-3">

          <FontAwesomeIcon
            icon={faCircleUser}
            className="text-gray-500 text-3xl"
          />

          <div className="flex flex-col">
            <div className="text-sm font-medium">
              {user?.name || "Admin"}
            </div>

            <div className="text-sm text-blue-500">
              {user?.email || "-"}
            </div>
          </div>

        </div>
      </NavLink>

    </aside>
  );
};

export default Sidebar;