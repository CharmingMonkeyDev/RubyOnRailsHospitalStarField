import * as React from "react";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, ChatContext } from "../Context";

interface Props {
  showChat: boolean;
  setShowChat: Function;
}

export const useChat = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const {
    showChatList,
    setShowChatList,
    setChatWindowControllers,
    setActiveChatGroup,
    patientId
  } = React.useContext(ChatContext);

  const [fetchedChannelId, setFetchedChannelId] = React.useState<string>("");

  React.useEffect(() => {
    getChatInfo();
  }, []);

  React.useEffect(() => {
    if (props.showChat) {
      fetchedChannelId ? handleChatShow() : handleChatCreation();
    }
  }, [props.showChat]);

  React.useEffect(() => {
    props.setShowChat(showChatList);
  }, [showChatList]);

  const getChatInfo = () => {
    if (patientId) {
      fetch(`/data_fetching/chats/get_channel_between/${patientId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.message);
          } else {
            setFetchedChannelId(result?.resource?.channel_id);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleChatShow = () => {
    if (fetchedChannelId) {
      setChatWindowControllers({
        show: true,
        channel_id: fetchedChannelId,
      });
    }
    setActiveChatGroup("patient");
    setShowChatList(!showChatList);
  };

  const handleChatCreation = () => {
    if (patientId) {
      fetch(`/chats`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          user_id: patientId,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.message);
          } else {
            setChatWindowControllers({
              show: true,
              channel_id: result?.resource?.id,
            });
            setActiveChatGroup("patient");
            setShowChatList(!showChatList);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
};
