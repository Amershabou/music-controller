import React, { useState, useEffect, useRef } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import {
  Grid,
  Button,
  ButtonGroup,
  Typography,
  setRef,
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

function RenderHomePage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" compact="h3">
          {" "}
          House Party
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>
            Join A Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create A Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default function HomePage(props) {
  const [roomCode, setRoomCode] = useState(null);
  const roomRef = useRef(null);

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => setRoomCode(data.code));
  }, []);

  function removeRoomCode() {
    setRoomCode(null);
  }

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            roomCode ? <Navigate to={`room/${roomCode}`} /> : <RenderHomePage />
          }
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route
          path="/create"
          element={
            <CreateRoomPage
              update={false}
              votesToSkip={2}
              guestCanPause={true}
              roomCode={null}
              updateCallBack={() => {}}
            />
          }
        />
        <Route
          path="/room/:roomCode"
          element={<Room ref={roomRef} removeRoomCode={removeRoomCode} />}
        />
      </Routes>
    </Router>
  );
}
