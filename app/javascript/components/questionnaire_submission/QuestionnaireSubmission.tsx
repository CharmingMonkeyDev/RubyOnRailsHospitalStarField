import React, { FC, useState, useEffect } from "react";
import { Grid } from "@mui/material";

// components
import QuestionnaireSubmissionForm from "./QuestionnaireSubmissionForm";
import QuestionnaireThankYou from "./QuestionnaireThankYou";
import QuestionnaireDobValidation from "./QuestionnaireDobValidation";

interface Props {
  questionnaireAssignment: any;
  csrfToken: string;
  user_id: string;
  redirect?: string | null;
}

const QuestionnaireSubmission: FC<Props> = (props: any) => {
  //  submissionform has 3 statuses, validation, submission and thankYou

  const getInitalSubStatus = () => {
    if (
      props.QuestionnaireAssignment.assignment_type == "manual" &&
      props.user_id
    ) {
      return "submission";
    } else {
      return "validation";
    }
  };
  const [subStatus, setSubStatus] = useState<string>(getInitalSubStatus());
  const [userId, setUserId] = useState<string>(props.user_id);
  const [subMsg, setSubMsg] = useState<string>(
    "Your response has been recorded. Thank you!"
  );

  useEffect(() => {
    if (props.QuestionnaireAssignment.assignment_type == "manual") {
      setSubMsg(
        "Your response has been recorded. You can review the questionnaire from the patient health profile. Thank you!"
      );
    }
  }, [props.questionnaireAssignment]);

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid
        item
        xs={12}
        md={3}
        style={{
          background: "white",
        }}
      >
        {subStatus == "validation" && (
          <QuestionnaireDobValidation
            questionnaireAssignment={props.QuestionnaireAssignment}
            setSubStatus={setSubStatus}
            setUserId={setUserId}
          />
        )}
        {subStatus == "submission" && (
          <QuestionnaireSubmissionForm
            questionnaireAssignment={props.QuestionnaireAssignment}
            setSubStatus={setSubStatus}
            userId={userId}
          />
        )}

        {subStatus == "thankYou" && <QuestionnaireThankYou msg={subMsg} redirect={props.redirect} />}
      </Grid>
    </Grid>
  );
};

export default QuestionnaireSubmission;
