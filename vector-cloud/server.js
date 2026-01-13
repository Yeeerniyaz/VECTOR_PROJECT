import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

let systemState = { roomTemp: 23.5, roomHum: 45, lastUpdate: new Date() };

io.on('connection', (socket) => {
  const type = socket.handshake.query.type || "unknown";
  console.log(`🔌 Connected: ${type} (${socket.id})`);

  socket.emit('sensor_data', systemState);

  socket.on('send_command', (cmd) => {
    console.log(`📡 Command: ${cmd.action}`);
    io.emit('control_command', cmd); 
  });

  socket.on('disconnect', () => console.log(`❌ Disconnected: ${type}`));
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 VECTOR SERVER RUNNING ON PORT ${PORT}`);
});