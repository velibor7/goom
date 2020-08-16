import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Peer from "peerjs";

import "./Room.css";

const ENDPOINT = "http://127.0.0.1:5000";

const Room = () => {
  const { room } = useParams();

  const myPeer = new Peer(undefined, {
    host: "/",
    port: "5001",
  });

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    const videoGrid = document.getElementById("grid");
    const myVideo = document.createElement("video");

    myVideo.muted = true;

    if (navigator.mediaDevices.getUserMedia) {
      console.log("idk hit?");
    }

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        console.log(stream);
        addVideoStream(myVideo, stream);
      })
      .catch((err) => console.log(err));

    const addVideoStream = (video, stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });

      videoGrid.append(video);
    };
    myPeer.on("open", (id) => {
      socket.emit("join-room", room, id);
    });

    socket.on("user-connected", (userId) => {
      console.log("User connected " + userId);
    });
  }, [room, myPeer]);

  return (
    <Fragment>
      <Link to="/">Home</Link>
      <p>Room id: {room}</p>
      <div id="grid"></div>
    </Fragment>
  );
};

export default Room;
