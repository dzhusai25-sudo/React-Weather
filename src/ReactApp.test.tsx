import { render, screen, fireEvent } from "@testing-library/react";
import { ReactApp } from "./ReactApp";
import "@testing-library/jest-dom";

// Мокаем дочерние компоненты, чтобы не загружать реальные страницы со сложной логикой
jest.mock("./pages/Home", () => ({
  Home: () => <div data-testid="home-page">Home Page Mock</div>,
}));
jest.mock("./pages/About", () => ({
  About: () => <div data-testid="about-page">About Page Mock</div>,
}));
jest.mock("./pages/Contacts", () => ({
  Contacts: () => <div data-testid="contacts-page">Contacts Page Mock</div>,
}));

describe("ReactApp", () => {
  test("рендерит навигацию и главную страницу по умолчанию", () => {
    render(<ReactApp />);
    expect(screen.getByText("🌤 Главная")).toBeInTheDocument();
    expect(screen.getByText("О приложении")).toBeInTheDocument();
    expect(screen.getByText("Контакты")).toBeInTheDocument();
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  test("переключение на страницу About", () => {
    render(<ReactApp />);
    fireEvent.click(screen.getByText("О приложении"));
    expect(screen.getByTestId("about-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
  });

  test("переключение на страницу Contacts", () => {
    render(<ReactApp />);
    fireEvent.click(screen.getByText("Контакты"));
    expect(screen.getByTestId("contacts-page")).toBeInTheDocument();
  });
});
