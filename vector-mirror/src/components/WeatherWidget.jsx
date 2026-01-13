import React, { useEffect, useState } from "react";
import { Group, Stack, Text, ThemeIcon, Loader } from "@mantine/core";
import { IconSun, IconCloud, IconCloudRain, IconCloudSnow, IconCloudStorm, IconMist, IconHome } from "@tabler/icons-react";

const WeatherWidget = ({ roomData }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Координаты Алматы
  const LAT = 43.25;
  const LON = 76.92;

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,weather_code&timezone=auto`
      );
      const data = await res.json();
      setWeather(data.current);
    } catch (error) {
      console.error("Ошибка погоды:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const timer = setInterval(fetchWeather, 900000); // 15 мин
    return () => clearInterval(timer);
  }, []);

  const getWeatherInfo = (code) => {
    if (code === 0) return { icon: IconSun, label: "Ясно" };
    if (code >= 1 && code <= 3) return { icon: IconCloud, label: "Облачно" };
    if (code >= 45 && code <= 48) return { icon: IconMist, label: "Туман" };
    if (code >= 51 && code <= 67) return { icon: IconCloudRain, label: "Дождь" };
    if (code >= 71 && code <= 77) return { icon: IconCloudSnow, label: "Снег" };
    if (code >= 95) return { icon: IconCloudStorm, label: "Гроза" };
    return { icon: IconCloud, label: "Пасмурно" };
  };

  if (loading) return <Loader color="orange" size="sm" />;
  if (!weather) return <Text c="dimmed">Нет данных</Text>;

  const info = getWeatherInfo(weather.weather_code);
  const Icon = info.icon;

  return (
    <Stack align="flex-end" gap="xs">
      <Group align="center" gap="sm">
        <ThemeIcon variant="transparent" size={60} c="white">
          <Icon size={60} stroke={1.5} />
        </ThemeIcon>
        <Stack gap={0} align="flex-start">
          <Text size="3rem" fw={700} lh={1}>{Math.round(weather.temperature_2m)}°</Text>
          <Text size="sm" c="dimmed" tt="capitalize">{info.label}, {Math.round(weather.apparent_temperature)}°</Text>
        </Stack>
      </Group>

      <Group mt="md" gap="xs" style={{ opacity: 0.8 }}>
        <IconHome size={20} color="#FF5700" />
        <Text size="md" fw={500}>
          Дом: {roomData ? roomData.roomTemp : '--'}°C • {roomData ? roomData.roomHum : '--'}%
        </Text>
      </Group>
    </Stack>
  );
};

export default WeatherWidget;