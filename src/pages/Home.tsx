import { useState, useEffect } from "react";
import { getWeather } from "../services/getWeather";
import { 
  Header, 
  Input, 
  Button, 
  Loader, 
  Result, 
  ErrorMessage, 
  HistoryList
} from "../components/HomePageElements";
import { WeatherData } from "../types";

export function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Загружаем историю из localStorage при монтировании
  useEffect(() => {
    const savedHistory = localStorage.getItem("weatherHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 3));
        }
      } catch (error) {
        console.error("Ошибка чтения истории из localStorage", error);
      }
    }
  }, []);

  // Сохраняем историю в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }, [history]);

  // Общая функция поиска погоды (используется и для кнопки, и для истории)
  const performSearch = async (searchCity: string) => {
    if (!searchCity.trim()) {
      setError("Введите название города");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getWeather(searchCity);
      setWeather(data);
      setCity("");
      // Обновляем историю: добавляем город в начало, убираем дубликаты
      setHistory((prev) => {
        const newHistory = [searchCity, ...prev.filter((item) => item !== searchCity)];
        return newHistory.slice(0, 3);
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка запроса");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик кнопки "Get Weather"
  const handleGetWeather = () => {
    performSearch(city);
  };

  // Обработчик клика по элементу истории
  const handleHistoryClick = (cityName: string) => {
    // setCity(cityName);
    performSearch(cityName);
  };

  return (
    <div>
      <Header />
      <Input value={city} onChange={(e) => setCity(e.target.value)} />
      {city.trim() && <Button onClick={handleGetWeather} disabled={loading} />}
      {loading && <Loader />}
      <Result weather={weather} />
      {error && <ErrorMessage message={error} />}
      <HistoryList history={history} onItemClick={handleHistoryClick} />
    </div>
  );
}