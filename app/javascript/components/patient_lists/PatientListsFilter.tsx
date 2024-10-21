/* eslint-disable prettier/prettier */

// library imports
import { CalendarToday } from "@mui/icons-material";
import { Grid, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import * as React from "react";

// component imports
import { getYodaDateToday } from "../utils/DateHelper";
import PatientListsAccrodion from "./PatientListsAccrodion";

const PatientListsFilter: React.FC<any> = () => {
  const [programExpanded, setProgramExpanded] = React.useState<boolean>(false);
  const [diagCodesExpanded, setDiagCodesExpanded] = React.useState<boolean>(false);
  const [insuranceTypesExpanded, setInsuranceTypesExpanded] = React.useState<boolean>(false);
  const [ltcExpanded, setLtcExpanded] = React.useState<boolean>(false);
  const [cgmExpanded, setCgmExpanded] = React.useState<boolean>(false);

  const [dob, setDob] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [firstName, setFirstName] = React.useState<string>("");

  const calendarRef = React.useRef(null);
  const firstNameRef = React.useRef("");
  const lastNameRef = React.useRef("");

  const handleCalendarClick = () => {
    if (calendarRef.current) {
      calendarRef.current.showPicker();
    }
  };

  return (
    <Grid item xs={12}>
      <Grid
        container
        justifyContent="space-between"
        className="customer-relation-container"
      >
        <Grid item xs={5} className="association-header">
          <h3>Search Tools</h3>
        </Grid>
      </Grid>
      <div className="divider"></div>
      <Grid container>
        <Grid item xs={12} className="patient-list-search-container">
          <div className="patient-list-search-content">
            <div className="filter-header">
              <h3>Patient Filters</h3>
              <button>
                <svg width="13" height="13" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect y="7.99902" width="8" height="8" rx="1" transform="rotate(-90 0 7.99902)" fill="#FF890A" />
                  <path d="M2.13699 1.66585L1.66699 2.13585L3.53033 3.99919L1.66699 5.86252L2.13699 6.33252L4.00033 4.46919L5.86366 6.33252L6.33366 5.86252L4.47033 3.99919L6.33366 2.13585L5.86366 1.66585L4.00033 3.52919L2.13699 1.66585Z" fill="white" />
                </svg>
                <span>Clear All</span>
              </button>
            </div>
            <div className="filter-inputs">
              <TextField
                id="first_name"
                className="textInput plainLabel"
                placeholder="First Name"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  firstNameRef.current = event.target.value;
                }}
                variant="outlined"
                InputProps={{
                  disableUnderline: true,
                  style: {
                    borderRadius: "4px",
                    height: 42.25,
                    backgroundColor: "#EFE9E7",
                  },
                }}
                sx={{
                  "& .MuiInputBase-input::placeholder": {
                    color: "#868382",
                    fontSize: 12,
                    fontWeight: 500,
                    opacity: 1,
                  },
                  "& .MuiInputBase-input": {
                    color: "#1E1E1E",
                    fontSize: 12,
                    fontWeight: 500,
                  },
                }}
              />
              <TextField
                id="last_name"
                className="textInput plainLabel"
                placeholder="Last Name"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                  lastNameRef.current = event.target.value;
                }}
                variant="outlined"
                InputProps={{
                  disableUnderline: true,
                  style: {
                    borderRadius: "4px",
                    height: 42.25,
                    backgroundColor: "#EFE9E7",
                  },
                }}
                sx={{
                  "& .MuiInputBase-input::placeholder": {
                    color: "#868382",
                    fontSize: 12,
                    fontWeight: 500,
                    opacity: 1,
                  },
                  "& .MuiInputBase-input": {
                    color: "#1E1E1E",
                    fontSize: 12,
                    fontWeight: 500,
                  },
                }}
              />
              <TextField
                id="dob"
                type="date"
                value={dob}
                className="textInput plainLabel"
                variant="filled"
                size="small"
                label="Date of Birth"
                inputRef={calendarRef}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: "#868382",
                    fontSize: 12,
                    fontWeight: 500,
                  },
                }}
                inputProps={{
                  max: `${getYodaDateToday()}`,
                }}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    borderRadius: "4px",
                    backgroundColor: "#EFE9E7",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarToday
                        onClick={handleCalendarClick}
                        style={{ cursor: "pointer" }}
                      />
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  setDob(event.target.value);
                }}
                sx={{
                  width: "100% !important",
                  flexShrink: 0,
                  "& .MuiInputBase-input::placeholder": {
                    color: "#868382",
                    fontSize: 12,
                    fontWeight: 500,
                    opacity: 1,
                  },
                  "& .MuiInputBase-input": {
                    color: dob ? "#1E1E1E" : "#868382",
                    fontSize: 12,
                    fontWeight: 500,
                  },
                  "& input[type=date]::-webkit-calendar-picker-indicator":
                  {
                    opacity: 0,
                    display: "none",
                  },
                }}
              />
            </div>
            <div className="filter-content">
              <div className="filter-content-accordion">
                <PatientListsAccrodion
                  title="Programs"
                  count={34}
                  isExpanded={programExpanded}
                  setIsExpanded={setProgramExpanded}
                >
                  Checkbox List here
                </PatientListsAccrodion>
                <PatientListsAccrodion
                  title="Diagnostic Codes"
                  count={5}
                  isExpanded={diagCodesExpanded}
                  setIsExpanded={setDiagCodesExpanded}
                >
                  Example
                </PatientListsAccrodion>
                <PatientListsAccrodion
                  title="Insurance Types"
                  count={25}
                  isExpanded={insuranceTypesExpanded}
                  setIsExpanded={setInsuranceTypesExpanded}
                >
                  Example
                </PatientListsAccrodion>
                <PatientListsAccrodion
                  title="LTC Facilities"
                  count={5}
                  isExpanded={ltcExpanded}
                  setIsExpanded={setLtcExpanded}
                >
                  Example
                </PatientListsAccrodion>
                <PatientListsAccrodion
                  title="CGM"
                  isExpanded={cgmExpanded}
                  setIsExpanded={setCgmExpanded}
                >
                  Example
                </PatientListsAccrodion>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientListsFilter;