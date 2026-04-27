import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children, activePage, onNavigate, navSearch, setNavSearch }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <Navbar
        activePage={activePage}
        onNavigate={onNavigate}
        navSearch={navSearch}
        setNavSearch={setNavSearch}
      />
      <main style={{ flex: 1, width: "100%" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
