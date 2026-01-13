import React, { useEffect, useState, useRef } from "react";
import { MantineProvider, createTheme, Box, Grid } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { io } from "socket.io-client";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

import DateClock from "./components/DateClock";
import WeatherWidget from "./components/WeatherWidget";
import AppsGrid from "./components/AppsGrid";
import TimerApp from "./components/TimerApp";

// - Обнови строку подключения:
const socket = io("https://vector.yeee.kz", { 
  transports: ["websocket"], // Добавь это!
  query: { type: "mirror" } 
});

function App() {
  const [sensorData, setSensorData] = useState(null);
  const [activeApp, setActiveApp] = useState(null);
  const [isSleep, setIsSleep] = useState(false); // Состояние сна
  const emblaRef = useRef(null);

  // ... внутри компонента App ...
useEffect(() => {
    socket.on("control_command", (cmd) => {
      console.log("📥 Signal:", cmd.action);
      const embla = emblaRef.current;
      const isAnimating = embla && !embla.internalEngine().animator.isTargetReached();

      switch (cmd.action) {
        case "SLIDE_NEXT": if (!isAnimating) embla?.scrollNext(); break;
        case "SLIDE_PREV": if (!isAnimating) embla?.scrollPrev(); break;
        
        // Громкость
        case "VOL_UP": window.electronAPI?.systemVolume("UP"); break;
        case "VOL_DOWN": window.electronAPI?.systemVolume("DOWN"); break;
        case "VOL_MUTE": window.electronAPI?.systemVolume("MUTE"); break;

        // Клавиатура (YouTube / Система)
        case "KEY_UP": window.electronAPI?.sendKey("Up"); break;
        case "KEY_DOWN": window.electronAPI?.sendKey("Down"); break;
        case "KEY_LEFT": window.electronAPI?.sendKey("Left"); break;
        case "KEY_RIGHT": window.electronAPI?.sendKey("Right"); break;
        case "KEY_ENTER": window.electronAPI?.sendKey("Enter"); break;
        case "KEY_BACK": window.electronAPI?.sendKey("Escape"); break;

        case "OPEN_YOUTUBE": window.electronAPI?.openYouTube(); break;
        case "CLOSE_YOUTUBE": window.electronAPI?.closeYouTube(); break;
        case "SCREEN_OFF": setIsSleep(true); break;
        case "SCREEN_ON": setIsSleep(false); break;
        case "RELOAD": window.location.reload(); break;
      }
    });
    return () => socket.off();
  }, []);
  return (
    <MantineProvider
      theme={createTheme({ primaryColor: "orange" })}
      defaultColorScheme="dark"
    >
      <Box
        w="100vw"
        h="100vh"
        bg="black"
        c="white"
        style={{ overflow: "hidden", position: "relative" }}
      >
        <Carousel
          height="100vh"
          withControls={false}
          getEmblaApi={(embla) => (emblaRef.current = embla)}
        >
          <Carousel.Slide>
            <Grid p="xl">
              <Grid.Col span={7}>
                <DateClock />
              </Grid.Col>
              <Grid.Col span={5}>
                <WeatherWidget roomData={sensorData} />
              </Grid.Col>
            </Grid>
          </Carousel.Slide>
          <Carousel.Slide>
            <AppsGrid onOpenApp={setActiveApp} />
          </Carousel.Slide>
        </Carousel>

        <TimerApp
          isOpen={activeApp === "TIMER"}
          onClose={() => setActiveApp(null)}
        />

        {/* --- ЧЕРНЫЙ ЭКРАН (SLEEP MODE) --- */}
        {isSleep && (
          <Box
            onClick={() => setIsSleep(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              zIndex: 9999,
              cursor: "none",
            }}
          />
        )}
      </Box>
    </MantineProvider>
  );
}

export default App;
