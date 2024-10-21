import React, { FC, useState, useEffect } from "react";
import { Grid, Checkbox, Radio } from "@mui/material";

interface Props {
  question: any;
  index: number;
  handleQuestionAnswer: any;
  formId: number;
}

const MultipleChoiceSub: FC<Props> = (props: any) => {
  // this will include title
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  const handleRadioSelect = (option) => {
    setSelectedOptions([option]); //saving as an arry because all the asnwers are array
  };

  const handleCheckBoxClick = (option) => {
    let tempSelectedOptions = [...selectedOptions];
    const indexToRemove = tempSelectedOptions.indexOf(option);
    if (indexToRemove !== -1) {
      tempSelectedOptions.splice(indexToRemove, 1);
    } else {
      tempSelectedOptions.push(option);
    }
    setSelectedOptions([...tempSelectedOptions]);
  };

  const checkSelected = (option) => {
    return selectedOptions.includes(option);
  };

  useEffect(() => {
    let tempQ = props.question;
    tempQ["answer"] = selectedOptions;
    props.handleQuestionAnswer(props.index, tempQ);
  }, [selectedOptions]);

  useEffect(() => {
    setSelectedOptions([]);
  }, [props.formId]);

  return (
    <Grid container>
      <Grid item xs={12} className="q-submission-title">
        {props.question.title}
      </Grid>
      {props.question.options.length > 0 && (
        <Grid item xs={12}>
          {props.question.options.map((option, index) => {
            return (
              <Grid item container xs={12} key={index}>
                <Grid item xs={1}>
                  {props.question.type == "multiple_choice" && (
                    <Checkbox
                      checked={checkSelected(option.id)}
                      inputProps={{ "aria-label": "Self" }}
                      style={{ paddingLeft: "0px" }}
                      onClick={() => handleCheckBoxClick(option.id)}
                    />
                  )}
                  {props.question.type == "true_false" && (
                    <Radio
                      checked={checkSelected(option.id)}
                      inputProps={{ "aria-label": "Self" }}
                      style={{ paddingLeft: "0px" }}
                      onClick={() => handleRadioSelect(option.id)}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={11}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                  }}
                >
                  {option.title}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Grid>
  );
};

export default MultipleChoiceSub;