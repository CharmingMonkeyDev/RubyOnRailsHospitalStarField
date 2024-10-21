/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";

// helper
import { getHeaders } from "../utils/HeaderHelper";
import { FlashContext, ImagesContext } from "../Context";

interface Props {
  csrfToken: string;
  setResendModalHandler: any;
  resendInviteModalHandler: any;
}

const ResendCustomerUserInviteModal: React.FC<Props> = (props: any) => {
  const imagesList = React.useContext(ImagesContext);
  const flashContext = React.useContext(FlashContext);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleResendInvite = () => {
    setLoading(true);
    fetch(
      `/resend_customer_user_association_patient/${props.resendInviteModalHandler.customerUserId}`,
      {
        method: "POST",
        headers: getHeaders(props.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
          flashContext.setMessage({text: result.error, type: "error"});
        } else {
          props.setResendModalHandler({ open: false, customerUserId: null });
          flashContext.setMessage({text: 'Invite sent!', type: "success"});
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        flashContext.setMessage({text: error, type: "error"});
        setLoading(false);
      });
  };
  return (
    <Modal
      open={props.resendInviteModalHandler.open}
      className="unsaved-changes-modal-container"
    >
      <div className="paper">
        <div className="paperInner">
          <Grid container>
            <Grid item xs={12}>
              <p className="main-header">Resend Invite</p>
            </Grid>
            <Grid item xs={12}>
              <p style={{ textAlign: "center" }}>
                Are you sure you want to continue?
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
                onClick={() =>
                  props.setResendModalHandler({
                    open: false,
                    customerUserId: null,
                  })
                }
              >
                Cancel
              </Link>
            </Grid>
            <Grid item xs={6} className="confirm-btn-container">
              {
                !loading
                ? (
                  <Link onClick={handleResendInvite} className="confirm-btn">
                    Confirm
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
      </div>
    </Modal>
  );
};

export default ResendCustomerUserInviteModal;