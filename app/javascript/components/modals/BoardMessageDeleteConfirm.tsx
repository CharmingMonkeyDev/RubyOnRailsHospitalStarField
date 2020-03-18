import * as React from "react";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";
import Modal from "./Modal";

interface Props {
  boardMessageId: string;
  modalOpen: boolean;
  setModalOpen: any;
  setRenderingKey?: any;
}

const BoardMessageDeleteConfirm: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  const deleteMessage = () => {
    fetch(`/board_messages/${props.boardMessageId}`, {
      method: "DELETE",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          flashContext.setMessage({
            text: "Message successfully deleted",
            type: "success",
          });
          props.setModalOpen(false);
          props.setRenderingKey(Math.random());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Modal
      successModalOpen={props.modalOpen}
      setSuccessModalOpen={() => props.setModalOpen(false)}
      successHeader={`Delete Message?`}
      successContent={
        "You are attempting to delete this message from the message board. This action cannot be undone. Would you like to continue?"
      }
      successCallback={deleteMessage}
      closeCallback={() => props.setModalOpen(false)}
      confirmButtonText="Continue"
    />
  );
};

export default BoardMessageDeleteConfirm;
