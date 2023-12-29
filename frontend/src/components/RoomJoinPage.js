import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

export default function RoomJoinPage(props) {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  function handleTextFieldChange(e) {
    setRoomCode(e.target.value);
  }
  const navigate = useNavigate();
  function handleRoomButtonPressed(e) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode,
      }),
    };
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          navigate(`/room/${roomCode}`);
        } else {
          setError("Room Not Found");
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter A Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>

      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleRoomButtonPressed}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
