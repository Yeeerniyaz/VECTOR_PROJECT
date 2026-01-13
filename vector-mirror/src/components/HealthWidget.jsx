import React from 'react';
import { RingProgress, Text, Group, Stack, Paper, Center } from '@mantine/core';
import { IconFlame, IconShoe, IconTarget } from '@tabler/icons-react';

const HealthWidget = () => {
  // Фейковые данные (потом будем тянуть из Google Fit)
  const stats = {
    steps: 6540,
    stepsGoal: 10000,
    calories: 420,
    caloriesGoal: 600,
  };

  return (
    <Stack align="center" justify="center" h="100%">
      
      {/* ЗАГОЛОВОК */}
      <Text size="xl" fw={700} mb="xl" style={{ letterSpacing: '2px' }}>
        АКТИВНОСТЬ СЕГОДНЯ
      </Text>

      <Group gap={50}>
        
        {/* КОЛЬЦО 1: ШАГИ (Оранжевое) */}
        <Stack align="center" gap="xs">
          <RingProgress
            size={160}
            thickness={12}
            roundCaps
            sections={[{ value: (stats.steps / stats.stepsGoal) * 100, color: '#FF5700' }]}
            label={
              <Center>
                <IconShoe size={40} color="#FF5700" />
              </Center>
            }
          />
          <Text fw={700} size="lg">{stats.steps}</Text>
          <Text size="xs" c="dimmed">шагов</Text>
        </Stack>

        {/* КОЛЬЦО 2: КАЛОРИИ (Белое) */}
        <Stack align="center" gap="xs">
          <RingProgress
            size={160}
            thickness={12}
            roundCaps
            sections={[{ value: (stats.calories / stats.caloriesGoal) * 100, color: 'white' }]}
            label={
              <Center>
                <IconFlame size={40} color="white" />
              </Center>
            }
          />
          <Text fw={700} size="lg">{stats.calories}</Text>
          <Text size="xs" c="dimmed">ккал</Text>
        </Stack>

      </Group>

      {/* НИЖНИЙ БЛОК: СТАТУС */}
      <Paper 
        mt="xl" 
        p="md" 
        radius="md" 
        style={{ border: '1px solid #333', background: 'transparent' }}
      >
        <Group>
          <IconTarget size={20} color="gray" />
          <Text size="sm" c="dimmed">
            Цель выполнена на {Math.round((stats.steps / stats.stepsGoal) * 100)}%
          </Text>
        </Group>
      </Paper>

    </Stack>
  );
};

export default HealthWidget;