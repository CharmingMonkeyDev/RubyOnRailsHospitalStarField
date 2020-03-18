import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";
import ReactQuill from "react-quill";
import CloseIcon from "@mui/icons-material/Close";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";
import GeneralModal from "./GeneralModal";

interface Props {
  modalOpen: boolean;
  setModalOpen: any;
  setRenderingKey: any;
}

const NewBoardMessage: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [message, setMessage] = React.useState<string>("");
  const flashContext = React.useContext(FlashContext);

  const saveNote = () => {
    if (message.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      flashContext.setMessage({ text: "Note cannot be empty", type: "error" });
    } else {
      fetch(`/board_messages`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          board_message: {
            message: message,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            if (result?.resource) {
              // reseting states and closing modal
              props.setRenderingKey(Math.random());
              props.setModalOpen(false);
              setMessage("");
              flashContext.setMessage({
                text: "Message saved",
                type: "success",
              });
            } else {
              alert("Something is wrong and note cannot be saved");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <GeneralModal
      open={props.modalOpen}
      title={"New Message"}
      successCallback={saveNote}
      closeCallback={() => props.setModalOpen(false)}
      confirmButtonText="Create Message"
    >
      <Grid container className="fum-form-container">
        <Grid item xs={12}>
          <p>Enter a message to be displayed to your team</p>
        </Grid>
        <Grid item xs={12}>
          <ReactQuill
            theme="snow"
            value={message}
            onChange={(value) => setMessage(value)}
            modules={{
              clipboard: {
                matchVisual: false,
              },
            }}
          />
        </Grid>
      </Grid>
    </GeneralModal>
  );
};

export default NewBoardMessage;
