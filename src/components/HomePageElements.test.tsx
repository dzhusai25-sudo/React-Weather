import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Header,
  Input,
  Button,
  Result,
  Loader,
  ErrorMessage,
  HistoryList,
} from "./HomePageElements";
import { WeatherData } from "../types";

describe("HomePageElements", () => {
  test("Header рендерит заголовок и подпись", () => {
    render(<Header />);
    expect(screen.getByText(/Enjoy your weather!/i)).toBeInTheDocument();
    expect(screen.getByText(/or not/i)).toBeInTheDocument();
  });

  test("Input отображает value и вызывает onChange", () => {
    const handleChange = jest.fn();
    render(<Input value="Moscow" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Ваш город");
    expect(input).toHaveValue("Moscow");
    fireEvent.change(input, { target: { value: "London" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("Button отображается с текстом и disabled", () => {
    const handleClick = jest.fn();
    const { rerender } = render(<Button onClick={handleClick} />);
    const button = screen.getByText("Get Weather");
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(<Button onClick={handleClick} disabled />);
    expect(screen.getByText("Get Weather")).toBeDisabled();
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

  test("Loader отображает текст", () => {
    render(<Loader />);
    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  test("ErrorMessage отображает сообщение", () => {
    render(<ErrorMessage message="Ошибка сети" />);
    expect(screen.getByText("Ошибка сети")).toBeInTheDocument();
  });

  test("HistoryList отображает список городов и вызывает onItemClick", () => {
    const history = ["Moscow", "London"];
    const handleClick = jest.fn();
    render(<HistoryList history={history} onItemClick={handleClick} />);
    expect(screen.getByText("История поиска:")).toBeInTheDocument();
    expect(screen.getByText("Moscow")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Moscow"));
    expect(handleClick).toHaveBeenCalledWith("Moscow");
  });

  test("HistoryList не рендерится, если история пуста", () => {
    render(<HistoryList history={[]} onItemClick={jest.fn()} />);
    expect(screen.queryByText("История поиска:")).not.toBeInTheDocument();
  });
});
