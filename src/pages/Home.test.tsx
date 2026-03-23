import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { getWeather } from "../services/getWeather";

jest.mock("../services/getWeather");
const mockGetWeather = getWeather as jest.MockedFunction<typeof getWeather>;

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

// рендеринг Home с заданным маршрутом
function renderHomeWithRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather/:city" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  test("рендер компонентов без истории и ошибок", () => {
    renderHomeWithRoute("/");
    expect(screen.getByText(/Enjoy your weather!/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ваш город")).toBeInTheDocument();
    expect(screen.queryByText("Get Weather")).not.toBeInTheDocument();
    expect(screen.queryByText("Загрузка...")).not.toBeInTheDocument();
    expect(screen.queryByText("История поиска:")).not.toBeInTheDocument();
  });

  test("кнопка появляется при вводе текста", () => {
    renderHomeWithRoute("/");
    const input = screen.getByPlaceholderText("Ваш город");
    fireEvent.change(input, { target: { value: "Moscow" } });
    expect(screen.getByText("Get Weather")).toBeInTheDocument();
  });

  test("поиск погоды по кнопке: очищает поле, сохраняет историю, отображает результат", async () => {
    const mockWeather = {
      name: "Moscow",
      sys: { country: "RU" },
      main: { temp: 15, humidity: 70 },
      weather: [{ description: "ясно" }],
    };
    mockGetWeather.mockResolvedValueOnce(mockWeather);

    renderHomeWithRoute("/");
    const input = screen.getByPlaceholderText("Ваш город");
    fireEvent.change(input, { target: { value: "Moscow" } });
    fireEvent.click(screen.getByText("Get Weather"));

    expect(mockGetWeather).toHaveBeenCalledWith("Moscow");
    expect(screen.getByText("Загрузка...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Загрузка...")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Moscow, RU")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ваш город")).toHaveValue("");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "weatherHistory",
      JSON.stringify(["Moscow"])
    );
    expect(screen.getByText("История поиска:")).toBeInTheDocument();
    expect(screen.getByText("Moscow")).toBeInTheDocument();
  });

  test("при наличии параметра city в URL выполняется поиск погоды", async () => {
    const mockWeather = {
      name: "Moscow",
      sys: { country: "RU" },
      main: { temp: 15, humidity: 70 },
      weather: [{ description: "ясно" }],
    };
    mockGetWeather.mockResolvedValueOnce(mockWeather);

    renderHomeWithRoute("/weather/Moscow");

    await waitFor(() => {
      expect(screen.getByText("Moscow, RU")).toBeInTheDocument();
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "weatherHistory",
      JSON.stringify(["Moscow"])
    );
  });

  test("ошибка при поиске по параметру URL отображается", async () => {
    mockGetWeather.mockRejectedValueOnce(
      new Error("Город Invalid не найден. Проверьте название города.")
    );

    renderHomeWithRoute("/weather/Invalid");

    await waitFor(() => {
      expect(screen.getByText("Город Invalid не найден. Проверьте название города.")).toBeInTheDocument();
    });
  });

  test("клик по элементу истории переводит на параметризированный роут", async () => {
    localStorageMock.setItem("weatherHistory", JSON.stringify(["London"]));

    renderHomeWithRoute("/");
    await waitFor(() => {
      expect(screen.getByText("London")).toBeInTheDocument();
    });

    const mockWeather = {
      name: "London",
      sys: { country: "GB" },
      main: { temp: 12, humidity: 75 },
      weather: [{ description: "пасмурно" }],
    };
    mockGetWeather.mockResolvedValueOnce(mockWeather);

    const user = userEvent.setup();
    await user.click(screen.getByText("London"));

    await waitFor(() => {
      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "weatherHistory",
      JSON.stringify(["London"])
    );
  });
});