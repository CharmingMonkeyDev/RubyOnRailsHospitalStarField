import React, { FC } from "react";
import { Grid, InputLabel, Button } from "@mui/material";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

interface Props {
  questionnaireAssignment: any;
  setSubStatus: any;
  setUserId: any;
}

const QuestionnaireDobValidation: FC<Props> = (props: any) => {
  const [dob, setDob] = React.useState<any>(new Date());

  const handleDateChange = (date) => {
    setDob(date);
  };

  const validateDob = () => {
    fetch(`/questionnaire_submissions_validate_dob`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "X-Frame-Options": "sameorigin",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Content-Security-Policy": "default-src 'self'",
      },
      body: JSON.stringify({
        validate_dob: {
          questionnaire_assignment_id: props.questionnaireAssignment.id,
          dob: dob,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            props.setUserId(result?.resource?.user_id);
            props.setSubStatus("submission");
          } else {
            alert("Something is wrong date of birth cannot be validated");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container>
      <Grid item xs={12} className="q-sub-form-header">
        Validate Date of Birth
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
        <Grid container className="fum-form-container">
          <Grid item xs={12}>
            <InputLabel htmlFor="next-date" className="fum-field-label">
              Enter a Date of Birth
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="field-container">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                autoOk={true}
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                className="next-date"
                value={dob}
                style={{
                  width: "100%",
                }}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid container item xs={12}>
            <Button
              className="orange-btn"
              onClick={validateDob}
              style={{
                height: "40px",
                paddingLeft: "16px",
                paddingRight: "16px",
                width: "100%",
              }}
            >
              Validate
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QuestionnaireDobValidation;
