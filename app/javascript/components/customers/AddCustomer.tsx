import * as React from "react";
import { Grid, Link, TextField, MenuItem, InputLabel } from "@mui/material";
import InputMask from "react-input-mask";

// helper import
import globals from "../globals/globals";

// app setting imports
import { AuthenticationContext } from "../Context";

// component imports
import FlashMessage from "../shared/FlashMessage";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  setShowAddCustomerForm: any;
}

const AddCustomer: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // form fields
  const [name, setName] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [zip, setZip] = React.useState<string>("");
  const [county, setCounty] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const [facilityNpi, setFacilityNpi] = React.useState<string>("");
  const [federalTaxId, setFederalTaxId] = React.useState<string>("");
  const [placeOfServiceCode, setPlaceOfServiceCode] =
    React.useState<string>("");

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const stateOptions = globals.states.map((state) => {
    return (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    );
  });

  const handleSave = () => {
    if (validForm()) {
      fetch(`/data_fetching/customers`, {
        method: "POST",
        headers: getHeaders(authenticationSetting?.csrfToken),
        body: JSON.stringify({
          customer: {
            name: name,
            address: address,
            city: city,
            state: state,
            zip: zip,
            county: county,
            phone_number: phoneNumber,
            notes: notes,
            facility_npi: facilityNpi,
            federal_tax_id: federalTaxId,
            place_of_service_code: placeOfServiceCode,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            setFlashMessage({ message: result.message, type: "error" });
          } else {
            setFlashMessage({ message: result.message, type: "success" });
            let url = "/customer-list";
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
    if (!name || name?.length < 1) {
      errorFields.push("Name");
    }
    if (!address && address?.length < 1) {
      errorFields.push("Address");
    }
    if (!city || city?.length < 1) {
      errorFields.push("City");
    }
    if (!state || state?.length < 1) {
      errorFields.push("State");
    }
    if (!zip || zip?.length < 1) {
      errorFields.push("Zip");
    }
    if (!phoneNumber || phoneNumber?.length < 1) {
      errorFields.push("Phone Number");
    }

    if (errorFields.length > 0) {
      let message = `${errorFields.join(", ")} are required.`;
      setFlashMessage({ message: message, type: "error" });
      return false;
    } else {
      return true;
    }
  };

  return (
    <Grid
      item
      xs={12}
      className="provider-container patient-edit-form"
      style={{
        marginTop: "88px",
      }}
    >
      <FlashMessage flashMessage={flashMessage} />
      <Grid container>
        <Grid container justifyContent="space-between">
          <Grid item xs={4}>
            <p className="secondary-label">Add Customer Information</p>
          </Grid>
          <Grid>
            <span>
              <Link
                className="cancel-link"
                onClick={() => props.setShowAddCustomerForm(false)}
              >
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
        <div className="divider-orange divider" style={{ margin: "0px" }}></div>
        <Grid container className="form-container">
          <Grid item xs={5} className="patient-info-left-container">
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="first_name" className="field-label">
                  Name*
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="name"
                  size="small"
                  value={name}
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
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
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setAddress(event.target.value);
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
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setCity(event.target.value);
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
                <TextField
                  id="state"
                  value={state}
                  required
                  size="small"
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setState(event.target.value);
                  }}
                  select
                >
                  {stateOptions}
                </TextField>
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
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setZip(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} className="patient-info-right-container">
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
                  className="the-field"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setCounty(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
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
                  value={phoneNumber}
                  disabled={false}
                  maskChar=""
                  variant="outlined"
                  className="the-field"
                  size="small"
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
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
                <InputLabel htmlFor="federal_tax_id" className="field-label">
                  Federal Tax ID #
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="federal_tax_id"
                  size="small"
                  value={federalTaxId}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setFederalTaxId(event.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="Facility NPI" className="field-label">
                  Facility NPI
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="provider_npi_number"
                  size="small"
                  value={facilityNpi}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setFacilityNpi(event.target.value);
                  }}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel
                  htmlFor="Place of service code"
                  className="field-label"
                >
                  Place of Service Code
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="provider_npi_number"
                  size="small"
                  value={placeOfServiceCode}
                  required
                  variant="outlined"
                  className="the-field"
                  onChange={(event) => {
                    setPlaceOfServiceCode(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={10}
            container
            direction="row"
            alignItems="center"
            style={{ marginLeft: "30px", marginTop: "15px" }}
          >
            <Grid item xs={12}>
              <div className="customerInfo">
                <div className="customerInfoLabel">Notes</div>
                <textarea
                  style={{ width: "100%", padding: "10px", textIndent: "0px" }}
                  rows={5}
                  className="customerInfoField"
                  value={notes}
                  onChange={(event) => {
                    setNotes(event.target.value);
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddCustomer;
