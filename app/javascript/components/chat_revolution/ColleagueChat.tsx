/* eslint-disable prettier/prettier */

// library import
import * as React from "react";
import { Grid, TextField, Link } from "@mui/material";

// component imports
import NewChat from "./NewChat";
import ArchiveChat from "./ArchiveChat";

// app setting import
import { AuthenticationContext, ChatContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  channelWithColleague: any;
  activateChat: any;
  add_new_user_to_chat_icon: string;
  handleChatChange: any;
  chat_flip_c_to_p_icon: string;
  userRole: string;
}

const ColleagueChat: React.FC<Props> = (props: any) => {
  // controlling overall chat flow
  const { setChatWindowControllers } = React.useContext(ChatContext);
  const authenticationSetting = React.useContext(AuthenticationContext);

  // states
  const [finalChannelWithColleague, setFinalChannelWithColleague] =
    React.useState<any>([]);
  const [searchKey, setSearchKey] = React.useState<string>("");
  const [showAddUserForm, setShowAddUserForm] = React.useState<boolean>(false);
  const [userList, setUserList] = React.useState<any>([]);

  React.useEffect(() => {
    getUsersWithoutChannel();
  }, []);

  React.useEffect(() => {
    applyFilter();
  }, [searchKey, props.channelWithColleague]);

  const getUsersWithoutChannel = () => {
    fetch(`/data_fetching/chats/get_users_without_channel?role_type=provider`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setUserList(result.resource?.userList);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openAddUserForm = () => {
    setShowAddUserForm(true);
  };

  const getChannelInitals = (names) => {
    if (names) {
      let array_names = names.split(",").map((item) => item.trim());
      let first_letters_array = array_names.map(([item]) => item);
      let first_letters = first_letters_array.join("");
      return first_letters.toUpperCase().substring(0, 2);
    }
  };

  const saveMethod = (user_id) => {
    fetch(`/chats`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        user_id: user_id,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setChatWindowControllers({
            show: true,
            channel_id: result.resource?.id,
          });
          setShowAddUserForm(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const applyFilter = () => {
    if (searchKey != "") {
      let channelsWithMatchingName = props.channelWithColleague.filter(
        (channel) =>
          channel.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
      );
      setFinalChannelWithColleague(channelsWithMatchingName);
    } else {
      setFinalChannelWithColleague(props.channelWithColleague);
    }
  };

  return (
    <>
      {showAddUserForm && props.userRole != "patient" ? (
        <NewChat
          userList={userList}
          saveMethod={saveMethod}
          setShowAddUserForm={setShowAddUserForm}
          userType="Colleague"
        />
      ) : (
        <>
          <Grid container className="chat-window-header">
            <Grid item xs={11}>
              Message Center
            </Grid>
            <Grid item xs={1}>
              {props.userRole != "patient" && (
                <Link onClick={props.handleChatChange}>
                  <img
                    src={props.chat_flip_c_to_p_icon}
                    alt="chat_flip"
                    title="Switch to Patients"
                  />
                </Link>
              )}
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} className="search-container">
              <TextField
                id="search"
                label="Search Conversations"
                value={searchKey}
                onChange={(event) => {
                  setSearchKey(event.target.value);
                }}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <div className="big-chat-container">
            <Grid container className="colleague-header-container">
              <Grid item xs={11}>
                {props.userRole == "patient"
                  ? "My Conversations"
                  : "My Colleagues"}
              </Grid>
              <Grid item xs={1}>
                {props.userRole != "patient" && (
                  <Link
                    onClick={openAddUserForm}
                    className="new-icon-container"
                  >
                    <img src={props.add_new_user_to_chat_icon} alt="new_chat" />
                  </Link>
                )}
              </Grid>
            </Grid>
            <div className="chat-list">
              {finalChannelWithColleague &&
                finalChannelWithColleague.map((channel) => {
                  return (
                    <div key={channel.id} className="single-chat-elem">
                      <Grid container className="single-chat-container">
                        <Grid item xs={1}>
                          <span className={`chat-initials  ${channel?.unread_count  > 0 ? 'chat-initals-colleagues-unread' : 'chat-initals-colleagues'}`}>
                            <span className="chat-initals-letters">
                              {getChannelInitals(channel.name)}
                            </span>
                          </span>
                        </Grid>
                        <Grid
                          item
                          className="channel-name"
                          xs={10}
                          onClick={() => props.activateChat(channel.id)}
                        >
                          <div>{channel.clean_name}</div>
                          <div
                            style={{
                              fontSize: "12px",
                              marginTop: "5px",
                            }}
                          >
                            {channel.customers}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {props.userRole != "patient" && (
                            <ArchiveChat
                              channel_id={channel.id}
                              channel_type="colleague"
                            />
                          )}
                        </Grid>
                      </Grid>
                    </div>
                  );
                })}
              <div className="ending-space"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ColleagueChat;
