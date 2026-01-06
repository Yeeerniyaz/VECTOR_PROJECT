/* src/App.jsx */
import { Container, Box, Text, Center, Stack } from "@mantine/core";
import { IconPlus, IconCloud, IconUserCircle } from "@tabler/icons-react";
import { WidgetCard } from "./components/WidgetCard";
import { ClockWidget } from "./components/ClockWidget";

// Настройка расположения (x, y, w, h)
const layoutConfig = [
  { id: "clock", x: 0, y: 0, w: 2, h: 2, type: "clock" }, // Часы слева
  { id: "weather", x: 2, y: 0, w: 2, h: 2, type: "weather" }, // Погода справа
  { id: "notes", x: 0, y: 2, w: 4, h: 2, type: "notes" }, // Заметки на всю ширину
  { id: "home", x: 0, y: 6, w: 2, h: 2, type: "home" }, // Управление домом (внизу)
];

function App() {
  const totalCols = 4;
  const totalRows = 8;

  return (
    <Container
      fluid
      h="100vh"
      p="md"
      style={{ background: "#000", overflow: "hidden" }}
    >
      {/* CSS GRID СЕТКА */}
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${totalCols}, 1fr)`,
          gridTemplateRows: `repeat(${totalRows}, 1fr)`,

          gap: "24px", // <--- ВОТ ЭТО ЧИСЛО ДЕЛАЕТ МАГИЮ

          height: "100%",
          width: "100%",
          padding: "24px", // Добавим и отступ от краев экрана
        }}
      >
        {/* Рендерим виджеты */}
        {layoutConfig.map((widget) => (
          <Box
            key={widget.id}
            style={{
              gridColumn: `span ${widget.w}`,
              gridRow: `span ${widget.h}`,
              // position: 'relative' // Если нужно будет что-то позиционировать
            }}
          >
            {/* ЧАСЫ */}
            {widget.type === "clock" && (
              <WidgetCard>
                <ClockWidget />
              </WidgetCard>
            )}

            {/* ПОГОДА */}
            {widget.type === "weather" && (
              <WidgetCard title="Weather">
                <Stack gap={0}>
                  <IconCloud size={50} color="white" />
                  <Text size="3rem" fw={300} style={{ lineHeight: 1 }}>
                    -5°
                  </Text>
                  <Text c="dimmed">Almaty</Text>
                </Stack>
              </WidgetCard>
            )}

            {/* ЗАМЕТКИ (Просто текст) */}
            {widget.type === "notes" && (
              <WidgetCard title="Tasks">
                <Stack gap="xs">
                  <Text size="lg">• Купить датчики</Text>
                  <Text size="lg">• Проверить код</Text>
                  <Text size="lg" c="dimmed" td="line-through">
                    • Собрать каркас
                  </Text>
                </Stack>
              </WidgetCard>
            )}

            {/* УМНЫЙ ДОМ */}
            {widget.type === "home" && (
              <WidgetCard title="Home">
                <Center
                  h="100%"
                  style={{ border: "1px solid #333", borderRadius: 16 }}
                >
                  <Text>Свет: ВЫКЛ</Text>
                </Center>
              </WidgetCard>
            )}
          </Box>
        ))}

        {/* ПУСТОЙ СЛОТ (Для примера, как добавить) */}
        <Box
          style={{
            gridColumn: "span 1",
            gridRow: "span 1",
            gridColumnStart: 4, // Ставим в 4 колонку
            gridRowStart: 8, // В самый низ
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.3, // Еле заметный
          }}
        >
          <div
            style={{
              border: "1px dashed gray",
              borderRadius: "50%",
              padding: 10,
            }}
          >
            <IconPlus size={20} color="gray" />
          </div>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
