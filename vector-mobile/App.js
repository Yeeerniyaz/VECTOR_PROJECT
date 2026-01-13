import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Vibration,
  SafeAreaView,
} from "react-native";
import io from "socket.io-client";

const socket = io("https://vector.yeee.kz", {
  transports: ["websocket"],
  query: { type: "mobile" },
});

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const send = (action) => {
    Vibration.vibrate(10);
    socket.emit("send_command", { action });
  };

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
  }, []);

  const RoundBtn = ({ icon, action, color = "#0A0A0A" }) => (
    <TouchableOpacity
      style={[styles.roundBtn, { backgroundColor: color }]}
      onPress={() => send(action)}
    >
      <Text style={styles.btnTxt}>{icon}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          V E C T O R <Text style={{ color: "#FF5700" }}>●</Text>
        </Text>
        <View
          style={[
            styles.status,
            { backgroundColor: isConnected ? "#0f0" : "#333" },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.dpad}>
          <RoundBtn icon="▲" action="KEY_UP" />
          <View style={styles.dpadRow}>
            <RoundBtn icon="◀" action="KEY_LEFT" />
            <TouchableOpacity
              style={styles.center}
              onPress={() => send("KEY_ENTER")}
            >
              <View style={styles.dot} />
            </TouchableOpacity>
            <RoundBtn icon="▶" action="KEY_RIGHT" />
          </View>
          <RoundBtn icon="▼" action="KEY_DOWN" />
        </View>

        <View style={styles.ctrlGrid}>
          <View style={styles.volStack}>
            <TouchableOpacity
              style={styles.vBtn}
              onPress={() => send("VOL_UP")}
            >
              <Text style={styles.vTxt}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.vBtn, { backgroundColor: "#FF5700" }]}
              onPress={() => send("VOL_MUTE")}
            >
              <Text style={styles.vTxt}>M</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.vBtn}
              onPress={() => send("VOL_DOWN")}
            >
              <Text style={styles.vTxt}>-</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.navStack}>
            <TouchableOpacity
              style={styles.lBtn}
              onPress={() => send("KEY_BACK")}
            >
              <Text style={styles.lTxt}>ESC / BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.lBtn}
              onPress={() => send("SLIDE_PREV")}
            >
              <Text style={styles.lTxt}>PREVIOUS SLIDE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.lBtn}
              onPress={() => send("SLIDE_NEXT")}
            >
              <Text style={styles.lTxt}>NEXT SLIDE</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.apps}>
          <TouchableOpacity
            style={styles.app}
            onPress={() => send("OPEN_YOUTUBE")}
          >
            <Text style={{ color: "#fff" }}>YT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.app, { borderColor: "#FF5700" }]}
            onPress={() => send("CLOSE_YOUTUBE")}
          >
            <Text style={{ color: "#FF5700" }}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.app}
            onPress={() => send("SCREEN_OFF")}
          >
            <Text style={{ color: "#fff" }}>🌙</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.app} onPress={() => send("RELOAD")}>
            <Text style={{ color: "#fff" }}>🔄</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    padding: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { color: "#fff", fontSize: 16, letterSpacing: 8, fontWeight: "200" },
  status: { width: 4, height: 4, borderRadius: 2 },
  scroll: { paddingHorizontal: 25 },
  dpad: { alignItems: "center", marginVertical: 20 },
  dpadRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  roundBtn: {
    width: 65,
    height: 65,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#111",
  },
  center: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  dot: { width: 15, height: 15, borderRadius: 8, backgroundColor: "#FF5700" },
  btnTxt: { color: "#fff", fontSize: 24 },
  ctrlGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  volStack: { width: "22%", gap: 10 },
  vBtn: {
    height: 60,
    backgroundColor: "#111",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  vTxt: { color: "#fff", fontWeight: "bold" },
  navStack: { width: "73%", gap: 10 },
  lBtn: {
    flex: 1,
    backgroundColor: "#080808",
    borderRadius: 30,
    justifyContent: "center",
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: "#111",
  },
  lTxt: { color: "#444", fontSize: 10, fontWeight: "bold" },
  apps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 50,
  },
  app: {
    width: "22%",
    height: 75,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
});
