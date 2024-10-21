import * as React from "react";
import { Grid, Link } from "@mui/material";
import { snakeCaseToTitleCase } from "../../utils/CaseFormatHelper";
import DeleteIcon from "@mui/icons-material/Delete";
import CoreTeamCustomerAssociationModalNew from "./CoreTeamCustomerAssociationModalNew";
import CoreTeamCustomerAssociationModalDelete from "./CoreTeamCustomerAssociationModalDelete";

// heplers
import { PrivilegesContext } from "../../PrivilegesContext";
import { checkPrivileges } from "../../utils/PrivilegesHelper";

// auth helpers
import { getHeaders } from "../../utils/HeaderHelper";
import { AuthenticationContext } from "../../Context";

interface Props {
  csrfToken: string;
  selectedProvider: any;
  menu_track_src: string;
}

const CoreTeamCustomerAssociation: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [customerAssociations, setCustomerAssociations] =
    React.useState<any>(null);
  const [associationModalOpen, setAssociationModalOpen] =
    React.useState<boolean>(false);
  const [deleteModalHandler, setDeleteModalHandler] = React.useState<any>({
    open: false,
    customerUserId: null,
  });
  const [deleteable, setDeleteable] = React.useState<boolean>(false);
  const userPrivileges = React.useContext(PrivilegesContext);

  const getCustomerUsers = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(
      `/data_fetching/core_team_customer_association_index/${props.selectedProvider?.id}?tz=${tz}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setCustomerAssociations(result?.resource?.customer_associations);
          setDeleteable(result?.resource?.deletable);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getCustomerUsers();
  }, [props.selectedProvider]);

  const handleModalOpen = () => {
    event.preventDefault();
    setAssociationModalOpen(true);
  };

  const unassingCustomerUser = (customerUserId) => {
    setDeleteModalHandler({ open: true, customerUserId: customerUserId });
  };

  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid container justifyContent="space-between">
          <Grid item xs={5} className="association-header">
            <h3>Customer Association History</h3>
          </Grid>
          <Grid
            item
            xs={5}
            className="button-container"
            style={{ marginLeft: "10px" }}
          >
            {props.selectedProvider.is_active &&
              checkPrivileges(userPrivileges, "Add Customer Association") && (
                <Link
                  style={{ display: "inline-block", cursor: "pointer" }}
                  href="#"
                  onClick={handleModalOpen}
                >
                  <div style={{ float: "left", marginRight: 10 }}>
                    <img
                      src={props.menu_track_src}
                      width="40"
                      alt="Invite New Patient"
                    />
                  </div>
                  <div
                    style={{
                      float: "left",
                      fontFamily: "QuicksandMedium",
                      color: "#a29d9b",
                      marginTop: 8,
                    }}
                  >
                    Add Customer Association
                  </div>
                </Link>
              )}
          </Grid>
        </Grid>
        <div className="divider"></div>
        <Grid container>
          <Grid item xs={12} className="customer-association-table-container">
            <table className="association-table">
              <thead>
                <tr>
                  <th className="first-column-header">Customer</th>
                  <th>Status</th>
                  <th>Added By</th>
                  <th style={{ textAlign: "left" }}>Timestamp</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customerAssociations && (
                  <>
                    {customerAssociations.map((customerUser) => {
                      return (
                        <tr key={customerUser.id} className="data-row">
                          <td className="first-column-data">
                            {customerUser.customer_name}
                          </td>
                          <td>
                            {customerUser.status == "pending" && (
                              <div className="pending-circle"></div>
                            )}

                            {customerUser.status == "accepted" && (
                              <div className="accepted-circle"></div>
                            )}

                            {customerUser.status == "inactive" && (
                              <div className="inactive-circle"></div>
                            )}

                            <div>
                              {snakeCaseToTitleCase(
                                customerUser.status == "accepted"
                                  ? "active"
                                  : customerUser.status
                              )}
                            </div>
                          </td>
                          <td>{customerUser.added_by}</td>
                          <td style={{ textAlign: "left", padding: 0 }}>
                            <span>{customerUser?.formatted_assigned_at} </span>{" "}
                            <span
                              style={{
                                display: "inline-block",
                                marginLeft: 10,
                              }}
                            >
                              {customerUser?.formatted_assigned_at_time}
                            </span>
                          </td>
                          <td>
                            {customerUser.status != "inactive" &&
                              deleteable && (
                                <DeleteIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    unassingCustomerUser(customerUser.id);
                                  }}
                                />
                              )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
      <CoreTeamCustomerAssociationModalNew
        csrfToken={props.csrfToken}
        selectedProvider={props.selectedProvider}
        menu_track_src={props.menu_track_src}
        getCustomerUsers={getCustomerUsers}
        setAssociationModalOpen={setAssociationModalOpen}
        associationModalOpen={associationModalOpen}
      />

      <CoreTeamCustomerAssociationModalDelete
        csrfToken={props.csrfToken}
        deleteModalHandler={deleteModalHandler}
        setDeleteModalHandler={setDeleteModalHandler}
        getCustomerUsers={getCustomerUsers}
      />
    </Grid>
  );
};

export default CoreTeamCustomerAssociation;
