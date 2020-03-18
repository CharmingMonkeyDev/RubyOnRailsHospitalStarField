/* eslint-disable prettier/prettier */
// library import
import * as React from "react";
import { Modal, Grid, Link } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";

// app setting import
import { AuthenticationContext, ChatContext } from "../Context";

// helpers
import { getHeaders } from "../utils/HeaderHelper";
interface Props {
  channel_id: string;
  channel_type: string;
}

const ArchiveChat: React.FC<Props> = (props: any) => {
  // controlling overall chat flow and authentication
  const { setChatWindowControllers } = React.useContext(ChatContext);
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChatArchive = () => {
    fetch(`/data_fetching/chats/archive_chat`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        channel_id: props.channel_id,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setChatWindowControllers({ show: false, channel_id: null });
          handleClose();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Link
        onClick={handleOpen}
        className={
          props.channel_type == "patient"
            ? "archive-icon-patient"
            : "archive-icon"
        }
      >
        <ArchiveIcon />
      </Link>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="archive-chat"
          aria-describedby="archive-chat"
        >
          <div className="new-to-chat archive-window">
            <Grid container justifyContent="center">
              <Grid item xs={12} className="form-header">
                Are you sure you want to archive the conversation?
              </Grid>
            </Grid>
            <Grid item xs={10} className="search-container"></Grid>
            <Grid container item xs={10} className="modal-button-container">
              <Grid item xs={6} className="action">
                <Link onClick={handleClose} className="link">
                  No
                </Link>
              </Grid>
              <Grid item xs={6} className="action">
                <Link onClick={handleChatArchive} className="button">
                  Yes
                </Link>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ArchiveChat;
