import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  console.log(`🔌 Подключился: ${socket.handshake.query.type || 'unknown'}`);

  socket.on('send_command', (cmd) => {
    console.log(`📡 Команда: ${cmd.action}`);
    io.emit('control_command', cmd); // Рассылаем всем
  });
});

httpServer.listen(5000, '0.0.0.0', () => console.log('🚀 Cloud Ready on port 5000'));