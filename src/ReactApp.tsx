import "./ReactApp.css";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contacts } from "./pages/Contacts";
import { useState } from "react";

export function ReactApp() {
  const [page, setPage] = useState("Home");

  return (
    <div className="ReactApp">
      <nav className="navi">
        <button onClick={() => setPage("Home")}>🌤 Главная</button>
        <button onClick={() => setPage("About")}>О приложении</button>
        <button onClick={() => setPage("Contacts")}>Контакты</button>
      </nav>
      {page === "Contacts" && <Contacts />}
      {page === "About" && <About />}
      {page === "Home" && <Home />}
    </div>
  );
}
