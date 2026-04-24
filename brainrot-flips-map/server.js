const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// 👇 dit is BELANGRIJK
app.use(express.static("public"));

// coinflip API
let balance = 100;

app.get("/flip/:bet", (req, res) => {
  const bet = Number(req.params.bet);

  if (bet > balance) {
    return res.json({ error: "Not enough balance" });
  }

  const win = Math.random() < 0.5;

  if (win) {
    balance += bet;
  } else {
    balance -= bet;
  }

  res.json({
    result: win ? "WIN" : "LOSE",
    balance
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
