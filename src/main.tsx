import React from "react";
import ReactDOM from "react-dom/client";
import FinancialLiteracyCalculator from "./FinancialLiteracyCalculator.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FinancialLiteracyCalculator />
  </React.StrictMode>
);
