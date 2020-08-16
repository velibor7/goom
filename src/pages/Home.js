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

  return (
    <div>
      <Link to={room}>Make a room</Link>
    </div>
  );
};

export default Home;
