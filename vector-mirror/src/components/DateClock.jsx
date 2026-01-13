import React, { useState, useEffect } from 'react';
import { Text, Group, Stack } from '@mantine/core';

const DateClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Форматирование времени (12:45)
  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  // Форматирование даты (Понедельник, 13 Января)
  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <Stack gap={0}>
      {/* ОГРОМНОЕ ВРЕМЯ */}
      <Text 
        style={{ fontSize: '7rem', lineHeight: 0.8, fontWeight: 700, letterSpacing: '-2px' }}
        c="white"
      >
        {formatTime(time)}
      </Text>
      
      {/* ДАТА (Оранжевый акцент) */}
      <Text 
        size="xl" 
        fw={500} 
        tt="capitalize" 
        c="brand.5" // Твой оранжевый цвет из темы
        mt="md"
      >
        {formatDate(time)}
      </Text>
    </Stack>
  );
};

export default DateClock;