import * as React from "react";
import { Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface Props {}

const Preferences: React.FC<Props> = (props: any) => {
  return (
    <div style={{ marginTop: "90px" }}>
      <div
        style={{
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          width: 320,
        }}
      >
        <div
          style={{
            marginLeft: 10,
            font: "22px QuicksandMedium",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Preferences
        </div>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={6}>
            <RouterLink
              to="/immunization-preferences"
              style={{
                cursor: "pointer",
                border: "1px solid #efe9e7",
                textAlign: "center",
                borderRadius: 6,
                display: "block",
                backgroundColor: "#ffffff",
                margin: 10,
                padding: 10,
                marginBottom: 18,
                boxShadow: "1px 1px 1px 1px #efefef",
              }}
            >
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/vaccine_grey.png"
                width="90"
                alt="Track"
              />
            </RouterLink>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Preferences;
