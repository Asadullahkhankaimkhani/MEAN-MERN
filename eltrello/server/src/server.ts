import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', () => {
  console.log('Connected');
});

mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
  console.log('Connected to MongoDB');
  httpServer.listen(3000, () => {
    console.log('Listening on port 3000');
  });
});
