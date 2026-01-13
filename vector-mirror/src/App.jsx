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

const socket = io("https://vector.yeee.kz", { query: { type: "mirror" } });

function App() {
  const [sensorData, setSensorData] = useState(null);
  const [activeApp, setActiveApp] = useState(null);
  const [isSleep, setIsSleep] = useState(false);
  const emblaRef = useRef(null);

  useEffect(() => {
    socket.on("sensor_data", setSensorData);
    socket.on("control_command", (cmd) => {
      switch (cmd.action) {
        case "SLIDE_NEXT": emblaRef.current?.scrollNext(); break;
        case "SLIDE_PREV": emblaRef.current?.scrollPrev(); break;
        case "OPEN_YOUTUBE": window.electronAPI?.openYouTube(); break;
        case "CLOSE_YOUTUBE": 
          window.electronAPI?.closeYouTube(); 
          setActiveApp(null); 
          setIsSleep(false);
          break;
        case "VOL_UP": window.electronAPI?.mediaVolume('UP'); break;
        case "VOL_DOWN": window.electronAPI?.mediaVolume('DOWN'); break;
        case "SCREEN_OFF": setIsSleep(true); break;
        case "SCREEN_ON": setIsSleep(false); break;
        case "APP_TIMER": setActiveApp("TIMER"); break;
        case "RELOAD": window.location.reload(); break;
      }
    });
    return () => socket.off();
  }, []);

  return (
    <MantineProvider theme={createTheme({ primaryColor: 'orange' })} defaultColorScheme="dark">
      <Box w="100vw" h="100vh" bg="black" c="white" style={{ overflow: "hidden" }}>
        
        <Carousel height="100vh" withControls={false} getEmblaApi={(embla) => (emblaRef.current = embla)}>
          <Carousel.Slide>
            <Grid p="xl">
              <Grid.Col span={7}><DateClock /></Grid.Col>
              <Grid.Col span={5}><WeatherWidget roomData={sensorData} /></Grid.Col>
            </Grid>
          </Carousel.Slide>
          <Carousel.Slide><AppsGrid onOpenApp={setActiveApp} /></Carousel.Slide>
        </Carousel>

        <TimerApp isOpen={activeApp === "TIMER"} onClose={() => setActiveApp(null)} />

        {/* SLEEP MODE OVERLAY */}
        {isSleep && (
          <Box onClick={() => setIsSleep(false)} style={{ position: 'absolute', inset: 0, bg: 'black', zIndex: 9999 }} />
        )}
      </Box>
    </MantineProvider>
  );
}
export default App;