import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket']
});

io.on('connection', (socket) => {
  const type = socket.handshake.query.type || "unknown";
  console.log(`🔌 [CONNECT] Тип: ${type}, ID: ${socket.id}`);

  socket.on('send_command', (cmd) => {
    console.log(`📡 [COMMAND] Отправлено: ${cmd.action}`);
    io.emit('control_command', cmd); // Трансляция всем
  });

  socket.on('disconnect', () => console.log(`❌ [DISCONNECT] ${type}`));
});

const PORT = 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 VECTOR SERVER READY ON PORT ${PORT}`);
});