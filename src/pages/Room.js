import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";

import "./Room.css";

const ENDPOINT = "http://127.0.0.1:5000";

const Room = () => {
  const { room } = useParams();
  const [res, setRes] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("join-room", room, 10);
  }, []);
  return (
    <Fragment>
      <p>Room id: {room}</p>
      <div id="grid"></div>
    </Fragment>
  );
};

export default Room;
