import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const IdleCheckModal = ({ onExpire }) => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let idleTimer;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);

      idleTimer = setTimeout(() => {
        setOpen(true);
      }, 390000);
      // }, 3000);
    };

    resetIdleTimer();

    const handleActivity = () => {
      if (!open) {
        setOpen(false);
        resetIdleTimer();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
    };
  }, [open]);

  useEffect(() => {
    let countdownTimer;

    if (open) {
      countdownTimer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const nextTimeLeft = prevTimeLeft - 1;
          if (nextTimeLeft < 1) {
            clearInterval(countdownTimer);
            onExpire();
            setOpen(false);
            return 0;
          }
          return nextTimeLeft;
        });
      }, 1000);
    } else {
      setTimeLeft(30);
    }

    return () => clearInterval(countdownTimer);
  }, [open, onExpire]);

  return (
    <Dialog open={open}>
      <DialogContent style={{ textAlign: "center", paddingBottom: "20px", maxWidth: "450px" }}>
        <div
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            borderBottom: "4px solid #ff890a",
          }}
        >
          <h2>Are you still there?</h2>
        </div>
        <h1
          style={{
            fontSize: "1.5em",
            fontWeight: "bold",
            display: "block",
            marginBottom: "20px",
            color: "#ff890a",
          }}
        >
          00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </h1>
        <DialogContentText>
          It appears you have been inactive for a few minutes. Would you like to
          continue? Reply within the next 30 seconds or your responses will be
          submitted.
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", marginBottom: "30px" }}>
        <Button
          onClick={() => {
            setOpen(false);
            onExpire();
          }}
        >
          I am done!
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          className="orange-btn"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdleCheckModal;