import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [room, setRoom] = useState();

  useEffect(() => {
    const makeRoom = async () => {
      fetch("http://localhost:5000/", {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
        },
      })
        .then((res) => {
          res.json().then((body) => {
            setRoom(body.roomId);
          });
        })
        .catch((err) => console.log(err));
    };
    makeRoom();
  }, []);

  const makeRoomHandler = () => {
    console.log("making a room");
  };

  return (
    <div>
      <Link to={room}>
        <button onClick={makeRoomHandler}>Make a room</button>
      </Link>
    </div>
  );
};

export default Home;
