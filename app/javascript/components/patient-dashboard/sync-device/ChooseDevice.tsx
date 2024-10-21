/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link, Select, MenuItem } from "@mui/material";
import globals from "../../globals/globals";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {
  setError: any;
  disabledButton: any;
  setDisabledButton: any;
  device: string;
  setSelectedDevice: any;
  setShowSyncDevice: any;
  setShowDexcomLogin: any;
  selectedDevice: any;
  setDexcomUrl: any;
}

const ChooseDevice: React.FC<Props> = (props: any) => {
  const deviceOptions = globals.devices.map((device) => {
    return (
      <MenuItem key={device} value={device}>
        {device}
      </MenuItem>
    );
  });

  const handleContinue = () => {
    if (props.selectedDevice !== "") {
      fetch(`/get_oauth_url`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success === false) {
            console.log(result.message);
          } else {
            console.log(result);
            props.setDexcomUrl(result.resource);
            props.setShowSyncDevice(false);
            props.setShowDexcomLogin(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
              <span>Choose Your Device</span>
            </Grid>
            <Grid item xs={2}>
              &nbsp;
            </Grid>
          </Grid>

          <div className="deviceForm">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={1}>
                <img src={props.device} alt="Device" />
              </Grid>
              <Grid item xs={11}>
                <Select
                  className="textInput"
                  variant="outlined"
                  value={props.selectedDevice}
                  onChange={(event) =>
                    props.setSelectedDevice(event.target.value)
                  }
                  style={{ width: "100%" }}
                >
                  {deviceOptions}
                </Select>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={6} className="centerButton">
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
              <Grid item xs={6} className="centerButton">
                {!props.disabledButton ? (
                  <Link
                    className="basicButton"
                    onClick={handleContinue}
                    style={{
                      width: "auto",
                    }}
                  >
                    Continue
                  </Link>
                ) : (
                  <>Saving...</>
                )}
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ChooseDevice;
