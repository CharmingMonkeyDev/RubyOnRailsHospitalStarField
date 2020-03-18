import { createTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

export const usePatientDashboardStyles = () => {
  const theme = createTheme();
  const theStyles = makeStyles(() => ({
    container: {
      marginTop: 0,
      "@media (max-width: 600px)": {},
    },
    alert: {
      border: "1px solid #dbe3e6",
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
    logoStyle: {
      marginLeft: "auto",
      marginRight: "auto",
      display: "block",
      marginTop: 20,
      marginBottom: 30,
      maxWidth: "100%",
    },
    textInput: {
      width: "100%",
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 4,
      backgroundColor: "#fcf6f4",
    },
    textInputCenter: {
      width: "100%",
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 4,
      textAlign: "center",
    },
    loginButton: {},
    loginLink: {
      color: "#313133",
      textDecoration: "underline",
    },
    clearButtonStyling: {
      background: "none",
      color: "inherit",
      border: "none",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
      outline: "inherit",
      textAlign: "center",
    },
    nextButton: {
      background: "none",
      border: "none",
      padding: 10,
      paddingLeft: 55,
      paddingRight: 55,
      font: "inherit",
      cursor: "pointer",
      outline: "inherit",
      textAlign: "center",
      color: "#ffffff !important",
      backgroundColor: "#ff8906",
      borderRadius: 4,
      fontFamily: "QuicksandMedium",
      marginTop: 20,
      display: "inline-block",
      "&:hover": {
        textDecoration: "none",
      },
    },
    inviteHeader: {
      font: "18px QuicksandMedium",
      marginBottom: 0,
      textAlign: "center",
    },
    centerButton: {
      textAlign: "center",
      marginTop: 10,
    },
    textInputLabel: {
      font: "12px QuicksandMedium",
      display: "inline-block",
      marginTop: 10,
    },
    editPatientRight: {
      paddingLeft: 10,
      "@media (max-width: 965px)": {
        paddingLeft: 0,
      },
    },
    numberStyleCenter: {
      textAlign: "center",
      "& a": {
        color: "#4a4442",
        padding: 7,
        border: "3px solid #a29d9b",
        borderRadius: "50%",
        font: "22px QuicksandMedium",
        paddingLeft: 14,
        paddingRight: 14,
        cursor: "pointer",
        display: "inline-block",
        marginBottom: 15,
        "&:hover": {
          textDecoration: "none",
        },
      },
    },
    rowEven: {},
    row: {
      backgroundColor: "#efe9e7",
    },
  }));
  const classes = theStyles();

  return {
    classes,
  };
};
