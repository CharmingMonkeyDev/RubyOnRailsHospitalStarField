import * as React from "react";
import { Grid, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";

// components
import NewBoardMessage from "../modals/NewBoardMessage";
import BoardMessageDeleteConfirm from "../modals/BoardMessageDeleteConfirm";

// settings
import { AuthenticationContext, ImagesContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import { formatToUsDateFromUTC } from "../utils/DateHelper";

interface Props {}

const MessageBoard: React.FC<Props> = (props: any) => {
  //  auth context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const images = React.useContext(ImagesContext);

  // other states
  const [messages, setMessages] = React.useState<any>([]);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [renderKey, setRenderingKey] = React.useState<number>(Math.random());

  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const [deleteMessageId, setDeleteMessageId] = React.useState<string>("");

  React.useEffect(() => {
    getBoardMessages();
  }, [renderKey]);

  const getBoardMessages = () => {
    fetch(`/board_messages`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        console.log(result);
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            setMessages(result?.resource?.board_messages);
          } else {
            alert("Something is wrong board messages cannot be fetched");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewMessageClick = () => {
    setModalOpen(true);
  };

  const handleDeleteClick = (messageId) => {
    setDeleteMessageId(messageId);
  };

  React.useEffect(() => {
    if (deleteMessageId) {
      setDeleteModalOpen(true);
    }
  }, [deleteMessageId]);

  React.useEffect(() => {
    if (deleteModalOpen == false) {
      setDeleteMessageId(null);
    }
  }, [deleteModalOpen]);
  return (
    <Grid
      container
      style={{
        backgroundColor: "white",
        borderRadius: "5px",
        paddingBottom: "16px",
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        item
        xs={12}
        style={{ padding: "16px" }}
      >
        <Grid
          item
          xs={6}
          className="vertical-center"
          style={{ fontSize: "21px" }}
        >
          Message Board
        </Grid>
        <Grid item xs={6}>
          <Link
            onClick={handleNewMessageClick}
            className="vertical-center"
            style={{ justifyContent: "flex-end" }}
            underline="none"
          >
            <img
              src={images.menu_track_src}
              width="30"
              alt="Create new message"
            />
            <span
              style={{
                color: "grey",
                display: "inline-block",
                paddingLeft: "10px",
                textDecoration: "none",
              }}
            >
              Add Message
            </span>
          </Link>
        </Grid>
      </Grid>
      <div
        className="divider-orange"
        style={{ margin: "0px", width: "100%" }}
      ></div>

      <Grid
        container
        style={{
          paddingLeft: "16px",
          paddingRight: "16px",
          borderBottom: "1px solid #EFE9E7",
        }}
      >
        <Grid item xs={6} className="pb-10 pt-10 vertical-center">
          Provider
        </Grid>
        <Grid item xs={5} className="pb-10 pt-10 vertical-center">
          Date
        </Grid>
      </Grid>
      <div style={{ maxHeight: "400px", overflow: "scroll" }}>
        {messages.map((message) => {
          return (
            <Grid
              container
              key={message.id}
              style={{
                paddingLeft: "16px",
                paddingRight: "16px",
                borderBottom: "1px solid #EFE9E7",
                marginTop: "10px",
              }}
            >
              <Grid item xs={6} className="pb-10 pt-10 vertical-center">
                {message?.user?.name_reversed}
              </Grid>
              <Grid item xs={5} className="pb-10 pt-10 vertical-center font-12">
                {formatToUsDateFromUTC(message.created_at)}
              </Grid>
              <Grid item xs={1} className="vertical-center">
                <DeleteIcon
                  style={{
                    fontSize: 20,
                    color: "#c1b7b3",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleDeleteClick(message.id);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="ql-message-container">
                <ReactQuill
                  value={message.message}
                  readOnly={true}
                  modules={{
                    clipboard: {
                      matchVisual: false,
                    },
                    toolbar: false,
                  }}
                />
              </Grid>
            </Grid>
          );
        })}
      </div>

      <NewBoardMessage
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setRenderingKey={setRenderingKey}
      />

      <BoardMessageDeleteConfirm
        boardMessageId={deleteMessageId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        setRenderingKey={setRenderingKey}
      />
    </Grid>
  );
};

export default MessageBoard;
