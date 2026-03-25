import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWeather } from "../hooks/useWeather";
import {
  Header,
  Input,
  Button,
  Loader,
  Result,
  ErrorMessage,
  HistoryList,
} from "../components/HomePageElements";

export function Home() {
  const navigate = useNavigate();
  const { city: cityParam } = useParams<{ city: string }>();
  const {
    city,
    setCity,
    weather,
    error,
    loading,
    history,
    performSearch,
    reset,
  } = useWeather();

  useEffect(() => {
    if (cityParam) {
      performSearch(cityParam);
    } else {
      reset();
    }
  }, [cityParam, performSearch, reset]);

  const handleGetWeather = () => {
    if (city.trim()) {
      navigate(`/weather/${city}`);
      setCity("");
    }
  };

  const handleHistoryClick = (cityName: string) => {
    navigate(`/weather/${cityName}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && city.trim()) {
      handleGetWeather();
    }
  };

  return (
    <div>
      <Header />
      <Input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {city.trim() && <Button onClick={handleGetWeather} disabled={loading} />}
      {loading && <Loader />}
      <Result weather={weather} />
      {error && <ErrorMessage message={error} />}
      <HistoryList history={history} onItemClick={handleHistoryClick} />
    </div>
  );
}
