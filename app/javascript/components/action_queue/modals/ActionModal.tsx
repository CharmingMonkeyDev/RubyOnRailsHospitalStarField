import React from "react";
import Modal from "../../modals/Modal";
import { TextField } from "@mui/material";
import { actionMenuOptions } from "../QueueHelper";

interface Props {
  setSuccessModalOpen: Function;
  successModalOpen: boolean;
  successCallback: Function;
  setSelectedModalAction: Function;
  closeCallback: Function;
}

const ActionModal: React.FC<Props> = (props: Props) => {
  const {
    setSuccessModalOpen,
    successCallback,
    successModalOpen,
    setSelectedModalAction,
    closeCallback,
  } = props;

  const [modalAction, setModalAction] = React.useState<string>("");

  const modalContent = (
    <div className="modal-content">
      <p>Choose an action status:</p>
      <TextField
        size="small"
        id="GroupActions"
        value={modalAction}
        className="input"
        placeholder="Select"
        variant="outlined"
        label="Select"
        onChange={(event) => {
          setModalAction(event.target.value);
        }}
        select
      >
        {actionMenuOptions}
      </TextField>
    </div>
  );

  const successCallbackWithModalAction = async () => {
    setSelectedModalAction(modalAction);

    await successCallback();
  };

  return (
    <Modal
      successModalOpen={successModalOpen}
      setSuccessModalOpen={setSuccessModalOpen}
      successHeader={"Action Menu"}
      successContent={modalContent}
      successCallback={successCallbackWithModalAction}
      closeCallback={closeCallback}
    />
  );
};

export default ActionModal;
