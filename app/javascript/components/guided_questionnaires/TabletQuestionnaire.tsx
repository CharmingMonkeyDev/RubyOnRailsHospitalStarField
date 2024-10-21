import React, { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import IdleCheckModal from "../modals/IdleCheck";

// components
import QuestionnaireSubmissionForm from "../questionnaire_submission/QuestionnaireSubmissionForm";

interface Props {
  questionnaire_assignments: Array<any>;
  csrfToken: string;
  logo_src: string;
  user_id: string;
  qrId: string;
}

const TabletQuestionnaire: FC<Props> = (props: any) => {
  const [subStatus, setSubStatus] = useState<string>("submission");
  const [userId, _] = useState<string>(props.user_id);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [questionnaireAssignment, setQuestionnaireAssignment] = useState<any>(
    props.questionnaire_assignments[0]
  );
  const [questionnaireAssignments, setQuestionnaireAssignments] = useState<any>(
    props.questionnaire_assignments
  );
  const [submitTrigger, setSubmitTrigger] = useState(false);

  useEffect(() => {
    if (currentStep <= questionnaireAssignments.length) {
      setQuestionnaireAssignment(questionnaireAssignments[currentStep]);
    }
  }, [currentStep, questionnaireAssignment]);

  useEffect(() => {
    if (subStatus == "thankYou") {
      fetch(`/expired_qr?id=${props.qrId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": props.csrfToken,
        },
      })

      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500)
    }
  }, [subStatus]);

  const handleTimerExpire = () => {
    sessionStorage.clear();
    setSubmitTrigger((prev) => !prev);
    window.location.href = "/expired_qr?id=" + props.qrId;
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ backgroundColor: "white", minHeight: "120vh" }}
    >
      {subStatus != "thankYou" && <IdleCheckModal onExpire={handleTimerExpire} />}
      <img
        src={props.logo_src}
        alt="startfield-logo-icon"
        className="action-icon-image w-100"
        style={{
          marginTop: "2rem",
        }}
      />

      {questionnaireAssignments.length >= currentStep + 1 && (
        <Grid
          item
          xs={12}
          md={12}
          className="text-center"
          style={{ padding: "2em 0px" }}
        >
          {`${questionnaireAssignment?.questionnaire_name} (${
            currentStep + 1
          }/${questionnaireAssignments.length})`}
        </Grid>
      )}

      {questionnaireAssignments.length < currentStep + 1 && (
        <Grid
          item
          xs={12}
          md={12}
          className="text-center"
          style={{ padding: "2em 0px", fontWeight: "bold"}}
        >
          Response Received
        </Grid>
      )}

      <Grid item xs={12} md={12}>
        <div className="divider-orange" style={{ margin: "0px" }}></div>
      </Grid>

      {questionnaireAssignments.length >= currentStep + 1 && (
        <Grid
          item
          xs={12}
          className="q-sub-form-header"
          style={{ paddingTop: "1em" }}
        >
          Please enter the information below.
        </Grid>
      )}

      {subStatus == "thankYou" &&
        questionnaireAssignments.length < currentStep + 1 && (
          <ThankYouContent>
            <Grid
              item
              xs={12}
              className="q-submission-container text-center"
              style={{ height: "90vh", lineHeight: "1.7" }}
            >
              Your response has been recorded. Your provider will review your
              <br />
              results soon. Please return this tablet to the reception desk.
              <p>Thank you.</p>
            </Grid>
          </ThankYouContent>
        )}

      <Grid
        item
        xs={12}
        md={4}
        style={{
          background: "white",
          minHeight: "120vh",
        }}
      >
        {questionnaireAssignments.length >= currentStep + 1 && (
          <QuestionnaireSubmissionForm
            questionnaireAssignment={questionnaireAssignment}
            setSubStatus={setSubStatus}
            setCurrentStep={setCurrentStep}
            userId={userId}
            submitTrigger={submitTrigger} //triggers a submit
            resetSubmitTrigger={() => setSubmitTrigger(false)}
            submitText={"Submit Answers and Continue"}
            fromTablet={true}
          />
        )}
      </Grid>
    </Grid>
  );
};

const ThankYouContent = ({children}) => {
  sessionStorage.clear();
  window.scrollTo(0, 0);
  return (
    <>{children}</>
  )
}

export default TabletQuestionnaire;