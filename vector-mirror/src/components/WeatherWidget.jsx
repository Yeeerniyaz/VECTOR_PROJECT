/* src/components/WeatherWidget.jsx */
import { Stack, Text, Loader, Center } from "@mantine/core";
import {
  IconCloud,
  IconSun,
  IconSnowflake,
  IconCloudRain,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";

// Твой API ключ вставь сюда (или вынеси в .env файл)
const API_KEY = "d82f94bbc1428435ab35d6e4c872536f";
const CITY = "Almaty";

export function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Функция получения погоды
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=ru&appid=${API_KEY}`
        );
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка погоды:", error);
        setLoading(false);
      }
    };

    fetchWeather();
    // Обновляем каждые 10 минут (600000 мс)
    const timer = setInterval(fetchWeather, 600000);
    return () => clearInterval(timer);
  }, []);

  if (loading)
    return (
      <Center h="100%">
        <Loader color="red" />
      </Center>
    );
  if (!weather || !weather.main) return <Text c="dimmed">Ошибка данных</Text>;

  // Выбор иконки в зависимости от погоды
  const getIcon = (id) => {
    if (id >= 200 && id < 600)
      return <IconCloudRain size={64} color="skyblue" />;
    if (id >= 600 && id < 700) return <IconSnowflake size={64} color="white" />;
    if (id === 800) return <IconSun size={64} color="yellow" />;
    return <IconCloud size={64} color="gray" />;
  };

  /* src/components/WeatherWidget.jsx (только часть return) */
  // ... (логика та же)

  return (
    <Stack
      align="center"
      justify="center"
      h="100%"
      gap={0}
      style={{ overflow: "hidden" }}
    >
      {/* Иконку тоже можно чуть уменьшить или оставить как есть */}
      {getIcon(weather.weather[0].id)}

      {/* ТЕМПЕРАТУРА */}
      <Text
        fw={700}
        c="white"
        style={{
          fontSize: "clamp(2rem, 8vw, 4rem)", // <--- Умный размер
          lineHeight: 1,
        }}
      >
        {Math.round(weather.main.temp)}°
      </Text>

      {/* ГОРОД */}
      <Text c="dimmed" size="xs" tt="uppercase" mt={5}>
        {CITY}
      </Text>
    </Stack>
  );
}
