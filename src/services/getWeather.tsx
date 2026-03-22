export async function getWeather(city: string) {
  const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
  const apiId = "97d93f1704dcb8e35dd2045c8e75710d";
  const response = await fetch(
    `${baseUrl}?units=metric&q=${city}&appid=${apiId}&lang=ru`,
  );

  if (!response.ok) {
    if (response.status === 404) throw new Error("Город не найден");
    throw new Error("Ошибка API");
  }

  return await response.json();
}
