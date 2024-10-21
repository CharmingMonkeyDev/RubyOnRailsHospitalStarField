// library import
import * as React from "react";
import { Grid, TextField, Link } from "@mui/material";

// component import
import NewChat from "./NewChat";
import ArchiveChat from "./ArchiveChat";

// app setting import
import { AuthenticationContext, ChatContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  channelWithPatient: any;
  activateChat: any;
  add_new_user_to_chat_patient_icon: string;
  handleChatChange: any;
  chat_flip_p_to_c_icon: string;
}

const PatientChat: React.FC<Props> = (props: any) => {
  // adding context to control chats
  const { setChatWindowControllers } = React.useContext(ChatContext);
  const authenticationSetting = React.useContext(AuthenticationContext);

  const [finalChannelWithPatient, setFinalChannelWithPatient] =
    React.useState<any>([]);
  const [userList, setUserList] = React.useState<any>([]);
  const [searchKey, setSearchKey] = React.useState<string>("");
  const [showAddUserForm, setShowAddUserForm] = React.useState<boolean>(false);

  React.useEffect(() => {
    getUsersWithoutChannel();
  }, [showAddUserForm]);

  React.useEffect(() => {
    applyFilter();
  }, [searchKey, props.channelWithPatient]);

  const getUsersWithoutChannel = () => {
    fetch(`/data_fetching/chats/get_users_without_channel?role_type=patient`, {
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
      let channelsWithMatchingName = props.channelWithPatient.filter(
        (channel) =>
          channel.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
      );
      setFinalChannelWithPatient(channelsWithMatchingName);
    } else {
      setFinalChannelWithPatient(props.channelWithPatient);
    }
  };

  const getChannelInitals = (names) => {
    if (names) {
      let array_names = names.split(",").map((item) => item.trim());
      let first_letters_array = array_names.map(([item]) => item);
      let first_letters = first_letters_array.join("");
      return first_letters.toUpperCase().substring(0, 2);
    }
  };
  return (
    <>
      {showAddUserForm ? (
        <NewChat
          userList={userList}
          saveMethod={saveMethod}
          setShowAddUserForm={setShowAddUserForm}
          userType="Patient"
        />
      ) : (
        <>
          <Grid container className="chat-window-header">
            <Grid item xs={11}>
              Message Center
            </Grid>
            <Grid item xs={1}>
              <Link onClick={props.handleChatChange}>
                <img
                  src={props.chat_flip_p_to_c_icon}
                  alt="chat_flip"
                  title="Switch to Colleagues"
                />
              </Link>
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
            <Grid container className="patient-header-container">
              <Grid item xs={11}>
                My Patients
              </Grid>
              <Grid item xs={1}>
                <Link onClick={openAddUserForm} className="new-icon-container">
                  <img
                    src={props.add_new_user_to_chat_patient_icon}
                    alt="new_chat"
                  />
                </Link>
              </Grid>
            </Grid>
            <div className="chat-list">
              {finalChannelWithPatient &&
                finalChannelWithPatient.map((channel) => {
                  return (
                    <div key={channel.id} className="single-chat-elem">
                      <Grid container className="single-chat-container">
                        <Grid item xs={1}>
                          <div>
                            <span
                              className={`chat-initials  ${
                                channel?.unread_count > 0
                                  ? "chat-initals-colleagues-unread"
                                  : "chat-initals-colleagues"
                              }`}
                            >
                              <span className="chat-initals-letters">
                                {getChannelInitals(channel.name)}
                              </span>
                            </span>
                          </div>
                        </Grid>
                        <Grid
                          className="channel-name"
                          item
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
                            <span>{channel?.sex}</span>
                            {channel?.sex && ","}
                            <span>{channel?.age}</span>
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            {channel?.full_address}
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
                          <ArchiveChat
                            channel_id={channel.id}
                            channel_type="patient"
                          />
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

export default PatientChat;
