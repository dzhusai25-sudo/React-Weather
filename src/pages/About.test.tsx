import { render, screen } from "@testing-library/react";
import { About } from "./About";
import "@testing-library/jest-dom";

describe("/About", () => {
  test("рендер статичного контента", () => {
    render(<About />);
    expect(screen.getByText(/О приложении/),).toBeInTheDocument();
    expect(screen.getByText(/Это приложение показывает погоду в реальном времени./),).toBeInTheDocument();
    expect(screen.getByText(/Использует OpenWeatherMap API./),).toBeInTheDocument();
  });
});
