import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Vibration, SafeAreaView } from 'react-native';
import io from 'socket.io-client';

const socket = io('https://vector.yeee.kz', { transports: ['websocket'], query: { type: 'mobile' } });

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const send = (action) => { Vibration.vibrate(10); socket.emit('send_command', { action }); };

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
  }, []);

  const NavBtn = ({ title, action, style }) => (
    <TouchableOpacity style={[styles.navBtn, style]} onPress={() => send(action)}>
      <Text style={styles.navText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>VECTOR <Text style={{color:'#FF5700'}}>PRO</Text></Text>
        <View style={[styles.dot, { backgroundColor: isConnected ? '#0f0' : '#f00' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* ДЖОЙСТИК (D-PAD) */}
        <Text style={styles.label}>YOUTUBE NAVIGATION</Text>
        <View style={styles.dpadContainer}>
          <NavBtn title="▲" action="NAV_UP" style={styles.up} />
          <View style={styles.dpadRow}>
            <NavBtn title="◀" action="NAV_LEFT" />
            <NavBtn title="OK" action="NAV_ENTER" style={styles.okBtn} />
            <NavBtn title="▶" action="NAV_RIGHT" />
          </View>
          <NavBtn title="▼" action="NAV_DOWN" style={styles.down} />
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.backBtn} onPress={() => send('NAV_BACK')}><Text style={styles.navText}>BACK / ESC</Text></TouchableOpacity>
        </View>

        {/* ГРОМКОСТЬ */}
        <Text style={styles.label}>VOLUME CONTROL</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.volBtn} onPress={() => send('VOL_DOWN')}><Text style={styles.navText}>VOL -</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.volBtn, {backgroundColor:'#FF5700'}]} onPress={() => send('VOL_UP')}><Text style={[styles.navText, {color:'#000'}]}>VOL +</Text></TouchableOpacity>
        </View>

        {/* СИСТЕМА */}
        <Text style={styles.label}>SYSTEM & MEDIA</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={[styles.card, {backgroundColor:'#1a1a1a'}]} onPress={() => send('OPEN_YOUTUBE')}><Text style={styles.cardTxt}>📺 OPEN YT</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.card, {backgroundColor:'#300'}]} onPress={() => send('CLOSE_YOUTUBE')}><Text style={[styles.cardTxt, {color:'#f55'}]}>✖ CLOSE ALL</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => send('SCREEN_OFF')}><Text style={styles.cardTxt}>🌙 SLEEP</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => send('SCREEN_ON')}><Text style={styles.cardTxt}>☀️ WAKE</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => send('SLIDE_PREV')}><Text style={styles.cardTxt}>◀ SLIDE</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => send('SLIDE_NEXT')}><Text style={styles.cardTxt}>SLIDE ▶</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.reloadBtn} onPress={() => send('RELOAD')}><Text style={styles.reloadTxt}>REBOOT SYSTEM</Text></TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 3 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  scroll: { padding: 15 },
  label: { color: '#444', fontSize: 10, fontWeight: 'bold', marginVertical: 15, letterSpacing: 2 },
  dpadContainer: { alignItems: 'center', marginVertical: 10 },
  dpadRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  navBtn: { width: 70, height: 70, backgroundColor: '#111', borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  okBtn: { backgroundColor: '#222', borderColor: '#FF5700', marginHorizontal: 15 },
  navText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  backBtn: { flex: 1, height: 50, backgroundColor: '#111', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  volBtn: { flex: 1, height: 60, backgroundColor: '#111', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '48%', height: 80, backgroundColor: '#111', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cardTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  reloadBtn: { marginTop: 40, height: 50, borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  reloadTxt: { color: '#444', fontSize: 12, fontWeight: 'bold' }
});