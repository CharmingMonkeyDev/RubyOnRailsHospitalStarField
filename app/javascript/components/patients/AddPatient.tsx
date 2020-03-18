/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, Link } from "@mui/material";
import AddPatientManual from "./AddPatientManual";
import AddPatientInvite from "./AddPatientInvite";

// context for modal control
import { NewPatientModalContext } from "../Context";
import ClearIcon from "@mui/icons-material/Clear";

interface Props {
  logo_src: string;
  button_src: string;
}

const AddPatient: React.FC<Props> = (props: any) => {
  // modal settting coming from context
  const modalSetting = React.useContext(NewPatientModalContext);

  const [manualOpen, setManualOpen] = React.useState<boolean>(false);
  const [inviteOpen, setInviteOpen] = React.useState<boolean>(false);

  const closeModal = () => {
    modalSetting.setNewPatientModalOpen(false);
  };

  const handleManualModalOpen = () => {
    setManualOpen(true);
  };

  const handleInviteModalOpen = () => {
    setInviteOpen(true);
  };

  return (
    <Modal
      open={modalSetting.newPatientModalOpen}
      onClose={closeModal}
      className="add-patient-container-modal"
    >
      <>
        <Grid container className="add-patient-body" sx={{ position: "relative" }}>
          <Grid container>
            <Grid item xs={12} sx={{position: "absolute", top: 10, right: 10}}>
              <ClearIcon onClick={closeModal} />
            </Grid>
            <Grid item xs={12} className="logo-container">
              <img src={props.logo_src} alt="logo" className="logo" />
            </Grid>
            <Grid item container xs={12}>
              <Grid
                container
                item
                xs={6}
                justifyContent="center"
                className="left-panel"
              >
                <Grid item container xs={8}>
                  <Grid item xs={12}>
                    <p className="header">Quick Add Patient — No App</p>
                  </Grid>
                  <Grid item xs={12} className="content-body">
                    Add a patient manually. Patient will NOT have access to app or
                    text communication.
                  </Grid>
                  <Grid item xs={12}>
                    <Link onClick={handleManualModalOpen} className="button">
                      Add Manually
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item xs={6} justifyContent="center">
                <Grid item container xs={8}>
                  <Grid item xs={12}>
                    <p className="header">Invite Patient to Starfield App</p>
                  </Grid>
                  <Grid item xs={12} className="content-body">
                    Invite patient to use Starfield App. Patient must complete
                    enrollment on their phone.
                  </Grid>
                  <Grid item xs={12}>
                    <Link onClick={handleInviteModalOpen} className="button">
                      Invite Patient
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <AddPatientManual
              manualOpen={manualOpen}
              setManualOpen={setManualOpen}
            />
            <AddPatientInvite
              logo_src={props.logo_src}
              button_src={props.button_src}
              inviteOpen={inviteOpen}
              setInviteOpen={setInviteOpen}
            />
          </Grid>
        </Grid>
      </>
    </Modal>
  );
};

export default AddPatient;
