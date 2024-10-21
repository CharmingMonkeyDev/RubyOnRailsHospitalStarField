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

// helpers
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
    marginTop: 90,
    "@media (max-width: 600px)": {
      width: "100%",
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
  textInputLabel: {
    font: "12px QuicksandMedium",
    display: "inline-block",
    marginTop: 10,
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
}));

const EditMyEmail: React.FC<Props> = (props: any) => {
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
            setEmail(result.email);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const classes = useStyles();
  const [email, setEmail] = React.useState<string>("");
  const [emailConfirmation, setEmailConfirmation] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [invalidFieldsArray, setInvalidFieldsArray] = React.useState<string[]>(
    []
  );
  const [disabledButton, setDisabledButton] = React.useState(false);

  const closeModal = () => {
    window.location.href = "/my-info";
  };

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
      } else if (email?.toLowerCase() != emailConfirmation?.toLowerCase()) {
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

  const saveInfo = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(`/edit_patient_info`, {
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
              <InputLabel htmlFor="email" className="field-label-1">
                Email*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="email"
                value={email}
                className="textinput__field"
                required
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>

            <div className="form-label-container">
              <InputLabel
                htmlFor="email_confirmation"
                className="field-label-1"
              >
                Email Confirmation*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="email_confirmation"
                value={emailConfirmation}
                className="textinput__field"
                required
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setEmailConfirmation(event.target.value);
                }}
              />
            </div>

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

export default EditMyEmail;
