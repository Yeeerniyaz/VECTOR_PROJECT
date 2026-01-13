import React, { useEffect, useState, useRef } from "react";
import {
  MantineProvider,
  createTheme,
  Box,
  Grid,
  Group,
  Text,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { io } from "socket.io-client";
import { IconBulb } from "@tabler/icons-react";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

// Импорт компонентов
import DateClock from "./components/DateClock";
import WeatherWidget from "./components/WeatherWidget";
import AppsGrid from "./components/AppsGrid";
import TimerApp from "./components/TimerApp";
import SystemApp from "./components/SystemApp";

const theme = createTheme({
  fontFamily: "Segoe UI, sans-serif",
  colors: {
    brand: [
      "#FFF0E6",
      "#FFD1B3",
      "#FFB380",
      "#FF944D",
      "#FF751A",
      "#FF5700",
      "#CC4600",
      "#993400",
      "#662300",
      "#331100",
    ],
  },
  primaryColor: "brand",
});

// Подключаемся к VPS
const socket = io("https://vector.yeee.kz", { query: { type: "mirror" } });

// --- СЛАЙД 1: ДАШБОРД ---
const DashboardSlide = ({ sensorData }) => (
  <Box
    p="xl"
    h="100%"
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Grid align="flex-start" gutter={50}>
      <Grid.Col span={7}>
        <DateClock />
      </Grid.Col>
      <Grid.Col
        span={5}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <WeatherWidget roomData={sensorData} />
      </Grid.Col>
    </Grid>
    <Box>
      <Group justify="center" gap="xs" style={{ opacity: 0.7 }}>
        <IconBulb size={24} color="#FF5700" />
        <Text size="lg" ta="center" c="dimmed">
          VECTOR SYSTEM ONLINE
        </Text>
      </Group>
    </Box>
  </Box>
);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sensorData, setSensorData] = useState(null);
  const [activeApp, setActiveApp] = useState(null);

  // Ссылка для управления слайдером
  const emblaRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("sensor_data", (data) => setSensorData(data));

    // 🔥 ДОБАВЛЕНО: Слушаем команды с телефона
    socket.on("control_command", (cmd) => {
      console.log("⚡ Команда:", cmd.action);

      switch (cmd.action) {
        case "SLIDE_NEXT":
          emblaRef.current?.scrollNext();
          break;
        case "SLIDE_PREV":
          emblaRef.current?.scrollPrev();
          break;
        case "OPEN_YOUTUBE":
          if (window.electronAPI) window.electronAPI.openYouTube();
          break;
        case "OPEN_TIMER":
          setActiveApp("TIMER");
          break;
        case "CLOSE_MODAL":
          setActiveApp(null);
          break;
        case "RELOAD":
          if (window.electronAPI) window.electronAPI.reloadApp();
          else window.location.reload();
          break;
        case "CLOSE_YOUTUBE":
          // Закрываем окно Electron
          if (window.electronAPI) window.electronAPI.closeYouTube();
          // И заодно закрываем модалки React
          setActiveApp(null);
          break;
        default:
          console.warn("Неизвестная команда:", cmd.action);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("sensor_data");
      socket.off("control_command"); // Не забываем отписаться
    };
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Box
        w="100vw"
        h="100vh"
        bg="black"
        c="white"
        style={{ overflow: "hidden", position: "relative" }}
      >
        {/* Индикатор статуса */}
        <Box
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1000,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: isConnected ? "#0f0" : "#333",
          }}
        />

        {/* СЛАЙДЕР (Добавили getEmblaApi) */}
        <Carousel
          height="100vh"
          withIndicators
          loop
          withControls={false}
          getEmblaApi={(embla) => (emblaRef.current = embla)}
        >
          <Carousel.Slide>
            <DashboardSlide sensorData={sensorData} />
          </Carousel.Slide>

          <Carousel.Slide>
            <AppsGrid onOpenApp={setActiveApp} />
          </Carousel.Slide>
        </Carousel>

        {/* --- МОДАЛЬНЫЕ ОКНА --- */}
        <TimerApp
          isOpen={activeApp === "TIMER"}
          onClose={() => setActiveApp(null)}
        />

        <SystemApp
          isOpen={activeApp === "SYSTEM"}
          onClose={() => setActiveApp(null)}
        />
      </Box>
    </MantineProvider>
  );
}

export default App;
