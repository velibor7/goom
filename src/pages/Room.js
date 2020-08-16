import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import socketIOClient, { connect } from "socket.io-client";
import Peer from "peerjs";

import "./Room.css";

const ENDPOINT = "http://127.0.0.1:5000";

const Room = () => {
  const { room } = useParams();
  // const [peers, setPeers] = useState({});
  const peers = {};
  const myPeer = new Peer(undefined, {
    host: "/",
    port: "5001",
  });

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    const videoGrid = document.getElementById("grid");
    const myVideo = document.createElement("video");

    myVideo.muted = true;

    const addVideoStream = (video, stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });

      videoGrid.append(video);
    };

    const connectToNewUser = (userId, stream) => {
      const call = myPeer.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
      peers[userId] = call;
    };

    if (navigator.mediaDevices.getUserMedia) {
      console.log("idk hit?");
    }

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        // audio: true,
      })
      .then((stream) => {
        console.log(stream);

        addVideoStream(myVideo, stream);

        myPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      })
      .catch((err) => console.log(err));

    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) {
        peers[userId].close();
      }
    });
    myPeer.on("open", (id) => {
      socket.emit("join-room", room, id);
    });
  }, [room, myPeer, peers]);

  return (
    <Fragment>
      <Link to="/">Home</Link>
      <p>Room id: {room}</p>
      <div id="grid"></div>
    </Fragment>
  );
};

export default Room;
