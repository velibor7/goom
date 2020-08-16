const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4 } = require("uuid");

// app.set()

app.get("/", (req, res) => {
  res.redirect(`/${v4()}`);
});

app.get("/:room", (req, res, next) => {
  res.render("room", { roomId: req.params.room });
});
server.listen(5000);
