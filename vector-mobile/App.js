import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Vibration, ScrollView 
} from 'react-native';
import io from 'socket.io-client';

// 🌍 ТВОЙ СЕРВЕР
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

  const send = (action) => {
    Vibration.vibrate(15);
    if (isConnected) socket.emit('send_command', { action });
  };

  // Компонент Кнопки
  const Btn = ({ title, action, type = 'default', icon = '' }) => {
    let bg = '#1A1A1A';
    let txt = '#FFF';
    
    if (type === 'primary') { bg = '#FF5700'; txt = '#000'; }
    if (type === 'danger') { bg = '#330000'; txt = '#FF3333'; }
    if (type === 'active') { bg = '#333'; }

    return (
      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: bg }]} 
        activeOpacity={0.7}
        onPress={() => send(action)}
      >
        <Text style={[styles.btnTxt, { color: txt }]}>{icon} {title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>VECTOR <Text style={{color:'#FF5700'}}>/</Text> REMOTE</Text>
        <View style={styles.statusBadge}>
            <View style={[styles.dot, { bg: isConnected ? '#0F0' : '#333' }]} />
            <Text style={styles.statusTxt}>{isConnected ? 'ONLINE' : 'SEARCHING...'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* 1. УПРАВЛЕНИЕ СЛАЙДАМИ */}
        <Text style={styles.sectionTitle}>INTERFACE</Text>
        <View style={styles.row}>
            <Btn title="PREV" action="SLIDE_PREV" type="active" icon="◀" />
            <View style={{width:10}}/>
            <Btn title="NEXT" action="SLIDE_NEXT" type="active" icon="▶" />
        </View>

        {/* 2. МЕДИА (YOUTUBE) */}
        <Text style={styles.sectionTitle}>MEDIA CENTER</Text>
        <View style={styles.card}>
            <Btn title="OPEN YOUTUBE TV" action="OPEN_YOUTUBE" type="default" icon="📺" />
            <View style={{height:10}}/>
            {/* 🔥 ВОТ ОНА - КНОПКА ЗАКРЫТИЯ */}
            <Btn title="CLOSE MEDIA / APPS" action="CLOSE_YOUTUBE" type="danger" icon="✖" />
        </View>

        {/* 3. ПРИЛОЖЕНИЯ */}
        <Text style={styles.sectionTitle}>WIDGETS</Text>
        <View style={styles.grid}>
            <Btn title="TIMER" action="OPEN_TIMER" />
            <Btn title="SYSTEM" action="OPEN_SYSTEM" />
        </View>

        {/* 4. СИСТЕМА */}
        <Text style={styles.sectionTitle}>SYSTEM CONTROL</Text>
        <Btn title="RELOAD MIRROR" action="RELOAD" type="active" icon="🔄" />

      </ScrollView>

      <Text style={styles.footer}>CONNECTED TO: {SERVER_URL}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll: { padding: 20, paddingBottom: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 10, marginTop: 10 },
  logo: { color: '#FFF', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusTxt: { color: '#666', fontSize: 10, fontWeight: 'bold' },
  
  sectionTitle: { color: '#666', fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: 20, letterSpacing: 1 },
  
  row: { flexDirection: 'row', flex: 1 },
  grid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#222' },
  
  btn: { flex: 1, height: 60, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minWidth: '45%' },
  btnTxt: { fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  
  footer: { position: 'absolute', bottom: 10, alignSelf: 'center', color: '#222', fontSize: 9 }
});