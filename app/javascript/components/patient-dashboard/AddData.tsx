/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, TextField, Link, Snackbar, InputAdornment, IconButton, InputLabel, Button } from "@mui/material";
import { Alert } from '@mui/material';
import { usePatientDashboardStyles } from "../styles/usePatientDashboardStyles";
import BackspaceIcon from "@mui/icons-material/Backspace";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// helpers
import { formatToUsDate } from "../utils/DateHelper";
import { getHeaders } from "../utils/HeaderHelper";
import { Box, Stack } from "@mui/system";

interface Props {
  patient_id: number;
  button_src: any;
  csrfToken: any;
  setAddData: any;
  addData: any;
  editData: any;
  setEditData: any;
  setShowNotes: any;
  source: string;
  type: string;
}

const AddData: React.FC<Props> = (props: any) => {
  const { classes } = usePatientDashboardStyles();
  const [error, setError] = React.useState<string>("");
  const [type, setType] = React.useState<string>(
    props.editData ? props.editData.type : props.addData ? props.addData : ""
  );
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [open, setOpen] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<string>(
    props.editData
      ? parseInt(
          props.editData.type == "blood_pressure"
            ? props.editData.systolic_value
            : props.editData.reading_value
        ).toString()
      : ""
  );
  const [value2, setValue2] = React.useState<string>(
    props.editData
      ? parseInt(
          props.editData.type == "blood_pressure"
            ? props.editData.diastolic_value
            : ""
        ).toString()
      : ""
  );
  const [notes, setNotes] = React.useState<string>(
    props.editData ? props.editData.notes : ""
  );
  const [createReading, setCreateReading] = React.useState<boolean>(
    props.editData && props.editData.source && props.editData.source != "manual"
      ? true
      : false
  );
  const [selectedDate, setSelectedDate] = React.useState<any>(
    props.editData ? new Date(props.editData.date_recorded) : new Date()
  );
  const [selectedNumber, setSelectedNumber] = React.useState<any>(null);
  const [patient, setPatient] = React.useState<any>(null);

  React.useEffect(() => {
    if (props.patient_id) {
      fetch(`/data_fetching/add_data/${props.patient_id}`, {
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
      props.setAddData(null);
      setValue("");
      setCreateReading(false);
      props.setEditData(null);
      props.setShowNotes(null);
    }
  };

  React.useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let typeParameter = urlParams.get("type");
    if (
      typeParameter &&
      !props.editData &&
      !props.addData &&
      type.length <= 0
    ) {
      setType(typeParameter);
    }
    if (
      typeParameter == "blood_pressure" &&
      props.editData &&
      props.editData.systolic_value
    ) {
      setValue(props.editData.systolic_value);
    }
  }, [props.patient_id]);

  const handleDateChange = (date) => {
    const now = new Date();
    const overLimit =
      date.getDay() == now.getDay() &&
      date.getMonth() == now.getMonth() &&
      date.getFullYear() == now.getFullYear() &&
      date.getTime() > now.getTime();
      console.log("overLimit", overLimit);
    if (overLimit) {
      setSelectedDate(now);
    } else {
      setSelectedDate(date);
    }
    if(date > now) {
      
      setSelectedDate(now);
    }
  };

  const increaseNumber = (number: string) => {
    if (type == "blood_pressure" && selectedNumber) {
      if (selectedNumber == "diastolic" && value2.length < 3) {
        setValue2(`${value2}${number}`);
      } else if (selectedNumber == "systolic" && value.length < 3) {
        setValue(`${value}${number}`);
      }
    } else if (type != "blood_pressure") {
      setValue(`${value}${number}`);
    }
  };

  const deleteNumber = () => {
    if (type == "blood_pressure") {
      if (selectedNumber == "diastolic") {
        setValue2(`${value2.slice(0, -1)}`);
      } else if (selectedNumber == "systolic") {
        setValue(`${value.slice(0, -1)}`);
      }
    } else {
      setValue(`${value.slice(0, -1)}`);
    }
  };

  const nextStep = () => {
    setError("");

    if (
      type == "blood_glucose" &&
      (!value || parseInt(value) < 1 || parseInt(value) > 1000)
    ) {
      setError("Invalid blood glucose range, valid range: 1-1000");
    } else if (type == "weight" && (!value || parseInt(value) < 1)) {
      setError("Invalid weight range, valid range: > 0");
    } else if (
      type == "blood_pressure" &&
      (!value ||
        parseInt(value) < 50 ||
        parseInt(value) > 270 ||
        !value2 ||
        parseInt(value2) < 30 ||
        parseInt(value2) > 200)
    ) {
      setError(
        "Invalid blood pressure range, valid range: systolic: 50-270, diastolic: 30-200"
      );
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

  const getDataUrl = () => {
    let url = props.editData ? `/update_blood_glucose` : `/add_blood_glucose`;
    if (type == "weight") {
      props.editData
        ? (url = `/weight_reading/${props.editData.id}`)
        : (url = `/weight_reading`);
    }
    if (type == "blood_pressure") {
      props.editData
        ? (url = `/blood_pressure_reading/${props.editData.id}`)
        : (url = `/blood_pressure_reading`);
    }
    return url;
  };

  const getDataMethod = () => {
    let method = "POST";
    if (type == "weight") {
      props.editData ? (method = "PATCH") : (method = "POST");
    }
    if (type == "blood_pressure") {
      props.editData ? (method = "PATCH") : (method = "POST");
    }
    return method;
  };

  const getDataPackage = () => {
    let reading = {};

    if (type == "blood_glucose") {
      props.editData
        ? (reading = {
            reading_value: value,
            reading_type: "blood_glucose",
            date_recorded: selectedDate,
            notes: notes,
            id: props.editData.id,
          })
        : (reading = {
            reading_value: value,
            reading_type: "blood_glucose",
            date_recorded: selectedDate,
            source: "manual",
            patient_device_id: patient?.patient_device_id
              ? patient?.patient_device_id
              : 0,
            notes: notes,
          });
    }

    if (type == "weight") {
      reading = {
        reading_value: value,
        date_recorded: selectedDate,
        notes: notes,
      };
    }
    if (type == "blood_pressure") {
      reading = {
        systolic_value: value,
        diastolic_value: value2,
        date_recorded: selectedDate,
        notes: notes,
      };
    }

    return reading;
  };

  const addData = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(getDataUrl(), {
        method: getDataMethod(),
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          reading: getDataPackage(),
          patient_id: patient.id,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            const additionalParams = ["weight", "blood_pressure"].includes(type) ? `?type=${type}` : ""

            if(props.source === "provider") {
              window.location.href = `/patient_reports/${props.patient_id}/${type}`
            } else if  (props.source == "patient") {
              window.location.href = `/my-data${additionalParams}`
            }
            else {
              (window.location.href = `/data-rpm/${props.patient_id}`);
            }
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

  const getModalTitle = (type) => {
    let title = "Blood Glucose";
    if (type == "weight") title = "Weight";
    if (type == "blood_pressure") title = "Blood Pressure";
    return title;
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
            <p className={classes.inviteHeader}>
              {getModalTitle(type)}{" "}
              {type == "blood_pressure" && (
                <>
                  <br />
                  <small>
                    {selectedNumber == "systolic" && "Selected: Systolic"}
                    {selectedNumber == "diastolic" && "Selected: Diastolic"}
                    {!selectedNumber && "Select each to enter in the number"}
                  </small>
                </>
              )}
            </p>

            <p
              style={{
                font: "50px QuicksandMedium",
                textAlign: "center",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <span
                onClick={() => {
                  if (type == "blood_pressure") setSelectedNumber("systolic");
                }}
                style={
                  type == "blood_pressure"
                    ? {
                        float: "left",
                        display: "inline-block",
                        width: "45%",
                        marginBottom: 10,
                        cursor: "pointer",
                      }
                    : { display: "inline" }
                }
              >
                {value.length
                  ? value
                  : type == "blood_pressure" &&
                    !selectedNumber &&
                    selectedNumber != "systolic"
                  ? "##"
                  : "0"}
                {type == "blood_pressure" && (
                  <small style={{ fontSize: 14, display: "block" }}>
                    Systolic
                  </small>
                )}
              </span>
              <span
                style={
                  type == "blood_pressure"
                    ? {
                        float: "left",
                        display: "inline-block",
                        width: "10%",
                        marginBottom: 10,
                      }
                    : { display: "inline" }
                }
              >
                {type == "blood_pressure" && <>/</>}
              </span>
              <span
                onClick={() => {
                  if (type == "blood_pressure") {
                    setSelectedNumber("diastolic");
                  }
                }}
                style={
                  type == "blood_pressure"
                    ? {
                        float: "left",
                        display: "inline-block",
                        width: "45%",
                        marginBottom: 20,
                        cursor: "pointer",
                      }
                    : { display: "inline" }
                }
              >
                {type == "blood_pressure" && (
                  <>
                    {value2.length
                      ? value2
                      : selectedNumber && selectedNumber == "diastolic"
                      ? "0"
                      : "##"}
                  </>
                )}
                {type == "blood_pressure" && (
                  <small style={{ fontSize: 14, display: "block" }}>
                    Diastolic
                  </small>
                )}
              </span>
            </p>

            {createReading && (
              <>
                {(props.editData && props.editData.source == "manual") ||
                !props.editData ? (
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
                      InputAdornmentProps={{
                        position: 'end',
                        children: (
                          <InputAdornment position="end">
                            <IconButton>
                              <AccessTimeIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
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

                <Grid item xs={12}>
                  <InputLabel htmlFor="note" className="fum-field-label">
                    Note(s)
                  </InputLabel>
                </Grid>
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
              justifyContent="center"
              alignItems="center"
              style={{ marginTop: "25px" }}
            >
              <Grid
                item
                xs={6}
                className="cancel-link-container"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Link
                  className="cancel-link"
                  onClick={closeModal}
                >
                  Cancel
                </Link>
              </Grid>
              <Grid item xs={6} className="confirm-btn-container">
              {!disabledButton ? (<Link
                  onClick={createReading == false ? nextStep : addData}
                  className="confirm-btn"
                  style={{ width: "100px" }}
                >
                  Next
                </Link>) : (
                  <Box height={"100%"}>Saving...</Box>
                )}
              </Grid>
            </Grid>

            
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddData;
