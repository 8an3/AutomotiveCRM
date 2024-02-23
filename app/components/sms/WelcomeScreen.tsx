import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Card,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";

const WelcomeScreen = (props) => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(true);

  const login = () => {
    if (
      email &&
      room &&
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      props.history.push("chat", { room, email });
    }
  };

  const handleChange = (event) => {
    if (loading) {
      setLoading(false);
    }
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "room") {
      setRoom(value);
    }
  };

  useEffect(() => {
    // Simulating loading user credentials, you can replace this with your authentication logic.
    const simulateLoadingUserCredentials = () => {
      setTimeout(() => {
        setLoading(false);
        setEmail("user@example.com"); // Set the user's email
        setRoom("defaultRoom"); // Set the default room
      }, 2000); // Simulating a 2-second delay
    };

    simulateLoadingUserCredentials();
  }, []);

  if (loading) {
    return (
      <CircularProgress
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  return (
    <>
      <AppBar style={styles.header} elevation={10}>
        <Toolbar>
          <Typography variant="h6">
            Chat App with Twilio Programmable Chat and React
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        style={styles.grid}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Card style={styles.card} elevation={10}>
          <Grid item style={styles.gridItem}>
            <TextField
              name="email"
              required
              style={styles.textField}
              label="Email address"
              placeholder="Enter email address"
              variant="outlined"
              type="email"
              value={email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item style={styles.gridItem}>
            <TextField
              name="room"
              required
              style={styles.textField}
              label="Room"
              placeholder="Enter room name"
              variant="outlined"
              value={room}
              onChange={handleChange}
            />
          </Grid>
          <Grid item style={styles.gridItem}>
            <Button
              color="primary"
              variant="contained"
              style={styles.button}
              onClick={login}
            >
              Login
            </Button>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

const styles = {
  header: {},
  grid: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  card: { padding: 40 },
  textField: { width: 300 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  button: { width: 300 },
};

export default WelcomeScreen;
