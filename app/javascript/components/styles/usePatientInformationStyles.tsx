import makeStyles from "@mui/styles/makeStyles";

export const usePatientInformationStyles = () => {
  const theStyles = makeStyles(() => ({
    editLink: {
      display: "inline-block",
      float: "right",
      color: "#A3A3A3",
      marginRight: 20,
      marginTop: -17,
    },
    editLinkAnchor: {
      color: "#A3A3A3",
      cursor: "pointer",
    },
    patientName: {
      font: "18px QuicksandMedium",
      color: "#313133",
      fontWeight: "bold",
    },
    patientText: {
      font: "14px QuicksandMedium",
      color: "#313133",
      fontWeight: "normal",
    },
    accordionHeader: {
      border: "1px solid #a2a2a2",
      marginTop: 10,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      boxShadow: "1px 1px 1px 1px #efefef",
    },
    accordianHeaderTag: {
      font: "16px QuicksandMedium",
      fontWeight: "bold",
    },
    accordianContent: {
      backgroundColor: "#EFE9E7",
      display: "block",
    },
    topAccordion: {
      marginTop: 30,
    },
    dataLink: {
      color: "#ffffff",
      backgroundColor: "#939393",
      textAlign: "center",
      display: "block",
      margin: 5,
      font: "12px QuicksandMedium",
      padding: 5,
      borderRadius: 4,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "none",
      },
    },
    labContainer: {
      display: "block",
    },
    noteText: {
      font: "14px QuicksandMedium",
    },
    dataContainer: {
      borderRadius: 4,
      border: "1px solid #b7b7b7",
      margin: 5,
    },
    dataTitle: {
      textAlign: "center",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "#939393",
      font: "16px QuicksandMedium",
      padding: 2,
    },
    dataFlex: {
      display: "flex",
      flexDirection: "row",
      borderBottom: "1px solid #939393",
      paddingTop: 4,
      paddingBottom: 4,
      "@media (max-width: 1330px)": {
        display: "block",
        width: "100%",
      },
    },
    dataFlexHidden: {
      display: "none",
      flexDirection: "row",
    },
    dataValue: {
      textAlign: "center",
      color: "#313133",
      fontWeight: "bold",
      font: "16px QuicksandMedium",
      paddingTop: 2,
      paddingBottom: 2,
      flex: 1,
      "@media (max-width: 1330px)": {
        flex: "none",
        width: "100%",
      },
    },
    dataDate: {
      textAlign: "center",
      color: "#888888",
      fontWeight: "normal",
      font: "12px QuicksandMedium",
      flex: 1,
      paddingTop: 5,
      "@media (max-width: 1330px)": {
        flex: "none",
        width: "100%",
      },
    },
    dataExpand: {
      textAlign: "center",
      color: "#ffffff",
      backgroundColor: "#939393",
      fontSize: 14,
      cursor: "pointer",
    },
    medicationRow: {
      borderRight: "1px solid #bdbdbd",
      font: "14px QuicksandMedium",
      backgroundColor: "#ffffff",
      alignItems: "stretch",
    },
    medicationRowEven: {
      borderRight: "1px solid #bdbdbd",
      font: "14px QuicksandMedium",
      backgroundColor: "#f4f4f4",
      borderBottom: "1px solid #bdbdbd",
      alignItems: "stretch",
    },
    medicationCell: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 12,
      borderLeft: "1px solid #bdbdbd",
      height: "100%",
      flexDirection: "column",
    },
    medicationCellLast: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      borderLeft: "1px solid #bdbdbd",
    },
    addMedicationsSection: {
      textAlign: "center",
    },
    addMedicationButton: {
      borderRadius: 6,
      backgroundColor: "#939393",
      color: "#ffffff",
      fontWeight: "bold",
      font: "14px QuicksandMedium",
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 15,
      paddingRight: 15,
      display: "inline-block",
      marginTop: 5,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "none",
      },
    },
    assignedActions: {
      paddingLeft: 45,
      marginTop: 10,
      paddingBottom: 20,
      backgroundColor: "#ffffff",
      paddingRight: 30,
      paddingTop: 20,
      minHeight: 50,
      "& div": {
        width: "100%",
        font: "14px QuicksandMedium",
      },
    },
    assignedPathwayContainer: {
      paddingLeft: 45,
      marginTop: 10,
      paddingBottom: 20,
      backgroundColor: "#ffffff",
      paddingRight: 30,
      paddingTop: 20,
      minHeight: 50,
    },
    assignedPathway: {
      font: "15px QuicksandMedium",
      "& span": {
        display: "inline-block",
      },
    },
    assignedPathwayWeek: {
      font: "14px QuicksandMedium",
      color: "#f8890b",
      marginTop: 5,
      marginBottom: 2,
      "& span": {
        color: "#2c2c2c",
        display: "inline-block",
        marginLeft: 10,
      },
    },
    assignedPathwayWeekAction: {
      width: "100%",
      font: "14px QuicksandMedium",
    },
    assignedPathwayGroup: {
      marginBottom: 30,
    },
  }));
  const classes = theStyles();

  return {
    classes,
  };
};
