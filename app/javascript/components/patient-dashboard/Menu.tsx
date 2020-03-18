/* eslint-disable prettier/prettier */

//library imports
import * as React from "react";
import { Grid, Link } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Link as RouterLink } from "react-router-dom";
import DataTypeMenu from "./DataTypeMenu";

// settings import
import { AuthenticationContext, ChatContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import { StreamChat } from "stream-chat";

// component import
import PatientBreadcrumbs from "../paritals/patient_breadcrumbs";

interface Props {
  user_name: string;
  menu_care_plan_src: string;
  menu_chat_src: string;
  menu_labs_src: string;
  menu_medications_src: string;
  menu_my_data_src: string;
  menu_track_src: string;
  track_blood_pressure_src: string;
  track_glucose_src: string;
  track_weight_src: string;
  cgm_report_src: string;
  chat_rev_icon_new_msgs: string;
}

const useStyles = makeStyles(() => ({
  container: {
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: 320,
  },
  patientName: {
    marginLeft: 10,
    font: "22px QuicksandMedium",
    marginBottom: 20,
  },
  menuLink: {
    border: "1px solid #efe9e7",
    textAlign: "center",
    borderRadius: 6,
    display: "block",
    backgroundColor: "#ffffff",
    margin: 10,
    padding: 10,
    marginBottom: 18,
    boxShadow: "1px 1px 1px 1px #efefef",
    "& img": {
      display: "inline-block",
    },
    "& span": {
      display: "inline-block",
      font: "20px QuicksandBold",
      color: "#000000",
    },
  },
  indicatorContainer: {
    width: "100%",
    "& img": {},
    textAlign: "center",
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: "#efe9e7",
    display: "inline-block",
    marginRight: 6,
    marginLeft: 6,
    marginTop: 25,
  },
}));

const Menu: React.FC<Props> = (props: any) => {
  // authentication setting
  const authenticationSetting = React.useContext(AuthenticationContext);

  // chat controller state
  const [streamApiKey, setStreamApiKey] = React.useState<string>();
  const { unreadMessages, setUnreadMessages } = React.useContext(ChatContext);
  const [chatUserToken, setChatUserToken] = React.useState<string>();
  const [uuid, setUuid] = React.useState<string>();
  const [name, setName] = React.useState<string>();

  const classes = useStyles();
  const [showTypeMenu, setShowTypeMenu] = React.useState<boolean>(false);

  React.useEffect(() => {
    getToken();
  }, []);

  React.useEffect(() => {
    getUnreadMessages();
  }, [chatUserToken]);

  const showTypeMenuClick = () => {
    setShowTypeMenu(true);
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

  return (
    <>
      <div className={classes.container}>
        {showTypeMenu && (
          <DataTypeMenu
            setShowTypeMenu={setShowTypeMenu}
            track_blood_pressure_src={props.track_blood_pressure_src}
            track_glucose_src={props.track_glucose_src}
            track_weight_src={props.track_weight_src}
          />
        )}

        <div className={classes.patientName}>
          {props.user_name == null ? "Loading..." : props.user_name}
        </div>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={6}>
            <Link
              className={classes.menuLink}
              onClick={showTypeMenuClick}
              style={{ cursor: "pointer" }}
            >
              <img src={props.menu_track_src} width="57" alt="Track" />
              <br />
              <span>Track</span>
            </Link>
            <RouterLink to="/my-care-plan" className={classes.menuLink}>
              <img src={props.menu_care_plan_src} width="46" alt="Care Plan" />
              <br />
              <span>Care Plan</span>
            </RouterLink>
            <RouterLink to="/my-medications" className={classes.menuLink}>
              <img
                src={props.menu_medications_src}
                width="52"
                alt="Medication"
              />
              <br />
              <span>Medications</span>
            </RouterLink>
            <RouterLink to="/cgm_report" className={classes.menuLink}>
              <img src={props.cgm_report_src} width="65" alt="CGM Report" />
              <br />
              <span> CGM Report </span>
            </RouterLink>
          </Grid>
          <Grid item xs={6} className="space-for-breadcrum">
            <RouterLink to="/patient_chats" className={classes.menuLink}>
              <img
                src={props.menu_chat_src}
                width="55"
                alt="Chat"
                className={unreadMessages && "unread-img-shift"}
              />
              {unreadMessages && <span className="chat-red-dot"></span>}
              <br />
              <span>Chat</span>
            </RouterLink>
            <RouterLink to="/my-data" className={classes.menuLink}>
              <img src={props.menu_my_data_src} width="56" alt="My Data" />
              <br />
              <span>My Data</span>
            </RouterLink>
            <RouterLink to="/my-labs" className={classes.menuLink}>
              <img src={props.menu_labs_src} width="65" alt="Labs" />
              <br />
              <span>Labs</span>
            </RouterLink>
          </Grid>
        </Grid>
      </div>
      <PatientBreadcrumbs page={"home"} />
    </>
  );
};

export default Menu;
