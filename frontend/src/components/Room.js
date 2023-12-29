import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

const Room = forwardRef(({ removeRoomCode }, ref) => {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { roomCode } = useParams();
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    removeRoomCode: handleLeaveButtonPressed,
  }));
  useEffect(() => {
    fetch("/api/get-room?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          removeRoomCode();
          navigate("/");
          return;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setGuestCanPause(data.guest_can_pause);
        setVotesToSkip(data.votes_to_skip);
        setIsHost(data.is_host);
      });
  }, []);

  function handleLeaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then(() => {
      removeRoomCode();
      navigate("/");
    });
  }

  function renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallBack={() => {}}
          />
        </Grid>
        <Grid item xs={12} align="center">
          {" "}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  if (showSettings) {
    return renderSettings();
  } else {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Code: {roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Can pause: {guestCanPause}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {isHost}
          </Typography>
        </Grid>
        {isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLeaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
});

export default Room;
