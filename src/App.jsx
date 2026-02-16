import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/layout/Footer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { useFinance } from "./context/FinanceContext.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { settings } = useFinance();

  useEffect(() => {
    const theme = settings?.theme || "light";
    document.documentElement.dataset.theme = theme;
  }, [settings?.theme]);

  return (
    <div className="app">
      <Navbar />
      <div className="app__body">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="app__main">
          <AppRoutes currentPage={currentPage} onNavigate={setCurrentPage} />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
