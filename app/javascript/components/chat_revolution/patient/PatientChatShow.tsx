/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

// library import, additional library added for getStream chat API
import * as React from "react";
import { Grid } from "@mui/material";
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

// app setting import
import { AuthenticationContext } from "../../Context";
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {
  channel_id: string;
  setChannelId: any;
}

const PatientChatShow: React.FC<Props> = (props: any) => {
  // the context is set on App.tsx, please refere there for data structure
  // also authentication controller
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [chatParams, setChatParams] = React.useState<any>({});

  React.useEffect(() => {
    getChatParams();
  }, [props.channel_id]);

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
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="patient-page-heading"
          >
            <Grid
              onClick={() => props.setChannelId("")}
              item
              xs={2}
              className="center-text"
            >
              <p className="patient-back-botton" style={{ color: "#4A4442" }}>
                &lt;
              </p>
            </Grid>
            <Grid
              item
              xs={8}
              className="patient-page-title"
              style={{
                textAlign: "center",
              }}
            >
              <span>{chatParams?.chat_channel_name}</span>
            </Grid>
          </Grid>
          <div className="patient-chat-show">
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
        </div>
      );
    }
  } else {
    return (
      <div className="chat-window-container">
        <LoadingIndicator /> Loading...
      </div>
    );
  }
};

export default PatientChatShow;
