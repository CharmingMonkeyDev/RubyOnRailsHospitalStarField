// library imports
import * as React from "react";
import { Grid, Typography, Link } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// component imports
import UserCustomerAssociation from "./UserCustomerAssociation";
import PatientInsuranceShow from "../patient_insurance/PatientInsuranceShow";
import InviteToAppButton from "./InviteToAppButton";
import FlashMessage from "../shared/FlashMessage";
import QuestionnaireQr from "../modals/QuestionnaireQr";
import { useHistory } from "react-router-dom";

const qrIcon = require("../../images/qrIcon.svg");

// helpers import
import { checkPrivileges } from "../utils/PrivilegesHelper";
import { getHeaders } from "../utils/HeaderHelper";

// app settings import
import { PrivilegesContext } from "../PrivilegesContext";
import { ChatContext, AuthenticationContext } from "../Context";
import { useCustomerPermission } from "../hooks/useCustomerPermission";

const addFollowupIcon = require("../../images/followupAddIcon.svg");

interface Props {
  csrfToken: string;
  selectedPatient: any;
  chat_icon_with_orange_line: string;
  the_wall_icon_grey: string;
  pencil_grey: string;
  setShowEditForm: any;
  menu_track_src: any;
  privilegesModalOpen: boolean;
  setPrivilegesModalOpen: any;
  patient_reports_icon: string;
  setRenderingKey?: any;
}

