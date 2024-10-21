/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid } from "@mui/material";
interface Props {
  glucoseExposure: any;
}

const GlucoseExposure: React.FC<Props> = (props: any) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container justifyContent={"space-between"}>
          <Grid item xs={6} style={{ paddingRight: "2.5%" }}>
            <Grid item xs={12} className="info-widget small-widget">
              <Grid container className="">
                <Grid item xs={12} className="header-container">
                  Glucose Exposure
                </Grid>
                <Grid item xs={12} className="label">
                  Avg Glucose
                </Grid>
                <Grid item xs={12} className="label">
                  mg/dL
                </Grid>
                <Grid item xs={12} className="data-value">
                  {props.glucoseExposure?.egv_value
                    ? props.glucoseExposure?.egv_value
                    : "NA"}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} style={{ paddingLeft: "2.5%" }}>
            {props.glucoseExposure?.gmi_value ? (
              <Grid item xs={12} className="info-widget small-widget">
                <Grid container>
                  <Grid item xs={12} className="header-container">
                    Glucose Management Indicator
                  </Grid>
                  <Grid item xs={12} className="label">
                    Avg Glucose
                  </Grid>
                  <Grid item xs={12} className="label">
                    mg/dL
                  </Grid>
                  <Grid item xs={12} className="data-value">
                    {props.glucoseExposure?.gmi_value}
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12} className="info-widget">
                <Grid container>
                  <Grid item xs={12} className="header-container">
                    Glucose Management Indicator
                  </Grid>
                  {props.glucoseExposure?.gmi > 0 ? (
                    <>
                      <Grid item xs={12} className="label">
                        Target &lt; 5.7%
                      </Grid>
                      <Grid item xs={12} className="data-value">
                        {props.glucoseExposure?.gmi}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} className="label">
                        Less Than 12 Days of Data
                      </Grid>
                      <Grid item xs={12} className="data-value">
                        NED
                      </Grid>
                      <Grid item xs={12} className="label">
                        (Not Enough Data)
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GlucoseExposure;
