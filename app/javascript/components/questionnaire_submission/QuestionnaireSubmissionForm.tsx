import React, { FC, useEffect, useState } from "react";
import { Grid, Button } from "@mui/material";

// components capture
import ConsentCaptureSub from "./question_components/ConsentCaptureSub";
import MultipleChoiceSub from "./question_components/MultipleChoiceSub";
import ShortAnswerSub from "./question_components/ShortAnswerSub";
import SignatureCaptureSub from "./question_components/SignatureCaptureSub";
interface Props {
  questionnaireAssignment: any;
  setSubStatus: any;
  userId: string;
  submitText?: string;
  setCurrentStep?: any;
  fromTablet?: boolean;
  submitTrigger?: boolean;
  resetSubmitTrigger?: () => void;
}

const QuestionnaireSubmissionForm: FC<Props> = (props: any) => {
  const [questions, setQuestions] = useState<any>([]);
  const [submitting, setSubmitting] = useState(false);
  const [signatureImg, setSignatureImg] = useState("");

  //   inital data fetching
  useEffect(() => {
    getQuestions();
  }, [props.questionnaireAssignment]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const confirmationMessage =
        "Are you sure you want to leave? Your changes may not be saved.";

      if (!window.confirm(confirmationMessage)) {
        e.preventDefault();
        return false;
      }
    };

    const handlePopstate = (e) => {
      if (e.type === "popstate") {
        handleBeforeUnload(e);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const getQuestions = () => {
    fetch(
      `/questionnaire_submissions_assets/${props.questionnaireAssignment?.questionnaire_id}`,
      {
        method: "GET",
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            setQuestions(result.resource.questions);
          } else {
            alert("Something is wrong, cannot fetch questionnaire");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleQuestionAnswer = (questionObj, index) => {
    let tempQuestions = [...questions];
    tempQuestions[index] = questionObj;
    setQuestions(tempQuestions);
  };

  const questionnaireSubmissionAttributes = () => {
    let body = {
      questionnaire_submission: {
        questionnaire_assignment_id: props.questionnaireAssignment?.id,
        user_id: props.userId,
        answers_attributes: questions.map((question) => {
          if (
            question.type === "true_false" ||
            question.type === "multiple_choice"
          ) {
            return {
              multiple_choice_answers_attributes: question.answer
                .slice(",")
                .map((id) => {
                  return { option_id: id };
                }),
              question_id: question.id,
            };
          } else {
            return {
              answer_text: question.answer,
              question_id: question.id,
              accepted: question.accepted,
            };
          }
        }),
      },
    };

    if (signatureImg) {
      body["signature"] = signatureImg;
    }

    return body;
  };

  const submitAnswers = () => {
    setSubmitting(true);
    const body = questionnaireSubmissionAttributes();

    fetch(`/questionnaire_submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((result) => result.json())
      .then((result) => {
        setSubmitting(false);
        if (result.success === false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            props.setSubStatus("thankYou");
            props?.setCurrentStep((currentStep) => currentStep + 1);
          } else {
            alert("Something is wrong, cannot fetch questionnaire");
          }
        }
      })
      .catch((error) => {
        setSubmitting(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (props.submitTrigger) {
      submitAnswers();
      props.resetSubmitTrigger();
    }
  }, [props.submitTrigger]);

  useEffect(() => {
    // Scroll to the top of the page whenever a new form is loaded
    window.scrollTo(0, 0);
  }, [props.questionnaireAssignment]);
  return (
    <Grid container>
      {!props.fromTablet && (
        <React.Fragment>
          <Grid item xs={12} className="q-sub-form-header">
            Answer Question(s) Below
          </Grid>
          <Grid item xs={12} md={12}>
            <div className="divider-orange" style={{ margin: "0px" }}></div>
          </Grid>
        </React.Fragment>
      )}
      <Grid item xs={12} className="q-submission-container">
        {questions.map((question, index) => (
          <div key={index}>
            {question.type == "consent_capture" && (
              <ConsentCaptureSub
                question={question}
                index={index}
                handleQuestionAnswer={handleQuestionAnswer}
                formId={props.questionnaireAssignment?.id}
              />
            )}

            {question.type == "signature_capture" && (
              <SignatureCaptureSub
                question={question}
                index={index}
                setSignatureImg={setSignatureImg}
                formId={props.questionnaireAssignment?.id}
              />
            )}
            {(question.type == "multiple_choice" ||
              question.type == "true_false") && (
              <MultipleChoiceSub
                question={question}
                index={index}
                handleQuestionAnswer={handleQuestionAnswer}
                formId={props.questionnaireAssignment?.id}
              />
            )}
            {question.type == "short_answer" && (
              <ShortAnswerSub
                question={question}
                index={index}
                handleQuestionAnswer={handleQuestionAnswer}
                formId={props.questionnaireAssignment?.id}
              />
            )}
            <div
              className="divider-grey"
              style={{ marginTop: "15px", marginBottom: "10px" }}
            ></div>
          </div>
        ))}
        <Grid container item xs={12}>
          <Button
            className="orange-btn"
            onClick={submitAnswers}
            style={{
              height: "40px",
              paddingLeft: "16px",
              paddingRight: "16px",
              width: "100%",
            }}
            disabled={submitting}
          >
            {props.submitText ?? "Submit Answers"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QuestionnaireSubmissionForm;