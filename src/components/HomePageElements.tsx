import { WeatherData } from "../types";

// Компонент заголовка приложения
export const Header = () => {
  return (
    <div>
      <h1 className="runApp">Enjoy your weather! 🌞</h1>
      <p className="orNot">... (or not 🌧️)</p>
    </div>
  );
};

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Компонент ввода
export const Input: React.FC<InputProps> = ({ value, onChange }) => {
  return (
    <input
      placeholder="Ваш город"
      className="input"
      value={value}
      onChange={onChange}
    />
  );
};

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

// Компонент кнопки
export const Button: React.FC<ButtonProps> = ({ onClick, disabled }) => {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      Get Weather
    </button>
  );
};

// Компонент результата
export const Result: React.FC<{ weather: WeatherData | null }> = ({
  weather,
}) => {
  if (!weather) return null;

  return (
    <div className="Result">
      <p>
        {weather.name}, {weather.sys.country}
      </p>
      <p>Температура: {Math.round(weather.main.temp)}°C</p>
      <p>Погода: {weather.weather[0]?.description ?? "нет данных"}</p>
      <p>Влажность: {weather.main.humidity}%</p>
    </div>
  );
};


// Компонент загрузки
export const Loader = () => {
  return <div className="loader">Загрузка...</div>;
};

// Компонент ошибки
export const ErrorMessage = ({ message }: { message: string }) => {
  return <div className="errors">{message}</div>;
};

// Компонент истории поиска
interface HistoryListProps {
  history: string[];
  onItemClick: (city: string) => void;
}

export const HistoryList = ({ history, onItemClick }: HistoryListProps) => {
  if (history.length === 0) return null;

  return (
    <div className="history">
      История поиска:
      <ul>
        {history.map((item, idx) => (
          <li key={idx} onClick={() => onItemClick(item)} style={{ cursor: "pointer" }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

