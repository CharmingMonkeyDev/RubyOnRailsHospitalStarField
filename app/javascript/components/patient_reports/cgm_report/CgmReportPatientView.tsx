/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid } from "@mui/material";
import ReportOverviewPatientView from "./ReportOverviewPatientView";
import ReportAmbulatoryPatientView from "./ReportAmbulatoryPatientView";
import { AuthenticationContext } from "../../Context";
import { useParams } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

import PatientBreadcrumbs from "../../paritals/patient_breadcrumbs";

interface Props {}

const CgmReportPatientView: React.FC<Props> = (props: any) => {
  // users id
  const { id } = useParams();
  const authSettings = React.useContext(AuthenticationContext);
  const csrfToken = authSettings.csrfToken;
  const userRole = authSettings.userRole;
  const [dateSelectionType, setDateSelectionType] =
    React.useState<string>("daily");
  const [dataDate, setDataDate] = React.useState<any>(new Date());

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/?menu=false"),
    onSwipedRight: () => (window.location.href = "/my-labs"),
  });

  return (
    <Grid className="cgm-report-container" {...swipeHandlers}>
      <Grid container spacing={3} className="main-report-container">
        <Grid item xs={12} lg={userRole == "patient" ? 12 : 4}>
          <ReportOverviewPatientView
            csrfToken={csrfToken}
            dateSelectionType={dateSelectionType}
            setDateSelectionType={setDateSelectionType}
            dataDate={dataDate}
            setDataDate={setDataDate}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={userRole == "patient" ? 12 : 8}
          style={{ paddingBottom: "30px" }}
        >
          <ReportAmbulatoryPatientView
            csrfToken={csrfToken}
            dateSelectionType={dateSelectionType}
            dataDate={dataDate}
            setDataDate={setDataDate}
          />
          <PatientBreadcrumbs page={"cgm"} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CgmReportPatientView;
