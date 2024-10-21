import * as React from "react";
import { Grid, TextField, Checkbox, Radio, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  index: number;
  options: any;
  updateOptions: any;
  type: string;
  readOnly: boolean;
  question: any;
  setHasUnsavedChanges: any;
  onQuestionDataChange: Function;
}

const MultipleChoicePartial: React.FC<Props> = (props: any) => {
  // structure of options [{id:, :title, :order}]
  const newOption = { title: "" };
  const [options, setOptions] = React.useState<any>([...props.options]);

  const handleAddOption = () => {
    setOptions([...options, newOption]);
    props.setHasUnsavedChanges(true);
    props.onQuestionDataChange();
  };

  const handleOptionChange = (index, event) => {
    const key = event.target.name;
    const value = event.target.value;
    let tempQuestions = [...options];
    tempQuestions[index][key] = value;
    setOptions(tempQuestions);
    props.setHasUnsavedChanges(true);
    props.onQuestionDataChange();
  };

  React.useEffect(() => {
    if (options.length >= 0) {
      props.updateOptions(props.index, options);
    }
  }, [options]);

  React.useEffect(() => {
    setOptions(props.question.options);
  }, [props.question]);

  const handleRemoveOption = (index) => {
    let tempOptions = [...options];
    if (tempOptions[index].id) {
      tempOptions[index]._destroy = true;
    } else {
      tempOptions.splice(index, 1);
    }

    setOptions(tempOptions);
    props.setHasUnsavedChanges(true);
    props.onQuestionDataChange();
  };
  return (
    <Grid container>
      {options.length > 0 && (
        <Grid item xs={12}>
          {options.map(
            (option, index) =>
              !option._destroy && (
                <Grid item container xs={12} key={index}>
                  <Grid
                    item
                    xs={1}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {props.type == "multiple_choice" && (
                      <Checkbox
                        checked={false}
                        inputProps={{ "aria-label": "Self" }}
                        style={{ paddingLeft: "0px" }}
                        disabled
                      />
                    )}
                    {props.type == "true_false" && (
                      <Radio
                        checked={false}
                        inputProps={{ "aria-label": "Self" }}
                        style={{ paddingLeft: "0px" }}
                        disabled
                      />
                    )}
                  </Grid>
                  <Grid item xs={10}>
                    <TextField
                      id="title"
                      size="small"
                      name="title"
                      value={option.title}
                      className="question-title-field"
                      variant="outlined"
                      onChange={(event) => {
                        handleOptionChange(index, event);
                      }}
                      disabled={props.readOnly}
                    />
                  </Grid>
                  {!props.readOnly && (
                    <Grid style={{ display: "flex", alignItems: "center" }}>
                      <Link
                        onClick={() => {
                          handleRemoveOption(index);
                        }}
                      >
                        <DeleteIcon
                          style={{
                            fontSize: 30,
                            color: "#c1b7b3",
                            cursor: "pointer",
                            paddingLeft: "10px",
                          }}
                        />
                      </Link>
                    </Grid>
                  )}
                </Grid>
              )
          )}
        </Grid>
      )}
      <Grid item xs={12}>
        {!props.readOnly && (
          <Link
            onClick={handleAddOption}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png"
              width="20"
              alt="Add Resource"
              style={{ padding: "5px" }}
            />
            Add Option
          </Link>
        )}
      </Grid>
    </Grid>
  );
};

export default MultipleChoicePartial;
