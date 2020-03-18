import {
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { AuthenticationContext, ImagesContext } from "../../../../Context";
import UserCustomerAssociationModalNew from "../../../../users/UserCustomerAssociationModalNew";
import { getHeaders } from "../../../../utils/HeaderHelper";
import ResendCustomerUserInviteModal from "../../../../users/ResendCustomerUserInviteModal";
import { PrivilegesContext } from "../../../../PrivilegesContext";
import { checkPrivileges } from "../../../../utils/PrivilegesHelper";
import { capitalize } from "../../../../utils/StringHelper";
import SortComponent from "../../../../common/SortComponent";

interface Props {
  patient: any;
}

const CustomerAssociationHistory: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const userPrivileges = React.useContext(PrivilegesContext);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });
  const [associationModalOpen, setAssociationModalOpen] =
    React.useState<boolean>(false);
  const [customerAssociations, setCustomerAssociations] = React.useState<any>(
    []
  );
  const [resendInviteModalHandler, setResendModalHandler] = React.useState<any>(
    { open: false, customerUserId: null }
  );

  React.useEffect(() => {
    if (props.patient) {
      getCustomerUsers();
    }
  }, [props.patient]);

  const getCustomerUsers = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(
      `/data_fetching/customer_association_index/${props.patient?.id}?tz=${tz}`,
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
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleModalOpen = () => {
    event.preventDefault();
    setAssociationModalOpen(true);
  };

  const handleResendInvite = (customerUserId) => {
    event.preventDefault();
    setResendModalHandler({ open: true, customerUserId: customerUserId });
    true;
  };

  const renderStatus = (association) => {
    let tagContainer = "label-tag-container";
    let tagLabel = "label-tag";
    switch (association?.status) {
      case "inactive":
        tagContainer = "label-tag-container secondary-container";
        tagLabel = "label-tag secondary-tag";
        break;
      case "pending":
        tagContainer = "label-tag-container tertiary-container";
        tagLabel = "label-tag tertiary-tag";
        break;
    }

    return (
      <div className={tagContainer} style={{ marginLeft: 0, marginBottom: 10 }}>
        <p className={tagLabel}>
          {association?.status == "accepted"
            ? "Active"
            : capitalize(association?.status)}
        </p>
      </div>
    );
  };

  return (
    <Grid container className="panel-container" borderRadius={"4px"}>
      <Grid item xs={12}>
        <Grid container className="panel-show-container">
          <Grid container className="panel-information-container">
            <Grid container direction="row" className="admin-header">
              <Grid item xs={12} className="box-header">
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  paddingX={3}
                  paddingY={1}
                  alignItems={"center"}
                  display={"flex"}
                >
                  <Grid item>
                    <p className="panel-header">Customer Association History</p>
                  </Grid>
                  {checkPrivileges(
                    userPrivileges,
                    "Add Customer Association"
                  ) && (
                    <Link className="action-link row" onClick={handleModalOpen}>
                      <img
                        src={images.add_icon}
                        alt="AddAssociation"
                        className="action-icon-image"
                        style={{ width: 31.466, maxHeight: 32 }}
                      />
                      <span className="app-user-text disable-pointer">
                        Add Customer Association
                      </span>
                    </Link>
                  )}
                </Stack>
                <Grid container className="general-patient-info-container">
                  <Grid item xs={12} style={{ backgroundColor: "white" }}>
                    <TableContainer style={{ maxHeight: 300 }}>
                      <Table stickyHeader className="no-border-table">
                        <TableHead className="table-header-box">
                          <TableRow>
                            <SortComponent
                              column_name={"customer_name"}
                              column_title={"Customer Name"}
                              list={customerAssociations}
                              setList={setCustomerAssociations}
                              sortObject={sortObject}
                              setSortObject={setSortObject}
                            />
                            <TableCell className="nowrap-header">
                              <p className="table-header">Timestamp</p>
                            </TableCell>
                            <TableCell className="nowrap-header">
                              <p className="table-header">Added By</p>
                            </TableCell>
                            <TableCell sx={{ paddingX: 18 }}></TableCell>
                            <TableCell></TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <p className="table-header">Status</p>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {customerAssociations.map((association) => {
                            return (
                              <TableRow key={association?.id}>
                                <TableCell>
                                  <p className="table-body-text">
                                    {association?.customer_name}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <span className="table-body-text">
                                    {association?.formatted_assigned_at}{" "}
                                  </span>{" "}
                                  <span
                                    className="table-body-text"
                                    style={{
                                      display: "inline-block",
                                      marginLeft: 10,
                                    }}
                                  >
                                    {association?.formatted_assigned_at_time}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <p className="table-body-text">
                                    {association?.added_by}
                                  </p>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                  {association?.status == "pending" && (
                                    <Link
                                      onClick={() => {
                                        handleResendInvite(association.id);
                                      }}
                                    >
                                      <span className="underline-button">
                                        Resend invite
                                      </span>
                                    </Link>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {renderStatus(association)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <UserCustomerAssociationModalNew
        csrfToken={authenticationSetting.csrfToken}
        selectedPatient={props.patient}
        menu_track_src={images.menu_track_src}
        getCustomerUsers={getCustomerUsers}
        setAssociationModalOpen={setAssociationModalOpen}
        associationModalOpen={associationModalOpen}
      />
      <ResendCustomerUserInviteModal
        csrfToken={authenticationSetting.csrfToken}
        setResendModalHandler={setResendModalHandler}
        resendInviteModalHandler={resendInviteModalHandler}
      />
    </Grid>
  );
};

export default CustomerAssociationHistory;