import * as React from "react";
import { Link, Grid, TextField, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// components
import ShortAnswerPartial from "./ShortAnswerPartial";
import ConsentCapturePartial from "./ConsentCapturePartial";
import MultipleChoicePartial from "./MultipleChoicePartial";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import NotesIcon from "@mui/icons-material/Notes";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import GestureIcon from "@mui/icons-material/Gesture";
import SignatureCapturePartial from "./SignatureCapturePartial";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

// helper
import { snakeCaseToTitleCase } from "../utils/CaseFormatHelper";

interface Props {
  newField: any;
  questions: any;
  setQuestions: any;
  readOnly: boolean;
  setHasUnsavedChanges: any;
  onQuestionDataChange: Function;
}

const FormPanel: React.FC<Props> = (props: any) => {
  // dont change the types here,
  const questionTypes = [
    "multiple_choice",
    "true_false",
    "short_answer",
    "consent_capture",
    "signature_capture",
  ];
  //helper functions
  const updateQuestionProps = (newQuestionsOrder) => {
    props.setQuestions(newQuestionsOrder);
    if (!compareObjects(props.questions, newQuestionsOrder)) {
      props.setHasUnsavedChanges(true);
      props.onQuestionDataChange();
    }
  };

  const compareObjects = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];

      if (obj1.type !== obj2.type || obj1.title !== obj2.title) {
        return false;
      }

      if (obj1.options.length !== obj2.options.length) {
        return false;
      }

      for (let j = 0; j < obj1.options.length; j++) {
        if (obj1.options[j].title !== obj2.options[j].title) {
          return false;
        }
      }
    }

    return true;
  };

  //   handlers
  const handleAddQuestion = () => {
    updateQuestionProps([...props.questions, props.newField]);
  };

  const handleDeleteAction = (index) => {
    const tempQuestions = [...props.questions];
    if (tempQuestions[index].id) {
      tempQuestions[index]._destroy = true;
    } else {
      tempQuestions.splice(index, 1);
    }
    updateQuestionProps(tempQuestions);
  };

  const handleFormChange = (index, event) => {
    const key = event.target.name;
    const value = event.target.value;
    let tempQuestions = [...props.questions];
    tempQuestions[index][key] = value;
    updateQuestionProps(tempQuestions);
  };

  const updateOptions = (index, options) => {
    let tempQuestions = [...props.questions];
    const prevOptions = tempQuestions[index]["options"];
    tempQuestions[index]["options"] = options;
    updateQuestionProps(tempQuestions);
  };

  // dropdwon icons
  const getDropdownIcon = (type) => {
    switch (type) {
      case "short_answer":
        return <NotesIcon />;
      case "multiple_choice":
        return <CheckBoxIcon />;
      case "true_false":
        return <RadioButtonCheckedIcon />;
      case "consent_capture":
        return <BorderColorIcon />;
      case "signature_capture":
        return <GestureIcon />;
    }
  };

  //handleQuestion postion change
  const handleMoveUp = (index) => {
    const tempQuestions = [...props.questions];
    const position = props.questions[index].position;

    [tempQuestions[index - 1].position, tempQuestions[index].position] = [
      position,
      position - 1,
    ];

    updateQuestionProps(tempQuestions);
    props.setHasUnsavedChanges(true);
    props.onQuestionDataChange();
  };
  const handleMoveDown = (index) => {
    const tempQuestions = [...props.questions];
    const position = props.questions[index].position;

    [tempQuestions[index + 1].position, tempQuestions[index].position] = [
      position,
      position + 1,
    ];

    updateQuestionProps(tempQuestions);
    props.setHasUnsavedChanges(true);
    props.onQuestionDataChange();
  };

  const getQuestionTypeName = (name) => {
    switch (name) {
      case "multiple_choice":
        return "Multiple Choice";
      case "true_false":
        return "Single Choice";
      default:
        return snakeCaseToTitleCase(name);
    }
  };
  return (
    <Grid container className="form-panel-container">
      <Grid item xs={12}>
        {props.questions
          ?.sort((a, b) => a.position - b.position)
          .map(
            (question, index) =>
              !question._destroy && (
                <div
                  key={index}
                  className="question-container"
                  style={{ padding: "10px" }}
                >
                  <Grid container>
                    <Grid item container xs={11} spacing={1}>
                      <Grid item xs={8}>
                        <TextField
                          id="title"
                          size="small"
                          name="title"
                          value={question.title}
                          className="question-title-field"
                          variant="outlined"
                          onChange={(event) => {
                            handleFormChange(index, event);
                          }}
                          disabled={props.readOnly}
                          inputProps={{
                            style: {
                              height: "28px",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          id="type"
                          name="type"
                          size="small"
                          value={question.type}
                          variant="outlined"
                          onChange={(event) => {
                            handleFormChange(index, event);
                            props.onQuestionDataChange();
                          }}
                          select
                          style={{ width: "100%", marginLeft: 0 }}
                          disabled={props.readOnly}
                        >
                          {questionTypes.map((item, index) => (
                            <MenuItem key={index} value={item}>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <span style={{ marginRight: "2px" }}>
                                  {getDropdownIcon(item)}
                                </span>
                                {getQuestionTypeName(item)}
                              </span>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        {question.type == "short_answer" && (
                          <ShortAnswerPartial />
                        )}
                        {question.type == "consent_capture" && (
                          <ConsentCapturePartial />
                        )}
                        {question.type == "multiple_choice" && (
                          <MultipleChoicePartial
                            index={index}
                            options={question.options}
                            updateOptions={updateOptions}
                            type="multiple_choice"
                            readOnly={props.readOnly}
                            question={question}
                            setHasUnsavedChanges={props.setHasUnsavedChanges}
                            onQuestionDataChange={props.onQuestionDataChange}
                          />
                        )}
                        {question.type == "true_false" && (
                          <MultipleChoicePartial
                            index={index}
                            options={question.options}
                            updateOptions={updateOptions}
                            type="true_false"
                            readOnly={props.readOnly}
                            question={question}
                            setHasUnsavedChanges={props.setHasUnsavedChanges}
                            onQuestionDataChange={props.onQuestionDataChange}
                          />
                        )}
                        {question.type == "signature_capture" && (
                          <SignatureCapturePartial published={props.readOnly} />
                        )}
                      </Grid>
                      <Grid item xs={12} container justifyContent="flex-end">
                        {!props.readOnly && (
                          <Link
                            onClick={() => handleDeleteAction(index)}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            Delete Question
                            <DeleteIcon
                              style={{
                                fontSize: 30,
                                color: "#c1b7b3",
                                display: "inline-block",
                                cursor: "pointer",
                              }}
                            />
                          </Link>
                        )}
                      </Grid>
                    </Grid>
                    {!props.readOnly && (
                      <Grid item xs={1} style={{ paddingLeft: "15px" }}>
                        <div>
                          {index === 0 ? (
                            <Link>
                              <ArrowDropUpIcon
                                className="grey-font"
                                fontSize="large"
                              />
                            </Link>
                          ) : (
                            <Link
                              onClick={() => {
                                handleMoveUp(index);
                              }}
                            >
                              <ArrowDropUpIcon
                                className="expand-icon"
                                fontSize="large"
                              />
                            </Link>
                          )}
                        </div>
                        <div>
                          {index === [...props.questions]?.length - 1 ? (
                            <Link>
                              <ArrowDropDownIcon
                                fontSize="large"
                                className="grey-font"
                              />
                            </Link>
                          ) : (
                            <Link
                              onClick={() => {
                                handleMoveDown(index);
                              }}
                            >
                              <ArrowDropDownIcon
                                className="expand-icon"
                                fontSize="large"
                              />
                            </Link>
                          )}
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </div>
              )
          )}
      </Grid>
      {!props.readOnly && (
        <Grid item xs={12}>
          <Link
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevents navigation trigger
              handleAddQuestion();
            }}
          >
            <span>
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png"
                width="40"
                alt="Invite New Patient"
              />
            </span>
            <span className="font-21px grey-font ml-10">Add Question</span>
          </Link>
        </Grid>
      )}
    </Grid>
  );
};

export default FormPanel;
