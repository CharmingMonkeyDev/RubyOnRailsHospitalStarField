import * as React from "react";
import { Grid, Link } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Link as RouterLink } from "react-router-dom";

interface Props {}

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
    padding: 10,
  },
}));

const ContactUs: React.FC<Props> = (props: any) => {
  const classes = useStyles();

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
              <span>Contact</span>
            </Grid>
            <Grid item xs={2}>
              &nbsp;
            </Grid>
          </Grid>

          <div className={classes.infoSection}>
            <p style={{ font: "16px QuicksandMedium", textAlign: "center" }}>
              Email us with questions or comments:{" "}
            </p>
            <p style={{ textAlign: "center" }}>
              <Link
                href="mailto:info@starfield.health"
                style={{ font: "16px QuicksandMedium", color: "#f78204" }}
              >
                info@starfield.health
              </Link>
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ContactUs;
