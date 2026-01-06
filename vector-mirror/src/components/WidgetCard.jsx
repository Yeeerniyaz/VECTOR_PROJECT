/* src/components/WidgetCard.jsx */
import { Box, Text } from "@mantine/core";
/* src/components/WidgetCard.jsx */
// ... (импорты те же)



export function WidgetCard({ children, title, onClick }) {
  return (
    <Box
      h="100%"
      w="100%"
      p="md"
      onClick={onClick}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.03)", // Еле заметная подложка (3%)

        // ВОТ ОНО: Тонкая полупрозрачная рамка
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 24, // Скруглим углы, чтобы было мягче

        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        cursor: onClick ? "pointer" : "default",
        color: "white",
        transition: "all 0.3s ease", // Плавная анимация
      }}
      // Добавим подсветку при наведении (для удобства настройки)
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.8)"; // Ярче при наведении
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"; // Обратно тускло
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
      }}
    >
      {/* ... (внутри всё то же самое) ... */}
      {title && (
        <Text
          c="dimmed"
          size="xs"
          tt="uppercase"
          fw={700}
          mb="xs"
          style={{ letterSpacing: 2, opacity: 0.6 }}
        >
          {title}
        </Text>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </Box>
  );
}
