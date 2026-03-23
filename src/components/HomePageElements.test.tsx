import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import {
  Header,
  Result,
  Loader,
  ErrorMessage,
  HistoryList,
} from "./HomePageElements";
import { WeatherData } from "../types";

describe("HomePageElements", () => {
  test("рендер заголовка", () => {
    render(<Header />);
    expect(screen.getByText(/Enjoy your weather!/)).toBeInTheDocument();
    expect(screen.getByText(/or not/)).toBeInTheDocument();
  });

  test("Result отображает данные погоды или null", () => {
    const weatherData: WeatherData = {
      name: "London",
      sys: { country: "GB" },
      main: { temp: 15, humidity: 80 },
      weather: [{ description: "cloudy" }],
    };
    const { rerender } = render(<Result weather={weatherData} />);
    expect(screen.getByText("London, GB")).toBeInTheDocument();
    expect(screen.getByText(/15°C/)).toBeInTheDocument();
    expect(screen.getByText(/cloudy/)).toBeInTheDocument();
    expect(screen.getByText(/80%/)).toBeInTheDocument();

    rerender(<Result weather={null} />);
    expect(screen.queryByText("London, GB")).not.toBeInTheDocument();
  });

  test("Текст Загрузки", () => {
    render(<Loader />);
    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  test("ErrorMessage отображает сообщение", () => {
    render(<ErrorMessage message="Ошибка" />);
    expect(screen.getByText("Ошибка")).toBeInTheDocument();
  });

  test("HistoryList отображает список городов", () => {
    const history = ["Moscow", "London"];
    const handleClick = jest.fn();
    render(<HistoryList history={history} onItemClick={handleClick} />);
    expect(screen.getByText("История поиска:")).toBeInTheDocument();
    expect(screen.getByText("Moscow")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
  });

  test("HistoryList не рендерится, если история пуста", () => {
    render(<HistoryList history={[]} onItemClick={jest.fn()} />);
    expect(screen.queryByText("История поиска:")).not.toBeInTheDocument();
  });
});
