/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";

// helper
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  deleteModalHandler: any;
  setDeleteModalHandler: any;
  getCustomerUsers: any;
}

const UserCustomerAssociationModalDelete: React.FC<Props> = (props: any) => {
  const handleCustomerUserSave = () => {
    fetch(`/customer_users/${props.deleteModalHandler.customerUserId}`, {
      method: "DELETE",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          props.setDeleteModalHandler({ open: false, customerUserId: null });
          props.getCustomerUsers();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Modal
      open={props.deleteModalHandler.open}
      className="unsaved-changes-modal-container"
    >
      <div className="paper">
        <div className="paperInner">
          <Grid container>
            <Grid item xs={12}>
              <p className="main-header">Deactivate Customer Association</p>
            </Grid>
            <Grid item xs={12}>
              <p>
                Deactivating the patient from this customer association will no
                longer allow this care team to have access to this patient’s
                file. Are you sure you want to continue?
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
                  props.setDeleteModalHandler({
                    open: false,
                    customerUserId: null,
                  })
                }
              >
                Cancel
              </Link>
            </Grid>
            <Grid item xs={6} className="confirm-btn-container">
              <Link onClick={handleCustomerUserSave} className="confirm-btn">
                Confirm
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Modal>
  );
};

export default UserCustomerAssociationModalDelete;
