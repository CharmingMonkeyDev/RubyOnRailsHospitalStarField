import makeStyles from "@mui/styles/makeStyles";

export const useHeaderStyles = () => {
  const theStyles = makeStyles(() => ({
    header: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      boxShadow: "0 4px 2px -2px #666666",
      display: "flex",
      flexDirection: "row",
      paddingTop: 6,
      paddingBottom: 8,
      justifyContent: "space-between",
      backgroundColor: "#ffffff",
      zIndex: 3,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    },
    mobileHeader: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      boxShadow: "0 4px 2px -2px #666666",
      display: "flex",
      flexDirection: "row",
      paddingTop: 6,
      paddingBottom: 8,
      justifyContent: "space-between",
      backgroundColor: "#ffffff",
      zIndex: 2,
    },
    logo: {
      display: "inline-block",
      marginTop: 16,
      marginLeft: 8,
    },
    welcomeText: {
      marginLeft: 20,
      font: "18px QuicksandMedium",
      fontWeight: "bold",
      color: "#313133",
      flexGrow: 1,
    },
    welcomeLeft: {
      float: "left",
      marginRight: 20,
    },
    welcomeRight: {
      float: "left",
      marginTop: 10,
    },
    dateText: {
      flexGrow: 2,
      font: "15px QuicksandMedium",
      fontWeight: "bold",
      color: "#084190",
      textAlign: "right",
      marginTop: 10,
    },
    logoutButton: {
      flexGrow: 1,
      textAlign: "right",
      marginRight: 50,
    },
    logoutLink: {
      display: "inline-block",
      borderRadius: 4,
      color: "#cfcfcf",
      textDecoration: "none",
      font: "21px QuicksandMedium",
      marginTop: 14,
    },
    welcomeSmall: {
      font: "14px QuicksandMedium",
      fontWeight: "normal",
      color: "#313133",
    },
    desktop: {
      display: "block",
      "@media (max-width: 1024px)": {
        display: "none",
      },
    },
    mobile: {
      position: "relative",
      display: "none",
      "@media (max-width: 1024px)": {
        display: "block",
      },
    },
    mobileLogo: {
      flexGrow: 2,
      textAlign: "center",
    },
    mobileLogoImage: {
      maxWidth: 160,
      textAlign: "center",
      display: "inline-block",
      marginTop: 10,
    },
    mobileHomeLink: {
      flexGrow: 1,
    },
    mobileNavLink: {},
    mobileNavIcon: {
      fontSize: 30,
      marginRight: 20,
      marginTop: 8,
      float: "right",
      color: "#000000",
    },
    mobileMenuLink: {
      flexGrow: 1,
    },
    mobileNavIconBlack: {
      color: "#000000",
      fontSize: 30,
      marginLeft: 20,
      marginTop: 8,
      cursor: "pointer",
    },
    mobileNavigation: {
      position: "fixed",
      width: "90%",
      backgroundColor: "#ffffff",
      top: 66,
      left: 0,
      zIndex: 10,
    },
    mobileNavigationLink: {
      color: "#919191",
      font: "21px QuicksandMedium",
      paddingLeft: 20,
      paddingTop: 20,
      paddingBottom: 20,
      width: "100%",
      borderBottom: "1px solid #A3A3A3",
      borderRight: "1px solid #A3A3A3",
      backgroundColor: "#ffffff",
      display: "inline-block",
      textDecoration: "none",
      marginTop: -5,
    },
    textInput: {
      width: "250px",
      marginTop: 8,
      marginBottom: 10,
      backgroundColor: "#fcf6f4",
      marginLeft: 10,
    },
  }));
  const classes = theStyles();

  return {
    classes,
  };
};
