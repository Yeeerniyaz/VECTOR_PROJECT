/* src/components/ClockWidget.jsx */
import { Text, Stack } from '@mantine/core';
import { useState, useEffect } from 'react';

export function ClockWidget() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateString = date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <Stack gap={0} justify="center" h="100%" style={{ overflow: 'hidden' }}>
      {/* ВРЕМЯ: используем clamp(минимум, идеал, максимум) */}
      <Text 
        c="white" 
        style={{ 
          // ШРИФТ ТЕПЕРЬ РЕЗИНОВЫЙ:
          // Минимально 3rem, Максимально 12vw (от ширины экрана), но не больше 6rem
          fontSize: 'clamp(3rem, 12vw, 6rem)', 
          fontWeight: 700, 
          lineHeight: 0.9,
          letterSpacing: '-2px',
          whiteSpace: 'nowrap' // Запрещаем перенос строки
        }}
      >
        {timeString}
      </Text>
      
      {/* ДАТА */}
      <Text 
        c="red" 
        tt="uppercase" 
        fw={700}
        style={{ 
            fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', // Тоже резиновая
            letterSpacing: '2px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }}
      >
        {dateString}
      </Text>
    </Stack>
  );
}