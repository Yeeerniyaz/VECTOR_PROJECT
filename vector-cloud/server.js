import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket'] // Форсируем вебсокеты для VPS
});

io.on('connection', (socket) => {
  const type = socket.handshake.query.type || "unknown";
  console.log(`🔌 Connect: ${type} [${socket.id}]`);

  socket.on('send_command', (cmd) => {
    console.log(`📡 Command: ${cmd.action}`);
    io.emit('control_command', cmd); 
  });
});

httpServer.listen(5000, '0.0.0.0', () => console.log('🚀 VECTOR CLOUD READY'));