import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Terms from "../legal/Terms";
import MyInfo from "../patient-profile/MyInfo";
import EditMyInfo from "../patient-profile/EditMyInfo";
import EditMyEmail from "../patient-profile/EditMyEmail";
import EditMyPassword from "../patient-profile/EditMyPassword";
import PatientDashboard from "../PatientDashboard";
import MyData from "../patient-dashboard/MyData";
import CarePlan from "../patient-dashboard/CarePlan";
import Lab from "../patient-dashboard/Lab";
import Medications from "../patient-dashboard/Medications";
import SyncDevice from "../patient-dashboard/sync-device/SyncDevice";
import PatientChatIndex from "../chat_revolution/patient/PatientChatIndex";
import ContactUs from "../patient-profile/ContactUs";
import CgmReportPatientView from "../patient_reports/cgm_report/CgmReportPatientView";
import Preferences from "../preferences/Preferences";
import ImmunizationPreference from "../preferences/ImmunizationPreference";
import FollowUpForm from "../modals/FollowUpForm";

export const PatientRoutes = (props, user, classes) => {
  return (
    <Switch>
      <Route exact path="/">
        {user == null ? (
          "Loading..."
        ) : (
          <PatientDashboard
            user_id={props.user_id}
            splash_src={props.splash_src}
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
        )}
      </Route>
      <Route exact path="/terms">
        <div className={classes.content}>
          <Terms />
        </div>
      </Route>
      <Route exact path="/my-data">
        <MyData
          csrfToken={props.csrfToken}
          user_id={props.user_id}
          menu_track_src={props.menu_track_src}
          button_src={props.button_src}
          source="patient"
        />
      </Route>
      <Route exact path="patient_reports/create-action">
        <FollowUpForm
          patient_id={props.user_id}
          modalOpen={true}
          setModalOpen={undefined}
        />
      </Route>
      <Route exact path="/my-care-plan">
        <CarePlan patient_id={props.user_id} csrfToken={props.csrfToken} />
      </Route>
      <Route exact path="/my-medications">
        <Medications
          patient_id={props.user_id}
          csrfToken={props.csrfToken}
          menu_track_src={props.menu_track_src}
        />
      </Route>
      <Route exact path="/sync-device">
        <SyncDevice
          patient_id={props.user_id}
          csrfToken={props.csrfToken}
          device={props.device}
        />
      </Route>
      <Route exact path="/my-labs">
        <Lab patient_id={props.user_id} />
      </Route>
      <Route exact path="/patient_chats">
        <PatientChatIndex />
      </Route>
      <Route exact path="/my-info">
        <MyInfo patient_id={props.user_id} csrfToken={props.csrfToken} />
      </Route>
      <Route exact path="/edit-my-info">
        <EditMyInfo patient_id={props.user_id} csrfToken={props.csrfToken} />
      </Route>
      <Route exact path="/edit-my-email">
        <EditMyEmail patient_id={props.user_id} csrfToken={props.csrfToken} />
      </Route>
      <Route exact path="/edit-my-password">
        <EditMyPassword
          patient_id={props.user_id}
          csrfToken={props.csrfToken}
        />
      </Route>
      <Route exact path="/contact-us">
        <ContactUs />
      </Route>
      <Route exact path="/cgm_report">
        <div className={"patient-main-container " + classes.content}>
          <CgmReportPatientView />
        </div>
      </Route>
      <Route exact path="/preferences">
        <Preferences />
      </Route>
      <Route exact path="/immunization-preferences">
        <ImmunizationPreference />
      </Route>
    </Switch>
  );
};
