/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid } from "@mui/material";
import AmbulatoryDailyPatientView from "./AmbulatoryDailyPatientView";
import AmbulatoryWeekPatientView from "./AmbulatoryWeekPatientView";

interface Props {
  csrfToken: string;
  dateSelectionType: string;
  dataDate: any;
  setDataDate: any;
}

const ReportAmbulatoryPatientView: React.FC<Props> = (props: any) => {
  return (
    <Grid
      container
      className="ambulatory-report-container patient-view space-for-breadcrum"
    >
      <Grid item xs={12}>
        <Grid container className="tabs-container">
          <Grid item xs={12}>
            {props.dateSelectionType == "daily" ? (
              <div>
                <AmbulatoryDailyPatientView
                  csrfToken={props.csrfToken}
                  dataDate={props.dataDate}
                  setDataDate={props.setDataDate}
                />
                <p style={{ fontSize: "12px" }}>Dexcom CGM Data</p>
              </div>
            ) : (
              <div>
                <AmbulatoryWeekPatientView
                  csrfToken={props.csrfToken}
                  weekRange={2}
                  startDate={props.dataDate}
                />
                <p style={{ fontSize: "12px" }}>Dexcom CGM Data</p>
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReportAmbulatoryPatientView;
