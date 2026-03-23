import { useState, useEffect, useCallback } from 'react';
import { getWeather } from '../services/getWeather';
import { WeatherData } from '../types';

export function useWeather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 3));
        }
      } catch (err) {
        console.error('Ошибка чтения истории из localStorage', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }, [history]);

  const performSearch = useCallback(async (searchCity: string) => {
    if (!searchCity.trim()) {
      setError('Введите название города');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getWeather(searchCity);
      setWeather(data);
      setCity('');

      setHistory(prev => {
        const newHistory = [searchCity, ...prev.filter(item => item !== searchCity)];
        return newHistory.slice(0, 3);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка запроса');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

    const reset = useCallback(() => {
    setWeather(null);
    setError('');
    setCity('');
  }, []);


  const handleGetWeather = useCallback(() => {
    performSearch(city);
  }, [city, performSearch]);

  const handleHistoryClick = useCallback((cityName: string) => {
    performSearch(cityName);
  }, [performSearch]);

  return {
    city,
    setCity,
    weather,
    error,
    loading,
    history,
    handleGetWeather,
    handleHistoryClick,
    performSearch,
    reset
  };
}