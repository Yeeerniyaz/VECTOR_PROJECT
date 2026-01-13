import React, { useEffect, useState, useRef } from "react";
import { MantineProvider, createTheme, Box, Grid } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { io } from "socket.io-client";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

// Подключение к облаку
const socket = io("https://vector.yeee.kz", { 
  transports: ["websocket"],
  query: { type: "mirror" } 
});

function App() {
  const [isSleep, setIsSleep] = useState(false);
  const emblaRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => console.log("✅ [SOCKET] Connected to VPS"));
    
    socket.on("control_command", (cmd) => {
      console.log("📥 [SIGNAL] Получено:", cmd.action); // ПРОВЕРЯЙ В КОНСОЛИ (F12)
      
      const embla = emblaRef.current;

      switch (cmd.action) {
        case "SLIDE_NEXT": embla?.scrollNext(); break;
        case "SLIDE_PREV": embla?.scrollPrev(); break;
        case "VOL_UP": window.electronAPI?.systemVolume("UP"); break;
        case "VOL_DOWN": window.electronAPI?.systemVolume("DOWN"); break;
        case "VOL_MUTE": window.electronAPI?.systemVolume("MUTE"); break;
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
    <MantineProvider theme={createTheme({ primaryColor: "orange" })} defaultColorScheme="dark">
      <Box w="100vw" h="100vh" bg="black" c="white" style={{ overflow: "hidden", position: "relative" }}>
        <Carousel height="100vh" withControls={false} getEmblaApi={(api) => (emblaRef.current = api)}>
          <Carousel.Slide><Box p="xl"><h1>INTERFACE 1</h1></Box></Carousel.Slide>
          <Carousel.Slide><Box p="xl"><h1>INTERFACE 2</h1></Box></Carousel.Slide>
        </Carousel>

        {isSleep && (
          <Box onClick={() => setIsSleep(false)} style={{ position: "absolute", inset: 0, backgroundColor: "black", zIndex: 9999 }} />
        )}
      </Box>
    </MantineProvider>
  );
}
export default App;