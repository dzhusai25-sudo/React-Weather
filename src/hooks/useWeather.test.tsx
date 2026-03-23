import { renderHook, act } from '@testing-library/react';
import { useWeather } from './useWeather';
import { getWeather } from '../services/getWeather';

jest.mock('../services/getWeather');
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
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  test('инициализация с пустой историей', () => {
    const { result } = renderHook(() => useWeather());
    expect(result.current.city).toBe('');
    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.history).toEqual([]);
  });

  test('загрузка истории из localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(['Moscow', 'London']));
    const { result } = renderHook(() => useWeather());
    expect(result.current.history).toEqual(['Moscow', 'London']);
  });

  test('performSearch получает данные и обновляет историю', async () => {
    const mockWeather = {
      name: 'Moscow',
      sys: { country: 'RU' },
      main: { temp: 15, humidity: 70 },
      weather: [{ description: 'ясно' }],
    };
    mockGetWeather.mockResolvedValueOnce(mockWeather);

    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.performSearch('Moscow');
    });

    expect(mockGetWeather).toHaveBeenCalledWith('Moscow');
    expect(result.current.weather).toEqual(mockWeather);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.history).toEqual(['Moscow']);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('weatherHistory', JSON.stringify(['Moscow']));
  });

  test('performSearch с пустым городом устанавливает ошибку', async () => {
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.performSearch('');
    });
    expect(result.current.error).toBe('Введите название города');
    expect(result.current.loading).toBe(false);
    expect(result.current.weather).toBeNull();
  });

  test('performSearch с ошибкой API', async () => {
    mockGetWeather.mockRejectedValueOnce(new Error('Ошибка API'));
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.performSearch('Invalid');
    });
    expect(result.current.error).toBe('Ошибка API');
    expect(result.current.loading).toBe(false);
    expect(result.current.weather).toBeNull();
    expect(result.current.history).toEqual([]); // история не обновляется
  });

  test('reset сбрасывает погоду, ошибку и город', async () => {
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.performSearch('Moscow');
    });
    expect(result.current.weather).not.toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe('');
    expect(result.current.city).toBe('');
  });

  test('handleGetWeather вызывает performSearch с текущим городом', async () => {
    const { result } = renderHook(() => useWeather());
    act(() => {
      result.current.setCity('Moscow');
    });
    mockGetWeather.mockResolvedValueOnce({
      name: 'Moscow',
      sys: { country: 'RU' },
      main: { temp: 15, humidity: 70 },
      weather: [{ description: 'ясно' }],
    });
    await act(async () => {
      await result.current.handleGetWeather();
    });
    expect(mockGetWeather).toHaveBeenCalledWith('Moscow');
  });

  test('handleHistoryClick вызывает performSearch с переданным городом', async () => {
    const { result } = renderHook(() => useWeather());
    mockGetWeather.mockResolvedValueOnce({
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 12, humidity: 75 },
      weather: [{ description: 'пасмурно' }],
    });
    await act(async () => {
      await result.current.handleHistoryClick('London');
    });
    expect(mockGetWeather).toHaveBeenCalledWith('London');
    expect(result.current.history).toEqual(['London']);
  });
});