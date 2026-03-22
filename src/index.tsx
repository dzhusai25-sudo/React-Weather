import React from "react";
import ReactDOM from "react-dom/client";
import { ReactApp } from "./ReactApp";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ReactApp />
  </React.StrictMode>,
);
