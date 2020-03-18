/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, InputLabel, Link, Snackbar, Select, MenuItem, TextField } from "@mui/material";
import { Alert } from '@mui/material';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CloseIcon from "@mui/icons-material/Close";

// importing app setting
import { AuthenticationContext } from "../../../Context";
import { getHeaders } from "../../../utils/HeaderHelper";
import { useState } from "react";
import GeneralModal from "../../../modals/GeneralModal";

interface Props {
  patient_id: number;
  open: boolean;
  labObject: any;
  setOpenAddModal: (boolean) => void;
  onSuccess: () => void;
  onModalClose: () => void;
}

const LAB_TEST_TYPES = [
  'A1C',
  "TC",
  "HDL",
];

const AddLabValues: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const labObject = props.labObject;

  // other states
  const [error, setError] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const [testType, setTestType] = useState("");
  const [testValue, setTestValue] = useState("");
  const [notes, setNotes] = useState("");
  const [openAddLabValueModal, setOpenAddLabValueModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  React.useEffect(() => {
    if (!!labObject) {
      setTestType(labObject.reading_type);
      setTestValue(labObject.reading_value);
      setNotes(labObject.notes);
      setSelectedDate(labObject.date_recorded);
      setOpenAddLabValueModal(true);
    }
  }, [props.labObject]);

  const validForm = () => {
    if (!testType || !testValue || !selectedDate) {
      return false
    }

    return true;
  };

  React.useEffect(() => {
    setTestType('');
  }, []);

  const createLabTestRecord = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(!!labObject ? `/lab_readings/${labObject.id}` : "/lab_readings",
        {
          method: !!labObject ? "PUT" : "POST",
          headers: getHeaders(authenticationSetting.csrfToken),
          body: JSON.stringify({
            lab_reading: {
              user_id: props.patient_id,
              reading_type: testType,
              reading_value: testValue,
              date_recorded: selectedDate,
              notes: notes,
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
            props.onSuccess();
            props.setOpenAddModal(false);
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

  const handleTestTypeChange = (event) => {
    const type = event.target.value;
    setTestType(type);
    if (type) {
      setOpenAddLabValueModal(true);
      props.setOpenAddModal(false);
    }
  }

  const handleDateChange = (date) => {
    const now = new Date();
    const overLimit =
      date.getDay() == now.getDay() &&
      date.getMonth() == now.getMonth() &&
      date.getFullYear() == now.getFullYear() &&
      date.getTime() > now.getTime();
    if (overLimit) {
      setSelectedDate(now);
    } else {
      setSelectedDate(date);
    }
  };

  const resetLabObject = () => {
    setTestType("");
    setTestValue("");
    setNotes("");
    setSelectedDate(new Date());
    props.onModalClose();
  }

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
          <Alert severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      <GeneralModal
        open={props.open}
        title={"Add New Lab Value"}
        successCallback={undefined}
        closeCallback={() => props.setOpenAddModal(false)}
        containerClassName="follow-up-modal"
        confirmButtonText="Select"
        width="430px"
      >
        <Grid container style={{ paddingTop: 20 }}>
          <Grid item xs={12} style={{ marginBottom: 10 }}>
            <InputLabel htmlFor="lab_test_type" className="fum-field-label">
              Add new lab value
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="field-container">
            <Select fullWidth value={testType} onChange={handleTestTypeChange} placeholder="Select">
              <MenuItem value={""}>Select</MenuItem>
              {LAB_TEST_TYPES.map((testType) => (
                <MenuItem key={testType} value={testType.toLowerCase()}>{testType}</MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </GeneralModal>

      <GeneralModal
        open={openAddLabValueModal}
        title={(!!labObject ? "Edit " : "Add ") + testType?.toUpperCase()}
        successCallback={createLabTestRecord}
        closeCallback={() => {
          setOpenAddLabValueModal(false); 
          resetLabObject();
        }}
        containerClassName="follow-up-modal"
        confirmButtonText={ !!labObject ? "Update" : "Add" }
        width="430px"
      >
        <Grid container className="fum-form-container" spacing={1} style={{ paddingTop: 20 }}>
          <Grid item xs={12}>
            <InputLabel htmlFor="value" className="fum-field-label">
              {testType === "tc" ? "Total Protein": testType?.toUpperCase() }
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="value"
              size="small"
              placeholder="Enter Value"
              type="number"
              value={testValue}
              className="basic-input-field"
              required
              variant="outlined"
              onChange={(event) => {
                setTestValue(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} className="field-container">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                autoOk={true}
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date of Collection"
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
                label="Time of Collection"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
                style={{ width: "100%" }}                  
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="note" className="fum-field-label">
              Note(s)
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="notes"
              label="Notes"
              value={notes}
              className={"basic-input-field"}
              multiline
              maxRows={20}
              variant="filled"
              onChange={(event) => {
                setNotes(event.target.value);
              }}
            />
          </Grid>
        </Grid>
      </GeneralModal>
    </>
  );
};

export default AddLabValues;
