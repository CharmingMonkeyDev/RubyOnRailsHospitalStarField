import makeStyles from "@mui/styles/makeStyles";

export const useNavStyles = () => {
  const theStyles = makeStyles(() => ({
    container: {
      position: "fixed",
      zIndex: 1,
      top: 72,
      left: 0,
      bottom: 15,
      width: 90,
      "@media (max-width: 1024px)": {
        display: "none",
      },
    },
    navLink: {
      color: "#ffffff",
      textAlign: "left",
      marginLeft: 5,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingLeft: 14,
      textDecoration: "none",
      "&:hover": {
        "& $navIcon": {
          backgroundColor: "#f08e37",
          borderRadius: 4,
          zIndex: 3,
          color: "#ffffff",
        },
      },
    },
    navLink2: {
      display: "inline-block",
      width: "90px",
      textAlign: "center",
    },
    navIcon: {
      fontSize: 45,
      marginTop: 20,
      padding: 5,
    },
    navIcon2: {
      fontSize: 45,
      marginTop: 20,
      padding: 5,
    },
  }));
  const classes = theStyles();

  return {
    classes,
  };
};
