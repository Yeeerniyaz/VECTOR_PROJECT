import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Создаем сервер
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Настройка CORS (разрешаем всем: и зеркалу, и телефону, и ESP32)
app.use(cors());
app.use(express.json());

// Настройка Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Разрешаем подключение с любых IP (важно для VPS)
    methods: ["GET", "POST"]
  }
});

// === ЭМУЛЯЦИЯ ДАТЧИКОВ (Память сервера) ===
let systemState = {
  roomTemp: 23.5,    // Температура
  roomHum: 45,       // Влажность
  co2: 400,          // CO2
  isPersonDetected: true,
  lastUpdate: new Date()
};

// === СОБЫТИЯ SOCKET.IO (Real-time) ===
io.on('connection', (socket) => {
  // Смотрим, кто подключился (зеркало или телефон?)
  const clientType = socket.handshake.query.type || "unknown";
  console.log(`🔌 Подключился: ${clientType} (${socket.id})`);

  // 1. Сразу отправляем данные датчиков новому клиенту
  socket.emit('sensor_data', systemState);

  // 2. Слушаем данные от реальных датчиков (ESP32)
  socket.on('sensor_update', (data) => {
    console.log('📡 Данные от ESP32:', data);
    systemState = { ...systemState, ...data }; 
    io.emit('sensor_data', systemState); // Рассылаем всем
  });

  // 3. 🔥 ГЛАВНОЕ: СЛУШАЕМ КОМАНДЫ С ТЕЛЕФОНА
  // (Без этого пульт работать не будет)
  socket.on('send_command', (command) => {
    console.log(`📱 Команда с телефона: ${command.action}`);
    
    // Пересылаем команду Зеркалу (broadcast)
    io.emit('control_command', command); 
  });

  socket.on('disconnect', () => {
    console.log(`❌ Отключился: ${clientType}`);
  });
});

// === СИМУЛЯЦИЯ ЖИЗНИ (пока нет ESP32) ===
// Каждые 3 секунды чуть меняем данные, чтобы видеть, что сервер не завис
setInterval(() => {
  const change = (Math.random() - 0.5) * 0.2; 
  systemState.roomTemp = parseFloat((systemState.roomTemp + change).toFixed(1));
  
  // Рассылаем обновление (чтобы цифры на зеркале менялись)
  io.emit('sensor_data', systemState);
}, 3000);

// === ПРОВЕРКА ===
app.get('/', (req, res) => {
  res.send('VECTOR Cloud Server is Running! 🚀 (ES Modules Mode)');
});

// Запуск
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ################################################
  🚀  Server listening on port: ${PORT}
  🔗  Link: http://localhost:${PORT}
  ################################################
  `);
});