import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Vibration, SafeAreaView } from 'react-native';
import io from 'socket.io-client';

const socket = io('https://vector.yeee.kz', { transports: ['websocket'], query: { type: 'mobile' } });

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const send = (action) => { Vibration.vibrate(15); socket.emit('send_command', { action }); };

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
  }, []);

  const Card = ({ title, action, icon, color = '#111' }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={() => send(action)}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>VECTOR <Text style={{color:'#FF5700'}}>CORE</Text></Text>
        <View style={[styles.dot, { backgroundColor: isConnected ? '#0f0' : '#333' }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <Text style={styles.label}>NAVIGATION</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.navBtn} onPress={() => send('SLIDE_PREV')}><Text style={styles.navTxt}>BACK</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => send('SLIDE_NEXT')}><Text style={styles.navTxt}>NEXT</Text></TouchableOpacity>
        </View>

        <Text style={styles.label}>MEDIA</Text>
        <View style={styles.grid}>
          <Card title="YouTube" icon="📺" action="OPEN_YOUTUBE" />
          <Card title="Close" icon="✕" action="CLOSE_YOUTUBE" color="#200" />
        </View>

        <Text style={styles.label}>VOLUME</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.volBtn} onPress={() => send('VOL_DOWN')}><Text style={styles.navTxt}>-</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.volBtn, {backgroundColor:'#FF5700'}]} onPress={() => send('VOL_UP')}><Text style={[styles.navTxt, {color:'#000'}]}>+</Text></TouchableOpacity>
        </View>

        <Text style={styles.label}>SYSTEM</Text>
        <View style={styles.grid}>
          <Card title="Sleep" icon="🌙" action="SCREEN_OFF" />
          <Card title="Wake" icon="☀️" action="SCREEN_ON" />
          <Card title="Timer" icon="⏱" action="APP_TIMER" />
          <Card title="Reload" icon="🔄" action="RELOAD" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { color: '#444', fontSize: 10, fontWeight: 'bold', marginVertical: 15, letterSpacing: 2 },
  row: { flexDirection: 'row', gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  navBtn: { flex: 1, height: 60, backgroundColor: '#111', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  volBtn: { flex: 1, height: 50, backgroundColor: '#111', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  navTxt: { color: '#fff', fontWeight: 'bold' },
  card: { width: '48%', height: 100, borderRadius: 20, padding: 15, justifyContent: 'center' },
  cardIcon: { fontSize: 20, marginBottom: 5 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});