import * as React from "react";
import { Button, Grid, Modal as MuiModal, TextField } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext, ImagesContext } from "../Context";
import InputMask from "react-input-mask";

interface Props {
  facility: any;
  openModel: boolean;
  setOpenModal: Function;
  onClose: Function;
  onConfirmSuccess: Function;
  isLoading: boolean;
  setIsLoading: Function;
}

const FacilityModal: React.FC<Props> = (props) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const images = React.useContext(ImagesContext);
  const [name, setName] = React.useState<string>("");
  const [address1, setAddress1] = React.useState<string>("");
  const [address2, setAddress2] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [zip, setZip] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

  React.useEffect(() => {
    if (props.facility) {
      setName(props.facility.name);
      setAddress1(props.facility.address_1);
      setAddress2(props.facility.address_2);
      setCity(props.facility.city);
      setState(props.facility.state);
      setZip(props.facility.zip);
      setPhoneNumber(props.facility.phone_number);
    } else {
      resetStates();
    }
  }, [props.facility]);

  const resetStates = () => {
    setName("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setZip("");
    setPhoneNumber("");
  };

  const handleCreate = () => {
    if (validForm()) {
      props.setIsLoading(true);
      fetch(`/ltc_facilities/`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          name: name,
          address_1: address1,
          address_2: address2,
          city: city,
          state: state,
          zip: zip,
          phone_number: phoneNumber,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            flashContext.setMessage({ text: result.error, type: "eror" });
          } else {
            props.setOpenModal(false);
            flashContext.setMessage({
              text: "You have successfully created the facility.",
              type: "success",
            });
            resetStates();
            props.onConfirmSuccess();
          }
          props.setIsLoading(false);
        })
        .catch((error) => {
          props.setIsLoading(false);
          flashContext.setMessage({
            text: error,
            type: "error",
          });
        });
    }
  };

  const handleEdit = () => {
    if (validForm()) {
      props.setIsLoading(true);
      fetch(`/ltc_facilities/${props.facility?.id}`, {
        method: "PUT",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          id: props.facility?.id,
          name: name,
          address_1: address1,
          address_2: address2,
          city: city,
          state: state,
          zip: zip,
          phone_number: phoneNumber,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            flashContext.setMessage({ text: result.error, type: "eror" });
          } else {
            props.setOpenModal(false);
            flashContext.setMessage({
              text: "You have successfully updated the facility.",
              type: "success",
            });
            resetStates();
            props.onConfirmSuccess();
          }
          props.setIsLoading(false);
        })
        .catch((error) => {
          props.setIsLoading(false);
          flashContext.setMessage({
            text: error,
            type: "error",
          });
        });
    }
  };

  const validForm = () => {
    let errorFields = [];

    if (name?.length < 1) {
      errorFields.push("Insured's First Name");
    }
    if (address1?.length < 1) {
      errorFields.push("Address 1");
    }
    if (address2?.length < 1) {
      errorFields.push("Addres 2");
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
    if (phoneNumber?.length < 1) {
      errorFields.push("Phone Number");
    }

    if (errorFields.length > 0) {
      let message = `${errorFields.join(", ")} required`;
      flashContext.setMessage({ text: message, type: "error" });
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <MuiModal
        open={props.openModel}
        className="modal-primary"
        onClose={() => props.onClose()}
      >
        <div className="paper" style={{ width: 430 }}>
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <div className="main-header">
                  {props.facility ? "Edit Facility" : "Create New Facility"}
                  <span
                    id="dismiss-button"
                    onClick={() => {
                      props.onClose();
                    }}
                  >
                    <ClearIcon />
                  </span>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  className="content"
                  style={{ padding: "24px 24px 15px 24px" }}
                >
                  <p
                    className="facility-text"
                    style={{ marginBottom: 4, marginTop: 0 }}
                  >
                    Facility Details
                  </p>
                  <Grid container className="form-container">
                    <Grid item xs={12} className="field-container">
                      <TextField
                        label="Name"
                        placeholder="Enter Name"
                        id="name"
                        value={name}
                        className="facility-field facility-text"
                        variant="outlined"
                        onChange={(event) => {
                          setName(event.target.value);
                        }}
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            transform: "translate(16px, 8px) scale(1)",
                            transformOrigin: "top left",
                            color: "#4A4442",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                        InputProps={{
                          sx: {
                            paddingTop: 2,
                            paddingLeft: 0.6,
                          },
                        }}
                        sx={{ height: 56, marginY: 0.5 }}
                      />
                    </Grid>
                    <Grid item xs={12} className="field-container">
                      <TextField
                        label="Address 1"
                        placeholder="Enter Address"
                        id="address"
                        value={address1}
                        className="facility-field facility-text"
                        variant="outlined"
                        onChange={(event) => {
                          setAddress1(event.target.value);
                        }}
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            transform: "translate(16px, 8px) scale(1)",
                            transformOrigin: "top left",
                            color: "#4A4442",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                        InputProps={{
                          sx: {
                            paddingTop: 2,
                            paddingLeft: 0.6,
                          },
                        }}
                        sx={{ height: 56, marginY: 0.5 }}
                      />
                    </Grid>
                    <Grid item xs={12} className="field-container">
                      <TextField
                        label="Address 2"
                        placeholder="Enter Address"
                        id="address"
                        value={address2}
                        className="facility-field facility-text"
                        variant="outlined"
                        onChange={(event) => {
                          setAddress2(event.target.value);
                        }}
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            transform: "translate(16px, 8px) scale(1)",
                            transformOrigin: "top left",
                            color: "#4A4442",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                        InputProps={{
                          sx: {
                            paddingTop: 2,
                            paddingLeft: 0.6,
                          },
                        }}
                        sx={{ height: 56, marginY: 0.5 }}
                      />
                    </Grid>
                    <Grid item xs={12} className="field-container">
                      <TextField
                        label="City"
                        placeholder="Enter City"
                        id="city"
                        value={city}
                        className="facility-field facility-text"
                        variant="outlined"
                        onChange={(event) => {
                          setCity(event.target.value);
                        }}
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            transform: "translate(16px, 8px) scale(1)",
                            transformOrigin: "top left",
                            color: "#4A4442",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                        InputProps={{
                          sx: {
                            paddingTop: 2,
                            paddingLeft: 0.6,
                          },
                        }}
                        sx={{ height: 56, marginY: 0.5 }}
                      />
                    </Grid>

                    <Grid
                      container
                      justifyContent="space-between"
                      sx={{ marginY: 0.5 }}
                    >
                      <Grid item xs={5.9}>
                        <Grid item xs={12} className="field-container">
                          <TextField
                            label="State"
                            placeholder="Enter State"
                            id="state"
                            value={state}
                            className="facility-field facility-text"
                            variant="outlined"
                            onChange={(event) => {
                              setState(event.target.value);
                            }}
                            InputLabelProps={{
                              shrink: true,
                              sx: {
                                transform: "translate(16px, 8px) scale(1)",
                                transformOrigin: "top left",
                                color: "#4A4442",
                                fontSize: 12,
                                fontWeight: 500,
                              },
                            }}
                            InputProps={{
                              sx: {
                                paddingTop: 2,
                                paddingLeft: 0.6,
                              },
                            }}
                            sx={{ height: 56 }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={5.9}>
                        <Grid item xs={12} className="field-container">
                          <TextField
                            label="Zipcode"
                            placeholder="Enter Zip"
                            id="zip"
                            value={zip}
                            className="facility-field facility-text"
                            variant="outlined"
                            onChange={(event) => {
                              setZip(event.target.value);
                            }}
                            InputLabelProps={{
                              shrink: true,
                              sx: {
                                transform: "translate(16px, 8px) scale(1)",
                                transformOrigin: "top left",
                                color: "#4A4442",
                                fontSize: 12,
                                fontWeight: 500,
                              },
                            }}
                            InputProps={{
                              sx: {
                                paddingTop: 2,
                                paddingLeft: 0.6,
                              },
                            }}
                            sx={{ height: 56 }}
                          />
                        </Grid>
                      </Grid>
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
                            label="Phone Number"
                            placeholder="Enter Phone Number"
                            id="phone_number"
                            value={phoneNumber}
                            className="facility-field facility-text"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                              sx: {
                                transform: "translate(16px, 8px) scale(1)",
                                transformOrigin: "top left",
                                color: "#4A4442",
                                fontSize: 12,
                                fontWeight: 500,
                              },
                            }}
                            InputProps={{
                              sx: {
                                paddingTop: 2,
                                paddingLeft: 0.6,
                              },
                            }}
                            sx={{ height: 56, marginY: 0.5 }}
                          />
                        )}
                      </InputMask>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className="modal-footer"
            >
              <Grid item xs={12} className="confirm-btn-container">
                <div
                  onClick={() => {
                    props.onClose();
                  }}
                  className="cancel-link"
                >
                  Cancel
                </div>
                {!props.isLoading ? (
                  <Button
                    onClick={props.facility ? handleEdit : handleCreate}
                    className="confirm-btn"
                    style={{ width: 156 }}
                  >
                    {props.facility ? "Save Facility" : "Create Facility"}
                  </Button>
                ) : (
                  <div className="cancel-link" style={{ padding: 0 }}>
                    <img src={images.spinner_src} style={{ width: 24 }}></img>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </MuiModal>
    </>
  );
};

export default FacilityModal;