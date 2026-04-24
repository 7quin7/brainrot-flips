const socket = io();

function createRoom() {
  const bet = document.getElementById("bet").value;
  socket.emit("createRoom", bet);
}

socket.on("rooms", (rooms) => {
  const container = document.getElementById("rooms");
  container.innerHTML = "";

  rooms.forEach(room => {
    const div = document.createElement("div");
    div.className = "room";
    div.innerText = `Bet: ${room.bet}`;
    div.onclick = () => socket.emit("joinRoom", room.id);
    container.appendChild(div);
  });
});

socket.on("result", (win) => {
  document.getElementById("result").innerText =
    win ? "YOU WON 🧠" : "YOU LOST 💀";
});