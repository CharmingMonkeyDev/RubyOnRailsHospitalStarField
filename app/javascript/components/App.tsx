// library import
import * as React from "react";
import { Grid, Modal, ThemeProvider } from "@mui/material";
import AddPatient from "./patients/AddPatient";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAppStyles } from "./styles/useAppStyles";
import MobileDetect from "mobile-detect";

// component imports
import Header from "./shared/Header";
import Nav from "./shared/Nav";
import AcceptTerms from "./legal/AcceptTerms";
import ChatRevolution from "./chat_revolution/ChatRevolution";
import { PatientRoutes } from "./routes/PatientRoutes";
import { ProviderRoutes } from "./routes/ProviderRoutes";

// Helpers import
import { getHeaders } from "./utils/HeaderHelper";

// other setting import
import { PrivilegesContext } from "./PrivilegesContext";
import {
	ImagesContext,
	ChatContext,
	AuthenticationContext,
	NewPatientModalContext,
	FlashContext,
} from "./Context";
import { checkPrivileges } from "./utils/PrivilegesHelper";
import GlobalFlashMessage from "./shared/GlobalFlashMessage";
import NotFound from "./shared/NotFound";
import theme from "./theme/Theme";

interface Props {
  csrfToken: string;
  small_logo_src: string;
  logo_src: string;
  button_src: string;
  splash_src: string;
  user_id: number;
  getstream_api_key: string;
  menu_care_plan_src: string;
  menu_chat_src: string;
  menu_labs_src: string;
  menu_medications_src: string;
  menu_my_data_src: string;
  menu_track_src: string;
  menu_minus_circle: string;
  create_channel_src: any;
  sort_plain_src: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  track_blood_pressure_src: string;
  track_glucose_src: string;
  track_weight_src: string;
  cgm_report_src: string;
  cgm_icon_white: string;
  customers: any;
  selected_customer: any;
  chat_icon_with_orange_line: string;
  the_wall_icon_grey: string;
  privileges: string;
  sync_device: string;
  device: string;
  pencil_grey: string;
  nav_chat_icon: string;
  action_queue_assign_icon: string;
  action_queue_unassign_icon: string;
  patient_reports_icon: string;
  chat_rev_icon_new_msgs: string;
  chat_rev_icon: string;
  cgm_chart_background: string;
  logo_white: string;
  chat_bubble_src: string;
  add_icon_src: string;
  checkmark_icon_src: string;
  close_icon_src: string;
  calendar_icon: string;
  clock_icon: string;
  place_icon: string;
  transfer_icon: string;
  immunization_calendar: string;
  immunization_icon: string;
  history_icon: string;
}

