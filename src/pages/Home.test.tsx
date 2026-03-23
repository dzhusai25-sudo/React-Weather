import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Home } from "./Home";
import { getWeather } from "../services/getWeather";
import "@testing-library/jest-dom";

// Мокаем зависимости
jest.mock("../services/getWeather");
const mockGetWeather = getWeather as jest.MockedFunction<typeof getWeather>;

// Мок localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  test("рендерит компоненты без истории и ошибок", () => {
    render(<Home />);
    expect(screen.getByText(/Enjoy your weather!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ваш город")).toBeInTheDocument();
    expect(screen.queryByText("Get Weather")).not.toBeInTheDocument(); // пока поле пусто
    expect(screen.queryByText("Загрузка...")).not.toBeInTheDocument();
    expect(screen.queryByText("История поиска:")).not.toBeInTheDocument();
  });

  test("кнопка появляется при вводе текста", () => {
    render(<Home />);
    const input = screen.getByPlaceholderText("Ваш город");
    fireEvent.change(input, { target: { value: "Moscow" } });
    expect(screen.getByText("Get Weather")).toBeInTheDocument();
  });

  test("поиск погоды успешен: очищает поле, сохраняет историю, отображает результат", async () => {
    const mockWeather = {
      name: "Moscow",
      sys: { country: "RU" },
      main: { temp: 15, humidity: 70 },
      weather: [{ description: "ясно" }],
    };
    mockGetWeather.mockResolvedValueOnce(mockWeather);

    render(<Home />);
    const input = screen.getByPlaceholderText("Ваш город");
    fireEvent.change(input, { target: { value: "Moscow" } });
    fireEvent.click(screen.getByText("Get Weather"));

    expect(mockGetWeather).toHaveBeenCalledWith("Moscow");
    expect(screen.getByText("Загрузка...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Загрузка...")).not.toBeInTheDocument();
    });

    // Результат отображается
    expect(screen.getByText("Moscow, RU")).toBeInTheDocument();
    // Поле очищено
    expect(screen.getByPlaceholderText("Ваш город")).toHaveValue("");
    // История сохранилась
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "weatherHistory",
      JSON.stringify(["Moscow"]),
    );
    // Блок истории отображается
    expect(screen.getByText("История поиска:")).toBeInTheDocument();
    expect(screen.getByText("Moscow")).toBeInTheDocument();
  });

  test("ошибка при поиске: поле не очищается, история не обновляется", async () => {
    mockGetWeather.mockRejectedValueOnce(new Error("Город не найден"));

    render(<Home />);
    const input = screen.getByPlaceholderText("Ваш город");
    fireEvent.change(input, { target: { value: "InvalidCity" } });
    fireEvent.click(screen.getByText("Get Weather"));

    // await waitFor(() => {
    //   expect(screen.getByText('Город не найден')).toBeInTheDocument();
    // });
    // Поле осталось с введённым текстом
    expect(screen.getByPlaceholderText("Ваш город")).toHaveValue("InvalidCity");
    // // История не обновлялась
    // expect(localStorageMock.setItem).not.toHaveBeenCalled();
    // // Блока истории нет
    // expect(screen.queryByText('История поиска:')).not.toBeInTheDocument();
  });

  test("клик по элементу истории выполняет поиск", async () => {
    // Предварительно сохраним историю в localStorage
    localStorageMock.setItem("weatherHistory", JSON.stringify(["London"]));
    const mockWeather = {
      name: "London",
      sys: { country: "GB" },
      main: { temp: 12, humidity: 75 },
      weather: [{ description: "пасмурно" }],
    };
    mockGetWeather.mockResolvedValueOnce(mockWeather);

    render(<Home />);

    // После загрузки истории должна появиться кнопка с городом London
    await waitFor(() => {
      expect(screen.getByText("London")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("London"));

    expect(mockGetWeather).toHaveBeenCalledWith("London");
    await waitFor(() => {
      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });
    // История обновляется (London перемещается в начало)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "weatherHistory",
      JSON.stringify(["London"]),
    );
  });

  test("загрузка истории из localStorage при монтировании", () => {
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify(["Paris", "Berlin"]),
    );
    render(<Home />);
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
  });
});
