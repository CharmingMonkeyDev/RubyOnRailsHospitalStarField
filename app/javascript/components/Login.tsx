import * as React from "react";
import { Modal, Grid, TextField, Link } from "@mui/material";
import { useLogin } from "./hooks/useLogin";
import { useStyles } from "./styles/useStyles";

interface Props {
  csrfToken: string;
  logo_src: string;
  button_src: string;
}

const Login: React.FC<Props> = (props: any) => {
  const { classes } = useStyles();
  const { open, email, password, setEmail, setPassword } = useLogin();

  return (
    <>
      <Modal
        open={open}
        BackdropProps={{
          style: {
            opacity: "1",
            background: "#F2F2F2",
          },
        }}
      >
        <div className={classes.paper}>
          <div className={classes.paperInner}>
            <img
              src={props.logo_src}
              alt="Project Starfield"
              className={classes.loginLogo}
            />

            <form id="loginform" action="/users/sign_in" method="post">
              <input
                type="hidden"
                name="authenticity_token"
                value={props.csrfToken}
              />
              <TextField
                id="email-address"
                label="Email Address*"
                className={`${classes.textInput} plainLabel`}
                required
                value={email}
                name="user[email]"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                variant="filled"
                autoComplete="off"
                InputProps={{
                  disableUnderline: true,
                }}
                InputLabelProps={{
                  required: false,
                }}
                size="medium"
              />

              <TextField
                id="password"
                className={`${classes.textInput} plainLabel`}
                required
                value={password}
                label="Password*"
                name="user[password]"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                variant="filled"
                type="password"
                autoComplete="off"
                InputProps={{
                  disableUnderline: true,
                }}
                InputLabelProps={{
                  required: false,
                }}
                size="medium"
                sx={{ mt: 2 }}
              />

              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={10}>
                  <p className="loginText">
                    Forgot your&nbsp;
                    <Link
                      href="/users/password/new"
                      onClick={() => {}}
                      className="forget-pass-link"
                    >
                      Password
                    </Link>
                    ?
                  </p>
                </Grid>
                <Grid item xs={2}>
                  <button
                    type="submit"
                    form="loginform"
                    value="Submit"
                    className={classes.clearButtonStyling}
                  >
                    <img
                      src={props.button_src}
                      alt="Login"
                      className={classes.loginButton}
                    />
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Login;
