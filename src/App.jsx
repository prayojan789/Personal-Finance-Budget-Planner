import { Suspense, useState } from "react";
import "./App.css";
import Footer from "./components/layout/Footer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import ToastContainer from "./components/common/ToastContainer.jsx";
import Loader from "./components/common/Loader.jsx";
import CommandPalette from "./components/common/CommandPalette.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

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
      <CommandPalette currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
