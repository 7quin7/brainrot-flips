const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let rooms = [];

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("createRoom", (bet) => {
    const room = {
      id: Math.random().toString(36).substring(7),
      bet: Number(bet),
      players: [socket.id]
    };

    rooms.push(room);
    io.emit("rooms", rooms);
  });

  socket.on("joinRoom", (id) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    room.players.push(socket.id);

    const winner = room.players[Math.floor(Math.random() * room.players.length)];

    room.players.forEach(player => {
      io.to(player).emit(
        "result",
        winner === player ? "YOU WIN" : "YOU LOSE"
      );
    });

    rooms = rooms.filter(r => r.id !== id);
    io.emit("rooms", rooms);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
