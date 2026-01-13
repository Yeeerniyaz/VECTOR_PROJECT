import React, { useEffect, useState } from "react";
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
// import HealthWidget from './components/HealthWidget'; // <--- УБРАЛИ ЛИШНЕЕ
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

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("sensor_data", (data) => setSensorData(data));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("sensor_data");
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

        {/* СЛАЙДЕР */}
        <Carousel height="100vh" withIndicators loop withControls={false}>
          {/* Экран 1: Главный */}
          <Carousel.Slide>
            <DashboardSlide sensorData={sensorData} />
          </Carousel.Slide>

          {/* Экран 2: Меню приложений (Таймер, Система и т.д.) */}
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
