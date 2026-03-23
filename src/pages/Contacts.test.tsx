import { render, screen } from "@testing-library/react";
import { Contacts } from "./Contacts";
import "@testing-library/jest-dom";

describe("Contacts component", () => {
  test("renders heading and GitHub link", () => {
    render(<Contacts />);
    expect(
      screen.getByRole("heading", { name: /контакты/i }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /github/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/dzhusai25-sudo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
