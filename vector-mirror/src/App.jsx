import React, { useEffect, useState, useRef } from "react";
import { Box, MantineProvider } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { io } from "socket.io-client";

const socket = io("https://vector.yeee.kz", { 
  transports: ['websocket'],
  query: { type: "mirror" } 
});

function App() {
  const [isSleep, setIsSleep] = useState(false);
  const emblaRef = useRef(null);

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
    <MantineProvider defaultColorScheme="dark">
      <Box w="100vw" h="100vh" bg="black" style={{ position: 'relative', overflow: 'hidden' }}>
        <Carousel withControls={false} getEmblaApi={(api) => (emblaRef.current = api)}>
          <Carousel.Slide><Box p="xl"><h1>VECTOR CORE</h1></Box></Carousel.Slide>
          <Carousel.Slide><Box p="xl"><h1>APPS GRID</h1></Box></Carousel.Slide>
        </Carousel>

        {isSleep && (
          <Box onClick={() => setIsSleep(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'black', zIndex: 9999 }} />
        )}
      </Box>
    </MantineProvider>
  );
}
export default App;