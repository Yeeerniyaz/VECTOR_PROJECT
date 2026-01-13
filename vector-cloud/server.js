import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Загружаем переменные среды
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Настройка CORS (чтобы React и ESP32 не ругались)
app.use(cors());
app.use(express.json());

// Настройка Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Разрешаем подключение зеркалу
    methods: ["GET", "POST"]
  }
});

// === ЭМУЛЯЦИЯ ДАТЧИКОВ (Временная память) ===
let systemState = {
  roomTemp: 23.5,    // Температура
  roomHum: 45,       // Влажность
  co2: 400,          // CO2
  isPersonDetected: true,
  lastUpdate: new Date()
};

// === СОБЫТИЯ SOCKET.IO (Real-time) ===
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // 1. Сразу отправляем данные новому клиенту (Зеркалу)
  socket.emit('sensor_data', systemState);

  // 2. Слушаем данные от реальных датчиков (ESP32) - на будущее
  socket.on('sensor_update', (data) => {
    console.log('Received sensor data:', data);
    systemState = { ...systemState, ...data }; // Обновляем память
    io.emit('sensor_data', systemState); // Рассылаем всем
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// === СИМУЛЯЦИЯ ЖИЗНИ (Сердцебиение) ===
// Каждые 3 секунды чуть-чуть меняем температуру
setInterval(() => {
  const change = (Math.random() - 0.5) * 0.2; // +/- 0.1 градус
  systemState.roomTemp = parseFloat((systemState.roomTemp + change).toFixed(1));
  
  // Отправляем всем (Зеркалу) новые данные
  io.emit('sensor_data', systemState);
}, 3000);

// === API ROUTES (REST) ===
app.get('/', (req, res) => {
  res.send('VECTOR Cloud Server is Running! 🚀');
});

// Запуск сервера
httpServer.listen(PORT, () => {
  console.log(`
  ################################################
  🚀  Server listening on port: ${PORT}
  🔗  Local: http://localhost:${PORT}
  ################################################
  `);
});