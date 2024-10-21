/* eslint-disable prettier/prettier */
import * as React from "react";
import {
  Modal,
  Grid,
  Link,
  Switch,
  Snackbar,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {
  selected_user: any;
  csrfToken: string;
  setPrivilegesModalOpen: any;
}

const EditPrivileges: React.FC<Props> = (props: any) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [privileges, setPrivileges] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");
  const [showConfirmResetModal, setShowConfirmResetModal] =
    React.useState<boolean>(false);
  const [showSelectCloneModal, setShowSelectCloneModal] =
    React.useState<boolean>(false);
  const [cloneableUsers, setCloneableUsers] = React.useState<any>(null);
  const [selectedCloneUserId, setSelectedCloneUserId] =
    React.useState<any>(null);
  const [selectedUserName, setSelectedUserName] = React.useState<string>("");
  const [showCloneConfirmationModal, setShowCloneConfirmationModal] =
    React.useState<boolean>(false);

  const getPrivileges = () => {
    fetch(`/data_fetching/get_user_privileges/${props.selected_user?.id}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setPrivileges(result.resource.privileges);
          setCloneableUsers(result.resource.cloneable_users);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getPrivileges();
  }, []);

  const updatePrivilegeState = (event) => {
    const privilege_id = event.target.value;
    const checked = event.target.checked;
    fetch(`/customer_user_privileges/${privilege_id}`, {
      method: "PUT",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        customer_user_privilege: {
          checked: checked,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          setError(result.message);
        } else {
          getPrivileges();
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const resetPrivileges = () => {
    fetch(`/reset_customer_user_privileges/${props.selected_user?.id}`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          setError(result.message);
        } else {
          setShowConfirmResetModal(false);
          getPrivileges();
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const cloneUser = () => {
    fetch(`/clone_customer_user_privileges/${props.selected_user?.id}`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        customer_user_privilege: {
          clone_user_id: selectedCloneUserId,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          setError(result.message);
        } else {
          setShowSelectCloneModal(false);
          setShowCloneConfirmationModal(false);
          getPrivileges();
        }
      })
      .catch((error) => {
        setError("Privileges cannot be cloned.");
      });
  };

  const closeModal = () => {
    props.setPrivilegesModalOpen(false);
  };

  const closeResetModal = () => {
    setShowConfirmResetModal(false);
  };

  const closeCloneModal = () => {
    setShowSelectCloneModal(false);
  };

  const handleResetClick = () => {
    setShowConfirmResetModal(true);
  };

  const handleCloneClick = () => {
    setShowSelectCloneModal(true);
  };

  const roleFormatted = (role) => {
    const formatted = [];
    role.split("_").forEach((word) => {
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      formatted.push(capitalized);
    });
    return formatted.join(" ");
  };

  const handleUserSelection = (user_id) => {
    setSelectedCloneUserId(user_id);
    const user = cloneableUsers.find((user) => user.id == user_id);
    setSelectedUserName(user.name_reversed);
  };

  return (
    <>
      {privileges != null && (
        <Modal open={open} onClose={closeModal} className={"modal-primary"}>
          <div className="paper">
            <div className="paperInner">
              <Grid item xs={12}>
                <div className="main-header">
                {`User Privileges For ${props.selected_user.last_name}, ${
                  props.selected_user.first_name
                } ${props.selected_user.middle_name} (${roleFormatted(
                  props.selected_user.role
                )})`}
                <span
                  id="dismiss-button"
                  onClick={closeModal}
                >
                  <ClearIcon />
                </span>
                </div>
              </Grid>

              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                {error.length > 0 && (
                  <Snackbar
                    open={error.length > 0}
                    autoHideDuration={6000}
                    onClose={() => {
                      setError("");
                    }}
                  >
                    <Alert severity="error">{error}</Alert>
                  </Snackbar>
                )}
                <Grid item xs={12} className="content" style={{ padding: "0 40px 0  40px" }}>
                  <ul className="privilegesList">
                    {privileges.map((privilege) => (
                      <li key={privilege.id} className="privilegeItem">
                        {privilege.name}
                        <div className="privilegeToggle">
                          <div className="toggleLable">OFF</div>
                          <Switch
                            value={privilege.id}
                            checked={privilege.state}
                            onChange={updatePrivilegeState}
                            color="primary"
                          />
                          <div className="toggleLabel">ON</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Grid>
                {/* <Grid item xs={6} className="centerButton">
                  <Link
                    className="clearButtonStyling"
                    onClick={closeModal}
                    style={{
                      font: "14px QuicksandMedium",
                      color: "#313133",
                      textDecoration: "underline",
                      marginTop: 20,
                      display: "inline-block",
                    }}
                  >
                    Close
                  </Link>
                </Grid> */}
              </Grid>
              <div className="buttonRow">
                <div className="orangeButton" onClick={handleResetClick}>
                  Reset to Default
                </div>
                <div className="orangeButton" onClick={handleCloneClick}>
                  Clone
                </div>
              </div>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={6} className="centerButton">
                    <Link
                      className="clearButtonStyling"
                      onClick={closeModal}
                      style={{
                        font: "14px QuicksandMedium",
                        color: "#313133",
                        textDecoration: "underline",
                        marginTop: 10,
                        marginBottom: 20,
                        display: "inline-block",
                      }}
                    >
                      Close
                    </Link>
                </Grid>
              </Grid>
            </div>
          </div>
        </Modal>
      )}
      {showConfirmResetModal && (
        <Modal open={open} onClose={closeModal} className="confirmModal">
          <div className="paper">
            <div className="paperInner">
              <p className="inviteHeader">Reset to Default?</p>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <p>
                  You are attempting to reset this user’s privileges. Are you
                  sure you want to continue?
                </p>
              </Grid>
              <div className="buttonRow">
                <Link
                  onClick={closeResetModal}
                  className="clearButtonStyling"
                  style={{
                    font: "14px QuicksandMedium",
                    color: "#313133",
                    textDecoration: "underline",
                    display: "inline-block",
                    marginRight: "20px",
                  }}
                >
                  Cancel
                </Link>
                <div className="orangeButton" onClick={resetPrivileges}>
                  Confirm
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {showSelectCloneModal && (
        <Modal open={open} onClose={closeModal} className="confirmModal">
          <div className="paper">
            <div className="paperInner">
              <p className="inviteHeader">Search for User to Clone</p>

              <TextField
                size="small"
                id="GroupActions"
                value={selectedCloneUserId}
                className="autocomplete"
                variant="outlined"
                onChange={(event) => {
                  handleUserSelection(event.target.value);
                }}
                select
              >
                {cloneableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name_reversed}
                  </MenuItem>
                ))}
              </TextField>
              <div className="buttonRow">
                <Link
                  onClick={closeCloneModal}
                  className="clearButtonStyling"
                  style={{
                    font: "14px QuicksandMedium",
                    color: "#313133",
                    textDecoration: "underline",
                    display: "inline-block",
                    marginRight: "20px",
                  }}
                >
                  Cancel
                </Link>
                <div
                  className="orangeButton"
                  onClick={() => setShowCloneConfirmationModal(true)}
                >
                  Select
                </div>
              </div>
            </div>
            {showCloneConfirmationModal && (
              <Modal
                open={showCloneConfirmationModal}
                onClose={closeModal}
                className="confirmModal"
              >
                <div className="paper">
                  <div className="paperInner">
                    <p className="inviteHeader">Clone {selectedUserName}?</p>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <p>
                        You are attempting to clone this user’s privileges to
                        the current user. Are you sure you want to continue?
                      </p>
                    </Grid>
                    <div className="buttonRow">
                      <Link
                        onClick={() => setShowCloneConfirmationModal(false)}
                        className="clearButtonStyling"
                        style={{
                          font: "14px QuicksandMedium",
                          color: "#313133",
                          textDecoration: "underline",
                          display: "inline-block",
                          marginRight: "20px",
                        }}
                      >
                        Cancel
                      </Link>
                      <div className="orangeButton" onClick={cloneUser}>
                        Confirm
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default EditPrivileges;
