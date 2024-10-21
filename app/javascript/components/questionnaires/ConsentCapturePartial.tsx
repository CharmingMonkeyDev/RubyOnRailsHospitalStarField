import * as React from "react";
import { Grid, TextField, Checkbox } from "@mui/material";

interface Props {}

const ConsentCapturePartial: React.FC<Props> = (props: any) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <p>
          By signing your name electronically on this form you are agreeing that
          your electronic signature is the legal equivalent of your manual
          signature.
        </p>
      </Grid>
      <Grid item xs={12}>
        <Checkbox size="medium" checked={false} disabled />
        <span className="loginTextCentered">
          By checking this box you agree to the terms noted in the above
          statement.
        </span>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="short_answer"
          size="small"
          name="title"
          value=""
          className="answer-field"
          variant="outlined"
          disabled
          minRows={4}
          label="Enter Full Name"
        />
      </Grid>
    </Grid>
  );
};

export default ConsentCapturePartial;
