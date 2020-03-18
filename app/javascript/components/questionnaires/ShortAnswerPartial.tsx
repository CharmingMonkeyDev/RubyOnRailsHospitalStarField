import * as React from "react";
import { Grid, TextField } from "@mui/material";

interface Props {}

const ShortAnswerPartial: React.FC<Props> = (props: any) => {
  return (
    <Grid container>
      <TextField
        id="short_answer"
        size="small"
        name="title"
        value=""
        className="answer-field"
        variant="outlined"
        disabled
        minRows={4}
        label="Short answer text"
      />
    </Grid>
  );
};

export default ShortAnswerPartial;