const App: React.FC<Props> = (props: any) => {
  const { classes } = useAppStyles();
  const [patient, setPatient] = React.useState<any>([]);
  const [user, setUser] = React.useState<any>(null);
  const [userPrivileges, setUserPrivileges] = React.useState<any>(null);
  const [message, setMessage] = React.useState<any>({
    text: "",
    type: "error",
  });

  // NewPatientModalContect
  const [newPatientModalOpen, setNewPatientModalOpen] =
    React.useState<boolean>(false);

  // show chat list controlls the opening and closing of ChatList(firstChatWindow)
  // ChatWindowController controlls the actull chat window(secondChatWindow)
  const [showChatList, setShowChatList] = React.useState<boolean>(false);
  const [unreadMessages, setUnreadMessages] = React.useState<boolean>(false);
  const [chatWindowControllers, setChatWindowControllers] = React.useState<any>(
    { show: false, channel_id: null }
  );
  const [activeChatGroup, setActiveChatGroup] =
    React.useState<string>("colleague");
  const [chatPatientId, setChatPatientId] = React.useState<any>(null);

  const chatSettings = {
    showChatList,
    setShowChatList,
    unreadMessages,
    setUnreadMessages,
    chatWindowControllers,
    setChatWindowControllers,
    activeChatGroup,
    setActiveChatGroup,
    patientId: chatPatientId,
    setPatientId: setChatPatientId,
  };

  const newPatientModalSetting = {
    newPatientModalOpen,
    setNewPatientModalOpen,
  };

  const authenticationSetting = {
    csrfToken: props.csrfToken,
    userId: props.user_id,
    userRole: user?.role,
  };

  const imagesList = {
    sort_plain_src: props.sort_plain_src,
    sort_ascending_src: props.sort_ascending_src,
    sort_descending_src: props.sort_descending_src,
    cgm_chart_background: props.cgm_chart_background,
    logo_white: props.logo_white,
    cgm_icon_white: props.cgm_icon_white,
    pencil_grey: props.pencil_grey,
    menu_track_src: props.menu_track_src,
    spinner_src: props.spinner_src,
    new_large_spinner_src: props.new_large_spinner_src,
    starfield_logo_gif_src: props.starfield_logo_gif_src,
    chat_bubble_orange: props.chat_bubble_src,
    add_icon: props.add_icon_src,
    check_mark_icon: props.checkmark_icon_src,
    close_icon: props.close_icon_src,
    calendar_icon: props.calendar_icon,
    clock_icon: props.clock_icon,
    place_icon: props.place_icon,
    transfer_icon: props.transfer_icon,
    immunization_calendar: props.immunization_calendar,
    immunization_icon: props.immunization_icon,
    history_icon: props.history_icon,
  };

  React.useEffect(() => {
    pollForSessionTimeout();
  }, []);

  // this is to reset timeout if mouseMove
  const latestActivityDetected = React.useRef(true);

  // not letting session out if there is mouse movement
  const handleUserActivity = () => {
    latestActivityDetected.current = true;
  };

  const resetSession = () => {
    if (latestActivityDetected.current) {
      fetch(`/reset_timeout_session`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => {
          if (result.status == 200) {
            latestActivityDetected.current = false;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
    };
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      resetSession();
    }, 300000); // 300000 milliseconds = 5 minutes

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // this is timeout and redirection method
  const pollForSessionTimeout = () => {
    const sessionTimeoutPollFrequency = 20;

    if (!latestActivityDetected.current) {
      fetch(`/check_session_timeout`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => {
          if (result.status == 200) {
            return result.json();
          } else {
            window.location.href = "/session_timeout";
          }
        })
        .then((result) => {
          if (result?.resource?.response <= 0) {
            window.location.href = "/session_timeout";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    window.setTimeout(
      pollForSessionTimeout,
      sessionTimeoutPollFrequency * 1000
    );
  };

  var md = new MobileDetect(window.navigator.userAgent);
  var mobile = md.mobile() && md.mobile().length > 0;

  React.useEffect(() => {
    if (props.user_id) {
      fetch(`/data_fetching/app/${props.user_id}`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setUserPrivileges(result.user.privileges);
            setUser(result.user);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.user_id]);

  return (
    <ThemeProvider theme={theme}>
      {userPrivileges && (
        <AuthenticationContext.Provider value={authenticationSetting}>
          <PrivilegesContext.Provider value={userPrivileges}>
            <ChatContext.Provider value={chatSettings}>
              <NewPatientModalContext.Provider value={newPatientModalSetting}>
                <ImagesContext.Provider value={imagesList}>
                  <FlashContext.Provider value={{ message, setMessage }}>
                    {mobile && user?.role != "patient" ? (
                      <Modal
                        open={true}
                        className="unsaved-changes-modal-container"
                      >
                        <div className="paper">
                          <div className="paperInner">
                            <Grid
                              container
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Grid item xs={12}>
                                <p className="main-header">
                                  {" "}
                                  Mobile device detected
                                </p>
                              </Grid>
                              <Grid item xs={12}>
                                <p className="content">
                                  Sorry, we are not compatible with mobile yet!
                                </p>
                              </Grid>
                            </Grid>
                          </div>
                        </div>
                      </Modal>
                    ) : (
                      <div
                        className={
                          user &&
                          (user?.role == "patient"
                            ? classes.bodyBackgroundPatient
                            : classes.bodyBackground)
                        }
                      >
                        <Router>
                          <GlobalFlashMessage />
                          <Header
                            logo_src={props.logo_src}
                            small_logo_src={props.small_logo_src}
                            user_id={props.user_id}
                            patient_id={patient?.id}
                            csrfToken={props.csrfToken}
                            customers={props.customers}
                            selected_customer={props.selected_customer}
                            sync_device={props.sync_device}
                            user={user}
                          />
                          <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                          >
                            {user && <Nav role={user?.role} />}
                            {user && !user.terms && <AcceptTerms />}
                            <Grid item xs={12}>
                              <Switch>
                                {user?.role == "patient"
                                  ? PatientRoutes(props, user, classes)
                                  : ProviderRoutes(
                                      props,
                                      user,
                                      classes,
                                      userPrivileges
                                    )}
                                <Route component={NotFound} />
                              </Switch>
                            </Grid>
                          </Grid>
                        </Router>
                      </div>
                    )}

                    <ChatRevolution
                      user_id={props.user_id}
                      chat_rev_icon={props.chat_rev_icon}
                      chat_rev_icon_new_msgs={props.chat_rev_icon_new_msgs}
                      nav_chat_icon={props.nav_chat_icon}
                    />

                    {checkPrivileges(userPrivileges, "Invite New Patient") && (
                      <AddPatient
                        logo_src={props.logo_src}
                        button_src={props.button_src}
                      />
                    )}
                  </FlashContext.Provider>
                </ImagesContext.Provider>
              </NewPatientModalContext.Provider>
            </ChatContext.Provider>
          </PrivilegesContext.Provider>
        </AuthenticationContext.Provider>
      )}
    </ThemeProvider>
  );
};

export default App;