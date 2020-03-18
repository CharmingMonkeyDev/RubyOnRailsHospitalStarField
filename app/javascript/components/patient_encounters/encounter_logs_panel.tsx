/* eslint-disable prettier/prettier */

// Library Imports
import * as React from "react";
import { Grid, Link } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import CloseIcon from "@mui/icons-material/Close";

// header import
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import { AuthenticationContext } from "../Context";

interface Props {
  encounterBillingId: string;
  reloadLogger: string;
}

const EncounterLogsPanel: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [logsExpanded, setLogsExpanded] = React.useState<boolean>(false);
  const [loggers, setLoggers] = React.useState<any>([]);

  React.useEffect(() => {
    getLogs();
  }, [props.encounterBillingId, props.reloadLogger]);

  const getLogs = () => {
    if (props.encounterBillingId) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      fetch(
        `/encounters/encounter_logs_panel_data/${props.encounterBillingId}?tz=${tz}`,
        {
          method: "GET",
          headers: getHeaders(authenticationSetting.csrfToken),
        }
      )
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setLoggers(result?.resource);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Grid container justifyContent="center" className="logs-panel">
      <Grid item xs={8} className="logs-container">
        {logsExpanded ? (
          <>
            {loggers?.map((log, index) => {
              return (
                <p key={log?.id}>
                  {log?.formatted_log}{" "}
                  {index == 0 && (
                    <Link onClick={() => setLogsExpanded(false)}>
                      <CloseIcon className="close-icon icon-position" />
                    </Link>
                  )}
                </p>
              );
            })}
          </>
        ) : (
          <p>
            {loggers[0]?.formatted_log}
            <Link
              onClick={() => setLogsExpanded(true)}
              className="icon-position"
            >
              <RestoreIcon />
            </Link>
          </p>
        )}
      </Grid>
    </Grid>
  );
};

export default EncounterLogsPanel;
