/* eslint-disable prettier/prettier */

// Library Imports
import * as React from "react";
import {
  Grid,
  Link,
  TextField,
  InputLabel,
  Radio,
  MenuItem,
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

// app setting imports
import { AuthenticationContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patient_id: string;
  setEditMode: any;
  insuranceReloader: boolean;
  setInsuranceReloader: any;
}

const PatientInsuranceShow: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [insuranceType, setInsuranceType] = React.useState<string>("");
  const [planName, setPlanName] = React.useState<string>("");
  const [insuredId, setInsuredId] = React.useState<string>("");
  const [relationship, setRelationship] = React.useState<string>("");
  const [insuredName, setInsuredName] = React.useState<string>("");
  const [insuredDob, setInsuredDob] = React.useState<any>(new Date(null));
  const [address, setAddress] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [zip, setZip] = React.useState<string>("");
  const [insuredPhoneNumber, setInsuredPhoneNumber] =
    React.useState<string>("");

  // Object caller state
  const [patientInsurance, setPatientInsurance] = React.useState<any>(null);
  const [insuranceTypeOptions, setInsuranceTypeOptions] = React.useState<any>(
    []
  );

  // Error handling states
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [invalidFields, setInvalidFields] = React.useState<any>([]);
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  React.useEffect(() => {
    getPatientInsurance();
  }, [props.patient_id]);

  React.useEffect(() => {
    if (patientInsurance) {
      setInsuranceType(patientInsurance?.insurance_type);
      setPlanName(patientInsurance?.plan_name);
      setInsuredId(patientInsurance?.insured_id);
      setRelationship(patientInsurance?.relationship);
      setInsuredName(patientInsurance?.insured_name);
      setInsuredDob(patientInsurance?.formatted_insured_dob);
      setAddress(patientInsurance?.address);
      setCity(patientInsurance?.city);
      setState(patientInsurance?.state);
      setZip(patientInsurance?.zip);
      setInsuredPhoneNumber(patientInsurance?.phone_number);
    }
  }, [patientInsurance]);

  const getPatientInsurance = () => {
    fetch(`/data_fetching/patient_insurances/${props.patient_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setPatientInsurance(result.resource?.patient_insurance);
          setInsuranceTypeOptions(result.resource?.insurance_types);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const stateOptions = globals.states.map((state) => {
    return (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    );
  });

  const handleDateChange = (date) => {
    setInsuredDob(date);
    setUnsavedChanges(true);
  };

  const handleCancel = () => {
    props.setEditMode(false);
  };

  const validForm = () => {
    let errorFields = [];
    if (insuranceType?.length < 1) {
      errorFields.push("Insurance Type");
    }
    if (insuredId?.length < 1) {
      errorFields.push("Insured's ID #");
    }
    if (planName?.length < 1) {
      errorFields.push("Plan Name or Program");
    }
    if (relationship?.length < 1) {
      errorFields.push("Relationship");
    }
    if (insuredName?.length < 1) {
      errorFields.push("Insured's Name");
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
    if (insuredPhoneNumber?.length < 1) {
      errorFields.push("PhoneNumber");
    }

    if (errorFields.length > 0) {
      let message = `${errorFields.join(", ")} are required.`;
      setFlashMessage({ message: message, type: "error" });
      return false;
    } else {
      return true;
    }
  };

  const checkDisabled = (field) => {
    if (relationship == "self" && patientInsurance) {
      if (field == "name") {
        return insuredName?.length >= 0;
      }
      if (field == "address") {
        return address?.length >= 0;
      }
      if (field == "city") {
        return city?.length >= 0;
      }
      if (field == "state") {
        return state?.length >= 0;
      }
      if (field == "zip") {
        return zip?.length >= 0;
      }

      if (field == "dob") {
        return true;
      }
    }
  };

  const handleSave = () => {
    if (validForm()) {
      fetch(`/patient_insurances`, {
        method: "POST",
        headers: getHeaders(authenticationSetting?.csrfToken),
        body: JSON.stringify({
          patient_id: props.patient_id,
          patient_insurance_id: patientInsurance?.id,
          patient_insurance: {
            insurance_type: insuranceType,
            plan_name: planName,
            insured_id: insuredId,
            relationship: relationship,
            insured_name: insuredName,
            insured_dob: new Date(insuredDob),
            address: address,
            city: city,
            state: state,
            zip: zip,
            phone_number: insuredPhoneNumber,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.message);
          } else {
            setFlashMessage({ message: result.message, type: "success" });
            props.setInsuranceReloader(!props.insuranceReloader);
            handleCancel();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Grid item xs={12} className="patient-insurance-edit-container">
      <FlashMessage flashMessage={flashMessage} />
      <Grid container>
        <Grid
          className="patient-edit-header"
          container
          justifyContent="space-between"
        >
          <Grid item xs={4}>
            <p className="secondary-label">Insurance Information</p>
          </Grid>
          <Grid className="action-container align-with-form">
            <span>
              <Link className="cancel-link" onClick={handleCancel}>
                Cancel
              </Link>
            </span>
            <span>
              <Link className="save-btn" onClick={handleSave}>
                Save
              </Link>
            </span>
            <span></span>
          </Grid>
        </Grid>
        <Grid
          container
          className="form-container"
          justifyContent="space-between"
        >
          <Grid
            item
            xs={5}
            className="patient-info-left-container form-left-container"
          >
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="insurance_type" className="field-label">
                  Insurance Type*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="insurance_type"
                  value={insuranceType}
                  required
                  size="small"
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setInsuranceType(event.target.value);
                  }}
                  select
                >
                  {insuranceTypeOptions.map((insuranceTypeOption) => {
                    return (
                      <MenuItem
                        key={insuranceTypeOption.id}
                        value={insuranceTypeOption.insurance_type}
                      >
                        {insuranceTypeOption.insurance_type}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="plan_name" className="field-label">
                  Insurance Plan or Program Name*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="plan_name"
                  size="small"
                  value={planName}
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setPlanName(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="insured_id" className="field-label">
                  Insured&#39;s ID #*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="insured_id"
                  size="small"
                  value={insuredId}
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setInsuredId(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="gender" className="field-label">
                Patient Relationship to Insured
              </InputLabel>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={4}>
                <div>
                  <Radio
                    checked={relationship === "self"}
                    onChange={(event) => setRelationship(event.target.value)}
                    value="self"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Self" }}
                    style={{ backgroundColor: "transparent" }}
                  />
                  Self
                </div>
                <div>
                  <Radio
                    checked={relationship === "spouse"}
                    onChange={(event) => setRelationship(event.target.value)}
                    value="spouse"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Spouse" }}
                    style={{ backgroundColor: "transparent" }}
                  />
                  Spouse
                </div>
              </Grid>
              <Grid item xs={4}>
                <div>
                  <Radio
                    checked={relationship === "child"}
                    onChange={(event) => setRelationship(event.target.value)}
                    value="child"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Child" }}
                    style={{ backgroundColor: "transparent" }}
                  />
                  Child
                </div>
                <div>
                  <Radio
                    checked={relationship === "other"}
                    onChange={(event) => setRelationship(event.target.value)}
                    value="other"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Other" }}
                    style={{ backgroundColor: "transparent" }}
                  />
                  Other
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="insured_name" className="field-label">
                  Insured&#39;s Name (Last, First, MI)
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="insured_name"
                  size="small"
                  value={insuredName}
                  className="the-field"
                  required
                  variant="outlined"
                  disabled={checkDisabled("name")}
                  onChange={(event) => {
                    setInsuredName(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={5}
            className="patient-info-right-container insurance-right-column"
          >
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="date_of_birth" className="field-label">
                  Insured&#39;s Date of Birth
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="date-field-container">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk={true}
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={insuredDob}
                    onChange={handleDateChange}
                    disabled={checkDisabled("dob")}
                    className="date-field"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label">
                  Insured&#39;s Address*
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
                  disabled={checkDisabled("address")}
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
                  disabled={checkDisabled("city")}
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
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="state" className="field-label">
                      State*
                    </InputLabel>
                  </Grid>
                  <Grid item xs={12} className="field-container">
                    <TextField
                      id="state"
                      value={state}
                      required
                      size="small"
                      variant="outlined"
                      className="the-field"
                      disabled={checkDisabled("state")}
                      onChange={(event) => {
                        setState(event.target.value);
                      }}
                      select
                    >
                      {stateOptions}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="zip" className="field-label">
                      Zip*
                    </InputLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="field-container"
                    style={{ paddingRight: "10px" }}
                  >
                    <TextField
                      id="zip"
                      size="small"
                      value={zip}
                      required
                      variant="outlined"
                      className="the-field"
                      disabled={checkDisabled("zip")}
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

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="Phone Number" className="field-label">
                  Insured&#39;s Phone Number*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <InputMask
                  style={{ borderBottom: "none" }}
                  id="insured-phone-number"
                  mask="999-999-9999"
                  value={insuredPhoneNumber}
                  disabled={false}
                  maskChar=""
                  className="the-field"
                  variant="outlined"
                  size="small"
                  onChange={(event) => {
                    setInsuredPhoneNumber(event.target.value);
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
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientInsuranceShow;
