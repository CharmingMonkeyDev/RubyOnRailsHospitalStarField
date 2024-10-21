import React, { FC, useEffect, useState } from "react";
import { Grid, TextField, Checkbox } from "@mui/material";

interface Props {
  question: any;
  index: number;
  handleQuestionAnswer: any;
  formId: number;
}

const ConsentCaptureSub: FC<Props> = (props: any) => {
  const [consent, setConsent] = useState<boolean>(false);
  const [consentText, setConsentText] = useState<string>("");

  useEffect(() => {
    let tempQ = props.question;
    tempQ["answer"] = consentText;
    tempQ["accepted"] = consent;
    props.handleQuestionAnswer(props.index, tempQ);
  }, [consent, consentText]);

  useEffect(() => {
    setConsent(false);
    setConsentText("");
  }, [props.formId]);

  // handlers
  const handleConsentChange = () => {
    setConsent(!consent);
  };
  return (
    <Grid container>
      <Grid item xs={12} className="q-submission-title">
        {props.question.title}
      </Grid>
      <Grid item xs={12}>
        <p style={{ lineHeight: "1.7" }}>
          By signing your name electronically on this form you are agreeing that
          your electronic signature is the legal equivalent of your manual
          signature.
        </p>
      </Grid>
      <Grid item xs={12}>
        <Checkbox
          size="medium"
          checked={consent}
          onChange={handleConsentChange}
        />
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
          value={consentText}
          className="answer-field"
          variant="outlined"
          minRows={4}
          label="Enter Full Name"
          onChange={(event) => {
            setConsentText(event.target.value);
          }}
          style={{ marginTop: "10px" }}
        />
      </Grid>
    </Grid>
  );
};

export default ConsentCaptureSub;