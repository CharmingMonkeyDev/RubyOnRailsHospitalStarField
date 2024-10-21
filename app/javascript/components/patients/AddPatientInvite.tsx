/* eslint-disable prettier/prettier */
// importing libraties
import * as React from "react";
import {
  Modal,
  Grid,
  TextField,
  Link,
  Snackbar,
  InputLabel,
} from "@mui/material";
import { Alert } from '@mui/material';
import { getYodaDateToday } from "../utils/DateHelper";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// importing hooks
import { useAddPatient } from "../hooks/patients/useAddPatient";

// app setting imports
import { AuthenticationContext } from "../Context";
import GeneralModal from "../modals/GeneralModal";

interface Props {
  logo_src: string;
  button_src: string;
  inviteOpen: boolean;
  setInviteOpen: any;
}

const AddPatientInvite: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  const {
    email,
    setEmail,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    dateOfBirth,
    setDateOfBirth,
    addPatient,
    error,
    setError,
    disabledButton,
  } = useAddPatient(authenticationSetting.csrfToken);

  const handleModalClose = () => {
    props.setInviteOpen(false);
  };

  const handleDateChange = (date) => {
    const stringDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    setDateOfBirth(stringDate);
  };

  return (
    <GeneralModal
      open={props.inviteOpen}
      title={"Invite Patient to Starfield"}
      successCallback={addPatient}
      closeCallback={handleModalClose}
      containerClassName="add-patient-modal"
      width="500px"
    >
      {error.length > 0 && (
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            setError("");
          }}
        >
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        </Snackbar>
      )}
      <Grid container className="form-container" spacing={1}>
        <Grid container>
          <Grid item xs={12}>
            <InputLabel htmlFor="gender" className="field-label2">
              First Name*
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="field-container">
            <TextField
              id="firstName"
              size="small"
              required
              value={firstName}
              variant="outlined"
              className="the-field"
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <InputLabel htmlFor="gender" className="field-label2">
              Middle Name
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="field-container">
            <TextField
              id="middleName"
              size="small"
              variant="outlined"
              className="the-field"
              value={middleName}
              onChange={(event) => {
                setMiddleName(event.target.value);
              }}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <InputLabel htmlFor="gender" className="field-label2">
              Last Name*
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="field-container">
            <TextField
              id="middleName"
              size="small"
              variant="outlined"
              className="the-field"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <InputLabel htmlFor="date_of_birth" className="field-label2">
              Date of Birth*
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="date-field-container">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                autoOk={true}
                variant="inline"
                format="MM/dd/yyyy"
                maxDate={new Date(getYodaDateToday())}
                margin="normal"
                id="date-picker-inline"
                value={dateOfBirth}
                onChange={handleDateChange}
                className="date-field patient-dob-field"
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <InputLabel htmlFor="gender" className="field-label2">
              Email Address*
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="field-container">
            <TextField
              id="email-address"
              size="small"
              variant="outlined"
              className="the-field"
              required
              value={email}
              type="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </GeneralModal>
  );
};

export default AddPatientInvite;
