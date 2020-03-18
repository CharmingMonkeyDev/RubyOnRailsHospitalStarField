import React from "react";
import Modal from "../../modals/Modal";

interface Props {
  setSuccessModalOpen: Function;
  successModalOpen: boolean;
  successCallback: Function;
  closeCallback: Function;
}

const CompleteModal: React.FC<Props> = (props: Props) => {
  const {
    setSuccessModalOpen,
    successCallback,
    successModalOpen,
    closeCallback,
  } = props;

  const modalContent = (
    <div className="modal-content">
      <p className="align-center">
        You are attempting to complete this patient&apos;s action. <br /> Would
        you like to continue?
      </p>
    </div>
  );

  return (
    <Modal
      successModalOpen={successModalOpen}
      setSuccessModalOpen={setSuccessModalOpen}
      successHeader={"Complete Action"}
      successContent={modalContent}
      successCallback={successCallback}
      closeCallback={closeCallback}
      confirmButtonText="Complete & Proceed"
    />
  );
};

export default CompleteModal;
