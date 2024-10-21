/* eslint-disable prettier/prettier */

// Library Imports
import * as React from "react";
import { Grid, Link, Stack, Switch } from "@mui/material";

// component imports
import FlashMessage from "../../../shared/FlashMessage";
import AdtNotificationPanel from "../../../paritals/AdtNotificationPanel";

// app setting imports
import { AuthenticationContext } from "../../../Context";

// getting helpers
import { getHeaders } from "../../../utils/HeaderHelper";
import { useParams } from "react-router-dom";

interface Props {}

const AdtNotifications: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const { id } = useParams();

  // For field expansion
  const [patient, setPatient] = React.useState<any>(null);
  const [adtTurnedOn, setAdtTurnedOn] = React.useState<any>(false);
  const [adtDisableMinutes, setAdtDisableMiniutes] = React.useState<number>(0);

  // Error handling states
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  React.useEffect(() => {
    getPatientInformation();
  }, []);

  const getPatientInformation = async() => {
    if (id) {
      const response = await fetch(`/data_fetching/patient_information/${id}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      if (response.status === 404) {
        window.location.href = "/not-found";
        return;
      }
      const result = await response.json();
      if (result.success == false) {
        console.log("result", result);
        if (result.status === 404) {
          console.error(result.message);
        }
      } else {
        setPatient(result?.resource);
        setAdtTurnedOn(result?.resource?.adt_notifications_turned_on);
        setAdtDisableMiniutes(result?.resource?.adt_disable_minutes);
      }
    }
  };

  const handleADTNotification = () => {
    if (id) {
      setAdtTurnedOn(!adtTurnedOn);
      fetch(`/adt/handle_adt_notification_change`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          patient_id: id,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.message);
          } else {
            getPatientInformation();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleTryLinking = () => {
    if (id) {
      fetch(`/data_fetching/link_with_ndhin/${id}`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.message);
          } else {
            getPatientInformation();
            setFlashMessage({ message: result.message, type: "success" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Grid container className="panel-container">
      <Grid item xs={12}>
        <FlashMessage flashMessage={flashMessage} />
        <Grid container className="panel-show-container">
          <Grid container className="panel-information-container">
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
                    <h3>ADT Notifications</h3>
                  </Grid>
                  <>
                    {patient?.linkedWithNdhin ? (
                      <>
                        {adtDisableMinutes > 0 ? (
                          <div>
                            <div className="switch adt-notif-container">
                              Notifications: Disabled for{" "}
                              {adtDisableMinutes} minutes
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Stack direction={"row"} alignItems={"center"} display={"flex"}>
                              Notifications: &nbsp;
                              <span>OFF</span>
                              <Switch
                                checked={adtTurnedOn}
                                onChange={handleADTNotification}
                              />
                              <span>ON</span>
                            </Stack>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="switch adt-notif-container">
                            Patient record not found on NDHIN:{" "}
                            <Link className="link" onClick={handleTryLinking}>
                              Try Linking
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                </Stack>
              </Grid>
            </Grid>
            <Grid container className="medication-container grey-container pad-top-10">
              <Grid item xs={12} className="medication-table-container">
                <AdtNotificationPanel patient_id={id} />
              </Grid>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdtNotifications;
