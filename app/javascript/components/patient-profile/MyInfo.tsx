/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

import { Link as RouterLink } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";

// helpers
import { formatToUsDate } from "../utils/DateHelper";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  patient_id: string;
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
  infoSection: {
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
    marginBottom: 15,
    boxShadow: "1px 1px 1px 1px #efefef",
    padding: 10,
    borderRadius: "5px",
  },
  infoLabel: {
    color: "#ada8a6",
    font: "14px QuicksandMedium",
    margin: 0,
    padding: 0,
    marginBottom: 5,
  },
  infoData: {
    color: "#5b5654",
    font: "16px QuicksandMedium",
    margin: 0,
    padding: 0,
    marginBottom: 22,
  },
  infoEdit: {
    textAlign: "right",
    "& svg": {
      color: "#aca7a5",
      fontSize: 20,
      cursor: "pointer",
    },
    margin: 0,
    padding: 0,
  },
}));

const MyInfo: React.FC<Props> = (props: any) => {
  const classes = useStyles();
  const [patient, setPatient] = React.useState<any>();

  React.useEffect(() => {
    fetch(`/data_fetching/my_info/${props.patient_id}`, {
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

  return (
    <div className={classes.container}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
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
              <span>My Info</span>
            </Grid>
            <Grid item xs={2}>
              &nbsp;
            </Grid>
          </Grid>

          <div className={classes.infoSection}>
            <p className={classes.infoEdit}>
              <RouterLink to="/edit-my-info">
                <CreateIcon />
              </RouterLink>
            </p>

            <p className={classes.infoLabel}>First Name</p>
            <p className={classes.infoData}>{patient?.first_name}</p>

            <p className={classes.infoLabel}>Middle Name</p>
            <p className={classes.infoData}>{patient?.middle_name}</p>

            <p className={classes.infoLabel}>Last Name</p>
            <p className={classes.infoData}>{patient?.last_name}</p>

            <p className={classes.infoLabel}>Address</p>
            <p className={classes.infoData}>{patient?.address}</p>

            <p className={classes.infoLabel}>City</p>
            <p className={classes.infoData}>{patient?.city}</p>

            <p className={classes.infoLabel}>State</p>
            <p className={classes.infoData}>{patient?.state}</p>

            <p className={classes.infoLabel}>Zip</p>
            <p className={classes.infoData}>{patient?.zip}</p>

            <p className={classes.infoLabel}>Mobile Phone Number</p>
            <p className={classes.infoData}>{patient?.mobile_phone_number}</p>

            <p className={classes.infoLabel}>Date of Birth</p>
            <p className={classes.infoData}>
              {formatToUsDate(patient?.date_of_birth)}
            </p>

            <p className={classes.infoLabel}>Gender</p>
            <p className={classes.infoData}>{patient?.gender}</p>
          </div>

          <div className={classes.infoSection}>
            <p className={classes.infoEdit}>
              <RouterLink to="/edit-my-email">
                <CreateIcon />
              </RouterLink>
            </p>
            <p className={classes.infoLabel}>Email</p>
            <p className={classes.infoData}>{patient?.email}</p>
          </div>

          <div className={classes.infoSection}>
            <p className={classes.infoEdit}>
              <RouterLink to="/edit-my-password">
                <CreateIcon />
              </RouterLink>
            </p>
            <p className={classes.infoLabel}>Password</p>
            <p className={classes.infoData}>
              &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MyInfo;
