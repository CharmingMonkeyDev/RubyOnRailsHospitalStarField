/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, TextField, Link, Snackbar } from "@mui/material";
import { Alert } from '@mui/material';
import { usePatientDashboardStyles } from "../styles/usePatientDashboardStyles";
import BackspaceIcon from "@mui/icons-material/Backspace";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// helpers
import { formatToUsDate } from "../utils/DateHelper";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patient_id: number;
  button_src: any;
  csrfToken: any;
  setAddGluecose: any;
  editGlucose: any;
  setEditGlucose: any;
  setShowNotes: any;
  source: string;
}

const AddGlucose: React.FC<Props> = (props: any) => {
  const { classes } = usePatientDashboardStyles();
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [open, setOpen] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<string>(
    props.editGlucose
      ? parseInt(props.editGlucose.reading_value).toString()
      : ""
  );
  const [notes, setNotes] = React.useState<string>(
    props.editGlucose ? props.editGlucose.notes : ""
  );
  const [createReading, setCreateReading] = React.useState<boolean>(
    props.editGlucose && props.editGlucose.source != "manual" ? true : false
  );
  const [selectedDate, setSelectedDate] = React.useState<any>(
    props.editGlucose ? new Date(props.editGlucose.date_recorded) : new Date()
  );
  const [patient, setPatient] = React.useState<any>(null);

  React.useEffect(() => {
    if (props.patient_id) {
      fetch(`/data_fetching/add_glucose/${props.patient_id}`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setPatient(result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.patient_id]);

  const closeModal = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let track = urlParams.get("track");
    if (track) {
      window.location.href = "/?menu=false";
    } else {
      props.setAddGluecose(false);
      setValue("");
      setCreateReading(false);
      props.setEditGlucose(null);
      props.setShowNotes(null);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const increaseNumber = (number: string) => {
    setValue(`${value}${number}`);
  };

  const deleteNumber = () => {
    setValue(`${value.slice(0, -1)}`);
  };

  const nextStep = () => {
    setError("");
    if (!value || parseInt(value) < 1 || parseInt(value) > 1000) {
      setError("Invalid blood glucose range, valid range: 1-1000");
    } else {
      setCreateReading(true);
    }
  };

  const validForm = () => {
    let valid = false;
    if (selectedDate) {
      valid = true;
    }

    return valid;
  };

  const addGlucose = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(
        props.editGlucose ? `/update_blood_glucose` : `/add_blood_glucose`,
        {
          method: "POST",
          headers: getHeaders(props.csrfToken),
          body: JSON.stringify({
            reading: props.editGlucose
              ? {
                  reading_value: value,
                  reading_type: "blood_glucose",
                  date_recorded: selectedDate,
                  notes: notes,
                  id: props.editGlucose.id,
                }
              : {
                  reading_value: value,
                  reading_type: "blood_glucose",
                  date_recorded: selectedDate,
                  source: "manual",
                  patient_device_id: patient?.patient_device_id
                    ? patient?.patient_device_id
                    : 0,
                  notes: notes,
                },
            patient_id: props.patient_id,
          }),
        }
      )
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            props.source == "patient"
              ? (window.location.href = `/my-data`)
              : (window.location.href = `/data-rpm/${props.patient_id}`);
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

  const timeFormatted = (dateString) => {
    let date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
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
            <p className={classes.inviteHeader}>Blood Glucose</p>

            <p
              style={{
                font: "50px QuicksandMedium",
                textAlign: "center",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              {value.length ? value : "0"}
            </p>

            {createReading && (
              <>
                {(props.editGlucose && props.editGlucose.source == "manual") ||
                !props.editGlucose ? (
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
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="Time"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                      style={{ width: "100%" }}
                    />
                  </MuiPickersUtilsProvider>
                ) : (
                  <>
                    <p
                      style={{
                        font: "22px QuicksandMedium",
                        textAlign: "center",
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                    >
                      {formatToUsDate(selectedDate)}
                    </p>
                    <p
                      style={{
                        font: "22px QuicksandMedium",
                        textAlign: "center",
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                    >
                      {timeFormatted(selectedDate)}
                    </p>
                  </>
                )}

                <TextField
                  id="notes"
                  label="Notes"
                  value={notes}
                  className={classes.textInput}
                  multiline
                  maxRows={20}
                  variant="filled"
                  onChange={(event) => {
                    setNotes(event.target.value);
                  }}
                />
              </>
            )}

            {createReading == false && (
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={4} className={classes.numberStyleCenter}>
                  <Link
                    onClick={() => {
                      increaseNumber("1");
                    }}
                    style={{
                      paddingLeft: 17,
                      paddingRight: 17,
                    }}
                  >
                    1
                  </Link>
                  <br />
                  <Link
                    onClick={() => {
                      increaseNumber("4");
                    }}
                  >
                    4
                  </Link>
                  <br />
                  <Link
                    onClick={() => {
                      increaseNumber("7");
                    }}
                    style={{ marginBottom: 75 }}
                  >
                    7
                  </Link>
                </Grid>
                <Grid item xs={4} className={classes.numberStyleCenter}>
                  <Link
                    onClick={() => {
                      increaseNumber("2");
                    }}
                  >
                    2
                  </Link>
                  <br />
                  <Link
                    onClick={() => {
                      increaseNumber("5");
                    }}
                  >
                    5
                  </Link>
                  <br />
                  <Link
                    onClick={() => {
                      increaseNumber("8");
                    }}
                  >
                    8
                  </Link>
                  <br />
                  <Link
                    onClick={() => {
                      increaseNumber("0");
                    }}
                  >
                    0
                  </Link>
                </Grid>
                <Grid item xs={4} className={classes.numberStyleCenter}>
                  <Link
                    onClick={() => {
                      increaseNumber("3");
                    }}
                  >
                    3
                  </Link>
                  <br />
                  <Link
                    onClick={() => {
                      increaseNumber("6");
                    }}
                  >
                    6
                  </Link>
                  <br />
                  <Link
                    onClick={() => {
                      increaseNumber("9");
                    }}
                  >
                    9
                  </Link>
                  <br />
                  <Link
                    onClick={() => {
                      deleteNumber();
                    }}
                    style={{ border: "none" }}
                  >
                    <BackspaceIcon />
                  </Link>
                </Grid>
              </Grid>
            )}

            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={6} className={classes.centerButton}>
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
              <Grid item xs={6} className={classes.centerButton}>
                {!disabledButton ? (
                  <>
                    {createReading == false ? (
                      <Link
                        className={classes.nextButton}
                        onClick={() => {
                          nextStep();
                        }}
                      >
                        Next
                      </Link>
                    ) : (
                      <Link className={classes.nextButton} onClick={addGlucose}>
                        Save
                      </Link>
                    )}
                  </>
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

export default AddGlucose;
