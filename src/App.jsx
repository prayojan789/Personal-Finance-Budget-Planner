import { Suspense, useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/layout/Footer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { useFinance } from "./context/FinanceContext.jsx";
import ToastContainer from "./components/common/ToastContainer.jsx";
import Loader from "./components/common/Loader.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { settings } = useFinance();

  useEffect(() => {
    const theme = settings?.theme || "light";
    document.documentElement.dataset.theme = theme;
  }, [settings?.theme]);

  return (
    <div className="app">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-main-content">
        Skip to main content
      </a>

      <Navbar />
      <div className="app__body">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="app__main" id="main-content" role="main">
          <Suspense fallback={<Loader label="Loading page..." />}>
            <AppRoutes currentPage={currentPage} onNavigate={setCurrentPage} />
          </Suspense>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
