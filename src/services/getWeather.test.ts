import { getWeather } from "./getWeather";

// Мок глобального fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("getWeather", () => {
  const city = "Moscow";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=97d93f1704dcb8e35dd2045c8e75710d&lang=ru`;

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("возвращает данные при успешном ответе", async () => {
    const mockData = { name: "Moscow", main: { temp: 10 } };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getWeather(city);
    expect(mockFetch).toHaveBeenCalledWith(apiUrl);
    expect(result).toEqual(mockData);
  });

  test('выбрасывает ошибку "Город не найден" при 404', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(getWeather(city)).rejects.toThrow(
      "Город Moscow не найден. Проверьте название города.",
    );
  });

  test("выбрасывает общую ошибку API при других кодах", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(getWeather(city)).rejects.toThrow("Ошибка API");
  });
});
