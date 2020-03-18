/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link } from "@mui/material";
import { formatToUsDate } from "../utils/DateHelper";
// import PatientListsModalNew from "./PatientListsModalNew";
// import ResendCustomerUserInviteModal from "./ResendCustomerUserInviteModal";
import { PrivilegesContext } from "../PrivilegesContext";
import { checkPrivileges } from "../utils/PrivilegesHelper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { FlashContext } from "../Context";

// components
import { Modal as DeleteModal } from "../modals/Modal";

// const authenticationSetting = React.useContext(AuthenticationContext);
// auth helpers
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  menu_track_src: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  sort_plain_src?: string;
}

export interface SortObject {
  field: string;
  direction : "descending" | "ascending"
}

const PatientListsTable: React.FC<Props> = (props: any) => {
  const flashContext = React.useContext(FlashContext);
  // other states
  const [showArchiveModal, setShowArchiveModal] =
    React.useState<boolean>(false);
  const [sortObject, setSortObject] = React.useState<SortObject | null>(null);
  const [deletePatientList, setDeletePatinetList] = React.useState<any>();
  const [patientLists, setPatientLists] = React.useState<any>(null);
  // const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const userPrivileges = React.useContext(PrivilegesContext);
  React.useEffect(() => {
    if (deletePatientList?.id) {
      setShowArchiveModal(true);
    }
  }, [deletePatientList?.id]);
  const getPatientLists = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(`/patient_lists`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        console.log("result", result);

        if (result.success === false) {
          console.log(result.error);
        } else {
          console.log(result?.patient_lists);

          setPatientLists(result?.patient_lists);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getPatientLists();
  }, [props.selectedPatient]);
  const handleModalOpen = () => {
    event.preventDefault();
    // setModalOpen(true);
  };
  
  const deleteList = () => {
    if (deletePatientList?.id) {
      fetch(`/patient_lists/${deletePatientList?.id}`, {
        method: "DELETE",
        headers: getHeaders(props.csrfToken),
      })
        .then((response) => {
          if (response.ok) {
            setShowArchiveModal(false);
            setPatientLists((prev) => {
              const index = prev.findIndex(
                (list) => list.id === deletePatientList?.id
              );
              const newLists = [...prev];
              if (index > -1) {
                newLists.splice(index, 1);
              }
              return newLists;
            });
            // success
            // props.setOpenModal(false);
            flashContext.setMessage({
              text: "Patient list deleted",
              type: "success",
            });
          } else {
            // error
            flashContext.setMessage({
              text: "Error deleting list",
              type: "error",
            });
          }
        })
        .catch((error) => {
          // network error
          flashContext.setMessage({
            text: "Error deleting list",
            type: "error",
          });
        });
      }
    };
    const closeModal = () => {
    setShowArchiveModal(false);
    setDeletePatinetList(null);
  };
  const handleArchiveBtnClick = (patientList) => {
    setDeletePatinetList(patientList);
  };
  
  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const getSortedAndSearchedList = React.useCallback((lists) => {
    let sortPatientLists = [...lists];
    sortPatientLists.sort((a, b) => (a.id > b.id ? 1 : -1));
    if (sortObject?.field === "list_name") {
      sortPatientLists.sort((a, b) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
    );
    }
    if (sortObject?.direction === "descending") {
      sortPatientLists.reverse();
    }
    return sortPatientLists;
  }, [sortObject]);
  
  const sortList = React.useCallback(() => {
    setPatientLists(prev => prev ? getSortedAndSearchedList(prev) : prev);
  }, [getSortedAndSearchedList]);
  
  React.useEffect(() => {
    sortList();
  }, [sortList]);

  return (
    <>
      <DeleteModal
        successModalOpen={showArchiveModal}
        setSuccessModalOpen={setShowArchiveModal}
        successHeader="Delete Patient List?"
        successContent="You are attempting to delete this patient list. This cannot be undone. Would you like to continue?"
        successCallback={deleteList}
        closeCallback={closeModal}
        confirmButtonText="Continue"
      />
      <Grid item xs={12}>
        <Grid container>
          <Grid
            container
            justifyContent="space-between"
            className="customer-relation-container"
          >
            <Grid item xs={5} className="association-header">
              <h3>Patient Lists</h3>
            </Grid>
            <Grid item xs={5} className="button-container">
              {checkPrivileges(userPrivileges, "Add Customer Association") && (
                <Link
                  style={{
                    display: "inline-block",
                    cursor: "pointer",
                    paddingRight: 10,
                  }}
                  href="#"
                  onClick={handleModalOpen}
                >
                  <span style={{ float: "left", marginRight: 10 }}>
                    <img
                      src={props.menu_track_src}
                      width="32"
                      alt="Invite New Patient"
                    />
                  </span>
                  <span
                    style={{
                      float: "left",
                      fontFamily: "QuicksandMedium",
                      color: "#a29d9b",
                      marginTop: 6,
                      fontSize: 16,
                    }}
                  >
                    Add Patient List
                  </span>
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
                    <th
                      className="first-column-header"
                      onClick={() => {
                        setSortOrder(
                          "list_name",
                          sortObject?.direction === "ascending"
                            ? "descending"
                            : "ascending"
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      List Name
                      {sortObject?.field === "list_name" ? (
                        <span className="sortIndicator">
                          {sortObject?.direction === "ascending" ? (
                            <img
                              src={props.sort_ascending_src}
                              width="10"
                              className="sort-icon"
                              alt="Sort Asc"
                            />
                          ) : (
                            <img
                              src={props.sort_descending_src}
                              width="10"
                              className="sort-icon"
                              alt="Sort Desc"
                            />
                          )}
                        </span>
                      ) : (
                        <span className="sortIndicator">
                          <img
                            src={props.sort_plain_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Asc"
                          />
                        </span>
                      )}
                    </th>
                    <th className="second-column-header">Date Created</th>
                    <th className="second-column-header">Patient Count</th>
                    <th className="action-column-header">View</th>
                    <th className="action-column-header">Edit</th>
                    <th className="action-column-header">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {patientLists && (
                    <>
                      {patientLists.map((patientList) => {
                        return (
                          <tr key={patientList.id}>
                            <td className="first-column-header">
                              {patientList.name}
                            </td>
                            <td className="second-column-header">
                              {patientList.created_at
                                ? formatToUsDate(patientList.created_at)
                                : "N/A"}
                            </td>
                            <td className="second-column-header">
                              {patientList.count}
                            </td>
                            <td className="action-column-header cursor-pointer">
                              <Link href={`/patient-lists/${patientList.id}`}><VisibilityIcon className="cursor-pointer" sx={{color: "black"}} /></Link>
                            </td>
                            <td className="action-column-header cursor-pointer">
                              <CreateIcon />
                            </td>
                            <td className="action-column-header cursor-pointer">
                              <DeleteIcon
                                onClick={() =>
                                  handleArchiveBtnClick(patientList)
                                }
                              ></DeleteIcon>
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
      </Grid>
    </>
  );
};

export default PatientListsTable;