import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;