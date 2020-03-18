// importing library
import * as React from "react";
import { Modal, Grid, TextField, Link, Snackbar } from "@mui/material";
import { Alert } from '@mui/material';

// importing hooks
import { usePatientInvite } from "../hooks/patients/usePatientInvite";

// importing components
import PatientInviteVerified from "./PatientInviteVerified";

interface Props {
  csrfToken: string;
  logo_src: string;
  button_src: string;
  patient_id: any;
}

const PatientInvite: React.FC<Props> = (props: any) => {
  const {
    open,
    dateOfBirth,
    setDateOfBirth,
    disabledButton,
    verifyIdentity,
    identityVerified,
    error,
    setError,
  } = usePatientInvite(props.patient, props.csrfToken);

  return (
    <Modal
      className="patient-invite-modal"
      open={open}
      style={{ overflow: "auto" }}
      BackdropProps={{
        style: {
          opacity: "1",
          background: "#F2F2F2",
          overflow: "auto",
        },
      }}
    >
      <div className="paper">
        <div className="paperInner">
          {identityVerified ? (
            <PatientInviteVerified
              csrfToken={props.csrfToken}
              logo_src={props.logo_src}
              button_src={props.button_src}
              patient={props.patient}
            />
          ) : (
            <>
              <p className="inviteHeader">Welcome to</p>

              <img
                src={props.logo_src}
                alt="Project Starfield"
                className="loginLogo"
                style={{ margin: "auto", marginTop: "15px" }}
              />

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

              {props.patient ? (
                <>
                  <p className="modalText" style={{ marginBottom: "0px" }}>
                    You have been invited to join Starfield Health
                  </p>

                  <p className="modalText" style={{ marginTop: "0px" }}>
                    Please confirm your identity
                  </p>

                  <TextField
                    id="date"
                    label="Date of birth"
                    value={dateOfBirth}
                    className="textInput"
                    type="date"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => {
                      setDateOfBirth(event.target.value);
                    }}
                  />

                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={12} className="centerButton">
                      {!disabledButton ? (
                        <Link
                          className="clearButtonStyling"
                          onClick={verifyIdentity}
                        >
                          <img
                            src={props.button_src}
                            alt="Save Patient Information"
                            className="loginButton"
                          />
                        </Link>
                      ) : (
                        <>Verifying...</>
                      )}
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <p className="modalText">
                    Your account was not found, or you already have completed
                    your account.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PatientInvite;
