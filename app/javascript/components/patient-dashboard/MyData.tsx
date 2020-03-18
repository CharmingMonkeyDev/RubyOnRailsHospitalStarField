/* eslint-disable prettier/prettier */
import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';

import { Link as RouterLink } from "react-router-dom";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  Link,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import AddData from "./AddData";
import ShowReadingNote from "./ShowReadingNote";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { Alert } from '@mui/material';
import { useSwipeable } from "react-swipeable";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { formatToUsDate } from "../utils/DateHelper";

// component import
import PatientBreadcrumbs from "../paritals/patient_breadcrumbs";

// helpers
import { getHeaders } from "../utils/HeaderHelper";
import { snakeCaseToTitleCase } from "../utils/CaseFormatHelper";

interface Props {
  user_id: number;
  csrfToken: string;
  menu_track_src: string;
  button_src: string;
  source: string;
}

const useStyles = makeStyles(() => ({
  container: {
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: 500,
    marginTop: 80,
    "@media (max-width: 600px)": {
      width: "100%",
      marginTop: 70,
    },
  },
  patientName: {
    marginLeft: 10,
    font: "22px QuicksandMedium",
    marginBottom: 20,
  },
  indicatorContainer: {
    width: "100%",
    textAlign: "center",
    "@media (max-width: 600px)": {
      position: "absolute",
      bottom: 20,
    },
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: "#efe9e7",
    display: "inline-block",
    marginRight: 6,
    marginLeft: 6,
    marginTop: 25,
  },
  pageTitle: {
    "& span": {
      font: "26px QuicksandMedium",
    },
  },
  backButton: {
    font: "30px QuicksandMedium",
    textDecoration: "none",
    display: "inline-block",
    marginTop: -6,
  },
  pageHeading: {
    borderBottom: "1px solid #948b87",
    marginBottom: 20,
    paddingBottom: 10,
  },
  centerText: {
    textAlign: "center",
  },
  table: {
    width: "100%",
  },
  tableCell: {
    padding: 0,
    paddingTop: 6,
    paddingBottom: 6,
  },
  rowEven: {},
  row: {
    backgroundColor: "#efe9e7",
  },
  trackLink: {
    float: "right",
    marginRight: 15,
    marginBottom: 5,
    cursor: "pointer",
  },
  accordionHeader: {
    border: "1px solid #a2a2a2",
    marginTop: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    boxShadow: "1px 1px 1px 1px #efefef",
    backgroundColor: "#f8890b",
    color: "#ffffff",
  },
  accordionHeaderDark: {
    border: "1px solid #a2a2a2",
    marginTop: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    boxShadow: "1px 1px 1px 1px #efefef",
    backgroundColor: "#a29d9b",
    color: "#ffffff",
  },
  accordianHeaderTag: {
    font: "20px QuicksandMedium",
    fontWeight: "normal",
  },
  accordianContent: {
    backgroundColor: "#ffffff",
    display: "block",
    padding: 0,
  },
}));

