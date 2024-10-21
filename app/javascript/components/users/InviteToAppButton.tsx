/* eslint-disable prettier/prettier */
// library import
import * as React from "react";
import { Modal, Grid, Link } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// app setting import
import { AuthenticationContext, FlashContext, ImagesContext } from "../Context";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patientId: string;
  addIcon?: any;
}

const InviteToAppButton: React.FC<Props> = (props: any) => {
  // controlling overall chat flow and authentication
  const authenticationSetting = React.useContext(AuthenticationContext);
  const imagesList = React.useContext(ImagesContext);
  const flashContext = React.useContext(FlashContext);

  // other states
  const [open, setOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const convertManualPatientToInvited = () => {
    if (props.patientId) {
      setIsLoading(true);
      fetch(`/patients/convert_patient_to_invited`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          user_id: props.patientId,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
            flashContext.setMessage({
              text: result.error,
              type: "error",
          });
          } else {
            flashContext.setMessage({
              text: 'Invite sent to patient',
              type: "success",
            });
          handleClose()
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          flashContext.setMessage({
            text: error,
            type: "error"
          });
          setIsLoading(false);
      })
    };
  }
  return (
    <>
      <Link className="invite-app-user-link" onClick={handleOpen}>
        {props.addIcon ??
            <>
              <AddIcon className="user-type-icon invite-app-user-icon" sx={{mr: 1}} />
            </>
        }
        <span className="app-user-text">Invite to App</span>
      </Link>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="archive-chat"
          aria-describedby="archive-chat"
        >
          <div className="new-to-chat archive-window">
            <Grid container justifyContent="center">
              <Grid item xs={12} className="form-header">
                Are you sure you want to invite user?
              </Grid>
            </Grid>
            <Grid item xs={10} className="search-container"></Grid>
            <Grid
              container
              item
              xs={10}
              className="modal-button-container invite-button-container"
            >
              <Grid item xs={6} className="action">
                <Link onClick={handleClose} className="link">
                  No
                </Link>
              </Grid>
              <Grid item xs={6} className="action">
                {
                  !isLoading
                  ? (
                    <Link
                    onClick={convertManualPatientToInvited}
                    className="button"
                  >
                    Yes
                  </Link>  
                  )
                  : (
                    <div style={{marginTop: 5}}>
                      <img
                        src={imagesList.spinner_src}
                        style={{ width: "24px" }}>
                      </img>
                    </div>
                  )
                }
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default InviteToAppButton;
