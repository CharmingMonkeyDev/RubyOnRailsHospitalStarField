// library imports
import * as React from "react";
import {
  Modal,
  Grid,
  TextField,
  InputLabel,
  Radio,
  Checkbox,
  Select,
} from "@mui/material";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import InputMask from "react-input-mask";

// component imports
import FlashMessage from "../shared/FlashMessage";

// helper import
import globals from "../globals/globals";
import { getHeaders } from "../utils/HeaderHelper";
import { getYodaDateToday } from "../utils/DateHelper";

// app setting imports
import { AuthenticationContext } from "../Context";
import GeneralModal from "../modals/GeneralModal";
import { Stack } from "@mui/system";

interface Props {
  manualOpen: boolean;
  setManualOpen: any;
}

export const stateOptions = globals.states.map((state) => {
  return (
    <option key={state} value={state}>
      {state}
    </option>
  );
});

const AddPatientManual: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // form fields
  const [firstName, setFirstName] = React.useState<string>("");
  const [middleName, setMiddleName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [dateOfBirth, setDateOfBirth] = React.useState<any>(new Date(null));
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [noEmail, setNoEmail] = React.useState<boolean>(false);
  const [gender, setGender] = React.useState<string>("Female");
  const [address, setAddress] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [zip, setZip] = React.useState<string>("");

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  const [unsavedchanges, setUnsavedChanges] = React.useState<boolean>(false);

  const handleModalClose = () => {
    props.setManualOpen(false);
  };

  const handleDateChange = (date) => {
    setDateOfBirth(date);
    setUnsavedChanges(true);
  };

  const saveManualPatient = () => {
    if (validForm()) {
      fetch(`/add_manual_patient`, {
        method: "POST",
        headers: getHeaders(authenticationSetting?.csrfToken),
        body: JSON.stringify({
          patient: {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email: email,
            no_email: noEmail,
            date_of_birth: new Date(dateOfBirth),
            mobile_phone_number: phoneNumber,
            gender: gender,
            address: address,
            city: city,
            state: state,
            zip: zip,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.message);
            setFlashMessage({ message: result.message, type: "error" });
          } else {
            setFlashMessage({ message: result.message, type: "success" });
            let url = "/patients";
            location.href = url;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const validForm = () => {
    let errorFields = [];
    if (firstName?.length < 1) {
      errorFields.push("First Name");
    }
    if (lastName?.length < 1) {
      errorFields.push("Last Name");
    }
    if (dateOfBirth?.length < 1) {
      errorFields.push("Date Of Birth");
    }
    if (phoneNumber?.length < 1) {
      errorFields.push("Phone Number");
    }
    if (!noEmail) {
      if (email?.length < 1) {
        errorFields.push("Email");
      }
    }
    if (address?.length < 1) {
      errorFields.push("Address");
    }
    if (city?.length < 1) {
      errorFields.push("City");
    }
    if (state?.length < 1) {
      errorFields.push("State");
    }
    if (zip?.length < 1) {
      errorFields.push("Zip");
    }

    if (errorFields.length > 0) {
      let message = `${errorFields.join(", ")} are required.`;
      setFlashMessage({ message: message, type: "error" });
      return false;
    } else {
      return true;
    }
  };

  // no email handler
  const handleNoEmailCheck = () => {
    setNoEmail(!noEmail);
  };
  return (
    <>
      <GeneralModal
        open={props.manualOpen}
        title={"Add Patient to Starfield"}
        successCallback={saveManualPatient}
        closeCallback={handleModalClose}
        containerClassName="manual-patient-modal-body"
        width="900px"
      >
        <FlashMessage flashMessage={flashMessage} />
        <Grid container className="form-container" spacing={1}>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="first_name" className="field-label2">
                  First Name*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="first_name"
                  size="small"
                  value={firstName}
                  autoFocus
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setFirstName(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="middle_name" className="field-label2">
                  Middle Name
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="middle_name"
                  size="small"
                  value={middleName}
                  className="the-field"
                  variant="outlined"
                  onChange={(event) => {
                    setMiddleName(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="last_name" className="field-label2">
                  Last Name*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="last_name"
                  size="small"
                  value={lastName}
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setLastName(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
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
                <InputLabel htmlFor="Phone Number" className="field-label2">
                  Mobile Phone Number*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <InputMask
                  style={{ borderBottom: "none" }}
                  id="mobile-phone-number"
                  mask="999-999-9999"
                  value={phoneNumber}
                  disabled={false}
                  maskChar=""
                  className="the-field"
                  variant="outlined"
                  size="small"
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                  }}
                >
                  {() => (
                    <TextField
                      className="the-field"
                      variant="outlined"
                      required
                      size="small"
                    />
                  )}
                </InputMask>
              </Grid>
            </Grid>

            <Grid container>
              <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
                <InputLabel htmlFor="email" className="field-label2">
                  Email*
                </InputLabel>
                <InputLabel
                  htmlFor="no-email"
                  className="field-label2"
                  style={{
                    textAlign: "right",
                    marginRight: "15px",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    checked={noEmail}
                    size="small"
                    inputProps={{ "aria-label": "Self" }}
                    style={{ padding: "0px" }}
                    onClick={handleNoEmailCheck}
                  />
                  Email not available
                </InputLabel>
              </Stack>
              <Grid item xs={12} className="field-container">
                {!noEmail && (
                  <TextField
                    id="email"
                    size="small"
                    value={email}
                    className="the-field"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    onKeyPress={(event) => {
                      setUnsavedChanges(true);
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="gender" className="field-label2">
                  Gender*
                </InputLabel>
              </Grid>
              <Grid item xs={12} style={{ height: "40px" }}>
                <Radio
                  checked={gender === "Male"}
                  onChange={(event) => setGender(event.target.value)}
                  value="Male"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Self" }}
                  style={{ backgroundColor: "transparent" }}
                />
                Male
                <Radio
                  checked={gender === "Female"}
                  onChange={(event) => setGender(event.target.value)}
                  value="Female"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Spouse" }}
                  style={{ backgroundColor: "transparent" }}
                />
                Female
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label2">
                  Address*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={address}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setAddress(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="city" className="field-label2">
                  City*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="city"
                  size="small"
                  value={city}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setCity(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="state" className="field-label2">
                  State*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <Select
                  id="state"
                  value={state}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setState(event.target.value as string);
                  }}
                  native
                >
                  <option value={""}>Select State</option>
                  {stateOptions}
                </Select>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="zip" className="field-label2">
                  Zip*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="zip"
                  size="small"
                  value={zip}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setZip(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </GeneralModal>
    </>
  );
};

export default AddPatientManual;
