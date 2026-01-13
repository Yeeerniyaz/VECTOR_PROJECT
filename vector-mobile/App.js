import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Vibration, ActivityIndicator 
} from 'react-native';
import io from 'socket.io-client';

// 🌍 ТВОЙ VPS (HTTPS) - Обновленный адрес
const SERVER_URL = 'https://vector.yeee.kz'; 

const socket = io(SERVER_URL, {
  transports: ['websocket'],
  query: { type: 'mobile_native' }
});

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    return () => { socket.off('connect'); socket.off('disconnect'); };
  }, []);

  const sendCmd = (action) => {
    Vibration.vibrate(10); // Легкая вибрация
    if (isConnected) {
      console.log('Sending:', action);
      socket.emit('send_command', { action });
    }
  };

  // Компонент Кнопки (Свой дизайн вместо Mantine)
  const Btn = ({ title, action, color = '#1a1a1a', txt = 'white', full = false }) => (
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: color, width: full ? '100%' : '48%' }]}
      activeOpacity={0.7}
      onPress={() => sendCmd(action)}
    >
      <Text style={[styles.txt, { color: txt }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.title}>VECTOR</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isConnected ? '#0f0' : '#333' }} />
            <Text style={{ color: '#666', fontSize: 12, fontWeight: 'bold' }}>
                {isConnected ? 'ONLINE' : 'CONNECTING...'}
            </Text>
        </View>
      </View>

      {/* Сетка кнопок */}
      <View style={styles.grid}>
        <View style={styles.row}>
          <Btn title="◀ НАЗАД" action="SLIDE_PREV" />
          <Btn title="ВПЕРЕД ▶" action="SLIDE_NEXT" />
        </View>

        <View style={{height: 20}} />
        <Btn title="📺 YOUTUBE" action="OPEN_YOUTUBE" full color="#222" />
        
        <View style={{height: 10}} />
        <View style={styles.row}>
          <Btn title="⏱ ТАЙМЕР" action="OPEN_TIMER" />
          <Btn title="❌ ЗАКРЫТЬ" action="CLOSE_MODAL" />
        </View>

        <View style={{height: 40}} />
        <Btn title="🔄 ПЕРЕЗАГРУЗКА" action="RELOAD" full color="#110500" txt="#FF5700" />
      </View>
      
      {/* Футер */}
      <Text style={{ position: 'absolute', bottom: 30, color: '#222', fontSize: 10 }}>
        CONNECTED TO: vector.yeee.kz
      </Text>
    </SafeAreaView>
  );
}

// СТИЛИ (Вместо CSS/Mantine)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: 5, marginBottom: 10 },
  grid: { width: '90%', maxWidth: 400 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { padding: 25, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  txt: { fontWeight: '700', fontSize: 14, letterSpacing: 1 }
});