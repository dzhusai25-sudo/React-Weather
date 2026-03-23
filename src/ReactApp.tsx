import "./ReactApp.css";
import { Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contacts } from "./pages/Contacts";

export function ReactApp() {
  return (
    <div className="ReactApp">
      <nav className="navi">
        <NavLink to="/">🌤 Главная</NavLink>
        <NavLink to="/about">О приложении</NavLink>
        <NavLink to="/contacts">Контакты</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather/:city" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </div>
  );
}