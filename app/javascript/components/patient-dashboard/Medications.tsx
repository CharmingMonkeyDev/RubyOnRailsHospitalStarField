/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import AddMedication from "./AddMedication";
import { useSwipeable } from "react-swipeable";
import { formatToUsDate } from "../utils/DateHelper";

// component import
import PatientBreadcrumbs from "../paritals/patient_breadcrumbs";

// helpers
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patient_id: string;
  csrfToken: string;
  menu_track_src: string;
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
    textAlign: "center",
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
  noteText: {
    font: "14px QuicksandMedium",
    padding: 20,
    color: "#4A4442",
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

const Medications: React.FC<Props> = (props: any) => {
  const classes = useStyles();
  const [error, setError] = React.useState<string>("");
  const [addMedication, setAddMedication] = React.useState<boolean>(false);
  const [editMedication, setEditMedication] = React.useState<any>(null);
  const [patient, setPatient] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/data_fetching/medications/${props.patient_id}`, {
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
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/my-labs"),
    onSwipedRight: () => (window.location.href = "/my-data"),
  });

  React.useEffect(() => {}, []);

  const removeMedication = (medication) => {
    setError("");
    if (
      confirm("Deleting this entry cannot be undone, do you wish to continue?")
    ) {
      fetch(`/remove_medication`, {
        method: "POST",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          medication: {
            patient_medication_id: medication.id,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
          } else {
            window.location.href = `/my-medications`;
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  return (
    <div {...swipeHandlers} style={{ touchAction: "pan-y", minHeight: "86vh" }}>
      <div className={classes.container}>
        {(addMedication || editMedication) && (
          <AddMedication
            patient_id={props.patient_id}
            csrfToken={props.csrfToken}
            setAddMedication={setAddMedication}
            editMedication={editMedication}
            setEditMedication={setEditMedication}
          />
        )}

        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12} className="space-for-breadcrum">
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              className={classes.pageHeading}
            >
              <Grid item xs={2} className={classes.centerText}>
                <RouterLink
                  to="/?menu=false"
                  className={classes.backButton}
                  style={{ color: "#4A4442" }}
                >
                  &lt;
                </RouterLink>
              </Grid>
              <Grid item xs={8} className={classes.pageTitle}>
                <span>Medications</span>
              </Grid>
              <Grid item xs={2}>
                &nbsp;
              </Grid>
            </Grid>

            <Link
              onClick={() => {
                setAddMedication(true);
              }}
              className={classes.trackLink}
            >
              <img src={props.menu_track_src} width="40" alt="Track" />
            </Link>

            {typeof patient?.patient_medications !== "undefined" &&
            patient?.patient_medications.length ? (
              <>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <strong
                            style={{
                              fontFamily: "QuicksandBold",
                              color: "#4A4442",
                            }}
                          >
                            Name
                          </strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong
                            style={{
                              fontFamily: "QuicksandBold",
                              color: "#4A4442",
                            }}
                          >
                            Dose
                          </strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong
                            style={{
                              fontFamily: "QuicksandBold",
                              color: "#4A4442",
                            }}
                          >
                            Date
                          </strong>
                        </TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patient?.patient_medications.map((medication, index) => (
                        <TableRow
                          key={medication.id}
                          className={
                            index % 2 == 0 ? classes.rowEven : classes.row
                          }
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              fontFamily: "QuicksandMedium",
                              fontSize: 12,
                              padding: 10,
                            }}
                          >
                            {medication.name}
                          </TableCell>
                          <TableCell
                            style={{
                              fontFamily: "QuicksandMedium",
                              fontSize: 12,
                              padding: 10,
                            }}
                          >
                            {medication.value}
                          </TableCell>
                          <TableCell
                            style={{
                              fontFamily: "QuicksandMedium",
                              fontSize: 12,
                              padding: 10,
                            }}
                          >
                            {formatToUsDate(medication.created_at)}
                          </TableCell>
                          <TableCell style={{ padding: 10 }}>
                            <CreateIcon
                              style={{
                                fontSize: 18,
                                color: "#c1b7b3",
                                display: "inline-block",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setEditMedication(medication);
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ padding: 10 }}>
                            <DeleteIcon
                              style={{
                                fontSize: 18,
                                color: "#c1b7b3",
                                display: "inline-block",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                removeMedication(medication);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : patient?.patient_medications?.length == 0 ? (
              <p>No medications found.</p>
            ) : (
              <p>Loading...</p>
            )}
          </Grid>
          <PatientBreadcrumbs page={"medication"} />
        </Grid>
      </div>
    </div>
  );
};

export default Medications;
