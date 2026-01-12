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
    origin: "*", // В продакшене заменим на адрес зеркала, пока разрешаем всем
    methods: ["GET", "POST"]
  }
});

// === СОБЫТИЯ SOCKET.IO (Real-time) ===
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // Пример получения данных от датчиков
  socket.on('sensor_data', (data) => {
    console.log('Received sensor data:', data);
    // Рассылаем данные всем подключенным (например, на зеркало)
    io.emit('update_mirror', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

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