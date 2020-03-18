import * as React from "react";
import { Grid } from "@mui/material";
import { Stack } from "@mui/system";

const ExpiredQr: React.FC<any> = (props) => {
  return (
    <Grid container style={{ backgroundColor: "white" }}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ width: "100%" }}
      >
        <img src={props.logo_src} alt={"Logo"} style={{ margin: "3rem" }} />
      </Stack>
      <Grid item xs={12} className="q-sub-form-header">
        Expired QR Code!
      </Grid><Grid item xs={12}>
        <div className="divider-orange" style={{ margin: "0px" }}></div>
      </Grid>
      <Grid
        item
        xs={12}
        className="message-container text-center"
        style={{ height: "90vh", lineHeight: "1.7" }}
      >
        We apologize for the inconvenience, but this QR code has expired. For assistance, please return this device to create a new QR code.
        <p>Thank you.</p>
      </Grid>
    </Grid>
  );
};

export default ExpiredQr;