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
  console.log("User connected:", socket.id);

  // CREATE ROOM
  socket.on("createRoom", (bet) => {
    const room = {
      id: Math.random().toString(36).substring(7),
      bet: Number(bet),
      players: [socket.id]
    };

    rooms.push(room);

    console.log("Room created:", room);

    io.emit("rooms", rooms);
  });

  // JOIN ROOM
  socket.on("joinRoom", (id) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    // voorkom dat iemand 2x joint
    if (room.players.includes(socket.id)) return;

    room.players.push(socket.id);

    // alleen doorgaan als 2 spelers
    if (room.players.length !== 2) return;

    const p1 = room.players[0];
    const p2 = room.players[1];

    // random winnaar
    const winner = Math.random() < 0.5 ? p1 : p2;

    console.log("Players:", p1, p2);
    console.log("Winner:", winner);

    // stuur resultaat
    io.to(p1).emit("result", winner === p1 ? "YOU WIN" : "YOU LOSE");
    io.to(p2).emit("result", winner === p2 ? "YOU WIN" : "YOU LOSE");

    // verwijder room
    rooms = rooms.filter(r => r.id !== id);

    io.emit("rooms", rooms);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // verwijder speler uit rooms
    rooms = rooms.filter(room => !room.players.includes(socket.id));

    io.emit("rooms", rooms);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
