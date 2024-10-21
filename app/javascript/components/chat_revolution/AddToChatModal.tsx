/* eslint-disable prettier/prettier */

// library import
import * as React from "react";
import { Modal, Grid, TextField, MenuItem, Link } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// app setting import
import { AuthenticationContext, ChatContext } from "../Context";

// helpers
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  channel_id: string;
}

const AddToChatModal: React.FC<Props> = (props: any) => {
  // adding context to control chats and authentication setting
  const { activeChatGroup, setChatWindowControllers } =
    React.useContext(ChatContext);
  const authenticationSetting = React.useContext(AuthenticationContext);

  //states
  const [open, setOpen] = React.useState<boolean>(false);
  const [providers, setProviders] = React.useState<any>([]);
  const [selectedProviderId, setSelectedProviderId] = React.useState<any>(null);

  React.useEffect(() => {
    getProvidersList();
  }, []);

  const getProvidersList = () => {
    fetch(
      `/data_fetching/get_providers_chat_new?channel_id=${props.channel_id}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setProviders(result?.resource?.provider_users);
          if (result?.resource?.provider_users?.length > 0) {
            setSelectedProviderId(result?.resource?.provider_users[0]?.id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChatAdd = () => {
    fetch(`/data_fetching/chats/add_to_chat`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        channel_id: props.channel_id,
        selected_user_id: selectedProviderId,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setChatWindowControllers({
            show: true,
            channel_id: props.channel_id,
          });
          handleClose();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <Grid container justifyContent="flex-end" className="button-container">
        <Grid item xs={4} className="actions">
          <button
            type="button"
            onClick={handleOpen}
            className={`button ${
              activeChatGroup == "colleague" ? "black-btn" : "orange-btn"
            }`}
          >
            <AddIcon
              style={{
                fontSize: 15,
                display: "inline-block",
                cursor: "pointer",
                marginRight: "3px",
                position: "relative",
                top: "2px",
              }}
            />
            Add to Chat
          </button>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="new-to-chat">
          <Grid container justifyContent="center">
            <Grid item xs={12} className="form-header">
              Add New Collegue to Chat
            </Grid>
          </Grid>
          <Grid item xs={10} className="search-container">
            <TextField
              id="add_colleague to chat"
              value={selectedProviderId}
              onChange={(event) => {
                setSelectedProviderId(event.target.value);
              }}
              variant="outlined"
              size="small"
              fullWidth
              select
            >
              {providers.map((provider) => {
                return (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid container item xs={10} className="modal-button-container">
            <Grid item xs={6} className="action">
              <Link onClick={handleClose} className="link">
                Cancel
              </Link>
            </Grid>
            <Grid item xs={6} className="action">
              <Link onClick={handleChatAdd} className="button">
                Select
              </Link>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
};

export default AddToChatModal;
