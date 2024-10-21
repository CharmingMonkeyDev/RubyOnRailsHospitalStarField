/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid } from "@mui/material";
import PatientInfo from "../PatientInfo";
import ReportOverview from "./ReportOverview";
import ReportAmbulatory from "./ReportAmbulatory";
import { AuthenticationContext } from "../../Context";
import { useParams } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

interface Props {}

const CgmReport: React.FC<Props> = (props: any) => {
  // users id
  const { id } = useParams();
  const authSettings = React.useContext(AuthenticationContext);
  const csrfToken = authSettings.csrfToken;
  const userRole = authSettings.userRole;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/?menu=false"),
    onSwipedRight: () => (window.location.href = "/my-labs"),
  });

  return (
    <Grid className="cgm-report-container" {...swipeHandlers}>
      <Grid container spacing={3} className="main-report-container">
        <Grid item xs={12} lg={userRole == "patient" ? 12 : 4} paddingLeft={"0 !important"} paddingTop={"6px !important"}>
          <ReportOverview csrfToken={csrfToken} />
        </Grid>
        <Grid
          item
          xs={12}
          lg={userRole == "patient" ? 12 : 8}
          pt={"0px !important"}
          pb={"30px"}
        >
          <ReportAmbulatory csrfToken={csrfToken} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CgmReport;
