// import * as React from "react";
import React, { FC, useState, useEffect } from "react";
import { Grid, Link, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

// components
import QuestionnaireSelection from "./QuestionnaireSelection";

// hooks
import { useCustomerPermission } from "../hooks/useCustomerPermission";

interface Props {
  patient_id: string;
  modalOpen: boolean;
  setModalOpen: any;
  setRenderingKey: any;
}

const QuestionnaireTypeSelection: FC<Props> = (props: Props) => {
  //option are manual, and sending
  const [assignmentType, setAssignmentType] = useState<string>("sending");
  const [nextModalOpen, setNextModalOpen] = useState<boolean>(false);
  const smsPermitted = useCustomerPermission(
    "Allow questionnaires to be assigned to patients by SMS text"
  );

  React.useEffect(() => {
    if (smsPermitted == false) {
      setAssignmentType("manual");
    }
  }, [smsPermitted]);

  const handleOptionSelection = () => {
    setNextModalOpen(true);
  };

  return (
    <Modal open={props.modalOpen} className="follow-up-modal">
      <div className="paper" style={{ width: "475px", padding: "0px" }}>
        <QuestionnaireSelection
          patient_id={props.patient_id}
          modalOpen={nextModalOpen}
          setModalOpen={setNextModalOpen}
          setRenderingKey={props.setRenderingKey}
          assignmentType={assignmentType}
          setAssignmentSelectionModalOpen={props.setModalOpen}
        />
        <div className="paperInner" style={{ padding: "0px" }}>
          <Grid container className="fum-header-container">
            <Grid item xs={10}>
              <h1 className="fum-header">Assign Questionnaire</h1>
            </Grid>
            <Grid
              item
              xs={2}
              className="fum-close-icon-container"
              style={{ paddingRight: "20px" }}
            >
              <Link
                onClick={() => props.setModalOpen(false)}
                style={{ color: "black" }}
              >
                <CloseIcon />
              </Link>
            </Grid>
          </Grid>
          <div className="divider-orange" style={{ margin: "0px" }}></div>

          <Grid item xs={12} style={{ textAlign: "center", padding: "25px" }}>
            Select an option below to proceed
          </Grid>

          <Grid container className="fum-form-container">
            <Grid item xs={12} className="q-selection-container">
              {smsPermitted ? (
                <div
                  className={`q-selection-card ${
                    assignmentType == "sending" && "q-selection-card--active"
                  }`}
                  onClick={() => setAssignmentType("sending")}
                >
                  <div>
                    <MobileFriendlyIcon fontSize="large" />
                  </div>
                  <div>Send to patient via SMS</div>
                </div>
              ) : (
                <div className="q-selection-card q-selection-card--disabled">
                  <div>
                    <MobileFriendlyIcon fontSize="large" />
                  </div>
                  <div>Send to patient via SMS</div>
                </div>
              )}
              <div
                className={`q-selection-card ${
                  assignmentType == "manual" && "q-selection-card--active"
                }`}
                onClick={() => setAssignmentType("manual")}
              >
                <div>
                  <NoteAddIcon fontSize="large" />
                </div>
                <div>Manual Entry by provider</div>
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ padding: "30px" }}
          >
            <Grid
              item
              xs={4}
              className="cancel-link-container"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Link
                className="cancel-link"
                onClick={() => props.setModalOpen(false)}
              >
                Cancel
              </Link>
            </Grid>
            <Grid item xs={4} className="confirm-btn-container">
              <Link
                onClick={handleOptionSelection}
                className="confirm-btn"
                style={{ width: "135px" }}
              >
                Continue
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionnaireTypeSelection;
