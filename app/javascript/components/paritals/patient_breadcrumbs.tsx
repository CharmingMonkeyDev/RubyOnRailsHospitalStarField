/* eslint-disable prettier/prettier */

import * as React from "react";
import { Grid } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  indicatorContainer: {
    width: "100%",
    textAlign: "center",
    background: "white",
    paddingBottom: "5px",
    "@media (max-width: 600px)": {
      position: "absolute",
      bottom: 0,
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
}));

interface Props {
  page: string;
}

const PatientBreadcrumbs: React.FC<Props> = (props: any) => {
  const classes = useStyles();

  const getBackgroundColor = (pageName) => {
    if (pageName == props.page) {
      return "#f78204";
    }
  };
  return (
    <Grid item xs={12}>
      <div className={classes.indicatorContainer}>
        <span
          className={classes.indicator}
          style={{ backgroundColor: getBackgroundColor("home") }}
        ></span>
        <span
          className={classes.indicator}
          style={{ backgroundColor: getBackgroundColor("chat") }}
        ></span>
        <span
          className={classes.indicator}
          style={{ backgroundColor: getBackgroundColor("care_plan") }}
        ></span>
        <span
          className={classes.indicator}
          style={{ backgroundColor: getBackgroundColor("my_data") }}
        ></span>
        <span
          className={classes.indicator}
          style={{ backgroundColor: getBackgroundColor("medication") }}
        ></span>
        <span
          className={classes.indicator}
          style={{ backgroundColor: getBackgroundColor("labs") }}
        ></span>
        <span
          className={classes.indicator}
          style={{ backgroundColor: getBackgroundColor("cgm") }}
        ></span>
      </div>
    </Grid>
  );
};

export default PatientBreadcrumbs;
