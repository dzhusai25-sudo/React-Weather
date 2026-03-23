import { useWeather } from '../hooks/useWeather';
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
  const {
    city,
    setCity,
    weather,
    error,
    loading,
    history,
    handleGetWeather,
    handleHistoryClick,
  } = useWeather();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && city.trim()) {
      handleGetWeather();
    }
  };

  return (
    <div>
      <Header />
      <Input value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={handleKeyDown}/>
      {city.trim() && <Button onClick={handleGetWeather} disabled={loading} />}
      {loading && <Loader />}
      <Result weather={weather} />
      {error && <ErrorMessage message={error} />}
      <HistoryList history={history} onItemClick={handleHistoryClick} />
    </div>
  );
}
