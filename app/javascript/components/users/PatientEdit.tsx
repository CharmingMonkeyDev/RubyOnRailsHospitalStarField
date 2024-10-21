import * as React from "react";
import {
  Grid,
  Link,
  TextField,
  InputLabel,
  Radio,
  Snackbar,
  Select,
  Box,
  Stack,
} from "@mui/material";
import InputMask from "react-input-mask";
import globals from "../globals/globals";
import { Alert } from '@mui/material';
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// helper
import { getHeaders } from "../utils/HeaderHelper";
import {raceOptions, ethnicityOptions} from "../globals/globals"

interface Props {
  csrfToken: string;
  selectedPatient: any;
  unsaveChanges: boolean;
  setUnsavedChanges: any;
  setUnsavedModalOpen: any;
  onUpdate: Function;
}

const PatientEdit: React.FC<Props> = (props: any) => {
  const [patient, setPatient] = React.useState<string>(props.selectedPatient);
  const [firstName, setFirstName] = React.useState<string>(
    props.selectedPatient?.first_name || ""
  );
  const [middleName, setMiddleName] = React.useState<string>(
    props.selectedPatient?.middle_name || ""
  );
  const [lastName, setLastName] = React.useState<string>(
    props.selectedPatient?.last_name || ""
  );
  const [email, setEmail] = React.useState<string>(
    props.selectedPatient?.email || ""
  );
  const [address, setAddress] = React.useState<string>(
    props.selectedPatient?.address || ""
  );
  const [city, setCity] = React.useState<string>(
    props.selectedPatient?.city || ""
  );
  const [state, setState] = React.useState<string>(
    props.selectedPatient?.state || ""
  );
  const [zip, setZip] = React.useState<string>(
    props.selectedPatient?.zip || ""
  );
  const [county, setCounty] = React.useState<string>(
    props.selectedPatient?.county || ""
  );
  const [race, setRace] = React.useState<string>(
    props.selectedPatient?.race || ""
  );
  const [ethnicity, setEthnicity] = React.useState<string>(
    props.selectedPatient?.ethnicity || ""
  );
  const [mobilePhoneNumber, setMobilePhoneNumber] = React.useState<string>(
    props.selectedPatient?.mobile_phone_number || ""
  );
  const [dateOfBirth, setDateOfBirth] = React.useState<Dayjs | null>(
    dayjs(props.selectedPatient?.date_of_birth) || dayjs()
  );
  const [gender, setGender] = React.useState<string>(
    props.selectedPatient?.gender || ""
  );
  const [error, setError] = React.useState<string>("");
  const [invalidFieldsArray, setInvalidFieldsArray] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    fetch(`/data_fetching/edit_my_info/${props.selectedPatient?.id}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          setPatient(result);
          setEmail(result?.email);
          setFirstName(result?.first_name);
          setMiddleName(result?.middle_name);
          setLastName(result?.last_name);
          setAddress(result?.address);
          setCity(result?.city);
          setState(result?.state);
          setZip(result?.zip);
          setCounty(result?.county);
          setRace(result?.race);
          setEthnicity(result?.ethnicity);
          setMobilePhoneNumber(result?.mobile_phone_number);
          setDateOfBirth(dayjs(result?.js_formatted_dob));
          setGender(result?.gender);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.csrfToken, props.selectedPatient]);

  const handleHideForm = () => {
    event.preventDefault();
    if (props.unsaveChanges) {
      props.setUnsavedModalOpen(true);
    } else {
      props.onUpdate();
    }
  };

  const handleDateChange = (date) => {
    setDateOfBirth(date);
    props.setUnsavedChanges(true);
  };

  const stateOptions = globals.states.map((state) => {
    return (
      <option key={state} value={state}>
        {state}
      </option>
    );
  });

  const validForm = () => {
    let valid = false;
    const fields = [
      [firstName, "First Name"],
      [lastName, "Last Name"],
      [email, "Email Address"],
      [address, "Address"],
      [city, "City"],
      [state, "State"],
      [zip, "Zip"],
      [mobilePhoneNumber, "Mobile Phone Number"],
      [gender, "Gender"],
    ];
    const invalid = fields.filter((field) => !field[0] || field[0].length == 0);
    let invalidFieldArrayObject = invalid.map((field) => field[1]);

    if (invalidFieldArrayObject.length == 0) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(String(email).toLowerCase())) {
        let invalidFields = invalidFieldArrayObject;
        invalidFields.push("a valid Email Address");
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

  const updatePatient = () => {
    setError("");
    if (validForm()) {
      fetch(`/edit_patient_info`, {
        method: "POST",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          user: {
            id: props.selectedPatient.id,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email: email,
            address: address,
            city: city,
            state: state,
            zip: zip,
            county: county,
            race: race,
            ethnicity: ethnicity,
            mobile_phone_number: mobilePhoneNumber,
            gender: gender,
            date_of_birth: dateOfBirth,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
          } else {
            props.onUpdate();
          }
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      setError("Invalid entries, please check your entries and try again.");
    }
  };

  return (
    <Grid
      item
      xs={6}
      className="patient-edit-container patient-edit-form"
      style={{
        marginTop: "86px",
        marginLeft: "-10px",
      }}
    >
      {error.length > 0 && (
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            setError("");
          }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      <Grid container>
        <Grid
          className="patient-edit-header"
          container
          justifyContent="space-between"
        >
          <Stack direction={"row"} width={"100%"} justifyContent={"space-between"}>
            <Grid item>
              <p className="secondary-label">Edit Patient Information</p>
            </Grid>
            <Stack
              direction={"row"}
              spacing={2}
              // justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}
            >
              <Link className="cancel-link" onClick={handleHideForm}>
                Cancel
              </Link>
              <Link className="save-btn" onClick={updatePatient}>
                Save
              </Link>
            </Stack>
          </Stack>
        </Grid>
        <div className="divider"></div>
        <Grid container className="form-container">
          <Grid
            item
            xs={5}
            className="patient-info-left-container form-left-container"
          >
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="first_name" className="field-label">
                  First Name*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="first_name"
                  size="small"
                  value={firstName}
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setFirstName(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="middle_name" className="field-label">
                  Middle Name
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="middle_name"
                  size="small"
                  value={middleName}
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setMiddleName(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="last_name" className="field-label">
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
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="date_of_birth" className="field-label">
                  Date of Birth*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <DemoContainer
                      components={["DatePicker", "DatePicker"]}
                      sx={{ height: "50px" }}
                    >
                      <DatePicker
                        value={dateOfBirth}
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            variant: "standard",
                          },
                        }}
                        className="report-date-input"
                      />
                    </DemoContainer>
                  </Box>
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel
                  htmlFor="mobile_phone_number"
                  className="field-label"
                >
                  Mobile Phone Number*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <InputMask
                  id="mobile-phone-number"
                  mask="999-999-9999"
                  value={mobilePhoneNumber}
                  disabled={false}
                  maskChar=""
                  variant="outlined"
                  className="the-field"
                  size="small"
                  onChange={(event) => {
                    setMobilePhoneNumber(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    props.setUnsavedChanges(true);
                  }}
                >
                  {() => (
                    <TextField
                      variant="outlined"
                      size="small"
                      className="the-field"
                    />
                  )}
                </InputMask>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="email" className="field-label">
                  Email*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="email"
                  size="small"
                  value={email}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="gender" className="field-label">
                  Gender*
                </InputLabel>
              </Grid>
              <Grid item xs={12}>
                <Radio
                  checked={gender === "Male"}
                  onChange={(event) => setGender(event.target.value)}
                  value="Male"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Male" }}
                  style={{ backgroundColor: "transparent" }}
                />
                Male
                <Radio
                  checked={gender === "Female"}
                  onChange={(event) => setGender(event.target.value)}
                  value="Female"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Female" }}
                  style={{ backgroundColor: "transparent" }}
                />
                Female
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} className="patient-info-right-container">
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="state" className="field-label">
                  Ethnicity
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <Select
                  id="ethnicity"
                  value={ethnicity}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setEthnicity(event.target.value as string);
                  }}
                  native
                >
                  <option value={""}>Select Ethnicity</option>
                  {ethnicityOptions.map((eth, index) => (
                    <option key={index} value={eth}>
                      {eth}
                    </option>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="state" className="field-label">
                  Race
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <Select
                  id="state"
                  value={race}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setRace(event.target.value as string);
                  }}
                  native
                >
                  <option value={""}>Select Race</option>
                  {raceOptions.map((r, index) => (
                    <option key={index} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label">
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
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="city" className="field-label">
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
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="state" className="field-label">
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
                  {stateOptions}
                </Select>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="zip" className="field-label">
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
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="zip" className="field-label">
                  County
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="county"
                  size="small"
                  value={county}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setCounty(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientEdit;
