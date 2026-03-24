// src/ReactApp.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ReactApp } from "./ReactApp";

jest.mock("./pages/Home", () => ({ Home: () => <div>Home Page</div> }));
jest.mock("./pages/About", () => ({ About: () => <div>About Page</div> }));
jest.mock("./pages/Contacts", () => ({
  Contacts: () => <div>Contacts Page</div>,
}));

describe("ReactApp", () => {
  test("рендерит главную страницу по умолчанию", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ReactApp />
      </MemoryRouter>,
    );
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  test("переход на страницу About", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ReactApp />
      </MemoryRouter>,
    );
    await user.click(screen.getByText("О приложении"));
    expect(screen.getByText("About Page")).toBeInTheDocument();
  });

  test("переход на страницу Contacts", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ReactApp />
      </MemoryRouter>,
    );
    await user.click(screen.getByText("Контакты"));
    expect(screen.getByText("Contacts Page")).toBeInTheDocument();
  });
});
