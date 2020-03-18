/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link, Snackbar } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Link as RouterLink } from "react-router-dom";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import AddGlucose from "./AddGlucose";
import ShowReadingNote from "./ShowReadingNote";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { Alert } from '@mui/material';
import { useSwipeable } from "react-swipeable";
import { formatToUsDate } from "../utils/DateHelper";

// componet import
import PatientBreadcrumbs from "../paritals/patient_breadcrumbs";

// helpers
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  user_id: number;
  csrfToken: string;
  patient_device: any;
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
    marginTop: 90,
    "@media (max-width: 600px)": {
      width: "100%",
    },
  },
  patientName: {
    marginLeft: 10,
    font: "22px QuicksandMedium",
    marginBottom: 20,
  },
  indicatorContainer: {
    width: "100%",
    "& img": {},
    textAlign: "center",
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
}));

const BloodGlucose: React.FC<Props> = (props: any) => {
  const classes = useStyles();
  const [addGlucose, setAddGluecose] = React.useState<boolean>(false);
  const [editGlucose, setEditGlucose] = React.useState<any>(null);
  const [showNotes, setShowNotes] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      props.source == "patient"
        ? (window.location.href = "/my-medications")
        : null,
    onSwipedRight: () =>
      props.source == "patient"
        ? (window.location.href = "/my-care-plan")
        : null,
  });

  React.useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let track = urlParams.get("track");
    if (track) setAddGluecose(true);
  }, []);

  const timeFormatted = (dateString) => {
    let date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const removeReading = (reading) => {
    setError("");
    if (
      confirm("Deleting this entry cannot be undone, do you wish to continue?")
    ) {
      fetch(`/remove_blood_glucose`, {
        method: "POST",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          reading: {
            patient_device_reading_id: reading.id,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
          } else {
            props.source == "patient"
              ? (window.location.href = `/my-data`)
              : (window.location.href = `/data-rpm/${props.user_id}`);
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

  return (
    <div
      {...swipeHandlers}
      style={
        props.source == "patient"
          ? { touchAction: "pan-y", minHeight: "86vh" }
          : {}
      }
    >
      <div>
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

        {(addGlucose || editGlucose) && (
          <AddGlucose
            patient_id={props.user_id}
            button_src={props.button_src}
            csrfToken={props.csrfToken}
            setAddGluecose={setAddGluecose}
            editGlucose={editGlucose}
            setEditGlucose={setEditGlucose}
            setShowNotes={setShowNotes}
            source={props.source}
          />
        )}

        {showNotes && (
          <ShowReadingNote
            editData={editGlucose}
            setEditData={setEditGlucose}
            showNotes={showNotes}
            setShowNotes={setShowNotes} 
            readingType={"Blood Glucose"}          
            />
        )}

        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          style={props.source == "patient" ? { marginTop: 90 } : {}}
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
                xs={8}
                className={classes.pageTitle}
                style={{
                  textAlign: props.patient == "patient" ? "center" : "left",
                }}
              >
                <span>Blood Glucose</span>
              </Grid>
              {props.source == "patient" && (
                <Grid item xs={2}>
                  &nbsp;
                </Grid>
              )}
            </Grid>

            <Link
              onClick={() => {
                setAddGluecose(true);
              }}
              className={classes.trackLink}
              style={{
                marginTop: props.source == "core_team" ? -70 : 20,
              }}
            >
              <img src={props.menu_track_src} width="40" alt="Track" />
            </Link>

            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                      <strong style={{ fontFamily: "QuicksandMedium" }}>
                        Date
                      </strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong style={{ fontFamily: "QuicksandMedium" }}>
                        Time
                      </strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong style={{ fontFamily: "QuicksandMedium" }}>
                        BG
                      </strong>
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.patient_device &&
                  props.patient_device.patient_device_readings ? (
                    <>
                      {props.patient_device.patient_device_readings.map(
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
                            >
                              {formatToUsDate(reading.date_recorded)}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ fontFamily: "QuicksandMedium" }}
                            >
                              {timeFormatted(reading.date_recorded).replace(
                                " ",
                                ""
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ fontFamily: "QuicksandMedium" }}
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
                            <TableCell align="center">
                              <CreateIcon
                                style={{
                                  fontSize: 20,
                                  color: "#c1b7b3",
                                  display: "inline-block",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setEditGlucose(reading);
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {reading.source && reading.source == "manual" && (
                                <DeleteIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    removeReading(reading);
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
          </Grid>
          {props.source == "patient" && <PatientBreadcrumbs page={"my_data"} />}
        </Grid>
      </div>
    </div>
  );
};

export default BloodGlucose;
