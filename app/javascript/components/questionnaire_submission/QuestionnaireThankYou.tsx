import React, { FC } from "react";
import { Grid, Button } from "@mui/material";

interface Props {
  msg: string;
  redirect?: string | null;
}

const QuestionnaireThankYou: FC<Props> = (props: any) => {
  const redirect = () => {
    if (props.redirect) {
      window.location.href = props.redirect;
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} className="q-sub-form-header">
        Response Received
      </Grid>
      <Grid item xs={12}>
        <div className="divider-orange" style={{ margin: "0px" }}></div>
      </Grid>
      <Grid
        item
        xs={12}
        className="q-submission-container"
        style={{ height: "90vh", lineHeight: "1.7" }}
      >
        {props.msg}

        <Grid justifyContent="center" style={{paddingTop: "16px", display: 'flex'}} alignContent="center">
          {props.redirect && (
            <Button
            variant="contained" 
            className="orange-btn"
            onClick={redirect}
            >
              OK
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QuestionnaireThankYou;
