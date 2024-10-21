/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Snackbar, Alert, Box } from "@mui/material";
import * as React from "react";

// helpers
import { getHeaders } from "./../utils/HeaderHelper";
import ActionFilters from "./ActionFilters";
import Actions from "./Actions";
import MessageBoard from "../message_board/MessageBoard";
import { Stack } from "@mui/system";
import { AuthenticationContext, ImagesContext } from "../Context";
import ActionHeader from "./ActionHeader";
import GlobalActionQueue from "./GlobalActionQueue";

export type ActionSourceFilterType = "all" | "adt_discharge" | "care_plan";

interface Props {
  csrfToken: string;
  user_id: string;
  action_queue_assign_icon: string;
  action_queue_unassign_icon: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  sort_plain_src: string;
}

const ActionQueue: React.FC<Props> = (props: any) => {
  const [error, setError] = React.useState<string>("");
  const [success_message, setSuccessMessage] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState<boolean>(false);
  const [reloadHook, setReloadHook] = React.useState<boolean>(false);
  const [actionStatuses, setActionStatuses] = React.useState<any>(null);
  const [sourceSummary, setSourceSummary] = React.useState<any>(null);
  const [source, setSource] = React.useState<ActionSourceFilterType>("all");
  const images = React.useContext(ImagesContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [basicInfo, setBasicInfo] = React.useState<any>();

  const getInitialQueueData = () => {
    fetch(`/data_fetching/get_initial_queue_data`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.error(result.error);
        } else {
          setActionStatuses(Object.keys(result.statuses));
          setSourceSummary(result.source_summary);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    getInitialQueueData();
  }, []);

  React.useEffect(() => {
    fetch(`/data_fetching/users/basic_user_info/${props.user_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setBasicInfo(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.user_id]);

  return (
    <div className="action-queue">
      <Grid
        container
        direction="row"
        alignItems="flex-start"
        spacing={2}
        className="action-queue-container"
      >
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

        {success_message.length > 0 && (
          <Snackbar
            open={success_message.length > 0}
            autoHideDuration={6000}
            onClose={() => {
              setSuccessMessage("");
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert severity="success" className="alert">
              {success_message}
            </Alert>
          </Snackbar>
        )}
        <Grid item xs={12} pr={"20px"}>
          <ActionHeader basicInfo={basicInfo} />
        </Grid>
        <Grid item xs={12} pr={"20px"}>
          <GlobalActionQueue />
        </Grid>
      </Grid>
    </div>
  );
};

export default ActionQueue;
