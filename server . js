const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let rooms = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("createRoom", (bet) => {
    const room = {
      id: Date.now(),
      player1: socket.id,
      bet: bet
    };

    rooms.push(room);
    io.emit("rooms", rooms);
  });

  socket.on("joinRoom", (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || room.player2) return;

    room.player2 = socket.id;

    const winner = Math.random() < 0.5 ? room.player1 : room.player2;

    io.to(room.player1).emit("result", winner === room.player1);
    io.to(room.player2).emit("result", winner === room.player2);

    rooms = rooms.filter(r => r.id !== roomId);
    io.emit("rooms", rooms);
  });

  socket.on("disconnect", () => {
    rooms = rooms.filter(r => r.player1 !== socket.id);
    io.emit("rooms", rooms);
  });
});

http.listen(PORT, () => {
  console.log("Brainrot Flips running on port " + PORT);
});
