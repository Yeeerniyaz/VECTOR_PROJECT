import React from "react";
import { SimpleGrid, UnstyledButton, Text, Stack, ThemeIcon } from "@mantine/core";
import { IconBrandYoutube, IconCalendar, IconClockPlay, IconCurrencyBitcoin, IconHomeBolt, IconTerminal2 } from "@tabler/icons-react";

const apps = [
  { title: "YouTube TV", icon: IconBrandYoutube, color: "red", action: "OPEN_YOUTUBE" },
  { title: "Таймер", icon: IconClockPlay, color: "orange", action: "OPEN_TIMER" },
  { title: "Календарь", icon: IconCalendar, color: "blue" },
  { title: "Финансы", icon: IconCurrencyBitcoin, color: "yellow" },
  { title: "Дом", icon: IconHomeBolt, color: "teal" },
  { title: "Система", icon: IconTerminal2, color: "gray", action: "OPEN_SYSTEM" },
];

const AppsGrid = ({ onOpenApp }) => {
  const handleAppClick = (action) => {
    if (action === "OPEN_YOUTUBE") {
      if (window.electronAPI) {
        window.electronAPI.openYouTube();
      } else {
        alert("Запустите через Electron!");
      }
    } 
    else if (action === "OPEN_TIMER") {
      if (onOpenApp) onOpenApp("TIMER");
    } 
    else if (action === "OPEN_SYSTEM") {
      if (onOpenApp) onOpenApp("SYSTEM");
    }
  };

  return (
    <Stack justify="center" h="100%" p="xl">
      <Text size="xl" fw={700} ta="center" mb="xl">МЕНЮ ПРИЛОЖЕНИЙ</Text>
      <SimpleGrid cols={3} spacing="lg" verticalSpacing="xl">
        {apps.map((app) => (
          <UnstyledButton
            key={app.title}
            onClick={() => app.action && handleAppClick(app.action)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "10px", borderRadius: "15px",
              opacity: app.action ? 1 : 0.5
            }}
          >
            <ThemeIcon size={60} radius="md" variant="light" color={app.color} style={{ background: "rgba(255,255,255,0.1)" }}>
              <app.icon size={35} stroke={1.5} />
            </ThemeIcon>
            <Text size="sm" mt="sm" fw={500}>{app.title}</Text>
          </UnstyledButton>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default AppsGrid;