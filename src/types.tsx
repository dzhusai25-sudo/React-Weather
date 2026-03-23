export interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: Array<{ description: string }>;
}

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export interface HistoryListProps {
  history: string[];
  onItemClick: (city: string) => void;
}
