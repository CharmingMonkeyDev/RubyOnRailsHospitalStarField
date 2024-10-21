/* eslint-disable prettier/prettier */
import { Grid } from "@mui/material";
import * as React from "react";
import WarningIcon from '@mui/icons-material/Warning';

// helpers
import { useEffect, useState } from "react";
import { getHeaders } from "../../utils/HeaderHelper";
interface Props {
  user_id: number;
}

const SyncNotification: React.FC<Props> = (props: any) => {
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const checkDeviceSyncing = () => {
    fetch(`/sync_device_status/${props.user_id}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        setShowNotification(!result.resource ?? false);
      });
  };

  useEffect(() => {
    checkDeviceSyncing();
  });

  return (
    <>
      {showNotification && (
        <div className='syncNotification'>
          <Grid container justifyContent="center">
            <Grid item>
              <WarningIcon />
              <span>
                Your CGM device has become disconnected.
                <br />
                Please reconnect your device.
              </span>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default SyncNotification;
