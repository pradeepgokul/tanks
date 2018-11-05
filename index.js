// Dependencies and Modules

const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');


const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, function() {
  console.log('Server running on [+] ', port);
});


// WebSocket handlers
var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
