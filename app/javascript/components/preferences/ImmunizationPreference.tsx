import * as React from "react";
import { Link, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface Props {}

const ImmunizationPreference: React.FC<Props> = (props: any) => {
  return (
    <div style={{ marginTop: "90px" }}>
      <div
        style={{
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          width: "400px",
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          className="page-heading"
        >
          <Grid item xs={2} className="center-text">
            <RouterLink
              to="/preferences"
              className="back-button"
              style={{ color: "#4A4442" }}
            >
              &lt;
            </RouterLink>
          </Grid>
          <Grid item xs={8} className="page-title">
            <span>Immunization Info</span>
          </Grid>
          <Grid item xs={2}>
            &nbsp;
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            xs={12}
            style={{
              padding: "16px",
              lineHeight: "1.5",
            }}
          >
            Starfield receives immunization information from NDIIS. If you would
            like to opt out of sharing your immunization information with the
            providers at Starfield, click the button below.
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link
              href="https://www.hhs.nd.gov/immunizations/ndiis"
              target="_blank"
              style={{
                borderRadius: "4px",
                border: "2px solid  #F00",
                width: "100%",
                padding: "10px",
                textAlign: "center",
                color: "#F00",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <span>Opt out of Immunization Sharing</span>
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/btn_syringe_icon.svg"
                alt="syringe-icon"
                style={{ display: "inline-block", paddingLeft: "10px" }}
              />
            </Link>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ImmunizationPreference;
