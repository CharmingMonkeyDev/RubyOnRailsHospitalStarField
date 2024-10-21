/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link, TextField, InputLabel, Snackbar } from "@mui/material";
import InputMask from "react-input-mask";
import globals from "../globals/globals";
import { Alert } from '@mui/material';
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

interface Props {
  user_id: string;
  selectedCustomer: string;
  customers: string;
}

import { Container, MenuItem, Checkbox } from "@mui/material";

const ProviderEdit: React.FC<Props> = (props: any) => {
  const [firstName, setFirstName] = React.useState<string>("");
  const [middleName, setMiddleName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [mobilePhoneNumber, setMobilePhoneNumber] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [invalidFieldsArray, setInvalidFieldsArray] = React.useState<string[]>(
    []
  );
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [user, setUser] = React.useState<any>();
  const [userPrivileges, setUserPrivileges] = React.useState<any>();
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [doNotAsk, setDoNotAsk] = React.useState<boolean>(false);
  const [customer, setCustomer] = React.useState<any>(
    props.selectedCustomer?.customer_id
  );
  const [customerSelection, setCustomerSelection] = React.useState<any>();

  //  context import
  const authenticationSetting = React.useContext(AuthenticationContext);

  React.useEffect(() => {
    if (props.user_id) {
      fetch(`/data_fetching/edit_provider`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setUserPrivileges(result.resource.privileges);
            setUser(result.resource);
            setFirstName(result.resource.first_name);
            setMiddleName(result.resource.middle_name);
            setLastName(result.resource.last_name);
            setMobilePhoneNumber(result.resource.mobile_phone_number);
            setEmail(result.resource.email);
            setCustomerSelection(result.resource.customer_selection_id);
            setDoNotAsk(result.resource.do_not_ask);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.user_id]);

  const validForm = () => {
    let valid = false;

    const fields = [
      [firstName, "First Name"],
      [lastName, "Last Name"],
      [email, "Email Address"],
      [mobilePhoneNumber, "Mobile Phone Number"],
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

  const updateUser = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(`/customer_selections/${customerSelection}`, {
        method: "PATCH",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          new_customer_id: customer,
          do_not_ask: doNotAsk,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            updateUserModel();
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

  const updateUserModel = () => {
    fetch(`/edit_provider`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        user: {
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          middle_name: middleName,
          mobile_phone_number: mobilePhoneNumber,
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
          window.location.href = `/`;
        }
      })
      .catch((error) => {
        setError(error);
        setDisabledButton(false);
      });
  };

  const handleHideForm = () => {
    event.preventDefault();
    if (unsavedChanges) {
      if (confirm("You have unsaved changes.  Cancel anyway?")) {
        history.back();
      }
    } else {
      history.back();
    }
  };

  return (
    <div className="main-content-outer">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="main-content"
      >
        <Grid
          item
          xs={6}
          className="patient-edit-container patient-edit-form provider-edit"
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
              <Grid item xs={4}>
                <p className="secondary-label">Edit Profile Information</p>
              </Grid>
              <Grid className="action-container">
                <span>
                  <Link className="cancel-link" onClick={handleHideForm}>
                    Cancel
                  </Link>
                </span>
                <span>
                  <Link className="save-btn" onClick={updateUser}>
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
                        setUnsavedChanges(true);
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
                        setUnsavedChanges(true);
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
                        setUnsavedChanges(true);
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
                        setUnsavedChanges(true);
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
                        setUnsavedChanges(true);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={5} className="patient-info-right-container">
                <Grid container>
                  <InputLabel htmlFor="customer_id" className="field-label">
                    Default Customer Login
                  </InputLabel>
                  <Grid item xs={12} className="field-container">
                    <TextField
                      id="customer_id"
                      name="customer[customer_id]"
                      className="the-field"
                      value={customer}
                      size="small"
                      variant="outlined"
                      onChange={(event) => {
                        setCustomer(event.target.value);
                      }}
                      select
                    >
                      {props.customers.map((customer, index) => (
                        <MenuItem key={index} value={customer.id}>
                          {customer.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <div className="checkbox-container">
                    <Checkbox
                      size="small"
                      name="customer[do_not_ask]"
                      checked={doNotAsk}
                      value={doNotAsk}
                      onClick={() => setDoNotAsk(doNotAsk ? false : true)}
                    />
                    <label className="checkbox-text">
                      Make this my default and do not ask me upon login{" "}
                    </label>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProviderEdit;
