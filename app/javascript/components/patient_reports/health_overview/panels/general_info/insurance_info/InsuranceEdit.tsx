import * as React from "react";
import { Grid, TextField, InputLabel, Radio, Select } from "@mui/material";
import InputMask from "react-input-mask";
import globals from "../../../../../globals/globals";
import dayjs, { Dayjs } from "dayjs";

// helper
import { FlashContext } from "../../../../../Context";
import CustomDatePicker from "../../../../../common/CustomDatePicker";

interface Props {
  csrfToken: string;
  patient: any;
  patientInsurance: any;
  insuranceTypeOptions: any;
  unsavedChanges: boolean;
  setUnsavedChanges: any;
  onUpdate: Function;
  onDelete: Function;
  isSecondaryInsurance: boolean;
  setPrimaryFormvalues: Function;
  setSecondaryFormValues: Function;
}

const InsuranceEdit: React.FC<Props> = (props) => {
  const flashContext = React.useContext(FlashContext);
  const [insuranceType, setInsuranceType] = React.useState<string>(
    props.patientInsurance?.insurance_type || ""
  );
  const [insurancePlan, setInsurancePLan] = React.useState<string>(
    props.patientInsurance?.plan_name || ""
  );
  const [insuranceNumber, setInsuranceNumber] = React.useState<string>(
    props.patientInsurance?.insured_id || ""
  );
  const [relationship, setRelationship] = React.useState<string>(
    props.patientInsurance?.relationship || ""
  );
  const [firstName, setFirstName] = React.useState<string>(
    props.patientInsurance?.first_name || ""
  );
  const [middleName, setMiddleName] = React.useState<string>(
    props.patientInsurance?.middle_name || ""
  );
  const [lastName, setLastName] = React.useState<string>(
    props.patientInsurance?.last_name || ""
  );
  const [address, setAddress] = React.useState<string>(
    props.patientInsurance?.address || ""
  );
  const [city, setCity] = React.useState<string>(
    props.patientInsurance?.city || ""
  );
  const [state, setState] = React.useState<string>(
    props.patientInsurance?.state || ""
  );
  const [zip, setZip] = React.useState<string>(
    props.patientInsurance?.zip || ""
  );
  const [county, setCounty] = React.useState<string>(
    props.patientInsurance?.county || ""
  );
  const [mobilePhoneNumber, setMobilePhoneNumber] = React.useState<string>(
    props.patientInsurance?.phone_number || ""
  );
  const [dateOfBirth, setDateOfBirth] = React.useState<Dayjs | null>(
    props.patientInsurance?.insured_dob
      ? dayjs(props.patientInsurance?.insured_dob)
      : null
  );
  const [error, setError] = React.useState<string>("");

  const updatePatientInsurance = () => {
    const formValues = {
      insurance_type: insuranceType,
      plan_name: insurancePlan,
      insured_id: insuranceNumber,
      relationship: relationship,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      address: address,
      city: city,
      state: state,
      zip: zip,
      county: county,
      phone_number: mobilePhoneNumber,
      insured_dob: dateOfBirth ? dateOfBirth.format("YYYY-MM-DD") : null,
      is_secondary: props.isSecondaryInsurance,
    };

    // Update state in the parent
    if (props.isSecondaryInsurance) {
      props.setSecondaryFormValues(formValues);
    } else {
      props.setPrimaryFormvalues(formValues);
    }
  };

  React.useEffect(() => {
    updatePatientInsurance();
  }, [
    insuranceType,
    insurancePlan,
    insuranceNumber,
    relationship,
    firstName,
    middleName,
    lastName,
    address,
    city,
    state,
    zip,
    county,
    mobilePhoneNumber,
    dateOfBirth,
  ]);

  React.useEffect(() => {
    if (relationship == "self") {
      setLastName(props?.patient.last_name);
      setFirstName(props?.patient.first_name);
      setMiddleName(props?.patient.middle_name);
      setDateOfBirth(
        props.patient?.date_of_birth
          ? dayjs(props.patient?.date_of_birth)
          : null
      );
    }
  }, [
    props?.patient.first_name,
    props?.patient.last_name,
    props?.patient.middle_name,
    relationship,
  ]);

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

  const countriesOptions = globals.countries.map((county) => {
    return (
      <option key={county} value={county}>
        {county}
      </option>
    );
  });

  const insuranceTypes = props.insuranceTypeOptions.map((option) => {
    return (
      <option key={option?.insurance_type} value={option?.insurance_type}>
        {option?.insurance_type}
      </option>
    );
  });

  const validForm = () => {
    let errorFields = [];
    if (insuranceType?.length < 1) {
      errorFields.push("Insurance Type");
    }
    if (insuranceNumber?.length < 1) {
      errorFields.push("Insured's ID #");
    }
    if (insurancePlan?.length < 1) {
      errorFields.push("Plan Name or Program");
    }
    if (relationship?.length < 1) {
      errorFields.push("Relationship");
    }
    if (lastName?.length < 1) {
      errorFields.push("Insured's Last Name");
    }

    if (firstName?.length < 1) {
      errorFields.push("Insured's First Name");
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
    if (county?.length < 1) {
      errorFields.push("County");
    }

    if (zip?.length < 1) {
      errorFields.push("Zip");
    }
    if (mobilePhoneNumber?.length < 1) {
      errorFields.push("PhoneNumber");
    }

    if (errorFields.length > 0) {
      let message = `${errorFields.join(", ")} are required.`;
      flashContext.setMessage({ text: message, type: "error" });
      return false;
    } else {
      return true;
    }
  };

  return (
    <Grid item xs={12} className="patient-edit-container patient-edit-form">
      {props.isSecondaryInsurance && !props.patientInsurance && (
        <div
          className="label-tag-container secondary-container"
          style={{ width: 40, marginLeft: 0 }}
        >
          <p className="label-tag secondary-tag">Secondary</p>
        </div>
      )}
      <Grid container>
        <Grid container className="form-container">
          <Grid item xs={2.5} sx={{ mr: 5 }}>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="insurance_type" className="field-label">
                  Insurance Type*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <Select
                  id="insurance_type"
                  value={insuranceType}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setInsuranceType(event.target.value);
                  }}
                  native
                >
                  <option value={""}>Select Insurance</option>
                  {insuranceTypes}
                </Select>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="plan_name" className="field-label">
                  Insurance Plan or Program*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="plan_name"
                  placeholder="Enter Insurance Plan"
                  size="small"
                  value={insurancePlan}
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setInsurancePLan(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="insured_id" className="field-label">
                  Insurance Number*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="insured_id"
                  placeholder="Enter Insurance Number"
                  size="small"
                  value={insuranceNumber}
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setInsuranceNumber(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="relationship" className="field-label">
                Patient Relationship to Insured*
              </InputLabel>
              <Grid container item xs={12}>
                <div className="row" style={{ height: 40 }}>
                  <Radio
                    checked={relationship === "self"}
                    onChange={(event) => setRelationship(event.target.value)}
                    value="self"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Self" }}
                    style={{ backgroundColor: "transparent" }}
                    sx={{
                      color: "#A29D9B",
                      ml: 2,
                      mr: 1,
                      width: 15,
                      height: 15,
                    }}
                  />
                  <p className="radio-label">Self</p>
                  <Radio
                    checked={relationship === "spouse"}
                    onChange={(event) => setRelationship(event.target.value)}
                    value="spouse"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Spouse" }}
                    style={{ backgroundColor: "transparent" }}
                    sx={{
                      color: "#A29D9B",
                      ml: 2,
                      mr: 1,
                      width: 15,
                      height: 15,
                    }}
                  />
                  <p className="radio-label">Spouse</p>
                  <Radio
                    checked={relationship === "child"}
                    onChange={(event) => setRelationship(event.target.value)}
                    value="child"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Child" }}
                    style={{ backgroundColor: "transparent" }}
                    sx={{
                      color: "#A29D9B",
                      ml: 2,
                      mr: 1,
                      width: 15,
                      height: 15,
                    }}
                  />
                  <p className="radio-label">Child</p>
                  <Radio
                    checked={relationship === "other"}
                    onChange={(event) => setRelationship(event.target.value)}
                    value="other"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Other" }}
                    style={{ backgroundColor: "transparent" }}
                    sx={{
                      color: "#A29D9B",
                      ml: 2,
                      mr: 1,
                      width: 15,
                      height: 15,
                    }}
                  />
                  <p className="radio-label">Other</p>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={2.5} sx={{ mr: 5 }}>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="last_name" className="field-label">
                  Last Name*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  placeholder="Enter Last Name"
                  id="last_name"
                  size="small"
                  value={
                    relationship == "self" ? props.patient?.last_name : lastName
                  }
                  disabled={relationship == "self"}
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
                <InputLabel htmlFor="first_name" className="field-label">
                  First Name*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="first_name"
                  placeholder="Enter First Name"
                  size="small"
                  value={
                    relationship == "self"
                      ? props.patient?.first_name
                      : firstName
                  }
                  disabled={relationship == "self"}
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
                  placeholder="Enter Middle Name"
                  size="small"
                  value={
                    relationship == "self"
                      ? props.patient?.middle_name
                      : middleName
                  }
                  disabled={relationship == "self"}
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
          </Grid>

          <Grid item xs={2.5} sx={{ mr: 5 }}>
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label">
                  Address*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  placeholder="Enter Address Lines"
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
                  placeholder="Enter City"
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

            <Grid container justifyContent="space-between">
              <Grid container xs={5.5}>
                <Grid item xs={12}>
                  <InputLabel htmlFor="state" className="field-label">
                    State*
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <Select
                    id="state"
                    placeholder="Select"
                    value={state}
                    required
                    variant="outlined"
                    className="the-field"
                    onChange={(event) => {
                      setState(event.target.value);
                    }}
                    native
                  >
                    <option value={""}>Select</option>
                    {stateOptions}
                  </Select>
                </Grid>
              </Grid>
              <Grid container xs={5.5} sx={{ mr: 1 }}>
                <Grid item xs={12}>
                  <InputLabel htmlFor="zip" className="field-label">
                    Zipcode*
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="zip"
                    placeholder="Enter Zip"
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
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="county" className="field-label">
                  County*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="county"
                  placeholder="Enter County"
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

          <Grid item xs={2.5} sx={{ mr: 5 }}>
            <CustomDatePicker
              id={"insured_dob"}
              label={"Date Of Birth"}
              placeholder={"Select Birthdate"}
              date={dateOfBirth}
              handleDateChange={handleDateChange}
              disabled={relationship == "self"}
            />
            <Grid container>
              <Grid item xs={12}>
                <InputLabel
                  htmlFor="mobile_phone_number"
                  className="field-label"
                >
                  Phone Number*
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
                      placeholder="Enter Phone Number"
                      className="the-field"
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

InsuranceEdit.displayName = "InsuranceEdit";

export default InsuranceEdit;
