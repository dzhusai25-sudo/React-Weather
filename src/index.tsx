import React from "react";
import ReactDOM from "react-dom/client";
import { ReactApp } from "./ReactApp";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactApp />
    </BrowserRouter>
  </React.StrictMode>,
);
