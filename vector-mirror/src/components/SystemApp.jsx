import React from 'react';
import { Modal, SimpleGrid, Text, Group, ActionIcon, Stack, UnstyledButton, ThemeIcon } from '@mantine/core';
import { IconX, IconPower, IconRefresh, IconTool, IconTerminal2 } from '@tabler/icons-react';

const SystemApp = ({ isOpen, onClose }) => {
  const handleAction = (action) => {
    if (window.electronAPI) {
      switch (action) {
        case 'RELOAD': window.electronAPI.reloadApp(); break;
        case 'DEVTOOLS': window.electronAPI.toggleDevTools(); break;
        case 'QUIT': window.electronAPI.quitApp(); break;
      }
    }
  };

  const SysBtn = ({ icon: Icon, title, color, action }) => (
    <UnstyledButton 
      onClick={() => handleAction(action)}
      style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20, border: '1px solid #333'
      }}
    >
      <ThemeIcon size={60} radius="xl" color={color} variant="filled"><Icon size={32} /></ThemeIcon>
      <Text mt="md" fw={500} c="white">{title}</Text>
    </UnstyledButton>
  );

  return (
    <Modal 
      opened={isOpen} onClose={onClose} withCloseButton={false} centered size="auto"
      overlayProps={{ backgroundOpacity: 0.8, blur: 5 }}
      styles={{ content: { backgroundColor: 'black', border: '2px solid #333', borderRadius: 30 } }}
    >
      <Stack w={350} p="md" gap="xl">
        <Group justify="space-between">
            <Group gap={5}>
                <IconTerminal2 size={20} color="gray"/>
                <Text size="sm" tt="uppercase" c="dimmed" fw={700}>System Control</Text>
            </Group>
            <ActionIcon variant="subtle" color="gray" onClick={onClose}><IconX size={20} /></ActionIcon>
        </Group>

        <SimpleGrid cols={2}>
            <SysBtn icon={IconRefresh} title="Перезапуск" color="blue" action="RELOAD" />
            <SysBtn icon={IconTool} title="Консоль" color="orange" action="DEVTOOLS" />
        </SimpleGrid>
        
        <UnstyledButton 
            onClick={() => handleAction('QUIT')}
            style={{ backgroundColor: 'rgba(255, 0, 0, 0.15)', borderRadius: 20, padding: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 0, 0, 0.3)' }}
        >
            <Group>
                <IconPower color="red" />
                <Text c="red" fw={700}>ВЫКЛЮЧИТЬ СИСТЕМУ</Text>
            </Group>
        </UnstyledButton>
      </Stack>
    </Modal>
  );
};

export default SystemApp;