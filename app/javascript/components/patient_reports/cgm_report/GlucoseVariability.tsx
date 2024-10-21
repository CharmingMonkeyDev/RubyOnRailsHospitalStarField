/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid } from "@mui/material";

interface Props {
  glucoseVariability: any;
}

const GlucoseVariability: React.FC<Props> = ({ glucoseVariability }) => {
  return (
    <Grid container className="glucose-variability-container">
      <Grid item xs={12}>
        <Grid container justifyContent={"space-between"}>
          <Grid item xs={8} style={{ paddingRight: "1%" }}>
            <Grid item xs={12} className="info-widget">
              <Grid container>
                <Grid item xs={12} className="header-container">
                  Glucose Variability
                </Grid>
                <Grid container className="body-container">
                  <Grid item xs={7}>
                    <Grid item xs={12} className="label">
                      Coefficient of
                    </Grid>
                    <Grid item xs={12} className="label">
                      Variation
                    </Grid>
                    <Grid item xs={12} className="data-value-small">
                      {glucoseVariability?.coefficient_of_variation}%
                    </Grid>
                  </Grid>
                  <Grid item xs={5} className="vertical-line">
                    <Grid item xs={12} className="label">
                      SD
                    </Grid>
                    <Grid item xs={12} className="label">
                      mg/dL
                    </Grid>
                    <Grid item xs={12} className="data-value-small">
                      {glucoseVariability?.standard_deviation}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4} style={{ paddingLeft: "1%" }}>
            <Grid item xs={12} className="info-widget">
              <Grid container>
                <Grid
                  item
                  xs={12}
                  className="header-container"
                  style={{ paddingTop: "10px" }}
                >
                  Data Sufficiency
                </Grid>
                <Grid item xs={12} className="label">
                  % Time CGM
                </Grid>
                <Grid item xs={12} className="label">
                  Active
                </Grid>
                <Grid
                  item
                  xs={12}
                  className="data-value-small"
                  style={{ paddingBottom: "10px" }}
                >
                  {glucoseVariability?.cgm_active_percentage}%
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GlucoseVariability;
