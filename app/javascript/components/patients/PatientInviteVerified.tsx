import * as React from "react";
import { Grid, TextField, Link, Snackbar, InputLabel } from "@mui/material";
import { usePatientInviteVerified } from "../hooks/patients/usePatientInviteVerified";
import { Alert } from '@mui/material';
import InputMask from "react-input-mask";

interface Props {
  csrfToken: string;
  logo_src: string;
  button_src: string;
  patient: any;
}

const PatientInvite: React.FC<Props> = (props: any) => {
  const {
    disabledButton,
    error,
    setError,
    completeAccount,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    address,
    setAddress,
    city,
    setCity,
    state,
    setState,
    zip,
    setZip,
    mobilePhoneNumber,
    setMobilePhoneNumber,
    stateOptions,
    gender,
    setGender,
    genderOptions,
  } = usePatientInviteVerified(props.patient, props.csrfToken);

  return (
    <>
      <img src={props.logo_src} alt="Project Starfield" className="loginLogo" />

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

      <p className="modalText">Please complete your account</p>

      <TextField
        id="first_name"
        label="First Name"
        value={firstName}
        className="textInput"
        required
        variant="filled"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        id="middle_name"
        label="Middle Name"
        value={middleName}
        className="textInput"
        variant="filled"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        id="last_name"
        label="Last Name"
        value={lastName}
        required
        className="textInput"
        variant="filled"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        id="address"
        label="Address"
        value={address}
        required
        className="textInput"
        variant="filled"
        onChange={(event) => {
          setAddress(event.target.value);
        }}
      />

      <TextField
        id="city"
        label="City"
        value={city}
        required
        className="textInput"
        variant="filled"
        onChange={(event) => {
          setCity(event.target.value);
        }}
      />

      <TextField
        id="state"
        label="State"
        className="textInput"
        value={state}
        onChange={(event) => {
          setState(event.target.value);
        }}
        select
      >
        {stateOptions}
      </TextField>

      <TextField
        id="zip"
        label="Zip"
        value={zip}
        required
        className="textInput"
        variant="filled"
        onChange={(event) => {
          setZip(event.target.value);
        }}
      />

      <InputLabel htmlFor="mobile-phone-number" className="textInputLabel">
        Mobile Phone Number (###-###-####) *
      </InputLabel>
      <InputMask
        id="mobile-phone-number"
        mask="999-999-9999"
        value={mobilePhoneNumber}
        disabled={false}
        maskChar=""
        className="textInput"
        variant="filled"
        onChange={(event) => {
          setMobilePhoneNumber(event.target.value);
        }}
      >
        {() => <TextField className="textInput" />}
      </InputMask>

      <TextField
        id="gender"
        label="Gender"
        className="textInput"
        value={gender}
        required
        onChange={(event) => {
          setGender(event.target.value);
        }}
        select
      >
        {genderOptions}
      </TextField>

      <TextField
        id="email-address"
        label="Email Address"
        className="textInput"
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        variant="filled"
      />

      <TextField
        id="password"
        className="textInput"
        required
        value={password}
        label="Password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        variant="filled"
        type="password"
      />

      <TextField
        id="confirm-password"
        className="textInput"
        required
        value={confirmPassword}
        label="Confirm Password"
        onChange={(event) => {
          setConfirmPassword(event.target.value);
        }}
        variant="filled"
        type="password"
      />

      <p className="modalTextSmall">
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
        <Grid item xs={12} className="centerButton">
          {!disabledButton ? (
            <Link className="clearButtonStyling" onClick={completeAccount}>
              <img
                src={props.button_src}
                alt="Save Patient Information"
                className="loginButton"
              />
            </Link>
          ) : (
            <>Creating Account...</>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default PatientInvite;
