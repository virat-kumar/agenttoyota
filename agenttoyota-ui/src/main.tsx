import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoanQuotation from "./pages/LoanQuotation";
import LeaseQuotation from "./pages/LeaseQuotation";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/loan-quote" element={<LoanQuotation />} />
        <Route path="/lease-quote" element={<LeaseQuotation />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
