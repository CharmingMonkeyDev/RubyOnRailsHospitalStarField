import * as React from "react";
import {
  Grid,
  Link,
  TextField,
  MenuItem,
  InputLabel,
  Snackbar,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import InputMask from "react-input-mask";

// component imports
import FlashMessage from "../../shared/FlashMessage";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";
import Modal from "../../modals/Modal";
import { AuthenticationContext, FlashContext } from "../../Context";

interface Props {
  csrfToken: string;
  selectedProvider: any;
  setShowEditForm: any;
  unsaveChanges: boolean;
  setUnsavedChanges: any;
  setUnsavedModalOpen: any;
  onDataUpdated: Function;
}

const ProviderEdit: React.FC<Props> = (props: any) => {
  const [patient, setProvider] = React.useState<string>(props.selectedProvider);
  const [firstName, setFirstName] = React.useState<string>(
    props.selectedProvider?.first_name || ""
  );
  const [middleName, setMiddleName] = React.useState<string>(
    props.selectedProvider?.middle_name || ""
  );
  const [lastName, setLastName] = React.useState<string>(
    props.selectedProvider?.last_name || ""
  );
  const [email, setEmail] = React.useState<string>(
    props.selectedProvider?.email || ""
  );
  const [role, setRole] = React.useState<string>(
    props.selectedProvider?.role || ""
  );
  const [providerNpiNumber, setProviderNpiNumber] = React.useState<string>("");
  const [mobilePhoneNumber, setMobilePhoneNumber] = React.useState<string>(
    props.selectedProvider?.mobile_phone_number || ""
  );
  const [businessPhoneNumber, setBusinessPhoneNumber] = React.useState<string>(
    props.selectedProvider?.business_phone_number || ""
  );
  const [error, setError] = React.useState<string>("");
  const [invalidFieldsArray, setInvalidFieldsArray] = React.useState<string[]>(
    []
  );
  const [
    openActivateDeactivateProviderModal,
    setOpenActivateDeactivateProviderModal,
  ] = React.useState<boolean>(false);

  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const modalContent = (
    <div className="modal-content">
      <p className="align-center">
        You are attempting to{" "}
        {props.selectedProvider.is_active ? "deactivate" : "reactivate"} this
        user. Would you like to continue?
      </p>
    </div>
  );

  React.useEffect(() => {
    fetch(`/data_fetching/core_teams/${props.selectedProvider?.id}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          setProvider(result);
          setEmail(result?.email);
          setFirstName(result?.first_name);
          setMiddleName(result?.middle_name);
          setLastName(result?.last_name);
          setMobilePhoneNumber(result?.mobile_phone_number);
          setProviderNpiNumber(result?.provider_npi_number);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.csrfToken, props.selectedProvider]);

  const handleHideForm = () => {
    event.preventDefault();
    if (props.unsaveChanges) {
      props.setUnsavedModalOpen(true);
    } else {
      props.setShowEditForm(false);
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

  React.useEffect(() => {
    if (invalidFieldsArray.length > 0) {
      setError(`Please fill out ${invalidFieldsArray.join(", ")}`);
    }
  }, [invalidFieldsArray]);

  const UpdateProvider = () => {
    setError("");

    if (validForm()) {
      fetch(`user/${props.selectedProvider?.id}`, {
        method: "PATCH",
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
            props.setShowEditForm(false);
            props.setUnsavedChanges(false);
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

  const handleProviderActivateDeactivate = () => {
    if (!props.selectedProvider) {
      return false;
    }

    const url = `user/${props.selectedProvider.id}/${
      props.selectedProvider.is_active ? "deactivate" : "reactivate"
    }`;
    fetch(url, {
      method: "PATCH",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          handleCloseActivateDeactivateModal();
          flashContext.setMessage({
            text: result.message,
            type: "success",
          });
          props.onDataUpdated();
        }
      })
      .catch((error) => {
        handleCloseActivateDeactivateModal();
        console.log(error);
      });
  };

  const handleCloseActivateDeactivateModal = () => {
    setOpenActivateDeactivateProviderModal(false);
  };

  return (
    <Grid
      item
      xs={6}
      className="patient-edit-container patient-edit-form"
      style={{
        marginTop: "85px",
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
          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Grid item>
              <p className="secondary-label">Edit Provider Information</p>
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
              <Link
                className="save-btn"
                // style={{ padding: "0px 10% 0px 10%" }}
                onClick={UpdateProvider}
              >
                Save
              </Link>
              {/* <Button onClick={UpdateProvider} sx={{ padding: 0 }}>Save</Button> */}
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
                  onKeyPress={(event) => {
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
                  onKeyPress={() => {
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
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className="form-container">
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              color: props.selectedProvider.is_active ? "red" : "green",
              marginTop: 30,
            }}
          >
            {props.selectedProvider && (
              <Button
                variant="outlined"
                onClick={() => setOpenActivateDeactivateProviderModal(true)}
                style={{
                  textTransform: "capitalize",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                }}
                color="inherit"
              >
                {`${
                  props.selectedProvider.is_active ? "Deactivate" : "Reactivate"
                } User`}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Modal
        successModalOpen={openActivateDeactivateProviderModal}
        setSuccessModalOpen={handleCloseActivateDeactivateModal}
        successHeader={
          props.selectedProvider.is_active
            ? "Deactivate User"
            : "Reactivate User"
        }
        successContent={modalContent}
        successCallback={handleProviderActivateDeactivate}
        closeCallback={handleCloseActivateDeactivateModal}
        confirmButtonText={
          props.selectedProvider.is_active ? "Deactivate" : "Reactivate"
        }
      />
    </Grid>
  );
};

export default ProviderEdit;
