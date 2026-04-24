const socket = io();

// create flip
function createRoom() {
  const bet = document.getElementById("bet").value;

  if (!bet || bet <= 0) {
    alert("Enter a valid bet!");
    return;
  }

  socket.emit("createRoom", bet);
}

// update rooms lijst
socket.on("rooms", (rooms) => {
  const div = document.getElementById("rooms");
  div.innerHTML = "";

  if (rooms.length === 0) {
    div.innerHTML = "<p>No open flips</p>";
    return;
  }

  rooms.forEach(room => {
    const el = document.createElement("div");

    el.innerHTML = `
      💰 Bet: $${room.bet}
      <button onclick="joinRoom('${room.id}')">Join</button>
    `;

    div.appendChild(el);
  });
});

// join room
function joinRoom(id) {
  socket.emit("joinRoom", id);
}

// resultaat ontvangen
socket.on("result", (result) => {
  document.getElementById("result").innerText = result;
});
