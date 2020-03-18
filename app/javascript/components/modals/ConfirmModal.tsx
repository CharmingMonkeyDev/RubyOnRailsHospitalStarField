import { Grid, Link, Modal } from "@mui/material";
import * as React from "react";
import GeneralModal from "./GeneralModal";

interface Props {
  open: boolean;
  setOpen: Function;
  header: string;
  content: string;
  onConfirm: Function;
}

const ConfirmModal: React.FC<Props> = (props) => {
  return (
    <>
      <GeneralModal
      open={props.open}
      title={"Warning"}
      successCallback={props.onConfirm}
      closeCallback={() => props.setOpen(false)}
      fullWidth={true}
      containerClassName="unsaved-changes-modal-container"
      width=""
      confirmButtonText="Confirm"
    >
      <p className="content"> Are you sure you want to delete this insurance item? </p>
    </GeneralModal>
    </>
  );
};

export default ConfirmModal;
