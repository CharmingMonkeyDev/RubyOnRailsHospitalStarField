/* eslint-disable prettier/prettier */
import * as React from "react";
import {
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  Link,
  Snackbar,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Link as RouterLink } from "react-router-dom";
import globals from "../globals/globals";
import InputMask from "react-input-mask";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Alert } from '@mui/material';

// setting import
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

const EditMyInfo: React.FC<Props> = (props: any) => {
  // authentication settings
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const classes = useStyles();
  const [error, setError] = React.useState<string>("");
  const [firstName, setFirstName] = React.useState<string>(null);
  const [middleName, setMiddleName] = React.useState<string>(null);
  const [lastName, setLastName] = React.useState<string>(null);
  const [invalidFieldsArray, setInvalidFieldsArray] = React.useState<string[]>(
    []
  );
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [patient, setPatient] = React.useState<any>();
  const [address, setAddress] = React.useState<string>(null);
  const [city, setCity] = React.useState<string>(null);
  const [state, setState] = React.useState<string>(null);
  const [zip, setZip] = React.useState<string>(null);
  const [dateOfBirth, setDateOfBirth] = React.useState<any>(new Date(null));
  const [mobilePhoneNumber, setMobilePhoneNumber] =
    React.useState<string>(null);
  const [gender, setGender] = React.useState<string>(null);

  React.useEffect(() => {
    if (props.patient_id) {
      fetch(`/data_fetching/edit_my_info/${props.patient_id}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setPatient(result);
            setFirstName(result?.first_name);
            setMiddleName(result?.middle_name);
            setLastName(result?.last_name);
            setAddress(result?.address);
            setCity(result?.city);
            setState(result?.state);
            setZip(result?.zip);
            setMobilePhoneNumber(result?.mobile_phone_number);
            setDateOfBirth(result?.date_of_birth);
            setGender(result?.gender);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleDateChange = (date) => {
    // setDateOfBirth(date);
  };

  const stateOptions = globals.states.map((state) => {
    return (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    );
  });

  const genderOptions = globals.genders.map((gender) => {
    return (
      <MenuItem key={gender} value={gender}>
        {gender}
      </MenuItem>
    );
  });

  const closeModal = () => {
    window.location.href = "/my-info";
  };

  const validForm = () => {
    let valid = false;

    const fields = [
      [firstName, "First Name"],
      [lastName, "Last Name"],
      [address, "Address"],
      [city, "City"],
      [state, "State"],
      [zip, "Zip"],
      [mobilePhoneNumber, "Mobile Phone Number"],
      [gender, "Gender"],
    ];
    const invalid = fields.filter(
      (field) => !field[0] || field[0]?.length == 0
    );
    let invalidFieldArrayObject = invalid.map((field) => field[1]);

    if (invalidFieldArrayObject.length == 0) {
      valid = true;
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
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          user: {
            id: patient.id,
            first_name: firstName,
            last_name: lastName,
            middle_name: middleName,
            address: address,
            city: city,
            state: state,
            zip: zip,
            mobile_phone_number: mobilePhoneNumber,
            gender: gender,
            date_of_birth: new Date(dateOfBirth),
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
                First Name*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="first_name"
                value={firstName}
                className="textinput__field"
                required
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>

            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                Middle Name
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="middle_name"
                value={middleName}
                className="textinput__field"
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                Last Name*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="last_name"
                value={lastName}
                required
                className="textinput__field"
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>

            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                Address*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="address"
                value={address}
                required
                className="textinput__field"
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setAddress(event.target.value);
                }}
              />
            </div>

            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                City*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="city"
                value={city}
                required
                className="textinput__field"
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setCity(event.target.value);
                }}
              />
            </div>

            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                State*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="state"
                className="textinput__field"
                value={state}
                required
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setState(event.target.value);
                }}
                select
              >
                {stateOptions}
              </TextField>
            </div>

            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                Zip*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="zip"
                value={zip}
                required
                className="textinput__field"
                variant="outlined"
                size="small"
                style={{ marginTop: 10 }}
                onChange={(event) => {
                  setZip(event.target.value);
                }}
              />
            </div>

            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                Mobile Phone Number* (###-###-####)
              </InputLabel>
            </div>
            <div className="textinput-container">
              <InputMask
                id="mobile-phone-number"
                mask="999-999-9999"
                value={mobilePhoneNumber}
                disabled={false}
                maskChar=""
                className="textinput__field"
                size="small"
                onChange={(event) => {
                  setMobilePhoneNumber(event.target.value);
                }}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    size="small"
                    className="textinput__field"
                    style={{ backgroundColor: "#e5e0de", paddingLeft: 5 }}
                  />
                )}
              </InputMask>
            </div>

            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                Date of Birth*
              </InputLabel>
            </div>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  autoOk={true}
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  value={dateOfBirth}
                  onChange={handleDateChange}
                  open={false}
                  InputProps={{
                    readOnly: true,
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  style={{ width: "100%" }}
                />
              </MuiPickersUtilsProvider>
            </div>

            <div className="form-label-container form-label-container--not-first">
              <InputLabel
                htmlFor="mobile-phone-number"
                className="field-label-1"
              >
                Gender*
              </InputLabel>
            </div>
            <div className="textinput-container">
              <TextField
                id="gender"
                className="textinput__field"
                value={gender}
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setGender(event.target.value);
                }}
                select
              >
                {genderOptions}
              </TextField>
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

export default EditMyInfo;
