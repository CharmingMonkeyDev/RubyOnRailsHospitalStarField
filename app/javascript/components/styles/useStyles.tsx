import { createTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

export const useStyles = () => {
  const theme = createTheme();
  const theStyles = makeStyles(() => ({
    root: {
      backgroundColor: "blue",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
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
        height: "100vh",
      },
    },
    paperInner: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      "@media (max-width: 600px)": {
        padding: theme.spacing(2, 4, 3),
      },
    },
    loginLogo: {
      marginLeft: "auto",
      marginRight: "auto",
      display: "block",
      marginTop: 30,
      marginBottom: 30,
      maxWidth: "100%",
    },
    twoFactorLogo: {
      marginLeft: "auto",
      marginRight: "auto",
      display: "block",
      marginTop: 30,
      marginBottom: 20,
      maxWidth: "100%",
    },
    textInput: {
      width: "100%",
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 4,
      backgroundColor: "#fcf6f4",
    },
    loginButton: {
      float: "right",
    },
    loginLink: {
      color: "#313133",
      textDecoration: "underline",
    },
    logoutLink: {
      display: "inline-block",
      borderRadius: 4,
      color: "#cfcfcf",
      textDecoration: "none",
      font: "21px QuicksandMedium",
      marginTop: 14,
    },
    loginTextCentered: {
      marginLeft: "auto",
      marginRight: "auto",
      color: "#939393",
      display: "inline-block",
      font: "14px QuicksandMedium",
    },
    clearButtonStyling: {
      background: "none",
      color: "inherit",
      border: "none",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
      outline: "inherit",
      float: "right",
    },
  }));
  const classes = theStyles();

  return {
    classes,
  };
};
