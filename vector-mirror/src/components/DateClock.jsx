import React, { useState, useEffect } from 'react';
import { Stack, Text, Group } from '@mantine/core';

const DateClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Форматирование времени (HH:MM)
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  // Дата на РУССКОМ (Понедельник, 13 января)
  const dateString = time.toLocaleDateString('ru-RU', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <Stack gap={0}>
      {/* Время: Огромное и жирное */}
      <Group align="baseline" gap="xs">
        <Text 
          c="white" 
          style={{ 
            fontSize: '8rem', // Крупный размер
            fontWeight: 700, 
            lineHeight: 0.8,
            letterSpacing: '-4px',
            fontFamily: 'Segoe UI, sans-serif'
          }}
        >
          {hours}:{minutes}
        </Text>
        {/* Секунды поменьше */}
        <Text 
          c="dimmed" 
          style={{ fontSize: '3rem', fontWeight: 300 }}
        >
          {seconds}
        </Text>
      </Group>

      {/* Дата: Оранжевый акцент, заглавные буквы */}
      <Text 
        size="xl" 
        fw={600} 
        tt="uppercase" 
        c="orange" 
        ls={2} // Немного разрядки для красоты
        mt="sm"
      >
        {dateString}
      </Text>
    </Stack>
  );
};

export default DateClock;