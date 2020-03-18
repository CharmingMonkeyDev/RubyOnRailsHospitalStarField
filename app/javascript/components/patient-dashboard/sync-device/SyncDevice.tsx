/* eslint-disable prettier/prettier */
import * as React from "react";
import { Snackbar } from "@mui/material";
import { Alert } from '@mui/material';
import ChooseDevice from "./ChooseDevice";
import DexcomLogin from "./DexcomLogin";
import Devices from "./Devices";

interface Props {
  patient_id: number;
  csrfToken: string;
  device: string;
}

const SyncDevice: React.FC<Props> = (props: any) => {
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState<boolean>(false);
  const [showDeviceList, setShowDeviceList] = React.useState<boolean>(true);
  const [showSyncDevice, setShowSyncDevice] = React.useState<boolean>(false);
  const [showDexcomLogin, setShowDexcomLogin] = React.useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] =
    React.useState<string>("Dexcom CGM");
  const [dexcomUrl, setDexcomUrl] = React.useState<string>("");

  return (
    <div className="sync-device">
      {error.length > 0 && (
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            props.setError("");
          }}
        >
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        </Snackbar>
      )}

      {showDeviceList && (
        <Devices
          setError={setError}
          setDisabledButton={setDisabledButton}
          disabledButton={disabledButton}
          device={props.device}
          setShowSyncDevice={setShowSyncDevice}
          setShowDeviceList={setShowDeviceList}
          userId={props.patient_id}
          csrfToken={props.csrfToken}
        />
      )}

      {showSyncDevice && (
        <ChooseDevice
          setError={setError}
          setDisabledButton={setDisabledButton}
          disabledButton={disabledButton}
          device={props.device}
          setSelectedDevice={setSelectedDevice}
          setShowSyncDevice={setShowSyncDevice}
          setShowDexcomLogin={setShowDexcomLogin}
          selectedDevice={selectedDevice}
          setDexcomUrl={setDexcomUrl}
        />
      )}

      {showDexcomLogin && (
        <DexcomLogin
          setError={setError}
          setDisabledButton={setDisabledButton}
          disabledButton={disabledButton}
          patient_id={props.patient_id}
          csrfToken={props.csrfToken}
          dexcomUrl={dexcomUrl}
        />
      )}
    </div>
  );
};

export default SyncDevice;
