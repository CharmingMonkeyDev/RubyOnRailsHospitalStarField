import React, { FC, useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";

interface Props {
  question: any;
  index: number;
  handleQuestionAnswer: any;
  formId: number;
}

const ShortAnswerSub: FC<Props> = (props: any) => {
  const [shortAnswer, setShortAnswer] = useState<string>("");
  useEffect(() => {
    let tempQ = props.question;
    tempQ["answer"] = shortAnswer;
    props.handleQuestionAnswer(props.index, tempQ);
  }, [shortAnswer]);

  useEffect(() => {
    setShortAnswer("");
  }, [props.formId]);

  return (
    <Grid container>
      <Grid item xs={12} className="q-submission-title">
        {props.question.title}
      </Grid>
      <TextField
        id="short_answer"
        label="Answer"
        size="small"
        name="title"
        value={shortAnswer}
        className="answer-field"
        variant="outlined"
        minRows={4}
        multiline
        onChange={(event) => {
          setShortAnswer(event.target.value);
        }}
      />
    </Grid>
  );
};

export default ShortAnswerSub;