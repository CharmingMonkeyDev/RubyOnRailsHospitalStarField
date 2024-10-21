import * as React from "react";
import { Modal, Grid, createTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  setShowTypeMenu: any;
  track_blood_pressure_src: string;
  track_glucose_src: string;
  track_weight_src: string;
}
const theme = createTheme();
const useStyles = makeStyles(() => ({
  container: {
    marginTop: 0,
    "@media (max-width: 600px)": {},
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "#ff0000",
    width: 320,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "6%",
    borderRadius: 8,
    "@media (max-width: 600px)": {
      width: "94vw",
    },
    "&:active": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    border: "1px solid #dbe3e6",
  },
  paperInner: {
    padding: theme.spacing(2, 4, 3),
    "@media (max-width: 600px)": {},
  },
  header: {
    font: "18px QuicksandMedium",
    marginBottom: 0,
    textAlign: "left",
  },
  menuLink: {
    border: "1px solid #efe9e7",
    textAlign: "center",
    borderRadius: 6,
    display: "block",
    backgroundColor: "#ffffff",
    margin: 10,
    padding: 10,
    marginBottom: 18,
    boxShadow: "1px 1px 1px 1px #efefef",
    "& img": {
      display: "inline-block",
    },
    "& span": {
      display: "inline-block",
      font: "20px QuicksandBold",
      color: "#000000",
    },
  },
}));

const DataTypeMenu: React.FC<Props> = (props: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(true);

  const closeModal = () => {
    props.setShowTypeMenu(false);
  };

  return (
    <>
      <Modal open={open} onClose={closeModal}>
        <div className={classes.paper}>
          <div className={classes.paperInner}>
            <p className={classes.header}>I want to track: </p>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={6}>
                <RouterLink
                  to="/my-data?track=true&type=blood_glucose"
                  className={classes.menuLink}
                >
                  <img
                    src={props.track_glucose_src}
                    width="41"
                    alt="Track"
                    style={{ marginTop: 8, marginBottom: 8 }}
                  />
                  <br />
                  <span>Glucose</span>
                </RouterLink>
                <RouterLink
                  to="/my-data?track=true&type=weight"
                  className={classes.menuLink}
                >
                  <img src={props.track_weight_src} width="57" alt="Track" />
                  <br />
                  <span>Weight</span>
                </RouterLink>
              </Grid>
              <Grid item xs={6}>
                <RouterLink
                  to="/my-data?track=true&type=blood_pressure"
                  className={classes.menuLink}
                >
                  <img
                    src={props.track_blood_pressure_src}
                    width="57"
                    alt="Track"
                  />
                  <br />
                  <span>Blood Pressure</span>
                </RouterLink>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DataTypeMenu;
