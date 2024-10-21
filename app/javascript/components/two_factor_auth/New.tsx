/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, TextField, Link } from "@mui/material";
import { useStyles } from "../styles/useStyles";

interface Props {
  csrfToken: string;
  user_id: string;
  logo_src: string;
  button_src: string;
}

const New: React.FC<Props> = (props: any) => {
  const { classes } = useStyles();
  const [open, setOpen] = React.useState<boolean>(true);
  const [code, setCode] = React.useState<string>("");

  return (
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
            className={classes.twoFactorLogo}
          />
          <p className={classes.loginTextCentered}>
            Enter your two-factor authentication code
          </p>
          <form id="mfa_form" action="/two_factor_auth_update" method="post">
            <input
              type="hidden"
              name="authenticity_token"
              value={props.csrfToken}
            />
            <input type="hidden" name="user[user_id]" value={props.user_id} />
            <TextField
              id="code"
              label="2FA Code"
              className={classes.textInput}
              required
              value={code}
              name="user[code]"
              onChange={(event) => {
                setCode(event.target.value);
              }}
              variant="filled"
            />

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <div>
                <a
                  className={classes.logoutLink}
                  rel="nofollow"
                  data-method="delete"
                  href="/users/sign_out"
                >
                  Back to Login
                </a>
              </div>
              <Grid item xs={2}>
                <button
                  type="submit"
                  form="mfa_form"
                  value="Submit"
                  className={classes.clearButtonStyling}
                >
                  <img
                    src={props.button_src}
                    alt="Verify Code"
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

export default New;
