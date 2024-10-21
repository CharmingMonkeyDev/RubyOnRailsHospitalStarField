/* eslint-disable prettier/prettier */
import * as React from "react";
import {
  Grid,
  Link,
  Modal,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";
import GeneralModal from "../../modals/GeneralModal";

interface Props {
  csrfToken: string;
  selectedProvider: any;
  menu_track_src: string;
  getCustomerUsers: any;
  associationModalOpen: boolean;
  setAssociationModalOpen: any;
}

const CoreTeamCustomerAssociationModalNew: React.FC<Props> = (props: any) => {
  const [customerOptions, setCustomerOptions] = React.useState<any>(null);
  const [selectedCustomerID, setselectedCustomerID] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");

  const handleCustomerUserSave = () => {
    event.preventDefault();
    fetch(`/provider_customer_users`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        customer_user: {
          user_id: props.selectedProvider.id,
          customer_id: selectedCustomerID,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          setError(result.message);
        } else {
          props.setAssociationModalOpen(false);
          props.getCustomerUsers();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetch(`/provider_customer_users/new`, {
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
  }, [props.selectedProvider]);

  return (
    <>
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
      <GeneralModal
        open={props.associationModalOpen}
        title={"Add a Customer Association"}
        successCallback={handleCustomerUserSave}
        closeCallback={() => props.setAssociationModalOpen(false)}
        containerClassName="add-patient-modal"
        confirmButtonText="Confirm"
        width="600px"
      >
        <Grid container style={{ paddingTop: 20 }}>
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

export default CoreTeamCustomerAssociationModalNew;
