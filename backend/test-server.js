const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("SERVER HIDUP");
});

app.post("/api/login", (req, res) => {
  res.send("LOGIN OK");
});

app.listen(5000, () => {
  console.log("TEST SERVER RUNNING di http://localhost:5000");
});