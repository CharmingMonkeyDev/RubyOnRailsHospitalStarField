// import * as React from "react";
import React, { FC } from "react";
import { Modal as CloseModal } from "./Modal";

interface Props {
  modalOpen: boolean;
  setModalOpen: any;
  objectName: string;
  redirectUrl?: string;
  onConfirmation?: Function;
}

const UnsavedDataConfirmation: FC<Props> = (props: Props) => {
  const handleConfirm = () => {
    if (props.redirectUrl) {
      window.location.href = props.redirectUrl;
    } else {
      props.onConfirmation();
    }
  };

  return (
    <>
      <CloseModal
        successModalOpen={props.modalOpen}
        setSuccessModalOpen={props.setModalOpen}
        successHeader={`Close ${props.objectName}?`}
        successContent={
          "Are you sure you want to close? There are some unsaved changes."
        }
        successCallback={handleConfirm}
        closeCallback={() => props.setModalOpen(false)}
        confirmButtonText="Confirm"
      />
    </>
  );
};

export default UnsavedDataConfirmation;
