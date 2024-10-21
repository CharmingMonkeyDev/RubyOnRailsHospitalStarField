import React from "react";
import Modal from "../../modals/Modal";

interface Props {
  setSuccessModalOpen: Function;
  successModalOpen: boolean;
  successCallback: Function;
  closeCallback: Function;
}

const IncompleteModal: React.FC<Props> = (props: Props) => {
  const {
    setSuccessModalOpen,
    successCallback,
    successModalOpen,
    closeCallback,
  } = props;

  const modalContent = (
    <div className="modal-content">
      <p className="align-center">
        You are attempting to mark this patient&apos;s action as incomplete.{" "}
        <br /> Would you like to continue?
      </p>
    </div>
  );

  return (
    <Modal
      successModalOpen={successModalOpen}
      setSuccessModalOpen={setSuccessModalOpen}
      successHeader={"Incomplete Action"}
      successContent={modalContent}
      successCallback={successCallback}
      closeCallback={closeCallback}
      confirmButtonText="Mark as Incomplete & Proceed"
      buttonWidth="unset"
    />
  );
};

export default IncompleteModal;
