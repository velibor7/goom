const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4 } = require("uuid");

// app.set()
app.use(bodyParser.json());

app.use((req, res, next) => {
  // req.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.get("/", (req, res, next) => {
  res.redirect(`/${v4()}`);
  next();
});

app.get("/:room", (req, res) => {
  // res.render("room", { roomId: req.params.room });
  const roomId = req.params.room;
  // console.log(roomId);
  res.json({ roomId });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log(roomId, userId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    // when user leaves
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(5000);
