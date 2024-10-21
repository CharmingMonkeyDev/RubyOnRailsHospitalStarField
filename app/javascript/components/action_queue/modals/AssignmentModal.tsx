import React from "react";
import Modal from "../../modals/Modal";
import { TextField } from "@mui/material";

interface Props {
  setSuccessModalOpen: Function;
  selectedCoachId: string;
  successModalOpen: boolean;
  setSelectedCoachId: Function;
  coachListOptions: JSX.Element[];
  successCallback: Function;
  closeCallback: Function;
}

const AssignmentModal: React.FC<Props> = (props: Props) => {
  const {
    setSuccessModalOpen,
    selectedCoachId,
    setSelectedCoachId,
    coachListOptions,
    successCallback,
    successModalOpen,
    closeCallback,
  } = props;

  const modalContent = (
    <div className="modal-content">
      <p>Assign this action to:</p>
      <TextField
        size="small"
        id="Coach"
        value={selectedCoachId}
        className="input"
        variant="outlined"
        label="Select"
        onChange={(event) => {
          setSelectedCoachId(event.target.value);
        }}
        select
      >
        {coachListOptions}
      </TextField>
    </div>
  );

  return (
    <Modal
      successModalOpen={successModalOpen}
      setSuccessModalOpen={setSuccessModalOpen}
      successHeader={"Assign this Action to a Provider"}
      successContent={modalContent}
      successCallback={successCallback}
      closeCallback={closeCallback}
    />
  );
};

export default AssignmentModal;
