import { useState } from "react";
import { getWeather } from "../services/getWeather";
import { Header, Input, Button, Result } from "../components/HomePageElements";
import { WeatherData } from "../types";

export function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleGetWeather = async () => {
    if (!city.trim()) {
      setError("Введите название города");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const data = await getWeather(city);
      setWeather(data);
      // Обновляем историю
      setHistory((prev) => {
        const newHistory = [city, ...prev.filter((item) => item !== city)];
        return newHistory.slice(0, 3);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка запроса");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div id="currentWidget" className="widget current-weather"></div>
      <Header />
      <Input value={city} onChange={(e) => setCity(e.target.value)} />
      <Button onClick={handleGetWeather} disabled={loading} />
      {loading && <div>Загрузка...</div>}
      <Result weather={weather} />
      {error && <div className="errors">{error}</div>}
    {history.length > 0 && (
      <div className="history">
        История поиска:
        <ul>
          {history.map((item, idx) => (
            <li
              key={idx}
              onClick={() => setCity(item)}
              style={{ cursor: "pointer" }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  );
}
