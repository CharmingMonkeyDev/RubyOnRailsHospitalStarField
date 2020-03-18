import * as React from "react";
import { Grid, Link, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// app setting imports
import { ChatContext, AuthenticationContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import { PrivilegesContext } from "../PrivilegesContext";
import { checkPrivileges } from "../utils/PrivilegesHelper";

// component imports
import FollowUpForm from "../modals/FollowUpForm";
import FlashMessage from "../shared/FlashMessage";
import { useGetPatientInfo } from "../hooks/patients/useGetPatientInfo";
import QuestionnaireQr from "../modals/QuestionnaireQr";
import { useCustomerPermission } from "../hooks/useCustomerPermission";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const addFollowupIcon = require("../../images/followupAddIcon.svg");
const qrIcon = require("../../images/qrIcon.svg");

interface Props {
  patient_id: string;
}
const PatientInfo: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const {
    showChatList,
    setShowChatList,
    setChatWindowControllers,
    setActiveChatGroup,
  } = React.useContext(ChatContext);
  const userPrivileges = React.useContext<any>(PrivilegesContext);

  const [assets, setAssets] = React.useState<any>({});
  const [fetchedChannelId, setFetchedChannelId] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = React.useState<boolean>(false);
  const patient = useGetPatientInfo(
    props.patient_id,
    authenticationSetting.csrfToken
  );

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const tabletPermitted = useCustomerPermission(
    "Allow questionnaires to display on local device"
  );

  React.useEffect(() => {
    getPatientInfoAssets();
    getChatInfo();
  }, []);

  // Checking if the current url is "patient_reports/:id/new_action. If yes, open the modal to create action"
  React.useEffect(() => {
    const pattern = /^\/patient_reports\/\d+\/new_action$/;
    const currentPathname = window.location.pathname;

    const isMatched = pattern.test(currentPathname);
    if (isMatched) {
      setModalOpen(true);
    }
  }, []);

  const getPatientInfoAssets = () => {
    fetch(`/reports/reports_patient_information_assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setAssets(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getChatInfo = () => {
    fetch(`/data_fetching/chats/get_channel_between/${props.patient_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
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
    fetch(`/chats`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        user_id: props.patient_id,
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
  };

  const handleQuestionnaireModelClick = () => {
    setQrModalOpen(true);
  };

  return (
    <Grid container className="patient-info-container">
      <Grid item xs={12} alignItems="center">
        <Stack
          direction={"row"}
          justifyContent="space-between"
          alignItems={"center"}
          px={"25px"}
          py={"15px"}
          minHeight={"50px"}
        >
          <Stack direction={"row"} minWidth={"40%"} spacing={2}>
            <Link
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
              href={`/patients/`}
            >
              <ArrowBackIosNewIcon
                style={{
                  borderRadius: "3px",
                  padding: "8px",
                  color: "black",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            </Link>
            <Stack className="info-column" gap={"2px"}>
              <div>
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {patient?.name} &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span style={{ fontSize: "16px" }}>
                  {patient?.user_creation_type == "invited" && (
                    <span>
                      <CheckIcon
                        fontSize="inherit"
                        className="user-type-icon app-user-icon"
                      />
                      <span>App User</span>
                    </span>
                  )}
                  {patient?.user_creation_type == "not_invited" && (
                    <span>
                      <CloseIcon
                        fontSize="inherit"
                        className="user-type-icon non-app-user-icon"
                      />{" "}
                      <span>Offline User</span>
                    </span>
                  )}
                  {patient?.user_creation_type == "invitation_pending" && (
                    <span>
                      <CloseIcon
                        fontSize="inherit"
                        className="user-type-icon non-app-user-icon"
                      />{" "}
                      <span>Invitation Pending</span>
                    </span>
                  )}
                </span>
              </div>
              <Stack direction={"row"} spacing={2} className="data-point">
                <div>
                  {patient?.gender}, {patient?.date_of_birth}
                </div>
                <div>{patient?.full_address}</div>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={1} className="info-column">
            <Link
              className={
                tabletPermitted
                  ? "action-icon action-icon-container"
                  : "action-icon-disabled action-icon-container"
              }
              onClick={
                tabletPermitted ? handleQuestionnaireModelClick : undefined
              }
              style={{ height: "100%", margin: "0 1px 0 1px" }}
              underline="none"
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                style={{ height: "70px" }}
              >
                <img
                  src={qrIcon}
                  alt="add-followup-icon"
                  className="action-icon-image"
                  style={{ width: "35px", maxHeight: "30px" }}
                />
                <p style={{ maxWidth: "68px" }}>Guided Questionnaire</p>
              </Grid>
            </Link>
            <Link
              className={"action-icon action-icon-container"}
              href={`/patient_reports/${props.patient_id}/new_action`}
              style={{ height: "100%", margin: "0 1px 0 3px" }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                style={{ height: "70px" }}
              >
                <img
                  src={addFollowupIcon}
                  alt="add-followup-icon"
                  className="action-icon-image"
                  style={{ width: "40px", maxHeight: "40px" }}
                />
                <p style={{ maxWidth: "48px" }}>New Action</p>
              </Grid>
            </Link>
            {checkPrivileges(userPrivileges, "Edit Patient") && (
              <Link
                className={"action-icon action-icon-container"}
                href={`/patient_reports/${props.patient_id}/general_info`}
                style={{ height: "100%", margin: "0 1px 0 1px" }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ height: "70px" }}
                >
                  <img
                    src={assets.pencil_grey}
                    alt="Edit Patient"
                    className="action-icon-image"
                    // style={{ width: "30px", maxHeight: "30px" }}
                  />
                  <p style={{ maxWidth: "68px" }}>Edit Patient</p>
                </Grid>
              </Link>
            )}
          </Stack>
        </Stack>
      </Grid>
      <FollowUpForm
        patient_id={props.patient_id}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setFlashMessage={setFlashMessage}
      />
      <FlashMessage flashMessage={flashMessage} />
      {qrModalOpen && (
        <QuestionnaireQr
          modalOpen={qrModalOpen}
          setModalOpen={setQrModalOpen}
          patientId={props.patient_id}
        />
      )}
    </Grid>
  );
};

export default PatientInfo;
