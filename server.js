const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const app = express();

const tasks = [];
app.use(cors());

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server, {
  cors: {
    origin: '*',
  },
});
io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (id) => {
    tasks.splice(id, 1);
    socket.broadcast.emit('removeTask', id);
  });
});
app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
