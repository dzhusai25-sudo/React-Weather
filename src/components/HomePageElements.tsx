import { WeatherData } from "../types";

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

export const Button: React.FC<ButtonProps> = ({ onClick, disabled }) => {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      Get Weather
    </button>
  );
};

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
