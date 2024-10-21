/* eslint-disable prettier/prettier */

// library import
import * as React from "react";

// component imports
import ChatWindow from "./ChatWindow";
import ColleagueChat from "./ColleagueChat";
import PatientChat from "./PatientChat";

// app setting imports
import { AuthenticationContext, ChatContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  user_id: string;
  setShowChatList: any;
}

const Chatlist: React.FC<Props> = (props: any) => {
  // context import, for data structure of these context please check App.tsx
  const { chatWindowControllers, setChatWindowControllers } =
    React.useContext(ChatContext);
  const { activeChatGroup, setActiveChatGroup } = React.useContext(ChatContext);
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [channelWithColleague, setChannelWithColleague] = React.useState<any>(
    []
  );
  const [channelWithPatient, setChannelWithPatient] = React.useState<any>([]);
  const [assets, setAssets] = React.useState<any>({});
  const [userRole, setUserRole] = React.useState<string>("patient");

  React.useEffect(() => {
    getChatLists();
    getAssets();
    getCurrentuserRole();
  }, [chatWindowControllers]);

  const getChatLists = () => {
    fetch(`/data_fetching/chats`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setChannelWithColleague(result?.resource?.channel_with_colleagues);
          setChannelWithPatient(result?.resource?.channel_with_patients);
          console.log(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAssets = () => {
    fetch(`/data_fetching/chats/assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setAssets(result.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCurrentuserRole = () => {
    fetch(`/data_fetching/users/current_user_role`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setUserRole(result.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeChatWindow = () => {
    props.setShowChatList(false);
  };

  const handleChatChange = () => {
    if (activeChatGroup == "colleague") {
      setActiveChatGroup("patient");
      return;
    }

    if (activeChatGroup == "patient") {
      setActiveChatGroup("colleague");
      return;
    }
  };

  const activateChat = (channel_id) => {
    getChatLists();
    setChatWindowControllers({
      show: true,
      channel_id: channel_id,
    });
  };

  return (
    <div className="chat-list-container">
      <div className="chat-component-container">
        {activeChatGroup == "colleague" && (
          <ColleagueChat
            channelWithColleague={channelWithColleague}
            activateChat={activateChat}
            add_new_user_to_chat_icon={assets.add_new_user_to_chat_icon}
            handleChatChange={handleChatChange}
            chat_flip_c_to_p_icon={assets.chat_flip_c_to_p_icon}
            userRole={userRole}
          />
        )}

        {activeChatGroup == "patient" && userRole != "patient" && (
          <PatientChat
            channelWithPatient={channelWithPatient}
            activateChat={activateChat}
            add_new_user_to_chat_patient_icon={
              assets.add_new_user_to_chat_patient_icon
            }
            handleChatChange={handleChatChange}
            chat_flip_p_to_c_icon={assets.chat_flip_p_to_c_icon}
          />
        )}
      </div>
      <div className="action-container">
        <div className="close-action">
          <a onClick={closeChatWindow}>
            <img src={assets.chat_close_icon} alt="chat_close" />
          </a>
        </div>
      </div>
      {chatWindowControllers.show && (
        <ChatWindow channel_id={chatWindowControllers.channel_id} />
      )}
    </div>
  );
};

export default Chatlist;
