import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/") return "Dashboard";

    if (path === "/products") return "Produk";
    if (path.includes("/products/add")) return "Tambah Produk";
    if (path.includes("/products/edit")) return "Edit Produk";

    if (path === "/categories") return "Kategori";
    if (path.includes("/categories/add")) return "Tambah Kategori";
    if (path.includes("/categories/edit")) return "Edit Kategori";

    if (path === "/orders") return "Pesanan";
    if (path === "/users") return "Pengguna";
    if (path === "/profile") return "Profile";
    if (path === "/reviews") return "Ulasan";

    return "Admin";
  };

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-6">

      <h2 className="font-semibold text-xl">
        {getPageTitle()}
      </h2>

      <div className="flex items-center gap-4">

        {/* <input
          type="text"
          placeholder="🔍︎ Cari"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
        /> */}

        {/* <div className="w-8 h-8 flex items-center justify-center">
          <FontAwesomeIcon icon={faBell} className="text-xl text-blue-500" />
        </div> */}
        
        {/* <NavLink to="/profile" className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
          <FontAwesomeIcon icon={faCircleUser} className="text-3xl text-blue-500" />
        </NavLink> */}

      </div>

    </header>
  );
};

export default Navbar;
