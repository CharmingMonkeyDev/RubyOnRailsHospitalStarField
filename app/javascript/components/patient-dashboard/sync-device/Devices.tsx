/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";

//helpers
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {
  setError: any;
  disabledButton: any;
  setDisabledButton: any;
  device: string;
  setShowSyncDevice: any;
  setShowDeviceList: any;
  userId: number;
  csrfToken: string;
}

const Devices: React.FC<Props> = (props: any) => {
  const [syncedAccounts, setSyncedAccounts] = React.useState<any>([]);
  const [confirmModalOpen, setConfirmModalOpen] =
    React.useState<boolean>(false);
  const [accountId, setAccountId] = React.useState<number>(null);

  const unlinkAccount = () => {
    fetch(`/synced_accounts/${accountId}`, {
      method: "DELETE",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success === false) {
          console.log(result.message);
          window.location.reload();
        } else {
          setConfirmModalOpen(false);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSyncedAccounts = () => {
    fetch(`/synced_accounts`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success === false) {
          console.log(result.message);
        } else {
          setSyncedAccounts(result.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getSyncedAccounts();
  }, []);

  const handleContinue = () => {
    props.setShowSyncDevice(true);
    props.setShowDeviceList(false);
  };

  const closeModal = () => {
    setConfirmModalOpen(false);
  };

  const handleConfirm = (event) => {
    setAccountId(event.target.value);
    setConfirmModalOpen(true);
  };

  const checkModalOpen = (): boolean => {
    return accountId && confirmModalOpen;
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="pageHeading"
          >
            <Grid item xs={12} className="pageTitle">
              <span>My Devices</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {syncedAccounts && syncedAccounts.length > 0 ? (
            <>
              {syncedAccounts.map((item) => (
                <div className="deviceForm" key={item.id}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={props.device}
                      alt="Device"
                      style={{ marginRight: "16px" }}
                    />
                    <p>{item.account_type}</p>
                  </Grid>
                  <button
                    className="unlinkButton"
                    value={item.id}
                    onClick={handleConfirm}
                  >
                    Unlink Account
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="deviceForm">
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={props.device}
                  alt="Device"
                  style={{ marginRight: "16px" }}
                />
                <p>No device connected</p>
              </Grid>
            </div>
          )}
        </Grid>
        <Grid item xs={12} className="centerButton">
          {!props.disabledButton ? (
            <Link className="nextButton" onClick={handleContinue}>
              Add a Device
            </Link>
          ) : (
            <>Saving...</>
          )}
        </Grid>
        <Modal open={checkModalOpen()} onClose={closeModal}>
          <div className="confirm-unlink-modal">
            <div className="title">Unlink Dexcom?</div>
            <p>
              You are attempting to revoke access to Starfield from collecting
              your Dexcom data. Your CGM data will no longer be shared with
              Starfield. Would you like to proceed?
            </p>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={6}>
                <div
                  className="clearButtonStyling"
                  onClick={() => setConfirmModalOpen(false)}
                >
                  Cancel
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="nextButton" onClick={unlinkAccount}>
                  Revoke Access
                </div>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </Grid>
    </div>
  );
};

export default Devices;
