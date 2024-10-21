import * as React from "react";
import { Box, Grid, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

// app setting imports
import { AuthenticationContext, BackContext, ImagesContext } from "../Context";

// importing header helpers
import { getHeaders } from "../utils/HeaderHelper";
const baseS3Url = "https://starfield-static-assets.s3.us-east-2.amazonaws.com";
const bpIcon = `${baseS3Url}/blood_pressure_icon.svg`;
const bpActiveIcon = `${baseS3Url}/blood_pressure_icon_white.svg`;
const weightIcon = `${baseS3Url}/weigh_icon.svg`;
const weightActiveIcon = `${baseS3Url}/weigh_icon_white.svg`;

// import { useLocation, useParams } from "react-router-dom";
import {
  BrowserRouter as Router,
  Link as LinkRouter,
  useLocation,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  AssignmentOutlined,
  Biotech,
  ContactPageOutlined,
  EditNote,
  HandshakeOutlined,
  Medication,
  Notifications,
  WaterDrop,
} from "@mui/icons-material";
import { TbVaccine } from "react-icons/tb";
import dayjs from "dayjs";

interface Props {
  patient_id: string;
}

const ReportNavigation: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const imagesList = React.useContext(ImagesContext);
  const { backPath, setBackPath } = React.useContext(BackContext);

  // other states
  const [navAssets, setNavAssets] = React.useState<any>(null);
  const [glucoseExposure, setGlucoseExposure] = React.useState<any>(null);
  const [selectedTab, setSelectedTab] = React.useState<string>("");

  // these are the default category, for other types it iwll be only visible on health overview page
  const categoryOptions = ["asthma", "copd", "depression", "hypertension"];
  const [bloodPressure, setBloodPressure] = React.useState<any>(null);
  const [glucose, setGlucose] = React.useState<any>(null);
  const [weight, setWeight] = React.useState<any>(null);
  const [activeNavs, setActiveNavs] = React.useState<any>([]);
  const location = useLocation();
  const tabNames = [
    // "health_overview",
    "action_center",
    "general_info",
    "encounters",
    "questionnaires",
    "cgm_report",
    "medications",
    "labs",
    "blood_pressure",
    "weight",
    "blood_glucose",
    "adt_notifications",
    "immunizations",
    "important_notes",
  ];

  React.useEffect(() => {
    getReportNavigationData();
    getGlucoseExposureValue();
    getUserData();
  }, [props.patient_id]);

  const getReportNavigationData = async () => {
    const response = await fetch(
      `/reports/reports/navigation_data/${props.patient_id}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    );
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    if (result.success == false) {
      console.log(result.error);
    } else {
      setNavAssets(result?.resource);
      setActiveNavs(result?.resource?.active_nav);
    }
  };

  const getGlucoseExposureValue = () => {
    fetch(
      `/reports/cgm_reports_glucose_exposure/${props.patient_id}?start_date=null&end_date=null`,
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
          setGlucoseExposure(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserData = () => {
    fetch(`/reports/user_data/${props.patient_id}/readings`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
        } else {
          setBloodPressure(result?.resource?.blood_pressure_reading);
          setGlucose(result?.resource?.glucose_reading);
          setWeight(result?.resource?.weight_reading);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    const matchingTab = tabNames.find((tab) =>
      window.location.pathname.includes(tab)
    );
    if (matchingTab) {
      setSelectedTab(matchingTab);
    }
  }, [location]);

  const [visibleStartIndex, setVisibleStartIndex] = React.useState(0);

  React.useEffect(() => {
    const urlLastSegment = location.pathname.split("/").pop();
    const currentMenuIndex = tabNames.findIndex(
      (tab) => tab === urlLastSegment
    );

    if (currentMenuIndex !== -1) {
      const newStartIndex = Math.floor(currentMenuIndex / 6);
      setVisibleStartIndex(newStartIndex);
    }
  }, [location]);

  const handleNext = () => {
    setVisibleStartIndex(visibleStartIndex + 1);
  };

  const handlePrev = () => {
    setVisibleStartIndex(visibleStartIndex - 1);
  };

  return (
    <Box display="flex" alignItems="center" sx={{ marginTop: 3 }}>
      {visibleStartIndex > 0 && (
        <Box className="side-arrow" onClick={handlePrev}>
          <ArrowLeft />
        </Box>
      )}
      <Grid
        container
        spacing={2}
        wrap="nowrap"
        overflow="hidden"
        className="report-navigation-container"
        sx={{ paddingTop: "0px !important" }}
      >
        {visibleStartIndex == 0 && (
          <>
            <Grid
              item
              xs={12}
              className={`report-normal-link first-link ${
                selectedTab == "action_center"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "action_center" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/action_center`}
              >
                <Stack
                  direction={"row"}
                  spacing={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <img
                    src={
                      selectedTab == "action_center"
                        ? navAssets?.health_overview_white_icon
                        : navAssets?.health_overview_icon
                    }
                    width="30px"
                  />
                  <div className="header">Action Center</div>
                </Stack>
              </RouterLink>
            </Grid>
            <Grid
              item
              container
              justifyContent={"center"}
              xs={12}
              className={`report-normal-link ${
                selectedTab == "general_info"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "general_info" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/general_info`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <ContactPageOutlined fontSize="large" />
                  <div className="header">General Info</div>
                </Stack>
              </RouterLink>
            </Grid>
            <Grid
              item
              container
              justifyContent={"center"}
              xs={12}
              className={`report-normal-link ${
                selectedTab == "encounters"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "encounters" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/encounters`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <HandshakeOutlined fontSize="large" />
                  <div className="header">Encounters</div>
                </Stack>
              </RouterLink>
            </Grid>
            <Grid
              item
              xs={12}
              className={`report-normal-link ${
                selectedTab == "questionnaires"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "questionnaires" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/questionnaires`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <AssignmentOutlined fontSize="large" />
                  <div className="header">Questionnaires</div>
                </Stack>
              </RouterLink>
            </Grid>

            <Grid
              item
              xs={12}
              className={
                selectedTab == "cgm_report"
                  ? "report-normal-link  report-active-link"
                  : "report-normal-link report-inactive-link"
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "10px",
                paddingBottom: "15px",
                position: "relative",
              }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "cgm_report" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/cgm_report`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack direction={"row"} spacing={2}>
                  <div
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    <img
                      src={
                        selectedTab == "cgm_report"
                          ? imagesList.cgm_icon_white
                          : navAssets?.cgm_icon
                      }
                      alt="cgm-icon"
                      style={{
                        width: "40px",
                        marginRight: "10px",
                      }}
                    />
                  </div>
                  <Stack>
                    <div className="header">CGM</div>
                    <div>
                      <div className="data">
                        {glucoseExposure?.egv_value ?? "N/A"}
                      </div>
                      <div className="unit">Avg mg/dL</div>
                    </div>
                  </Stack>
                </Stack>
              </RouterLink>
            </Grid>

            <Grid
              item
              xs={12}
              className={`report-normal-link ${
                selectedTab == "medications"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "medications" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/medications`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Medication fontSize="large" />
                  <div className="header">Medications</div>
                </Stack>
              </RouterLink>
            </Grid>
          </>
        )}
        {visibleStartIndex == 1 && (
          <>
            <Grid
              item
              xs={12}
              className={`report-normal-link ${
                selectedTab == "labs"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "labs" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/labs`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Biotech fontSize="large" />
                  <div className="header">Labs</div>
                </Stack>
              </RouterLink>
            </Grid>
            <Grid
              item
              xs={12}
              className={`report-normal-link ${
                selectedTab == "blood_glucose"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative", paddingTop: "0 !important" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "blood_glucose" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/blood_glucose`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack direction={"row"} spacing={2}>
                  <div
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    <WaterDrop fontSize="large" />
                  </div>
                  <Stack>
                    <div className="header">Glucose</div>
                    <div>
                      <div className="data">
                        {glucose?.reading_value ?? "N/A"}
                      </div>
                      <div className="unit">{glucose?.date_recorded}</div>
                    </div>
                  </Stack>
                </Stack>
              </RouterLink>
            </Grid>

            <Grid
              item
              xs={12}
              className={`report-normal-link ${
                selectedTab == "weight"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative", paddingTop: "0 !important" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "weight" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/weight`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack direction={"row"} spacing={5}>
                  <div
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    <img
                      src={
                        selectedTab == "weight" ? weightActiveIcon : weightIcon
                      }
                      alt="weight-icon"
                      style={{
                        width: "30px",
                      }}
                    />
                  </div>
                  <Stack>
                    <div className="header">Weight</div>
                    <div>
                      <div className="data">
                        {weight?.reading_value ?? "N/A"}
                      </div>
                      <div className="unit">
                        {dayjs(weight?.date_recorded).format(
                          "MM/DD/YYYY HH:mm"
                        )}
                      </div>
                    </div>
                  </Stack>
                </Stack>
              </RouterLink>
            </Grid>

            <Grid
              item
              xs={12}
              className={`report-normal-link ${
                selectedTab == "blood_pressure"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative", paddingTop: "0 !important" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "blood_pressure" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/blood_pressure`}
              >
                <Stack direction={"row"} spacing={2}>
                  <div style={{ alignSelf: "center" }}>
                    <img
                      src={
                        selectedTab == "blood_pressure" ? bpActiveIcon : bpIcon
                      }
                      alt="bp-icon"
                      style={{
                        width: "30px",
                        marginRight: "10px",
                      }}
                    />
                  </div>
                  <Stack>
                    <div className="header">Blood Pressure</div>
                    <div>
                      <div className="data">
                        {bloodPressure
                          ? `${bloodPressure?.systolic_value}/${bloodPressure?.diastolic_value}`
                          : "N/A"}
                      </div>
                      <div className="unit">
                        {dayjs(bloodPressure?.date_recorded).format(
                          "MM/DD/YYYY HH:mm"
                        )}
                      </div>
                    </div>
                  </Stack>
                </Stack>
              </RouterLink>
            </Grid>

            <Grid
              item
              xs={12}
              className={`report-normal-link ${
                selectedTab == "adt_notifications"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "adt_notifications" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/adt_notifications`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                  display={"flex"}
                >
                  <Notifications fontSize="large" />
                  <div className="header" style={{ fontSize: "0.8rem" }}>
                    ADT Notifications
                  </div>
                </Stack>
              </RouterLink>
            </Grid>

            <Grid
              item
              xs={12}
              className={`report-normal-link ${
                selectedTab == "immunizations"
                  ? "report-active-link"
                  : "report-inactive-link"
              }`}
              sx={{ position: "relative" }}
            >
              <RouterLink
                className={`patient-nav-link ${
                  selectedTab == "immunizations" ? "active" : ""
                }`}
                to={`/patient_reports/${props.patient_id}/immunizations`}
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                  display={"flex"}
                >
                  <TbVaccine
                    size={25}
                    fontSize="large"
                    style={{
                      fontWeight: "bolder",
                      transform: "rotate(180deg)",
                      marginRight: "8px",
                    }}
                  />
                  <div
                    className="header"
                    style={{ fontSize: "0.9rem", marginTop: "6px" }}
                  >
                    Immunizations
                  </div>
                </Stack>
              </RouterLink>
            </Grid>
          </>
        )}
        {visibleStartIndex > 1 && (
          <Grid
            item
            xs={12}
            className={`report-normal-link ${
              selectedTab == "important_notes"
                ? "report-active-link"
                : "report-inactive-link"
            }`}
            sx={{ position: "relative" }}
          >
            <RouterLink
              className={`patient-nav-link ${
                selectedTab == "important_notes" ? "active" : ""
              }`}
              to={`/patient_reports/${props.patient_id}/important_notes`}
              style={{
                boxSizing: "border-box",
                width: "100%",
                height: "100%",
              }}
            >
              <Stack
                direction={"row"}
                spacing={1}
                justifyContent={"center"}
                display={"flex"}
                alignItems={"center"}
              >
                <EditNote fontSize="large" />
                <div className="header" style={{ fontSize: "0.9rem" }}>
                  Important Notes
                </div>
              </Stack>
            </RouterLink>
          </Grid>
        )}
        {visibleStartIndex < 2 && (
        <Box className="side-arrow" onClick={handleNext}>
          <ArrowRight />
        </Box>
      )}
      </Grid>
      {/* {visibleStartIndex < 2 && (
        <Box className="side-arrow" onClick={handleNext}>
          <ArrowRight />
        </Box>
      )} */}
    </Box>
  );
};

export default ReportNavigation;
