import { Grid, Link, Modal } from "@mui/material";
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";

interface Props {
  unsavedChanges: boolean;
}

const UnsavedChangesModal: React.FC<Props> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [unsavedModalOpen, setUnsavedModalOpen] =
    React.useState<boolean>(false);
  const [nextLocation, setNextLocation] = React.useState<string>(null);
  const [allowNavigation, setAllowNavigation] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unblock = history.block((nextLocaltion) => {
      if (!props.unsavedChanges || allowNavigation) {
        return true; // Allow navigation
      } else {
        setNextLocation(nextLocaltion);
        setUnsavedModalOpen(true);
        return false; // Block navigation
      }
    });

    return () => {
      unblock();
    };
  }, [props.unsavedChanges, allowNavigation, history, location]);

  React.useEffect(() => {
    if (allowNavigation && nextLocation) {
      history.push(nextLocation);
    }
  }, [allowNavigation, history, nextLocation]);

  const confirmOnSaveModal = () => {
    setUnsavedModalOpen(false);
    setAllowNavigation(true);
  };

  return (
    <Modal open={unsavedModalOpen} className="unsaved-changes-modal-container">
      <div className="paper">
        <div className="paperInner">
          <Grid container>
            <Grid item xs={12}>
              <p className="main-header">Unsaved Changes</p>
            </Grid>
            <Grid item xs={12}>
              <p className="content">
                Are you sure you want to leave this section? There are some
                unsaved changes.
              </p>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={6} className="cancel-link-container">
              <Link
                className="cancel-link"
                onClick={() => setUnsavedModalOpen(false)}
              >
                Cancel
              </Link>
            </Grid>
            <Grid item xs={6} className="confirm-btn-container">
              <Link onClick={confirmOnSaveModal} className="confirm-btn">
                Confirm
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Modal>
  );
};

export default UnsavedChangesModal;
