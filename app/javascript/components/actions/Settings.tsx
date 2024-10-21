import {
  Grid,
  Snackbar,
  Alert,
  TextField,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect } from "react";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";

const ActionSettings = () => {
  const [error, setError] = React.useState<string>("");
  const [globalActionFutureDays, setGlobalActionFutureDays] =
    React.useState<number>();
  const [globalActionPastDays, setGlobalActionPastDays] =
    React.useState<number>();
  const [patientActionFutureDays, setPatientActionFutureDays] =
    React.useState<number>();
  const [patientActionPastDays, setPatientActionPastDays] =
    React.useState<number>();
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  const setErrorFlash = (message) => {
    flashContext.setMessage({
      text: message,
      type: "error",
    });
  };
  useEffect(() => {
    getSettings();
  }, []);

  const getSettings = async () => {
    try {
      const response = await fetch(`/company_action_settings`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      const result = await response.json();
      console.log(result);
      if (result.success == false) {
        setError(result.message);
      } else {
        const settings = result.resource;
        if (settings) {
          setGlobalActionPastDays(settings.global_action_past_days);
          setGlobalActionFutureDays(settings.global_action_future_days);
          setPatientActionPastDays(settings.patient_action_past_days);
          setPatientActionFutureDays(settings.patient_action_future_days);
        }
      }
    } catch (error) {
      console.error(error);
      flashContext.setMessage({
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  //  validation
  const validateFields = () => {
    if (
      isBlank(globalActionPastDays) ||
      globalActionPastDays < 1 ||
      globalActionPastDays > 90
    ) {
      setErrorFlash(
        "Global Action Past Days cannot be blank and must be between 1 and 90"
      );
      return false;
    }

    if (
      isBlank(globalActionFutureDays) ||
      globalActionFutureDays < 1 ||
      globalActionFutureDays > 90
    ) {
      setErrorFlash(
        "Global Action Future Days cannot be blank and must be between 1 and 90"
      );
      return false;
    }

    if (
      isBlank(patientActionPastDays) ||
      patientActionPastDays < 1 ||
      patientActionPastDays > 90
    ) {
      setErrorFlash(
        "Patient  Action Past Days cannot be blank and must be between 1 and 90"
      );
      return false;
    }

    if (
      isBlank(patientActionFutureDays) ||
      patientActionFutureDays < 1 ||
      patientActionFutureDays > 90
    ) {
      setErrorFlash(
        "Patient Action Future Days cannot be blank and must be between 1 and 90"
      );
      return false;
    }

    return true;
  };

  const isBlank = (str) => {
    return !str || str === undefined;
  };

  const saveSettings = async () => {
    if (!validateFields()) {
      return false;
    }
    try {
      const response = await fetch(`/company_action_settings`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          global_action_future_days: globalActionFutureDays,
          global_action_past_days: globalActionPastDays,
          patient_action_past_days: patientActionPastDays,
          patient_action_future_days: patientActionFutureDays,
        }),
      });
      const result = await response.json();
      if (result.success == false) {
        setError(result.message);
      } else {
        flashContext.setMessage({
          text: result.message,
          type: "success",
        });
      }
    } catch (error) {
      console.error(error);
      flashContext.setMessage({
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  return (
    <div className="patient-index-container">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container"
      >
        <Grid item xs={12} md={8} lg={7} xl={5}>
          {error.length > 0 && (
            <Snackbar
              open={error.length > 0}
              autoHideDuration={6000}
              onClose={() => {
                setError("");
              }}
            >
              <Alert severity="error" className="alert">
                {error}
              </Alert>
            </Snackbar>
          )}

          <div className="userAdminInformation">
            <Grid container className="information-container">
              <Grid
                container
                direction="row"
                className="admin-header border-bottom-header"
              >
                <Grid item xs={12}>
                  <h3 className="header-label">
                    Action Queue Date Range Settings
                  </h3>
                </Grid>
              </Grid>
              <Grid item p={"10px 20px"} width={"100%"}>
                <Stack gap={1}>
                  <Typography>
                    <Box
                      component="span"
                      fontWeight="normal"
                      fontSize={"0.9em"}
                    >
                      Below, you are able to customize the amount of time
                      surrounding the actions presented in your Action Queue. By
                      changing the date range, you can control how many actions
                      are displayed by default.
                    </Box>
                  </Typography>
                  <Typography mt={1}>
                    <Box
                      component="span"
                      fontWeight="fontWeightBold"
                      fontSize={"0.9em"}
                    >
                      Note: Overdue actions are shown across all date ranges
                      regardless of the settings below.
                    </Box>
                  </Typography>
                  <Divider sx={{ width: "100%", my: 1 }} />
                  <Typography>
                    <Box
                      component="span"
                      fontWeight="fontWeightBold"
                      fontSize={"1.1em"}
                    >
                      Set Global Actions Queue Length
                    </Box>
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    className="field-container"
                    sx={{ ml: 0 }}
                  >
                    <span>History: Show actions &nbsp; </span>
                    <TextField
                      required
                      variant="outlined"
                      placeholder="0"
                      type="number"
                      style={{
                        width: "4em",
                      }}
                      className="the-field"
                      value={globalActionPastDays}
                      onChange={(e) =>
                        setGlobalActionPastDays(parseInt(e.target.value))
                      }
                    />
                    <span>&nbsp; day(s) prior to today.</span>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    className="field-container"
                    sx={{ ml: 0 }}
                  >
                    <span>Future: Show actions &nbsp; </span>
                    <TextField
                      required
                      variant="outlined"
                      placeholder="0"
                      type="number"
                      style={{
                        width: "4em",
                      }}
                      className="the-field"
                      value={globalActionFutureDays}
                      onChange={(e) =>
                        setGlobalActionFutureDays(parseInt(e.target.value))
                      }
                    />
                    <span>&nbsp; day(s) after today.</span>
                  </Box>

                  <Divider sx={{ width: "100%", my: 3 }} />

                  <Typography>
                    <Box
                      component="span"
                      fontWeight="fontWeightBold"
                      fontSize={"1.1em"}
                    >
                      Set Actions on Patient Profile Length
                    </Box>
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    className="field-container"
                    sx={{ ml: 0 }}
                  >
                    <span>History: Show actions &nbsp; </span>
                    <TextField
                      required
                      variant="outlined"
                      placeholder="0"
                      type="number"
                      style={{
                        width: "4em",
                      }}
                      className="the-field"
                      value={patientActionPastDays}
                      onChange={(e) =>
                        setPatientActionPastDays(parseInt(e.target.value))
                      }
                    />
                    <span>&nbsp; day(s) prior to today.</span>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    className="field-container"
                    sx={{ ml: 0 }}
                  >
                    <span>Future: Show actions &nbsp; </span>
                    <TextField
                      required
                      variant="outlined"
                      placeholder="0"
                      type="number"
                      style={{
                        width: "4em",
                      }}
                      className="the-field"
                      value={patientActionFutureDays}
                      onChange={(e) =>
                        setPatientActionFutureDays(parseInt(e.target.value))
                      }
                    />
                    <span>&nbsp; day(s) after today.</span>
                  </Box>
                  <Grid
                    item
                    display={"flex"}
                    justifyContent={"center"}
                    width={"100%"}
                    mt={4}
                  >
                    <Button
                      sx={{ p: "5px", width: "200px" }}
                      onClick={saveSettings}
                    >
                      Save
                    </Button>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ActionSettings;
