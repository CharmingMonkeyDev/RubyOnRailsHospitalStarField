/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, TextField, Link, Snackbar } from "@mui/material";
import { Alert } from '@mui/material';
import { usePatientDashboardStyles } from "../styles/usePatientDashboardStyles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// helpers
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patient_id: any;
  csrfToken: any;
  setAddMedication: any;
  editMedication: any;
  setEditMedication: any;
}

const AddMedication: React.FC<Props> = (props: any) => {
  const { classes } = usePatientDashboardStyles();
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [open, setOpen] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<string>(
    props.editMedication ? props.editMedication.value : ""
  );
  const [name, setName] = React.useState<string>(
    props.editMedication ? props.editMedication.name : ""
  );
  const [selectedDate, setSelectedDate] = React.useState<any>(
    props.editMedication
      ? new Date(props.editMedication.created_at)
      : new Date()
  );
  const [medicationSearch, setMedicationSearch] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/medication_search`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
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
  }, [name]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const closeModal = () => {
    props.setAddMedication(false);
    setValue("");
    setName("");
    props.setEditMedication(null);
  };

  const validForm = () => {
    let valid = false;
    if (name && value) {
      valid = true;
    }

    return valid;
  };

  const addMedication = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(props.editMedication ? `/update_medication` : `/add_medication`, {
        method: "POST",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          medication: props.editMedication
            ? {
                name: name,
                value: value,
                id: props.editMedication.id,
                user_id: props.patient_id,
                created_at: selectedDate,
              }
            : {
                name: name,
                value: value,
                user_id: props.patient_id,
                created_at: selectedDate,
              },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            window.location.href = `/my-medications`;
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
    <>
      {error.length > 0 && (
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            setError("");
          }}
        >
          <Alert severity="error" className={classes.alert}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Modal open={open} onClose={closeModal}>
        <div className={classes.paper}>
          <div className={classes.paperInner}>
            <p className={classes.inviteHeader}>Medication</p>

            <TextField
              id="name"
              label="Medication Name*"
              value={name}
              className={classes.textInput}
              required
              maxRows={20}
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
                      className={index % 2 == 0 ? classes.rowEven : classes.row}
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
              id="dose"
              label="Medication Dose*"
              value={value}
              className={classes.textInput}
              required
              maxRows={20}
              variant="filled"
              onChange={(event) => {
                setValue(event.target.value);
              }}
              InputLabelProps={{
                required: false,
              }}
            />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                autoOk={true}
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                maxDate={new Date()}
                style={{ width: "100%" }}
              />
            </MuiPickersUtilsProvider>

            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={4} className={classes.centerButton}>
                <Link
                  className={classes.clearButtonStyling}
                  onClick={closeModal}
                  style={{
                    font: "14px QuicksandMedium",
                    color: "#313133",
                    textDecoration: "underline",
                    marginTop: 20,
                    display: "inline-block",
                  }}
                >
                  Cancel
                </Link>
              </Grid>
              <Grid
                item
                xs={8}
                className={classes.centerButton}
                style={{ textAlign: "right" }}
              >
                {!disabledButton ? (
                  <Link
                    className={classes.nextButton}
                    onClick={addMedication}
                    style={{ paddingLeft: 70, paddingRight: 70 }}
                  >
                    Save
                  </Link>
                ) : (
                  <>Saving...</>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddMedication;
