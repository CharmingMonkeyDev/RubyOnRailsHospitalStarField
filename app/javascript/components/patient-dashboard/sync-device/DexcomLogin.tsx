/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link } from "@mui/material";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {
  setError: any;
  disabledButton: any;
  setDisabledButton: any;
  patient_id: number;
  csrfToken: string;
  dexcomUrl: string;
}

const DexcomLogin: React.FC<Props> = (props: any) => {
  const authenticateUser = () => {
    fetch(`/synced_accounts`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        user_id: props.patient_id,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          console.log(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="pageHeading"
          >
            <Grid item xs={2} className="centerText">
              &nbsp;
            </Grid>
            <Grid item xs={8} className="pageTitle">
              <span>Login to Dexcom</span>
              <p>
                Provide credentials for your Dexcom account in order to share
                your glucose monitoring data with Starfield.
              </p>
            </Grid>
            <Grid item xs={2}>
              &nbsp;
            </Grid>
          </Grid>

          <div className="deviceForm2">
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={12} className="centerButton">
                {!props.disabledButton ? (
                  <Link className="syncButton" href={props.dexcomUrl}>
                    Sync With Dexcom
                  </Link>
                ) : (
                  <>Saving...</>
                )}
              </Grid>
              <Grid item xs={12} className="centerButton">
                <Link
                  className="clearButtonStyling"
                  href="/?menu=false"
                  style={{
                    font: "14px QuicksandMedium",
                    color: "#313133",
                    textDecoration: "underline",
                    marginTop: 20,
                    display: "inline-block",
                  }}
                >
                  Cancel
                </Link>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default DexcomLogin;
