/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, TextField, Link, Snackbar } from "@mui/material";
import { Alert } from '@mui/material';

// importing app setting
import { AuthenticationContext } from "../../../Context";
import { getHeaders } from "../../../utils/HeaderHelper";
import GeneralModal from "../../../modals/GeneralModal";

interface Props {
  patient_id: number;
  edit_medication: any;
  open: boolean;
  setOpen: any;
}

const AddMedication: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [name, setName] = React.useState<string>(
    props.edit_medication != null ? props.edit_medication.name : ""
  );
  const [value, setValue] = React.useState<string>(
    props.edit_medication != null ? props.edit_medication.value : ""
  );
  const [medicationSearch, setMedicationSearch] = React.useState<any>(null);

  React.useEffect(() => {
    if (name) {
      fetch(`/medication_search`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          medication: {
            name: name,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
            setMedicationSearch(null);
          } else {
            let medicationSearchObject = result.data.results;
            console.log("medicationSearchObject", medicationSearchObject);
            setMedicationSearch(medicationSearchObject);
          }
        })
        .catch((error) => {
          setError(error);
          setDisabledButton(false);
          setMedicationSearch(null);
        });
    }
  }, [name]);

  const closeModal = () => {
    props.setOpen(false);
  };

  const validForm = () => {
    let valid = false;
    if (name && value) {
      valid = true;
    }

    return valid;
  };

  const updatePatient = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(
        props.edit_medication != null
          ? `/update_medication`
          : `/add_medication`,
        {
          method: "POST",
          headers: getHeaders(authenticationSetting.csrfToken),
          body: JSON.stringify({
            medication: {
              user_id: props.patient_id,
              name: name,
              value: value,
              id:
                props.edit_medication != null ? props.edit_medication.id : null,
            },
          }),
        }
      )
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            props.setOpen(false);
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

  return (
    <GeneralModal
      open={props.open}
      title={(props.edit_medication != null ? "Edit" : "Add") + " Medication"}
      successCallback={updatePatient}
      closeCallback={closeModal}
      containerClassName="add-medication-modal"
      confirmButtonText="Save"
    >
      {error.length > 0 && (
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            setError("");
          }}
        >
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        </Snackbar>
      )}

      <Grid style={{ paddingTop: 20 }}>
        <TextField
          id="medication_name"
          label="Medication Name*"
          value={name}
          className="textInput"
          required
          variant="filled"
          onChange={(event) => {
            setName(event.target.value);
          }}
          InputLabelProps={{
            required: false,
          }}
        />

        {medicationSearch && medicationSearch.length > 0 ? (
          <>
            <strong style={{ fontFamily: "QuicksandMedium" }}>
              Available Medications:{" "}
              <small>(Click medication below to set above)</small>
            </strong>
            <div
              style={{
                border: "1px solid #929292",
                borderRadius: 6,
                maxHeight: 200,
                overflow: "auto",
                padding: 10,
              }}
            >
              {medicationSearch.map((medication, index) => (
                <div
                  key={index}
                  className={index % 2 == 0 ? "rowEven" : "row"}
                  style={{
                    cursor: "pointer",
                    padding: 3,
                    fontFamily: "QuicksandMedium",
                  }}
                  onClick={() => {
                    setName(medication);
                    setMedicationSearch(null);
                  }}
                >
                  {medication}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <strong style={{ fontFamily: "QuicksandMedium" }}>
              <small>
                Begin typing a name to search for existing medications.
              </small>
            </strong>
          </>
        )}

        <TextField
          id="medication_dosage"
          label="Medication Dosage*"
          value={value}
          className="textInput"
          required
          variant="filled"
          onChange={(event) => {
            setValue(event.target.value);
          }}
          InputLabelProps={{
            required: false,
          }}
        />
      </Grid>
    </GeneralModal>
  );
};

export default AddMedication;
