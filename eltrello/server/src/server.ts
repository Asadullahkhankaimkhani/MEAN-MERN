import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import * as UserControllers from '../controller/user.controller';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('<h1>Server is Running</h1>');
});

app.post('/api/users', UserControllers.userRegister);

io.on('connection', () => {
  console.log('Connected');
});

mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
  console.log('Connected to MongoDB');
  httpServer.listen(3000, () => {
    console.log('Listening on port 3000');
  });
});
