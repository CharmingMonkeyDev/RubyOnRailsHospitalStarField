/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

// library import, additional library added for getStream chat API
import * as React from "react";
import { Grid, Link } from "@mui/material";
import {
  Chat as StreamChatComponent,
  Channel,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import CloseIcon from "@mui/icons-material/Close";

// component import
import AddToChatModal from "./AddToChatModal";

// app setting import
import { AuthenticationContext, ChatContext } from "../Context";

// helper
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  channel_id: string;
}

const ChatWindow: React.FC<Props> = (props: any) => {
  // the context is set on App.tsx, please refere there for data structure
  // also authentication controller
  const { activeChatGroup, chatWindowControllers, setChatWindowControllers } =
    React.useContext(ChatContext);
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [chatParams, setChatParams] = React.useState<any>({});

  React.useEffect(() => {
    getChatParams();
  }, [props.channel_id, chatWindowControllers]);

  const handleChatHide = () => {
    setChatWindowControllers({
      show: false,
      channel_id: null,
    });
  };

  const getChannelInitals = (names) => {
    if (names) {
      let array_names = names.split(",").map((item) => item.trim());
      let first_letters_array = array_names.map(([item]) => item);
      let first_letters = first_letters_array.join("");
      return first_letters.toUpperCase().substring(0, 2);
    }
  };

  const getChatParams = () => {
    fetch(`/data_fetching/chats/initialize_chat`, {
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
          console.log(result?.resource);
          setChatParams(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (typeof chatParams?.user_token != "undefined") {
    const chatClient = StreamChat.getInstance(chatParams?.get_stream_api_key);
    chatClient.connectUser(
      {
        id: chatParams?.current_channel_user?.uuid,
        name: chatParams?.curren_channel_user?.name,
      },
      chatParams?.user_token
    );

    let channel = chatClient.channel("messaging", chatParams.uniq_channel_id, {
      name: chatParams?.chat_channel_name,
      members: chatParams?.users_in_channel,
    });
    channel.watch();

    if (chatClient) {
      return (
        <div className="chat-window-container">
          <Grid
            container
            className={`chat-title-container ${
              activeChatGroup == "colleague" ? "black-title" : "orange-title"
            }`}
          >
            {activeChatGroup == "colleague" ? (
              <Grid item xs={1}>
                <span className="chat-initials chat-initals-colleagues">
                  {getChannelInitals(chatParams?.chat_channel_name)}
                </span>
              </Grid>
            ) : (
              <Grid item xs={1}>
                <span className="chat-initials chat-initals-patients">
                  {getChannelInitals(chatParams?.chat_channel_name)}
                </span>
              </Grid>
            )}

            <Grid item xs={10} className="chat-title">
              {chatParams?.chat_channel_name}
            </Grid>
            <Grid item xs={1} className="chat-windown-action-container">
              <Link className="close-link" onClick={handleChatHide}>
                <CloseIcon />
              </Link>
            </Grid>
          </Grid>
          <div className="chat-stream-container">
            <StreamChatComponent client={chatClient} theme="messaging light">
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </StreamChatComponent>
          </div>

          <AddToChatModal channel_id={props.channel_id} />
        </div>
      );
    }
  } else {
    return (
      <div className="chat-window-container">
        <LoadingIndicator />;
      </div>
    );
  }
};

export default ChatWindow;