const PatientInfoSection = (label, value) => {
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

const PatientShow: React.FC<Props> = (props: any) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const {
    showChatList,
    setShowChatList,
    setChatWindowControllers,
    setActiveChatGroup,
  } = React.useContext(ChatContext);
  const userPrivileges = React.useContext<any>(PrivilegesContext);
  const tabletPermitted = useCustomerPermission(
    "Allow questionnaires to display on local device"
  );

  // other states
  const [patient, setPatient] = React.useState<any>(props.selectedPatient);
  const [fetchedChannelId, setFetchedChannelId] = React.useState<string>("");
  const [insuranceReloader, setInsuranceReloader] =
    React.useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = React.useState<boolean>(false);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  React.useEffect(() => {
    getUserInfo();
    getChatInfo();
  }, [props.selectedPatient]);

  const getUserInfo = () => {
    fetch(`/data_fetching/edit_my_info/${props.selectedPatient?.id}`, {
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
      `/data_fetching/chats/get_channel_between/${props.selectedPatient?.id}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
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
  };
  const history = useHistory();
  const handleShowForm = () => {
    event.preventDefault();
    props.setShowEditForm(true);
    history.push(`/patients?patient_id=${patient.id}&action=edit`, {
      shallow: true,
    });
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
    if (props.selectedPatient) {
      fetch(`/chats`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          user_id: props.selectedPatient?.id,
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

  const handleQuestionnaireModelClick = () => {
    setQrModalOpen(true);
  };

  return (
    <Grid
      item
      xs={12}
      md={6}
      className="patient-show-container"
      sx={{ ml: "-10px" }}
    >
      <Grid container className="information-container">
        <Grid container direction="row" className="admin-header border-bottom">
          <Grid item xs={12} lg={6}>
            <h3 className="header-label">Patient Information</h3>
          </Grid>
          <Grid
            item
            xs={12}
            lg={6}
            className="info-column"
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            spacing={5}
          >
            <Link
              className={
                tabletPermitted
                  ? "action-icon action-icon-container"
                  : "action-icon-disabled"
              }
              onClick={
                tabletPermitted ? handleQuestionnaireModelClick : undefined
              }
              style={{ height: "100%", margin: "0 5px 0 5px" }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                style={{ height: "53px" }}
              >
                <img
                  src={qrIcon}
                  alt="add-followup-icon"
                  className="action-icon-image"
                  style={{ width: "25px", maxHeight: "20px" }}
                />
                <p style={{ maxWidth: "68px" }}>Guided Questionnaire</p>
              </Grid>
            </Link>
            <Link
              className={"action-icon action-icon-container"}
              href={`/patient_reports/${patient.id}/new_action`}
              style={{ height: "100%", margin: "0 5px 0 5px" }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                style={{ height: "53px" }}
              >
                <img
                  src={addFollowupIcon}
                  alt="add-followup-icon"
                  className="action-icon-image"
                  style={{ width: "25px", maxHeight: "22px" }}
                />
                <p style={{ maxWidth: "68px" }}>New Action</p>
              </Grid>
            </Link>
            {checkPrivileges(userPrivileges, "View Patient Labs") && (
              <Link
                className={"action-icon action-icon-container"}
                href={`/patient_reports/${patient?.id}/action_center`}
                style={{ height: "100%", margin: "0 5px 0 5px" }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ height: "53px" }}
                >
                  <img
                    src={props.patient_reports_icon}
                    alt="PatientReport"
                    className="action-icon-image"
                    style={{ width: "25px", maxHeight: "25px" }}
                  />
                  <p style={{ maxWidth: "68px" }}>Profile</p>
                </Grid>
              </Link>
            )}
            <Link
              className={"action-icon action-icon-container"}
              onClick={fetchedChannelId ? handleChatShow : handleChatCreation}
              style={{ height: "100%", margin: "0 5px 0 5px" }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                style={{ height: "53px" }}
              >
                <img
                  src={props.chat_icon_with_orange_line}
                  alt="Chat"
                  className="action-icon-image"
                  style={{ width: "25px", maxHeight: "28px" }}
                />
                <p style={{ maxWidth: "68px" }}>Chat</p>
              </Grid>
            </Link>

            {checkPrivileges(userPrivileges, "Edit Patient") && (
              <Link
                className={"action-icon action-icon-container"}
                href={`/patient_reports/${patient.id}/general_info`}
                style={{ height: "100%", margin: "0 5px 0 5px" }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ height: "53px" }}
                >
                  <img
                    src={props.pencil_grey}
                    alt="Edit Patient"
                    className="action-icon-image"
                    style={{ width: "22px", maxHeight: "22px" }}
                  />
                  <p style={{ maxWidth: "68px" }}>Edit Patient</p>
                </Grid>
              </Link>
            )}
          </Grid>
        </Grid>
        <div className="divider"></div>
        <Grid container className="table-container">
          <Grid item xs={6} className="patient-info-left-container">
            {PatientInfoSection("First Name*", patient?.first_name)}
            {PatientInfoSection("Middle Name", patient?.middle_name)}
            {PatientInfoSection("Last Name*", patient?.last_name)}
            {PatientInfoSection(
              "Date of Birth*",
              patient?.formatted_date_of_birth
            )}
            {PatientInfoSection(
              "Mobile Phone Number*",
              patient?.mobile_phone_number
            )}
            {PatientInfoSection("Email Address*", patient?.email)}
            {PatientInfoSection("Gender*", patient?.gender)}
          </Grid>
          <Grid item xs={5} className="patient-info-right-container">
            {PatientInfoSection("Ethnicity", patient?.ethnicity)}
            {PatientInfoSection("Race", patient?.race)}
            {PatientInfoSection("Address*", patient?.address)}
            {PatientInfoSection("City*", patient?.city)}
            {PatientInfoSection("State*", patient?.state)}
            {PatientInfoSection("Zip*", patient?.zip)}
            {PatientInfoSection("County", patient?.county)}
            {PatientInfoSection("Medical Records Number", patient?.mrn_number)}

            {patient?.user_creation_type == "invited" && (
              <p>
                <CheckIcon className="user-type-icon app-user-icon" />{" "}
                <span className="app-user-text">App User</span>
              </p>
            )}
          </Grid>

          <Grid item xs={12} container className="invitation-btn-container">
            <Grid item xs={6}></Grid>
            <Grid item xs={6} style={{ paddingLeft: 20 }}>
              {patient?.user_creation_type == "not_invited" && (
                <Grid container item xs={12}>
                  <Grid item xs={6}>
                    <CloseIcon className="user-type-icon non-app-user-icon" />{" "}
                    <span className="app-user-text">Offline User</span>
                  </Grid>
                  <Grid>
                    <InviteToAppButton patientId={patient?.id} />
                  </Grid>
                </Grid>
              )}

              {patient?.user_creation_type == "invitation_pending" && (
                <Grid container item xs={12}>
                  <Grid item xs={6}>
                    <CloseIcon className="user-type-icon non-app-user-icon" />{" "}
                    <span className="app-user-text">Invitation Pending</span>
                  </Grid>
                  <Grid item xs={6}>
                    <InviteToAppButton patientId={patient?.id} />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="customer-relation-container">
        <PatientInsuranceShow
          patient_id={props.selectedPatient.id}
          pencil_grey={props.pencil_grey}
          insuranceReloader={insuranceReloader}
          setInsuranceReloader={setInsuranceReloader}
        />
      </Grid>

      <Grid container className="customer-relation-container">
        <UserCustomerAssociation
          csrfToken={authenticationSetting.csrfToken}
          selectedPatient={props.selectedPatient}
          menu_track_src={props.menu_track_src}
        />
      </Grid>
      {qrModalOpen && (
        <QuestionnaireQr
          modalOpen={qrModalOpen}
          setModalOpen={setQrModalOpen}
          patientId={props.selectedPatient.id}
        />
      )}
      <FlashMessage flashMessage={flashMessage} />
    </Grid>
  );
};

export default PatientShow;