const MyData: React.FC<Props> = (props: any) => {
  const classes = useStyles();
  const [addData, setAddData] = React.useState<any>(null);
  const [editData, setEditData] = React.useState<any>(null);
  const [showNotes, setShowNotes] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");
  const [expanded, setExpanded] = React.useState<string>("blood_glucose");
  const [type, setType] = React.useState<string>("blood_glucose");
  const [weightReadings, setWeightReadings] = React.useState<any>([]);
  const [bloodPressureReadings, setBloodPressureReadings] = React.useState<any>(
    []
  );
  const [patientDevice, setPatientDevice] = React.useState<any>(null);

  const getUserObj = () => {
    if (props.user_id) {
      fetch(`/data_fetching/my_data/${props.user_id}`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
          } else {
            setWeightReadings(result.weight_readings);
            setBloodPressureReadings(result.blood_pressure_readings);
            setPatientDevice(result.patient_device);
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  React.useEffect(() => {
    getUserObj();
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/my-medications"),
    onSwipedRight: () => (window.location.href = "/my-care-plan"),
  });

  React.useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let track = urlParams.get("track");
    let typeParameter = urlParams.get("type");
    if (typeParameter) {
      setExpanded(typeParameter);
      if (track) setAddData(typeParameter);
    }
  }, []);

  React.useEffect(() => {
    setType(expanded);
  }, [expanded]);

  const timeFormatted = (dateString) => {
    let date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getRemoveUrl = (typeObject, id) => {
    let url = `/remove_blood_glucose`;
    if (typeObject == "weight") url = `/weight_reading/${id}`;
    if (typeObject == "blood_pressure") url = `/blood_pressure_reading/${id}`;
    return url;
  };

  const getRemoveMethod = (typeObject) => {
    let method = "POST";
    if (typeObject == "weight") method = "DELETE";
    if (typeObject == "blood_pressure") method = "DELETE";
    return method;
  };

  const removeReading = (reading, removalType) => {
    setError("");
    if (
      confirm("Deleting this entry cannot be undone, do you wish to continue?")
    ) {
      fetch(getRemoveUrl(removalType, reading.id), {
        method: getRemoveMethod(removalType),
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          reading: { patient_device_reading_id: reading.id },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
          } else {
            const additional_params = ["weight", "blood_pressure"].includes(removalType) ? `?type=${removalType}` : ""

            if(props.source === "provider") {
              window.location.href = `/patient_reports/${props.user_id}/user_report${additional_params}`
            } else if  (props.source == "patient") {
              window.location.href = `/my-data${additional_params}`
            }
            else {
              (window.location.href = `/data-rpm/${props.user_id}`);
            }
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  const getReadingColor = (value) => {
    let color = "#FF0000";
    if (value >= 70 && value <= 130) color = "#07BC2A";
    if (value >= 131 && value <= 299) color = "#EBB708";

    return color;
  };

  const getBPColor = (sys: number, dia: number) => {
    if (sys >= 140 || dia >= 90) {
      return "#FF0000";
    }
    if (sys >= 121 || dia >= 81) {
      return "#EBB708";
    }
    return "#07BC2A";
  };

  return (
    <div
      {...swipeHandlers}
      style={
        props.source == "patient"
          ? { touchAction: "pan-y", minHeight: "86vh" }
          : {}
      }
    >
      <div  className={props.source !== "provider" ? classes.container: ""}>
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

        {(addData || editData) && (
          <AddData
            patient_id={props.user_id}
            button_src={props.button_src}
            csrfToken={props.csrfToken}
            setAddData={setAddData}
            addData={addData}
            editData={editData}
            setEditData={setEditData}
            setShowNotes={setShowNotes}
            source={props.source}
            type={type}
          />
        )}

        {showNotes && (
          <ShowReadingNote
            editData={editData}
            setEditData={setEditData}
            showNotes={showNotes}
            setShowNotes={setShowNotes} 
            readingType={snakeCaseToTitleCase(type)}          
          />
        )}

        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          className="patient-data-container"
        >
          <Grid item xs={12} className="space-for-breadcrum">
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              className={classes.pageHeading}
            >
              {props.source == "patient" && (
                <Grid item xs={2} className={classes.centerText}>
                  <RouterLink
                    to="/?menu=false"
                    className={classes.backButton}
                    style={{ color: "#4A4442" }}
                  >
                    &lt;
                  </RouterLink>
                </Grid>
              )}
              <Grid
                item
                xs={12}
                className={classes.pageTitle}
                style={{
                  textAlign: "center",
                }}
              >
                <span>{props.source === "provider" ? "User" : "My"} Data</span>
              </Grid>
              {props.source == "patient" && (
                <Grid item xs={2}>
                  &nbsp;
                </Grid>
              )}
            </Grid>

            <Accordion
              expanded={expanded === "blood_glucose"}
              onChange={() => {
                expanded == "blood_glucose"
                  ? setExpanded("")
                  : setExpanded("blood_glucose");
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#ffffff" }} />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                className={
                  expanded == "blood_glucose"
                    ? classes.accordionHeader
                    : classes.accordionHeaderDark
                }
              >
                <span className={classes.accordianHeaderTag}>
                  Blood Glucose
                </span>
              </AccordionSummary>

              <AccordionDetails className={classes.accordianContent}>
                <Link
                  onClick={() => {
                    setAddData("blood_glucose");
                  }}
                  className={classes.trackLink}
                  style={{
                    marginTop: props.source == "core_team" ? -70 : 5,
                  }}
                >
                  <img src={props.menu_track_src} width="40" alt="Track" />
                </Link>

                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            Date
                          </strong>
                        </TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            Time
                          </strong>
                        </TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            BG
                          </strong>
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patientDevice &&
                      patientDevice.patient_device_readings ? (
                        <>
                          {patientDevice.patient_device_readings.map(
                            (reading, index) => (
                              <TableRow
                                key={index}
                                className={
                                  index % 2 == 0 ? classes.rowEven : classes.row
                                }
                              >
                                <TableCell
                                  size="small"
                                  scope="row"
                                  align="center"
                                  style={{
                                    width: 10,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                  }}
                                  className={classes.tableCell}
                                >
                                  {reading.notes && reading.notes.length && (
                                    <InfoIcon
                                      style={{
                                        fontSize: 16,
                                        color: "#c1b7b3",
                                        display: "inline-block",
                                        marginLeft: 20,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        reading.type = "blood_glucose";
                                        setShowNotes(reading);
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  style={{ fontFamily: "QuicksandMedium" }}
                                  className={classes.tableCell}
                                >
                                  {formatToUsDate(reading.date_recorded)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ fontFamily: "QuicksandMedium" }}
                                  className={classes.tableCell}
                                >
                                  {timeFormatted(reading.date_recorded).replace(
                                    " ",
                                    ""
                                  )}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ fontFamily: "QuicksandMedium" }}
                                  className={classes.tableCell}
                                >
                                  <span
                                    style={{
                                      color: getReadingColor(
                                        parseInt(reading.reading_value)
                                      ),
                                    }}
                                  >
                                    {parseInt(reading.reading_value)}
                                  </span>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableCell}
                                >
                                  <CreateIcon
                                    style={{
                                      fontSize: 20,
                                      color: "#c1b7b3",
                                      display: "inline-block",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      reading.type = "blood_glucose";
                                      setEditData(reading);
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableCell}
                                >
                                  {reading.source &&
                                    reading.source == "manual" && (
                                      <DeleteIcon
                                        style={{
                                          fontSize: 20,
                                          color: "#c1b7b3",
                                          display: "inline-block",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          removeReading(
                                            reading,
                                            "blood_glucose"
                                          );
                                        }}
                                      />
                                    )}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </>
                      ) : (
                        <p>No entries available.</p>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "blood_pressure"}
              onChange={() => {
                expanded == "blood_pressure"
                  ? setExpanded("")
                  : setExpanded("blood_pressure");
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#ffffff" }} />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                className={
                  expanded == "blood_pressure"
                    ? classes.accordionHeader
                    : classes.accordionHeaderDark
                }
              >
                <span className={classes.accordianHeaderTag}>
                  Blood Pressure
                </span>
              </AccordionSummary>

              <AccordionDetails className={classes.accordianContent}>
                <Link
                  onClick={() => {
                    setAddData("blood_pressure");
                  }}
                  className={classes.trackLink}
                  style={{
                    marginTop: props.source == "core_team" ? -70 : 5,
                  }}
                >
                  <img src={props.menu_track_src} width="40" alt="Track" />
                </Link>

                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            Date
                          </strong>
                        </TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            Time
                          </strong>
                        </TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            BP
                          </strong>
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bloodPressureReadings &&
                      bloodPressureReadings.length > 0 ? (
                        <>
                          {bloodPressureReadings.map((reading, index) => (
                            <TableRow
                              key={index}
                              className={
                                index % 2 == 0 ? classes.rowEven : classes.row
                              }
                            >
                              <TableCell
                                size="small"
                                scope="row"
                                align="center"
                                style={{
                                  width: 10,
                                  paddingLeft: 0,
                                  paddingRight: 0,
                                }}
                                className={classes.tableCell}
                              >
                                {reading.notes && reading.notes.length && (
                                  <InfoIcon
                                    style={{
                                      fontSize: 16,
                                      color: "#c1b7b3",
                                      display: "inline-block",
                                      marginLeft: 20,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      reading.type = "blood_pressure";
                                      setShowNotes(reading);
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                                style={{ fontFamily: "QuicksandMedium" }}
                                className={classes.tableCell}
                              >
                                {formatToUsDate(reading.date_recorded)}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{ fontFamily: "QuicksandMedium" }}
                                className={classes.tableCell}
                              >
                                {timeFormatted(reading.date_recorded).replace(
                                  " ",
                                  ""
                                )}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{ fontFamily: "QuicksandMedium" }}
                                className={classes.tableCell}
                              >
                                <span
                                  style={{
                                    color: getBPColor(
                                      parseInt(reading.systolic_value),
                                      parseInt(reading.diastolic_value)
                                    ),
                                  }}
                                >
                                  {parseInt(reading.systolic_value)} /{" "}
                                  {parseInt(reading.diastolic_value)}
                                </span>
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableCell}
                              >
                                <CreateIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    reading.type = "blood_pressure";
                                    setEditData(reading);
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableCell}
                              >
                                <DeleteIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    removeReading(reading, "blood_pressure");
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <p>No entries available.</p>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "weight"}
              onChange={() => {
                expanded == "weight" ? setExpanded("") : setExpanded("weight");
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#ffffff" }} />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                className={
                  expanded == "weight"
                    ? classes.accordionHeader
                    : classes.accordionHeaderDark
                }
              >
                <span className={classes.accordianHeaderTag}>Weight</span>
              </AccordionSummary>

              <AccordionDetails className={classes.accordianContent}>
                <Link
                  onClick={() => {
                    setAddData("weight");
                  }}
                  className={classes.trackLink}
                  style={{
                    marginTop: props.source == "core_team" ? -70 : 5,
                  }}
                >
                  <img src={props.menu_track_src} width="40" alt="Track" />
                </Link>

                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            Date
                          </strong>
                        </TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            Time
                          </strong>
                        </TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                          <strong style={{ fontFamily: "QuicksandMedium" }}>
                            Weight(lbs.)
                          </strong>
                        </TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                        <TableCell
                          align="center"
                          className={classes.tableCell}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weightReadings && weightReadings.length > 0 ? (
                        <>
                          {weightReadings.map((reading, index) => (
                            <TableRow
                              key={index}
                              className={
                                index % 2 == 0 ? classes.rowEven : classes.row
                              }
                            >
                              <TableCell
                                size="small"
                                scope="row"
                                align="center"
                                style={{
                                  width: 10,
                                  paddingLeft: 0,
                                  paddingRight: 0,
                                }}
                                className={classes.tableCell}
                              >
                                {reading.notes && reading.notes.length && (
                                  <InfoIcon
                                    style={{
                                      fontSize: 16,
                                      color: "#c1b7b3",
                                      display: "inline-block",
                                      marginLeft: 20,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      reading.type = "weight";
                                      setShowNotes(reading);
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                                style={{ fontFamily: "QuicksandMedium" }}
                                className={classes.tableCell}
                              >
                                {formatToUsDate(reading.date_recorded)}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{ fontFamily: "QuicksandMedium" }}
                                className={classes.tableCell}
                              >
                                {timeFormatted(reading.date_recorded).replace(
                                  " ",
                                  ""
                                )}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{ fontFamily: "QuicksandMedium" }}
                                className={classes.tableCell}
                              >
                                <span>{parseInt(reading.reading_value)}</span>
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableCell}
                              >
                                <CreateIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    reading.type = "weight";
                                    setEditData(reading);
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableCell}
                              >
                                <DeleteIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    removeReading(reading, "weight");
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <p>No entries available.</p>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
          {props.source == "patient" && <PatientBreadcrumbs page={"my_data"} />}
        </Grid>
      </div>
    </div>
  );
};

export default MyData;
