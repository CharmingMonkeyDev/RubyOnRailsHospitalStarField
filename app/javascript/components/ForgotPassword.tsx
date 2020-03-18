import * as React from "react";
import { Modal, Grid, TextField } from "@mui/material";
import { useLogin } from "./hooks/useLogin";
import { useStyles } from "./styles/useStyles";

interface Props {
  csrfToken: string;
  logo_src: string;
  button_src: string;
}

const ForgotPassword: React.FC<Props> = (props: any) => {
  const { classes } = useStyles();
  const { open, email, setEmail, closeModal } = useLogin();

  return (
    <Modal
      open={open}
      onClose={closeModal}
      BackdropProps={{
        style: {
          opacity: "1",
          background: "#F2F2F2",
        },
      }}
    >
      <div className={classes.paper}>
        <div className={classes.paperInner}>
          <a href="/">
            <img
              src={props.logo_src}
              alt="Project Starfield"
              className={classes.loginLogo}
            />
          </a>

          <form id="forgotpasswordform" action="/users/password" method="post">
            <input
              type="hidden"
              name="authenticity_token"
              value={props.csrfToken}
            />
            <TextField
              id="email-address"
              label="Email Address"
              className={`${classes.textInput} plainLabel`}
              required
              value={email}
              name="user[email]"
              type="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              variant="filled"
              autoComplete="off"
              InputProps={{
                disableUnderline: true,
              }}
              size="medium"
            />

            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={10}>
                <p className="loginText">
                  Send me password reset instructions.
                </p>
              </Grid>
              <Grid item xs={2}>
                <button
                  type="submit"
                  form="forgotpasswordform"
                  value="Submit"
                  className={classes.clearButtonStyling}
                >
                  <img
                    src={props.button_src}
                    alt="Forgot Password"
                    className={classes.loginButton}
                  />
                </button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ForgotPassword;
