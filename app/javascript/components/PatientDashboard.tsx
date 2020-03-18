/* eslint-disable prettier/prettier */
import * as React from "react";
import { Snackbar, Alert } from "@mui/material";
import { usePatientDashboard } from "./hooks/usePatientDashboard";
import { usePatientDashboardStyles } from "./styles/usePatientDashboardStyles";
import Splash from "./patient-dashboard/Splash";
import Menu from "./patient-dashboard/Menu";
import { useSwipeable } from "react-swipeable";

// app setting imports
import { AuthenticationContext } from "./Context";
import { getHeaders } from "./utils/HeaderHelper";
import SyncNotification from "./patient-dashboard/sync-device/SyncNotification";

interface Props {
  user_id: number;
  splash_src: string;
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

const PatientDashboard: React.FC<Props> = (props: any) => {
  //  context import
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const { classes } = usePatientDashboardStyles();
  const { open, error, setError, showSplash } = usePatientDashboard();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (props.user_id) {
      fetch(`/data_fetching/users/basic_user_info/${props.user_id}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.message);
          } else {
            setUser(result?.resource);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.user_id]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/patient_chats"),
    onSwipedRight: () => (window.location.href = "/my-labs"),
  });

  return (
    <>
      {error.length > 0 && (
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            setError("");
          }}
        >
          <Alert severity="error" className={classes.alert}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <div className={classes.container}>
        {user?.role == "patient" && (
          <>
            {showSplash ? (
              <Splash splash_src={props.splash_src} user_name={user?.name} />
            ) : (
              <div
                {...swipeHandlers}
                style={{ touchAction: "pan-y", minHeight: "86vh", marginTop: 90 }}
              >
                <SyncNotification user_id={props.user_id} />
                <Menu
                  user_name={user?.name}
                  menu_care_plan_src={props.menu_care_plan_src}
                  menu_chat_src={props.menu_chat_src}
                  menu_labs_src={props.menu_labs_src}
                  menu_medications_src={props.menu_medications_src}
                  menu_my_data_src={props.menu_my_data_src}
                  menu_track_src={props.menu_track_src}
                  track_blood_pressure_src={props.track_blood_pressure_src}
                  track_glucose_src={props.track_glucose_src}
                  track_weight_src={props.track_weight_src}
                  cgm_report_src={props.cgm_report_src}
                  chat_rev_icon_new_msgs={props.chat_rev_icon_new_msgs}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PatientDashboard;
