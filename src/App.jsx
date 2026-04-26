import React, { useEffect, useState } from "react";
import './App.css';
import GlobalLoader from "./components/GlobalLoader";
import Sidebar from "../components/MainChart/Sidebar";

import MainChart from "../pages/MainChart";
import Home from "../pages/Home";
import PdfToJson from "../pages/PdfToJsonPage";
import PlanerChecker from "../pages/PlanerChecker";
import { Routes, Route, useLocation } from "react-router-dom";
import Prism from "../pages/Prism";
import Orbit from "../pages/Orbit";
import Analysis from "../pages/Analysis";
import AnalysisAggregated from "../pages/AnalysisAggregated";
import Analysis3 from "../pages/Analysis3";
import About from "../pages/About";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    setLoading(true);
    // On route change, reset data loading. The component will set it to true if it needs to fetch.
    setDataLoading(false);
    
    // Minimum visual loading time (e.g. 1.5s for non-data pages)
    const timer = setTimeout(() => {
      setLoading(false);
      setInitialLoad(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const showLoader = loading || dataLoading;

  return (
    <>
      <ScrollToTop />
      <div className="dark bg-background text-foreground relative min-h-screen w-full overflow-hidden transition-colors duration-300">
        <GlobalLoader loading={showLoader} />

        {/* Sidebar — fixed left */}
        <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />

        {/* Main content area — offset by dynamic sidebar width */}
        <div
          className={`relative z-10 min-h-screen transition-all duration-300 overflow-x-hidden pt-14 md:pt-0 ${
            isSidebarCollapsed ? "md:ml-[68px] w-full md:w-[calc(100%-68px)]" : "md:ml-[260px] w-full md:w-[calc(100%-260px)]"
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main-chart" element={<MainChart setDataLoading={setDataLoading} />} />
            <Route path="/pdf-to-json" element={<PdfToJson />} />
            <Route path="/planner-checker" element={<PlanerChecker setDataLoading={setDataLoading} />} />
            <Route path="/prism" element={<Prism setDataLoading={setDataLoading} />} />
            <Route path="/orbit" element={<Orbit setDataLoading={setDataLoading} />} />
            <Route path="/analysis" element={<Analysis setDataLoading={setDataLoading} />} />
            <Route path="/analysis-aggregated" element={<AnalysisAggregated setDataLoading={setDataLoading} />} />
            <Route path="/analysis-3" element={<Analysis3 setDataLoading={setDataLoading} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;