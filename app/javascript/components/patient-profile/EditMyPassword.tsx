/* eslint-disable prettier/prettier */
import * as React from "react";
import {
  Grid,
  TextField,
  Link,
  Snackbar,
  InputLabel,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Link as RouterLink } from "react-router-dom";
import { Alert } from '@mui/material';

// settings import
import { AuthenticationContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  patient_id: number;
}

const useStyles = makeStyles(() => ({
  container: {
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: 500,
    marginTop: 80,
    "@media (max-width: 600px)": {
      width: "100%",
      marginTop: 70,
    },
  },
  pageTitle: {
    textAlign: "center",
    "& span": {
      font: "26px QuicksandMedium",
    },
  },
  backButton: {
    font: "30px QuicksandMedium",
    textDecoration: "none",
    display: "inline-block",
    marginTop: -6,
  },
  pageHeading: {
    borderBottom: "1px solid #948b87",
    marginBottom: 20,
    paddingBottom: 10,
  },
  centerText: {
    textAlign: "center",
  },
  infoSection: {
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
    marginBottom: 15,
    boxShadow: "1px 1px 1px 1px #efefef",
    padding: 10,
    borderRadius: 6,
  },
  nextButton: {
    background: "none",
    border: "none",
    padding: 10,
    paddingLeft: "30%",
    paddingRight: "30%",
    font: "inherit",
    cursor: "pointer",
    outline: "inherit",
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "#ff8906",
    borderRadius: 4,
    fontFamily: "QuicksandMedium",
    marginTop: 20,
    display: "inline-block",
    "&:hover": {
      textDecoration: "none",
    },
  },
  textInput: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: "#fcf6f4",
  },
  centerButton: {
    textAlign: "center",
    marginTop: 10,
  },
  clearButtonStyling: {
    background: "none",
    color: "inherit",
    border: "none",
    padding: 0,
    font: "inherit",
    cursor: "pointer",
    outline: "inherit",
    textAlign: "center",
  },
  alert: {
    border: "1px solid #dbe3e6",
  },
  modalTextSmall: {
    color: "#707070",
    font: "12px QuicksandMedium",
    fontWeight: "normal",
  },
}));

const EditMyPassword: React.FC<Props> = (props: any) => {
  // authentication settings
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const classes = useStyles();
  const [password, setPassword] = React.useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] =
    React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState(false);

  const closeModal = () => {
    window.location.href = "/my-info";
  };

  const validForm = () => {
    let valid = false;
    if (password && passwordConfirmation) {
      const numberUpperTest = /[A-Z].*\d|\d.*[A-Z]/;
      const numberLowerTest = /[a-z].*\d|\d.*[a-z]/;

      password != passwordConfirmation ||
      password.length < 8 ||
      !numberUpperTest.test(String(password)) ||
      !numberLowerTest.test(String(password))
        ? (valid = false)
        : (valid = true);
    }

    return valid;
  };

  const saveInfo = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(`/edit_patient_info`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          user: {
            id: props.patient_id,
            password: password,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            window.location.href = `/my-info`;
          }
        })
        .catch((error) => {
          setError(error);
          setDisabledButton(false);
        });
    } else {
      setError("Invalid entries, please check your entries and try again.");
      setDisabledButton(false);
    }
  };

  return (
    <div className={classes.container}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            className={classes.pageHeading}
          >
            <Grid item xs={2} className={classes.centerText}>
              <RouterLink
                to="/my-info"
                className={classes.backButton}
                style={{ color: "#4A4442" }}
              >
                &lt;
              </RouterLink>
            </Grid>
            <Grid item xs={8} className={classes.pageTitle}>
              <span>My Info</span>
            </Grid>
            <Grid item xs={2}>
              &nbsp;
            </Grid>
          </Grid>

          <div className={classes.infoSection}>
            {error.length > 0 && (
              <Snackbar
                open={error.length > 0}
                autoHideDuration={6000}
                onClose={() => {
                  setError("");
                }}
              >
                <Alert severity="error" className={classes.alert}>
                  {error}
                </Alert>
              </Snackbar>
            )}

            <div className="form-label-container">
              <InputLabel htmlFor="password" className="field-label-1">
                Create a Password*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="password"
                value={password}
                className="textinput__field"
                required
                type="password"
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </div>
            <div className="form-label-container form-label-container--not-first">
              <InputLabel htmlFor="password" className="field-label-1">
                Re-enter a Password*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="password_confirmation"
                value={passwordConfirmation}
                className="textinput__field"
                required
                type="password"
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setPasswordConfirmation(event.target.value);
                }}
              />
            </div>

            <p className="password-restriction-content">
              Password: <br />
              &bull; Must be at least 8 characters in length <br />
              &bull; Must contain at least one capital letter <br />
              &bull; Must contain at least one lowercase letter <br />
              &bull; Must contain at least one number <br />
              &bull; May optionally contain a special character
            </p>

            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={6} className={classes.centerButton}>
                <Link
                  className={classes.clearButtonStyling}
                  onClick={closeModal}
                  style={{
                    font: "14px QuicksandMedium",
                    color: "#313133",
                    textDecoration: "underline",
                    marginTop: 20,
                    display: "inline-block",
                  }}
                >
                  Cancel
                </Link>
              </Grid>
              <Grid item xs={6} className={classes.centerButton}>
                {!disabledButton ? (
                  <Link className={classes.nextButton} onClick={saveInfo}>
                    Save
                  </Link>
                ) : (
                  <>Saving...</>
                )}
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditMyPassword;
