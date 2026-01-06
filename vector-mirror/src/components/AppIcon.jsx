/* src/components/AppIcon.jsx */
import { Paper, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useHover } from '@mantine/hooks';

export function AppIcon({ icon: Icon, label, color = 'dark' }) {
  const { hovered, ref } = useHover();

  return (
    <UnstyledButton ref={ref} style={{ width: '100%', height: '100%' }}>
      <Paper 
        h="100%" 
        bg={hovered ? '#1A1A1A' : 'transparent'} 
        style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 16,
            transition: 'background-color 0.2s ease'
        }}
      >
        <ThemeIcon 
            size={80} 
            radius="xl" 
            variant={hovered ? 'filled' : 'light'} 
            color={color === 'dark' ? 'gray' : color}
            style={{ transition: 'all 0.2s ease' }}
        >
          <Icon size={40} stroke={1.5} />
        </ThemeIcon>
        
        <Text c="white" mt="sm" size="lg" fw={500}>
          {label}
        </Text>
      </Paper>
    </UnstyledButton>
  );
}