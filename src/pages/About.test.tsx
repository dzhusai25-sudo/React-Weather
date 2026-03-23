import { render, screen } from "@testing-library/react";
import { About } from "./About";
import "@testing-library/jest-dom";

describe("About component", () => {
  test("renders heading and description", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /о приложении/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/показывает погоду в реальном времени/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/использует openweathermap api/i),
    ).toBeInTheDocument();
  });
});
