import * as React from "react";
import {
  Grid,
  Link,
  TextField,
  MenuItem,
  InputLabel,
  Snackbar,
} from "@mui/material";
import InputMask from "react-input-mask";
import { Alert } from "@mui/material";

// component imports
import FlashMessage from "../../shared/FlashMessage";

// headers
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  unsaveChanges: boolean;
  setUnsavedChanges: any;
  setUnsavedModalOpen: any;
  setShowAddCoreTeamForm: any;
}

const AddProvider: React.FC<Props> = (props: any) => {
  const [firstName, setFirstName] = React.useState<string>("");
  const [middleName, setMiddleName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [role, setRole] = React.useState<string>("pharmacist");
  const [mobilePhoneNumber, setMobilePhoneNumber] = React.useState<string>("");
  const [businessPhoneNumber, setBusinessPhoneNumber] =
    React.useState<string>("");
  const [providerNpiNumber, setProviderNpiNumber] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const handleHideForm = () => {
    event.preventDefault();
    if (props.unsaveChanges) {
      props.setUnsavedModalOpen(true);
    } else {
      props.setShowAddCoreTeamForm(false);
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
    if (email?.length < 1) {
      errorFields.push("Email");
    }
    if (providerNpiNumber.length > 1) {
      if (providerNpiNumber.length != 10 || !isInt(providerNpiNumber)) {
        setFlashMessage({
          message: "Invalid Rendering Provider ID # Number. Must be 10 digit.",
          type: "error",
        });
        return false;
      }
    }

    if (errorFields.length > 0) {
      let message = `${errorFields.join(", ")} are required.`;
      setFlashMessage({ message: message, type: "error" });
      return false;
    } else {
      return true;
    }
  };

  const inviteProvider = () => {
    setError("");
    if (validForm()) {
      fetch(`/user`, {
        method: "POST",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          user: {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email: email,
            mobile_phone_number: mobilePhoneNumber,
            business_phone_number: businessPhoneNumber,
            role: role,
            provider_npi_number: providerNpiNumber,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
          } else {
            props.setShowAddCoreTeamForm(false);
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  const isInt = (value) => {
    if (isNaN(value)) {
      return false;
    }
    let x = parseFloat(value);
    return Number.isInteger(x);
  };

  return (
    <Grid
      item
      xs={6}
      className="provider-container patient-edit-form"
      style={{
        marginTop: "86px",
        marginLeft: "-10px",
      }}
    >
      <FlashMessage flashMessage={flashMessage} />
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
          container
          justifyContent="space-between"
          className="patient-edit-header"
        >
          <Grid item xs={6}>
            <p className="secondary-label">Add Provider Information</p>
          </Grid>
          <Grid item xs={5} style={{ textAlign: "right" }}>
            <span>
              <Link className="cancel-link" onClick={handleHideForm}>
                Cancel
              </Link>
            </span>
            <span>
              <Link className="save-btn" onClick={inviteProvider}>
                Save
              </Link>
            </span>
            <span></span>
          </Grid>
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
                <InputLabel htmlFor="email" className="field-label">
                  Email Address*
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
                  onKeyPress={() => {
                    props.setUnsavedChanges(true);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} className="patient-info-right-container">
            <Grid container>
              <Grid item xs={12}>
                <InputLabel
                  htmlFor="mobile_phone_number"
                  className="field-label"
                >
                  Mobile Phone Number
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
                <InputLabel
                  htmlFor="mobile_phone_number"
                  className="field-label"
                >
                  Business Phone Number
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <InputMask
                  id="business-phone-number"
                  mask="999-999-9999"
                  value={businessPhoneNumber}
                  disabled={false}
                  maskChar=""
                  variant="outlined"
                  className="the-field"
                  size="small"
                  onChange={(event) => {
                    setBusinessPhoneNumber(event.target.value);
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
                <InputLabel htmlFor="role" className="field-label">
                  Role
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="role"
                  className="the-field"
                  value={role}
                  variant="outlined"
                  size="small"
                  onChange={(event) => {
                    setRole(event.target.value);
                  }}
                  select
                >
                  <MenuItem key="pharmacist" value="pharmacist">
                    Pharmacist
                  </MenuItem>
                  <MenuItem key="health_coach" value="health_coach">
                    Health Coach
                  </MenuItem>
                  <MenuItem key="physician" value="physician">
                    Physician
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel
                  htmlFor="rendering Provider ID"
                  className="field-label"
                >
                  Rendering Provider ID #
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="provider_npi_number"
                  size="small"
                  value={providerNpiNumber}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setProviderNpiNumber(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    props.setUnsavedChanges(true);
                  }}
                  inputProps={{
                    maxLength: 10,
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

export default AddProvider;
