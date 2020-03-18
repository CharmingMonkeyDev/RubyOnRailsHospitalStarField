/* eslint-disable prettier/prettier */
import * as React from "react";
import {
  Grid,
  Link,
  Modal,
  TextField,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { Alert } from '@mui/material';

// helper
import { getHeaders } from "../utils/HeaderHelper";
import GeneralModal from "../modals/GeneralModal";

interface Props {
  csrfToken: string;
  selectedPatient: any;
  menu_track_src: string;
  getCustomerUsers: any;
  associationModalOpen: boolean;
  setAssociationModalOpen: any;
}

const UserCustomerAssociationModalNew: React.FC<Props> = (props: any) => {
  const [customerOptions, setCustomerOptions] = React.useState<any>(null);
  const [selectedCustomerID, setselectedCustomerID] = React.useState<any>(null);
  const [flashMessage, SetFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleCustomerUserSave = () => {
    event.preventDefault();
    setLoading(true);
    fetch(`/customer_users/`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        customer_user: {
          user_id: props.selectedPatient.id,
          customer_id: selectedCustomerID,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
          SetFlashMessage({ message: result.message, type: "error" });
        } else {
          SetFlashMessage({ message: result.message, type: "success" });
          props.setAssociationModalOpen(false);
          props.getCustomerUsers();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetch(`/customer_users/new/`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          setCustomerOptions(result?.data?.customers);
          if (result?.data?.customers) {
            setselectedCustomerID(result.data.customers[0].id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.selectedPatient]);

  return (
    <>
      {flashMessage.message.length > 0 && (
        <Snackbar
          open={flashMessage.message.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            SetFlashMessage({ message: "", type: "error" });
          }}
        >
          <Alert severity={flashMessage.type}>{flashMessage.message}</Alert>
        </Snackbar>
      )}
      <GeneralModal
        open={props.associationModalOpen}
        title={"Add a Customer Association"}
        successCallback={handleCustomerUserSave}
        closeCallback={() => props.setAssociationModalOpen(false)}
        containerClassName="add-patient-modal"
        confirmButtonText="Confirm"
        width="600px"
        isLoading={loading}
      >
        <Grid container style={{ paddingTop: 20}}>
          <Grid item xs={12}>
            {customerOptions && (
              <TextField
                id="customer_id"
                size="small"
                className="textInput"
                value={selectedCustomerID}
                variant="outlined"
                onChange={(event) => {
                  setselectedCustomerID(event.target.value);
                }}
                select
              >
                {customerOptions.map((customer, index) => (
                  <MenuItem key={index} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>
        </Grid>
      </GeneralModal>
    </>
  );
};

export default UserCustomerAssociationModalNew;