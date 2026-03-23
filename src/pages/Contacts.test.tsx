import { render, screen } from "@testing-library/react";
import { Contacts } from "./Contacts";
import "@testing-library/jest-dom";

describe("/Contacts", () => {
  test("рендер статичного контента с ссылкой на профиль гит", () => {
    render(<Contacts />);
    expect(screen.getByText(/Контакты/),).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /GitHub/});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/dzhusai25-sudo");
  });
});
