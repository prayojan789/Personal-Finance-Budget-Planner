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
      <Navbar />
      <d className="app__body">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="app__main">
          <Suspense fallback={<Loader label="Loading page..." />}>
            <AppRoutes currentPage={currentPage} onNavigate={setCurrentPage} />
          </Suspense>
        </main>
      </d iv>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
