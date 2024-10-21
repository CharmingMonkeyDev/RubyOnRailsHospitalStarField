import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';
import { Grid, TextField, Link, Snackbar } from "@mui/material";

import { Alert } from "@mui/material";

// helpers
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  patient_id: string;
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
  },
  nextButton: {
    background: "none",
    border: "none",
    padding: 10,
    paddingLeft: 55,
    paddingRight: 55,
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
  modalText: {
    font: "15px QuicksandMedium",
    fontWeight: "normal",
    color: "#707070",
    textAlign: "center",
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    "@media (max-width: 600px)": {
      width: "100%",
    },
  },
}));

const UndoEmail: React.FC<Props> = (props: any) => {
  const classes = useStyles();
  const [patient, setPatient] = React.useState<any>(null);

  React.useEffect(() => {
    if (props.patient_id) {
      fetch(`/data_fetching/edit_my_email/${props.patient_id}`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setPatient(result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const [email, setEmail] = React.useState<string>(patient.email);
  const [emailConfirmation, setEmailConfirmation] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [invalidFieldsArray, setInvalidFieldsArray] = React.useState<string[]>(
    []
  );
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [dateOfBirth, setDateOfBirth] = React.useState<string>("");

  const validForm = () => {
    let valid = false;

    const fields = [
      [email, "Email"],
      [emailConfirmation, "Email Confirmation"],
    ];
    const invalid = fields.filter((field) => !field[0] || field[0].length == 0);
    let invalidFieldArrayObject = invalid.map((field) => field[1]);

    if (invalidFieldArrayObject.length == 0) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      let invalidFields = invalidFieldArrayObject;
      if (!re.test(String(email).toLowerCase())) {
        invalidFields.push("a valid Email Address");
        setInvalidFieldsArray(invalidFields);
        valid = false;
      } else if (email != emailConfirmation) {
        invalidFields.push("a valid Email Confirmation");
        setInvalidFieldsArray(invalidFields);
        valid = false;
      } else {
        valid = true;
      }
    } else {
      setInvalidFieldsArray(invalidFieldArrayObject);
    }

    return valid;
  };

  React.useEffect(() => {
    if (invalidFieldsArray.length > 0) {
      setError(`Please fill out ${invalidFieldsArray.join(", ")}`);
    }
  }, [invalidFieldsArray]);

  const validDateOfBirthForm = () => {
    let valid = false;
    dateOfBirth ? (valid = true) : (valid = false);
    return valid;
  };

  const verifyIdentity = () => {
    setError("");
    setDisabledButton(true);

    if (validDateOfBirthForm()) {
      fetch(`/verify_date_of_birth/${patient.id}`, {
        method: "POST",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          user: {
            date_of_birth: dateOfBirth,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            saveInfo();
          }
        })
        .catch((error) => {
          setError(error);
          setDisabledButton(false);
        });
    } else {
      setError("Invalid date of birth, please check your entry and try again.");
      setDisabledButton(false);
    }
  };

  const saveInfo = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(`/undo_patient_email`, {
        method: "POST",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          user: {
            id: patient.id,
            email: email,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            window.location.href = `/users/sign_in`;
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
            <Grid item xs={12} className={classes.pageTitle}>
              <span>Undo Email Change</span>
              <br />
              {!patient && <small>Invalid password token</small>}
            </Grid>
          </Grid>

          {patient && (
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

              <p className={classes.modalText}>
                Please Confirm your date of birth.
              </p>

              <TextField
                id="date"
                label="Date of birth"
                value={dateOfBirth}
                className={classes.textInput}
                type="date"
                required
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event) => {
                  setDateOfBirth(event.target.value);
                }}
              />

              <TextField
                id="email"
                label="Email"
                value={email}
                className={classes.textInput}
                required
                variant="filled"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />

              <TextField
                id="email_confirmation"
                label="Email Confirmation"
                value={emailConfirmation}
                className={classes.textInput}
                required
                variant="filled"
                onChange={(event) => {
                  setEmailConfirmation(event.target.value);
                }}
              />

              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={12} className={classes.centerButton}>
                  {!disabledButton ? (
                    <Link
                      className={classes.nextButton}
                      onClick={verifyIdentity}
                    >
                      Save
                    </Link>
                  ) : (
                    <>Saving...</>
                  )}
                </Grid>
              </Grid>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default UndoEmail;
