import React, { useState, useEffect, useRef } from 'react';
import { Modal, Text, Group, ActionIcon, Stack, Button, RingProgress, Center, rem } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconRefresh, IconX, IconAlarm } from '@tabler/icons-react';

// Звук пищалки (Base64, чтобы работало сразу без файлов)
const ALARM_SOUND_URI = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; // (сократил для примера, полный код ниже)
// Реальный короткий звук "пик-пик"
const playAlarmSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "square";
    osc.frequency.value = 880; // Высокий писк
    osc.start();
    
    // Эффект прерывания (пик-пик-пик)
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    
    osc.stop(ctx.currentTime + 0.5);
};

const TimerApp = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(0); 
  const [isAlarming, setIsAlarming] = useState(false);
  const [flash, setFlash] = useState(false); // Для мигания

  // Логика таймера
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // ВРЕМЯ ВЫШЛО
      setIsActive(false);
      triggerAlarm();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Логика мигания и звука
  useEffect(() => {
    let alarmInterval = null;
    if (isAlarming) {
        // Мигаем каждые 500мс
        alarmInterval = setInterval(() => {
            setFlash(prev => !prev);
            playAlarmSound(); // Пищим
        }, 800);
    } else {
        setFlash(false);
    }
    return () => clearInterval(alarmInterval);
  }, [isAlarming]);

  const triggerAlarm = () => {
      setIsAlarming(true);
  };

  const stopAlarm = () => {
      setIsAlarming(false);
      setTimeLeft(0);
      setInitialTime(0);
  };

  const addTime = (seconds) => {
    if (isAlarming) stopAlarm();
    const newTime = timeLeft + seconds;
    setTimeLeft(newTime);
    setInitialTime(Math.max(initialTime, newTime));
  };

  const toggle = () => {
    if (isAlarming) {
        stopAlarm();
    } else if (timeLeft > 0) {
        setIsActive(!isActive);
    }
  };

  const reset = () => {
    setIsActive(false);
    setIsAlarming(false);
    setTimeLeft(0);
    setInitialTime(0);
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

  // Цвет интерфейса (если орет - красный, иначе оранжевый)
  const uiColor = isAlarming ? 'red' : 'orange';

  return (
    <Modal 
      opened={isOpen} 
      onClose={() => { stopAlarm(); onClose(); }} 
      withCloseButton={false} 
      centered
      size="auto" // Авто-размер контейнера
      overlayProps={{ backgroundOpacity: 0.8, blur: 5 }}
      styles={{
        content: { 
            backgroundColor: 'black', 
            // Если орет - рамка мигает
            border: `3px solid ${flash ? 'red' : '#333'}`, 
            borderRadius: 30,
            // Если орет - тень пульсирует
            boxShadow: flash ? '0 0 80px rgba(255, 0, 0, 0.6)' : 'none',
            transition: 'border 0.2s, box-shadow 0.2s'
        }
      }}
    >
      {/* Жесткая ширина w={320}, чтобы не было криво */}
      <Stack align="center" gap="md" p="xl" w={320}>
        
        {/* Хедер */}
        <Group justify="space-between" w="100%">
             <Group gap={5}>
                <IconAlarm size={20} color={uiColor} style={{ animation: isAlarming ? 'shake 0.5s infinite' : 'none' }} />
                <Text size="sm" tt="uppercase" c="dimmed" fw={700}>Timer</Text>
            </Group>
            <ActionIcon variant="subtle" color="gray" onClick={() => { stopAlarm(); onClose(); }}>
                <IconX size={20} />
            </ActionIcon>
        </Group>

        {/* Круг */}
        <RingProgress
          size={220}
          thickness={14}
          roundCaps
          sections={[{ value: isAlarming ? 100 : progress, color: uiColor }]}
          label={
            <Center>
              <Text c={flash ? "red" : "white"} fw={700} style={{ fontSize: 56, fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </Text>
            </Center>
          }
        />

        {/* Кнопки добавления времени (видны, когда не таймер не идет или на паузе) */}
        {!isActive && !isAlarming && (
            <Group gap={8} justify="center" w="100%">
                <Button variant="default" radius="xl" size="xs" onClick={() => addTime(60)} styles={{root: {borderColor: '#333', color: 'white', backgroundColor: 'transparent'}}}>+1 мин</Button>
                <Button variant="default" radius="xl" size="xs" onClick={() => addTime(300)} styles={{root: {borderColor: '#333', color: 'white', backgroundColor: 'transparent'}}}>+5 мин</Button>
                <Button variant="default" radius="xl" size="xs" onClick={() => addTime(10)} styles={{root: {borderColor: '#333', color: 'white', backgroundColor: 'transparent'}}}>+10 сек</Button>
            </Group>
        )}

        {/* Управление */}
        <Group gap="xl" mt="xs">
          <ActionIcon 
            variant="outline" 
            color="gray" 
            size={50} 
            radius="xl" 
            onClick={reset}
            style={{ borderWidth: 2 }}
          >
            <IconRefresh size={24} />
          </ActionIcon>

          <ActionIcon 
            variant="filled" 
            color={uiColor} 
            size={70} 
            radius="xl" 
            onClick={toggle}
            // Анимация кнопки при тревоге
            style={isAlarming ? { animation: 'pulse 1s infinite' } : {}}
          >
             {/* Если орет - иконка Стоп, если идет - Пауза, если стоит - Плей */}
             {isAlarming ? <IconX size={32} /> : (isActive ? <IconPlayerPause size={32} /> : <IconPlayerPlay size={32} />)}
          </ActionIcon>
        </Group>
      </Stack>
      
      {/* Стили анимации */}
      <style>{`
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes shake { 0% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } 100% { transform: rotate(0deg); } }
      `}</style>
    </Modal>
  );
};

export default TimerApp;