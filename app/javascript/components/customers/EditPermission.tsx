import * as React from "react";
import { Modal, Grid, Link, Switch, Snackbar } from "@mui/material";
import { Alert } from '@mui/material';

// helpers
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import GeneralModal from "../modals/GeneralModal";

interface Props {
  customerId: any;
  open: boolean;
  setOpen: any;
  customerName: string;
}

const EditPermission: React.FC<Props> = (props: any) => {
  //  context import
  const authenticationSetting = React.useContext(AuthenticationContext);

  const [permissions, setPermissions] = React.useState<any>([]);
  const [error, setError] = React.useState<string>("");

  const getPermissions = () => {
    fetch(`/customer_permissions/${props.customerId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setPermissions(result.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getPermissions();
  }, [props.customerId, props.open]);

  const updatePrivilegeState = (event) => {
    const permissionId = event.target.value;
    const permitted = event.target.checked;
    fetch(`/customer_permissions/${permissionId}`, {
      method: "PUT",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        customer_permission_control: {
          permitted: permitted,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (!result.success) {
          setError(result.message);
        } else {
          getPermissions();
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const closeModal = () => {
    props.setOpen(false);
  };

  return (
    <>
      <GeneralModal
        open={props.open}
        title={"Customer Permissions"}
        successCallback={undefined}
        closeCallback={closeModal}
        showContinueIcon={false}
        cancelButtonText="Close"
        width="900px"
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ paddingTop: 20 }}
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
          <Grid container item xs={12}>
            {permissions.map((permission) => (
              <Grid
                item
                xs={6}
                container
                key={permission.id}
                style={{ padding: "5px" }}
              >
                <Grid item xs={8}>
                  {permission.permission_name}
                </Grid>
                <Grid item xs={4}>
                  <div className="privilegeToggle">
                    <div className="toggleLable">OFF</div>
                    <Switch
                      value={permission.id}
                      checked={permission.permitted}
                      onChange={updatePrivilegeState}
                      color="primary"
                    />
                    <div className="toggleLabel">ON</div>
                  </div>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </GeneralModal>
    </>
  );
};

export default EditPermission;
