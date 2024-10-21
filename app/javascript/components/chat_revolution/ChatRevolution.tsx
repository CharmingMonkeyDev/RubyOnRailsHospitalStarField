/* eslint-disable prettier/prettier */
import * as React from "react";
import ChatList from "./ChatList";
import { AuthenticationContext, ChatContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import { StreamChat } from "stream-chat";

interface Props {
  user_id: string;
  nav_chat_icon: string;
  chat_rev_icon: string;
  chat_rev_icon_new_msgs: string;
}

const ChatRevolution: React.FC<Props> = (props: any) => {
  const { showChatList, setShowChatList } = React.useContext(ChatContext);
  const { unreadMessages, setUnreadMessages } = React.useContext(ChatContext);
  const [chatViewed, setChatViewed] = React.useState<boolean>(false);
  const [chatUserToken, setChatUserToken] = React.useState<string>();
  const [streamApiKey, setStreamApiKey] = React.useState<string>();
  const [uuid, setUuid] = React.useState<string>();
  const [name, setName] = React.useState<string>();

  const authenticationSetting = React.useContext(AuthenticationContext);
  const userRole = authenticationSetting.userRole;
  const handleChatToggle = () => {
    setShowChatList(!showChatList);
    setChatViewed(true);
  };

  const getToken = () => {
    fetch(`/data_fetching/chats/get_token`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setStreamApiKey(result?.resource.stream_api_key);
          setUuid(result?.resource.uuid);
          setName(result?.resource.name);
          setChatUserToken(result?.resource.user_token);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUnreadMessages = () => {
    if (chatUserToken) {
      const chatClient = StreamChat.getInstance(streamApiKey);
      chatClient.disconnectUser();
      const res = chatClient.connectUser(
        {
          id: uuid,
          name: name,
        },
        chatUserToken
      );
      res.then((res: any) => {
        setUnreadMessages(res?.me?.total_unread_count > 0);
      });
    }
  };

  React.useEffect(() => {
    getToken();
  }, []);

  React.useEffect(() => {
    if (showChatList == false) {
      getUnreadMessages();
    }
  }, [showChatList]);

  React.useEffect(() => {
    getUnreadMessages();
  }, [chatUserToken]);

  return (
    <div className="chat-container">
      {userRole != "patient" && (
        <div className="chat-button-container">
          <a onClick={handleChatToggle}>
            {unreadMessages ? (
              <img
                src={props.chat_rev_icon_new_msgs}
                alt="chat_icon"
                id="chat-rev"
              />
            ) : (
              <img src={props.chat_rev_icon} alt="chat_icon" id="chat-rev" />
            )}
          </a>
        </div>
      )}
      {showChatList && (
        <ChatList user_id={props.user_id} setShowChatList={setShowChatList} />
      )}
    </div>
  );
};

export default ChatRevolution;
