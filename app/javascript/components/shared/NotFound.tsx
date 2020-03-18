import * as React from "react";
import { Grid, Snackbar } from "@mui/material";
import { Alert } from '@mui/material';

interface Props {
  customMessage?: any;
}

const NotFound: React.FC<Props> = (props: any) => {
  return (
    <div className="resource-catalog">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className="container"
        style={{
          width: "calc(100% - 120px)",
          marginLeft: "100px",
          padding: 10,
          textAlign: "center",
          backgroundColor: "#FE890B",
          borderRadius: "5px",
          color: "white",
        }}
      >
        <Grid item xs={12}>
          <h2 style={{ lineHeight: 0.5 }}>404 Error: Page Not Found</h2>
          <p style={{ lineHeight: 0.5 }}>
            Sorry, the page you are looking for could not be found. Please go
            back to your <a href="/">dashboard</a>.
          </p>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFound;
