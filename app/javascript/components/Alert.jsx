import * as React from "react";
import { Snackbar, Alert as MaterialAlert } from "@mui/material";

class Alert extends React.Component {
  alertClass(type) {
    let classes = {
      error: "error",
      alert: "error",
      notice: "success",
      success: "success",
    };
    return classes[type] || classes.success;
  }

  render() {
    const message = this.props.message;
    const alertType = `${this.alertClass(message.type)}`;

    return (
      <Snackbar
        open={message.text.length > 0}
        autoHideDuration={6}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MaterialAlert
          style={{ border: "1px solid #dbe3e6" }}
          severity={alertType}
        >
          {message.text}
        </MaterialAlert>
      </Snackbar>
    );
  }
}

export default Alert;
