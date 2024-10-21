import { createTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

export const useAddPatientStyles = () => {
  const theme = createTheme();
  const theStyles = makeStyles(() => ({
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: "#ff0000",
      padding: theme.spacing(2, 4, 3),
      width: 480,
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "6%",
      borderRadius: 4,
      "&:active": {
        outline: "none",
      },
      "&:focus": {
        outline: "none",
      },
      border: "1px solid #dbe3e6",
      "@media (max-width: 600px)": {
        marginTop: 0,
        width: "100%",
        padding: 0,
        minHeight: "100vh",
      },
    },
    paperInner: {
      "@media (max-width: 600px)": {
        padding: theme.spacing(2, 4, 3),
      },
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
    inviteHeader: {
      font: "16px QuicksandMedium",
      marginBottom: 0,
      textAlign: "center",
    },
    centerButton: {
      textAlign: "center",
      marginTop: 10,
    },
    alert: {
      border: "1px solid #dbe3e6",
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
