import makeStyles from "@mui/styles/makeStyles";

export const useAppStyles = () => {
  const theStyles = makeStyles(() => ({
    header: {
      marginLeft: "auto",
      marginRight: "auto",
      display: "block",
      marginTop: 30,
      marginBottom: 30,
    },
    content: {
      marginTop: 100,
      marginBottom: 20,
    },
    navWrapper: {
      position: "relative",
    },
    bodyBackground: {
      // backgroundColor: "#B0B0B0",
      backgroundColor: "#888888",
      overflow: "auto",
      height: "100vh",
      "@media (max-width: 600px)": {
        backgroundColor: "#F2F2F2",
      },
    },
    bodyBackgroundPatient: {
      backgroundColor: "#FFFFFF",
      overflow: "auto",
      height: "100vh",
      "@media (max-width: 600px)": {},
    },
  }));
  const classes = theStyles();

  return {
    classes,
  };
};
