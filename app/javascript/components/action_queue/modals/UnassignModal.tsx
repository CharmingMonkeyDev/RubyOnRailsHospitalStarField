import React from "react";
import Modal from "../../modals/Modal";

interface Props {
  setSuccessModalOpen: Function;
  successModalOpen: boolean;
  successCallback: Function;
  closeCallback: Function;
}

const UnassignModal: React.FC<Props> = (props: Props) => {
  const {
    setSuccessModalOpen,
    successCallback,
    successModalOpen,
    closeCallback,
  } = props;

  const modalContent = (
    <div className="modal-content">
      <p className="align-center">
        You are attempting to un-assign this action. <br /> Would you like to
        continue?
      </p>
    </div>
  );

  return (
    <Modal
      successModalOpen={successModalOpen}
      setSuccessModalOpen={setSuccessModalOpen}
      successHeader={"Un-assign Action"}
      successContent={modalContent}
      successCallback={successCallback}
      closeCallback={closeCallback}
      confirmButtonText="Un-assign & Proceed"
    />
  );
};

export default UnassignModal;
