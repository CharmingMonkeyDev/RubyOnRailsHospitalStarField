import * as React from "react";
import { Grid, Link, Stack } from "@mui/material";
import {
  AuthenticationContext,
  ChatContext,
  ImagesContext,
} from "../../../../../Context";
import { Female, Male } from "@mui/icons-material";
import InviteToAppButton from "../../../../../users/InviteToAppButton";
import moment from "moment";
import { checkPrivileges } from "../../../../../utils/PrivilegesHelper";
import { PrivilegesContext } from "../../../../../PrivilegesContext";
import PatientDetails from "./PatientDetails";
import PatientEdit from "./PatientEdit";
import UnsavedChangesModal from "../../../../../modals/UnsavedChangesModal";

interface Props {
  patient: any;
  showChat: boolean;
  setShowChat: Function;
  showPatientEditForm: boolean;
  setShowPatientEditForm: Function;
}

const PatientInfo: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const userPrivileges = React.useContext<any>(PrivilegesContext);
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [triggerUpdate, setTriggerUpdate] = React.useState<boolean>(false);
  const chatSettings = React.useContext(ChatContext);

  const handleShowForm = () => {
    event.preventDefault();
    props.setShowPatientEditForm(true);
  };

  const age = () => {
    const age = moment().diff(
      moment(props.patient?.date_of_birth, "YYYY-MM-DD"),
      "years"
    );
    if (props.patient?.date_of_birth) {
      return `${age} years old`;
    } else {
      return "Birthdate not set";
    }
  };

  const renderEditButton = () => {
    if (checkPrivileges(userPrivileges, "Edit Patient")) {
      if (props.showPatientEditForm) {
        return (
          <Link className="save-btn" onClick={() => setTriggerUpdate(true)}>
            Save
          </Link>
        );
      } else {
        return (
          <Link
            className="action-link add-encounter"
            onClick={() => handleShowForm()}
            sx={{ ml: 3, mr: 3 }}
          >
            <img
              src={images.pencil_grey}
              alt="Edit Patient"
              className="action-icon-image"
              style={{ width: 31.466, maxHeight: 32, marginLeft: 32 }}
            />
          </Link>
        );
      }
    }
    return <></>;
  };

  const renderHeader = () => {
    return (
      <Grid container direction="row" className="admin-header">
        <Grid item xs={12} className="box-header">
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            paddingX={3}
            paddingY={1}
            alignItems={"center"}
            display={"flex"}
          >
            <Grid item>
              <p className="panel-header">Patient Information</p>
            </Grid>
            <div className="row">
              {props.patient?.user_creation_type == "invited" ? (
                <p className="row">
                  <img
                    src={images.check_mark_icon}
                    alt="Edit Patient"
                    className="action-icon-image"
                    style={{ width: "31.466px", maxHeight: "32px" }}
                  />
                  <span className="app-user-text disable-pointer">
                    Online User
                  </span>
                </p>
              ) : (
                <>
                  <img
                    src={images.close_icon}
                    alt="Edit Patient"
                    className="action-icon-image"
                    style={{ width: 31.466, maxHeight: 32 }}
                  />
                  <span className="app-user-text disable-pointer">
                    Offline User
                  </span>
                  <InviteToAppButton
                    patientId={props.patient?.id}
                    addIcon={
                      <img
                        src={images.add_icon}
                        alt="Edit Patient"
                        className="action-icon-image"
                        style={{ width: 31.466, maxHeight: 32 }}
                      />
                    }
                  />
                </>
              )}
              {renderEditButton()}
            </div>
          </Stack>
        </Grid>
      </Grid>
    );
  };

  const handleShowChat = () => {
    chatSettings.setPatientId(props.patient?.id);
    props.setShowChat(true);
  };

  const renderOverview = () => {
    return (
      <div className="overview-container row">
        <div className="item-icon-container">
          {props.patient?.gender === "Male" ? (
            <Male sx={{ color: "#FF890A", fontSize: 28 }} />
          ) : (
            <Female sx={{ color: "#FF890A", fontSize: 28 }} />
          )}
        </div>
        <div className="header-text-container">
          <div className="row">
            <h4 className="overview-header">
              {props.patient?.last_name}, {props.patient?.first_name}{" "}
              {"(" + props.patient?.middle_name?.[0] + ")"}
            </h4>
            <h4 className="medical_id_text">
              #ID: {props.patient?.mrn_number}
            </h4>
          </div>
          <p className="overview-detail">
            {age()}
            {props.patient?.race && (
              <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            )}
            {props.patient?.race}
            {props.patient?.ethnicity && (
              <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            )}
            {props.patient?.ethnicity}
           
            {/* {age()} {props.patient?.ethnicity && <span style={{ marginLeft: 10, marginRight: 10 }}>•</span>}
            {props.patient?.ethnicity} {props.patient?.race && <span style={{ marginLeft: 10, marginRight: 10 }}>•</span>}
            {props.patient?.race} */}
          </p>
        </div>
        <Link className="action-link add-encounter" onClick={handleShowChat}>
          <div className="item-icon-container">
            <img
              src={images.chat_bubble_orange}
              alt="Chat Bubble"
              className="action-icon-image"
              style={{ width: 28, maxHeight: 27 }}
            />
          </div>
        </Link>
      </div>
    );
  };

  const renderDetails = () => {
    if (props.showPatientEditForm) {
      return (
        <PatientEdit
          csrfToken={authenticationSetting.csrfToken}
          selectedPatient={props.patient}
          unsavedChanges={unsavedChanges}
          setUnsavedChanges={setUnsavedChanges}
          onUpdate={() => {
            props.setShowPatientEditForm(false);
            setTriggerUpdate(false);
            setUnsavedChanges(false);
          }}
          triggerUpdate={triggerUpdate}
          setTriggerUpdate={setTriggerUpdate}
        />
      );
    }
    return <PatientDetails patient={props.patient} />;
  };

  return (
    <Grid container className="panel-container">
      <Grid item xs={12}>
        <Grid container className="panel-show-container">
          <Grid container className="panel-information-container">
            {renderHeader()}
            <Grid container className="general-patient-info-container">
              <Grid item xs={12} className="info-container">
                {renderOverview()}
                <div className="divider"></div>
                {renderDetails()}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <UnsavedChangesModal unsavedChanges={unsavedChanges} />
    </Grid>
  );
};

export default PatientInfo;