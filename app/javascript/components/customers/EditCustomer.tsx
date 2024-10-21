import * as React from "react";
import { Grid, TextField, MenuItem, Button } from "@mui/material";
import InputMask from "react-input-mask";
import FlashMessage from "../shared/FlashMessage";

// helper import
import globals from "../globals/globals";

// app setting imports
import { AuthenticationContext, FlashContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import Modal from "../modals/Modal";

interface Props {
  csrfToken: string;
  customerId: number;
  setEditInfo: any;
  setCustomerInfo: any;
  setError: any;
  setRenderingKey: any;
}

const EditCustomer: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

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
  const [deleteable, setDeleteable] = React.useState<boolean>(false);
  const [placeOfServiceCode, setPlaceOfServiceCode] =
    React.useState<string>("");
  const [openDeactivateProviderModal, setOpenDeactivateProviderModal] =
    React.useState(false);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const modalContent = (
    <div className="modal-content">
      <p className="align-center">
        You are attempting to deactivate this user. Would you like to continue?
      </p>
    </div>
  );

  const getCustomerObj = () => {
    if (props.customerId) {
      fetch(`/data_fetching/customers/${props.customerId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting?.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setName(result.customer?.name);
            setAddress(result.customer?.address);
            setCity(result.customer?.city);
            setState(result.customer?.state);
            setZip(result.customer?.zip);
            setCounty(result.customer?.county);
            setPhoneNumber(result.customer?.phone_number);
            setNotes(result.customer?.notes);
            setFacilityNpi(result.customer?.facility_npi);
            setFederalTaxId(result.customer?.federal_tax_id);
            setDeleteable(result.customer?.deleteable);
            setPlaceOfServiceCode(result.customer?.place_of_service_code);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    getCustomerObj();
  }, [props.customerId]);

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

  const updateCustomer = () => {
    if (validForm()) {
      fetch(`/data_fetching/customers/${props.customerId}`, {
        method: "PUT",
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
          if (typeof result.error !== "undefined") {
            setFlashMessage({ message: result?.error, type: "error" });
          } else {
            setFlashMessage({ message: "Customer Updated", type: "success" });
          }
        })
        .catch((error) => {
          props.setError(error);
        });
    }
  };

  const stateOptions = globals.states.map((state) => {
    return (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    );
  });

  const handleCustomerArchive = () => {
    console.log("archiving customer");
    fetch(`/data_fetching/customers/${props.customerId}`, {
      method: "DELETE",
      headers: getHeaders(authenticationSetting?.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          handleCloseDeactivateModal();
          flashContext.setMessage({
            text: result.message,
            type: "success",
          });
          props.setEditInfo(false);
          props.setRenderingKey(Math.random());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseDeactivateModal = () => {
    setOpenDeactivateProviderModal(false);
  };

  return (
    <div className="show-edit-customer">
      <div className="userAdminInformation">
        <FlashMessage flashMessage={flashMessage} />
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          className="adminHeader"
        >
          <Grid container direction="row" alignItems="center">
            <h3>Edit Customer Information</h3>
            <div
              className="cancelButton"
              style={{ marginLeft: "auto", marginRight: "50px" }}
              onClick={() => {
                props.setEditInfo(false);
                props.setCustomerInfo(true);
              }}
            >
              Cancel
            </div>
            <div className="addLink" style={{ justifyContent: "flex-end" }}>
              <div className="saveButton" onClick={() => updateCustomer()}>
                Save
              </div>
            </div>
          </Grid>
        </Grid>
        <div className="tableContainer">
          <Grid container direction="row" alignItems="flex-start">
            <Grid item xs={12} lg={6}>
              <div className="customerInfo">
                <div className="customerInfoLabel">Name*</div>
                <TextField
                  type="text"
                  className="the-field"
                  size="small"
                  variant="outlined"
                  value={name}
                  required
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">Address*</div>
                <TextField
                  type="text"
                  className="the-field"
                  size="small"
                  required
                  variant="outlined"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                  }}
                />
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">City*</div>
                <TextField
                  type="text"
                  className="the-field"
                  size="small"
                  variant="outlined"
                  value={city}
                  required
                  onChange={(event) => {
                    setCity(event.target.value);
                  }}
                />
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">State*</div>
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
              </div>

              <div className="customerInfo">
                <div className="customerInfoLabel">Zip*</div>
                <TextField
                  type="text"
                  className="the-field"
                  size="small"
                  variant="outlined"
                  value={zip}
                  required
                  onChange={(event) => {
                    setZip(event.target.value);
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <div className="customerInfo">
                <div className="customerInfoLabel">County</div>
                <TextField
                  type="text"
                  className="the-field"
                  size="small"
                  variant="outlined"
                  value={county}
                  onChange={(event) => {
                    setCounty(event.target.value);
                  }}
                />
              </div>

              <div className="customerInfo">
                <div className="customerInfoLabel">Phone Number*</div>
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
                      size="small"
                    />
                  )}
                </InputMask>
              </div>

              <div className="customerInfo">
                <div className="customerInfoLabel">Federal Tax ID #</div>
                <TextField
                  type="text"
                  className="the-field"
                  size="small"
                  variant="outlined"
                  value={federalTaxId}
                  onChange={(event) => {
                    setFederalTaxId(event.target.value);
                  }}
                />
              </div>

              <div className="customerInfo">
                <div className="customerInfoLabel">Facility NPI</div>
                <TextField
                  type="text"
                  className="the-field"
                  size="small"
                  variant="outlined"
                  value={facilityNpi}
                  onChange={(event) => {
                    setFacilityNpi(event.target.value);
                  }}
                />
              </div>

              <div className="customerInfo">
                <div className="customerInfoLabel">Place of Service Code</div>
                <TextField
                  type="text"
                  className="the-field"
                  size="small"
                  variant="outlined"
                  value={placeOfServiceCode}
                  onChange={(event) => {
                    setPlaceOfServiceCode(event.target.value);
                  }}
                />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" alignItems="flex-start">
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
          {deleteable && (
            <Grid container className="form-container">
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "red",
                  marginTop: 30,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setOpenDeactivateProviderModal(true)}
                  style={{
                    textTransform: "capitalize",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                  }}
                  color="inherit"
                >
                  Deactivate User
                </Button>
              </Grid>
            </Grid>
          )}
        </div>
      </div>
      <Modal
        successModalOpen={openDeactivateProviderModal}
        setSuccessModalOpen={handleCloseDeactivateModal}
        successHeader={"Deactivate User"}
        successContent={modalContent}
        successCallback={handleCustomerArchive}
        closeCallback={handleCloseDeactivateModal}
        confirmButtonText="Deactivate"
      />
    </div>
  );
};

export default EditCustomer;
