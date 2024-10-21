/* eslint-disable prettier/prettier */

// library imports
import * as React from "react";
import { Grid, Typography, Link } from "@mui/material";

// component imports
import CoreTeamCustomerAssociation from "./CoreTeamCustomerAssociation";

// helpers import
import { snakeCaseToTitleCase } from "../../utils/CaseFormatHelper";
import { checkPrivileges } from "../../utils/PrivilegesHelper";
import { getHeaders } from "../../utils/HeaderHelper";

// app setting import
import { ChatContext, AuthenticationContext } from "../../Context";
import { PrivilegesContext } from "../../PrivilegesContext";

interface Props {
  selectedProvider: any;
  chat_icon_with_orange_line: string;
  the_wall_icon_grey: string;
  pencil_grey: string;
  setShowEditForm: any;
  menu_track_src: any;
  setPrivilegesModalOpen: any;
  privilegesModalOpen: boolean;
  user_id: number;
}

const ProviderInformationSection = (label, value) => {
  return (
    <>
      <Typography variant="body1" className="info-label">
        {label}
      </Typography>
      <Typography variant="subtitle1" className="info-value">
        {value}
      </Typography>
    </>
  );
};

const ProviderShow: React.FC<Props> = (props: any) => {
  // app setting context
  const {
    showChatList,
    setShowChatList,
    setChatWindowControllers,
    setActiveChatGroup,
  } = React.useContext(ChatContext);
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [fetchedChannelId, setFetchedChannelId] = React.useState<string>("");
  const [provider, setPatient] = React.useState<any>(props.selectedProvider);
  const userPrivileges = React.useContext(PrivilegesContext);

  React.useEffect(() => {
    getUserInfo();
    getChatInfo();
  }, [props.selectedProvider]);

  const getUserInfo = () => {
    fetch(`/data_fetching/core_teams/${props.selectedProvider?.id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          setPatient(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getChatInfo = () => {
    fetch(
      `/data_fetching/chats/get_channel_between/${props.selectedProvider?.id}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setFetchedChannelId(result?.resource?.channel_id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleShowForm = () => {
    event.preventDefault();
    props.setShowEditForm(true);
  };

  const handleShowPrivileges = () => {
    event.preventDefault();
    props.setPrivilegesModalOpen(!props.privilegesModalOpen);
  };

  const handleChatShow = () => {
    if (fetchedChannelId) {
      setChatWindowControllers({
        show: true,
        channel_id: fetchedChannelId,
      });
    }
    setActiveChatGroup("colleague");
    setShowChatList(!showChatList);
  };

  const handleChatCreation = () => {
    if (props.selectedProvider) {
      fetch(`/chats`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          user_id: props.selectedProvider?.id,
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
            setActiveChatGroup("colleague");
            setShowChatList(!showChatList);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <Grid item xs={6} className="provider-show-container" sx={{marginLeft: "-10px"}}>
      <Grid container className="information-container">
        <Grid container direction="row" className="admin-header border-bottom">
          <Grid item xs={12} md={6}>
            <h3 className="header-label">Provider Information</h3>
          </Grid>
          <Grid item md={6}>
            <Grid container direction="row" justifyContent="flex-end">
              {checkPrivileges(userPrivileges, "Update Privileges") && props.selectedProvider.is_active && (
                <span>
                  <Link
                    className="action-icon"
                    href="#"
                    onClick={handleShowPrivileges}
                  >
                    <img
                      src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/privileges.png"
                      width="35"
                      alt="View Priviliges"
                      className="priv-icon action-icon-image"
                      style={{ width: "25px", maxHeight: "20px" }}
                    />
                    <p>Privileges</p>
                  </Link>
                </span>
              )}
              {props.selectedProvider.is_active ? 
                fetchedChannelId ? (
                  <span>
                    <Link className="action-icon" onClick={handleChatShow}>
                      <img
                        src={props.chat_icon_with_orange_line}
                        width="35"
                        alt="Chat"
                        className="action-icon-image"
                        style={{ width: "25px", maxHeight: "25px" }}
                      />
                      <p>Chat</p>
                    </Link>
                  </span>
                ) : (
                  <span>
                    <Link className="action-icon" onClick={handleChatCreation}>
                      <img
                        src={props.chat_icon_with_orange_line}
                        width="35"
                        alt="Chat"
                        className="action-icon-image"
                        style={{ width: "25px", maxHeight: "25px" }}
                      />
                      <p>Chat</p>
                    </Link>
                  </span>
                ) 
              : <></>}
              <span>
                <Link className="action-icon" href="#" onClick={handleShowForm}>
                  <img
                    src={props.pencil_grey}
                    width="35"
                    alt="Edit Provider"
                    className="action-icon-image"
                    style={{ width: "25px", maxHeight: "25px" }}
                  />
                  <p>Edit Provider</p>
                </Link>
              </span>
            </Grid>
          </Grid>
        </Grid>
        <div className="divider"></div>
        <Grid container className="table-container">
          <Grid item xs={6} className="provider-info-left-container">
            {ProviderInformationSection("First Name*", provider?.first_name)}
            {ProviderInformationSection("Middle Name", provider?.middle_name)}
            {ProviderInformationSection("Last Name*", provider?.last_name)}
            {ProviderInformationSection("Email Address*", provider?.email)}
          </Grid>
          <Grid item xs={5} className="provider-info-right-container">
            {ProviderInformationSection(
              "Mobile Phone Number",
              provider?.mobile_phone_number
            )}
            {ProviderInformationSection(
              "Business Phone Number",
              provider?.business_phone_number
            )}
            {ProviderInformationSection(
              "Role*",
              snakeCaseToTitleCase(provider?.role)
            )}
            {ProviderInformationSection(
              "Rendering Provider ID #*",
              provider?.provider_npi_number
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="customer-relation-container">
        <CoreTeamCustomerAssociation
          csrfToken={authenticationSetting.csrfToken}
          selectedProvider={props.selectedProvider}
          menu_track_src={props.menu_track_src}
        />
      </Grid>
    </Grid>
  );
};

export default ProviderShow;
