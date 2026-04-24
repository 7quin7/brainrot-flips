const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let rooms = [];

// wanneer iemand connect
io.on("connection", (socket) => {
  console.log("User connected");

  // maak room
  socket.on("createRoom", (bet) => {
    const room = {
      id: Math.random().toString(36).substring(7),
      bet: Number(bet),
      players: [socket.id]
    };

    rooms.push(room);

    io.emit("rooms", rooms);
  });

  // join room
  socket.on("joinRoom", (id) => {
    const room = rooms.find(r => r.id === id);

    if (!room) return;

    room.players.push(socket.id);

    // coinflip
    const winner = room.players[Math.floor(Math.random() * room.players.length)];

    io.to(room.players[0]).emit("result", winner === room.players[0] ? "YOU WIN" : "YOU LOSE");
    io.to(room.players[1]).emit("result", winner === room.players[1] ? "YOU WIN" : "YOU LOSE");

    // remove room
    rooms = rooms.filter(r => r.id !== id);

    io.emit("rooms", rooms);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
