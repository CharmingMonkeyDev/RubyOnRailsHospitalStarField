import * as React from "react";
import { Modal, Grid, TextField } from "@mui/material";
import { useLogin } from "./hooks/useLogin";
import { useStyles } from "./styles/useStyles";

interface Props {
  csrfToken: string;
  logo_src: string;
  button_src: string;
}

const ChangePassword: React.FC<Props> = (props: any) => {
  const { classes } = useStyles();
  const { open, password, setPassword, closeModal } = useLogin();
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const getParameter = (name) => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    return url.searchParams.get(name);
  };

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

          <form id="changepasswordform" action="/users/password" method="post">
            <input
              type="hidden"
              name="authenticity_token"
              value={props.csrfToken}
            />
            <input type="hidden" name="_method" value="put" />
            <input
              type="hidden"
              value={getParameter("reset_password_token")}
              name="user[reset_password_token]"
              id="user_reset_password_token"
            />

            <TextField
              id="password"
              className={classes.textInput}
              required
              value={password}
              label="Password"
              name="user[password]"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              variant="filled"
              type="password"
            />

            <TextField
              id="confirm_password"
              className={classes.textInput}
              required
              value={confirmPassword}
              label="Password Confirmation"
              name="user[password_confirmation]"
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              variant="filled"
              type="password"
            />

            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={10}>
                <p className="loginText">Change your password</p>
              </Grid>
              <Grid item xs={2}>
                <button
                  type="submit"
                  form="changepasswordform"
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

export default ChangePassword;
