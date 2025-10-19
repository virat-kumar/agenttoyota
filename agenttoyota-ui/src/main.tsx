import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoanQuotation from "./pages/LoanQuotation";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/loan-quote" element={<LoanQuotation />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
