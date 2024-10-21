/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, Link, TextField, InputLabel, Button } from "@mui/material";

// helper imports
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import { AuthenticationContext, FlashContext } from "../Context";
import PatientListTable from "./PatientListTable";
import GeneralModal from "../modals/GeneralModal";

interface Props {
  openModal: boolean;
  setOpenModal: any;
  selectedPatientList: any;
}

const EditPatientList: React.FC<Props> = (props: any) => {
  // state
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [listName, setListName] = React.useState<String>("");
  const [firstName, setFirstName] = React.useState<String>("");
  const [lastName, setLastName] = React.useState<String>("");
  const [fullPatients, setFullPatients] = React.useState<any>([]);
  const [paginatedList, setPaginatedList] = React.useState<any>(null);
  const [patients, setPatients] = React.useState<any>([]);
  const [checkedList, setCheckedList] = React.useState<Array<any>>([]);
  const [resetTable, setResetTable] = React.useState<boolean>(false);
  const [refreshTable, setRefreshTable] = React.useState<boolean>(false);
  const [addPatients, setAddPatients] = React.useState<boolean>(false);
  const [resetPage, setResetPage] = React.useState<boolean>(false);
  const afterFetch = React.useRef(false);
  const flashContext = React.useContext(FlashContext);

  // clear search if both last name and firstname are cleared
  React.useEffect(() => {
    if (lastName == "" && firstName == "") {
      search();
    }
  }, [lastName, firstName]);

  // reset on close
  React.useEffect(() => {
    if (props.openModal == false) {
      resetModal();
    }
    if (props.openModal == true) {
      setListName(props.selectedPatientList.name);
      setRefreshTable(true);
    }
  }, [props.openModal]);

  // other functions
  const resetModal = () => {
    setFirstName("");
    setLastName("");
    setCheckedList([]);
    setAddPatients(false);
  };

  const closeModal = () => {
    props.setOpenModal(false);
  };

  const search = () => {
    fetch(
      `/data_fetching/patient_index_patient_list?first_name=${firstName}&last_name=${lastName}&patient_list=${
        props.selectedPatientList?.id || ""
      }&add_patients=${addPatients ? true : ""}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          setPatients(result.patients);
          setResetPage(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const resetSearch = () => {
    setLastName("");
    setFirstName("");
  };

  const removeFromList = () => {
    if (props.selectedPatientList && checkedList.length > 0) {
      fetch(`/patient_lists/remove_patients`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          patient_ids: getPatientIds(),
          patient_list_id: props.selectedPatientList.id,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
            flashContext.setMessage({
              text: "Error removing patients",
              type: "error",
            });
          } else {
            setRefreshTable(true);
            resetSearch();
            flashContext.setMessage({
              text: "Removed patients successfully",
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      flashContext.setMessage({
        text: "Must select patients to delete",
        type: "error",
      });
    }
  };

  const addToList = () => {
    if (props.selectedPatientList && checkedList.length > 0) {
      fetch(`/patient_lists/${props.selectedPatientList.id}`, {
        method: "PATCH",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          patient_ids: getPatientIds(),
          patient_list_id: props.selectedPatientList.id,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
            flashContext.setMessage({
              text: "Error adding patients",
              type: "error",
            });
          } else {
            props.setOpenModal(false);
            flashContext.setMessage({
              text: "Added patients successfully",
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      flashContext.setMessage({
        text: "Must select patients to add",
        type: "error",
      });
    }
  };

  const getPatientIds = () => {
    return checkedList.map((patient) => patient.id);
  };

  const deleteList = () => {
    if (confirm("Are you sure you want to delete this list?")) {
      fetch(`/patient_lists/${props.selectedPatientList.id}`, {
        method: "DELETE",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((response) => {
          if (response.ok) {
            // success
            props.setOpenModal(false);
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

  return (
    <GeneralModal
      open={props.openModal}
      title={"Edit Patient List"}
      closeCallback={closeModal}
      confirmButtonText="Create List" 
      successCallback={undefined}
      showCancelButton={false}
      showContinueIcon={false}
      >
        <Grid container  sx={{marginTop: "20px", maxHeight: "520px", overflowY: "auto"}}>
          <Grid container justifyContent="space-between">
            <Grid item xs={12}>
              <Grid container justifyContent="space-between" spacing={1}>
                <Grid
                  item
                  xs={12}
                  className="field-container"
                  style={{ marginLeft: "0px" }}
                >
                  <InputLabel
                    htmlFor="searchTerm"
                    className="field-label"
                    style={{ paddingLeft: 0, color: "black" }}
                  >
                    Name of List*
                  </InputLabel>
                  <TextField
                    id="searchTerm"
                    className="textInput plainLabel"
                    value={listName}
                    onChange={(event) => {
                      setListName(event.target.value);
                    }}
                    variant="filled"
                    size="small"
                    label="Enter name"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{marginTop: 1}}
                  />
                </Grid>
              </Grid>
              <Grid container mt={3}>
                <InputLabel
                  htmlFor="searchTerm"
                  className="field-label"
                  style={{ paddingLeft: 0, color: "black", marginBottom: "10px" }}
                  >
                  Search Patients
                </InputLabel>
                <Grid container spacing={3}>
                  <Grid
                    item
                    xs={4}
                    className="field-container"
                    style={{ marginLeft: "0px" }}
                  >
                    <TextField
                      id="lastname"
                      className="textInput plainLabel"
                      value={lastName}
                      onChange={(event) => {
                        setLastName(event.target.value);
                      }}
                      variant="filled"
                      size="small"
                      label="Last Name"
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} className="field-container">
                    <TextField
                      id="firstname"
                      value={firstName}
                      className="textInput plainLabel"
                      variant="filled"
                      size="small"
                      label="First Name"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className="field-container"
                    style={{
                      justifyContent: "end",
                      alignContent: "center",
                      display: "grid",
                      marginLeft: "25px",
                    }}
                  >
                    <Button onClick={search} sx={{width: "100%", px: 5, py: "10px"}}>Search</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5} className="search-switch"></Grid>
          </Grid>

          <PatientListTable
            getPatientsUrl={`/data_fetching/patient_index_patient_list?patient_list=${
              props.selectedPatientList.id
            }&add_patients=${addPatients ? true : ""}`}
            fullPatients={fullPatients}
            setFullPatients={setFullPatients}
            paginatedList={paginatedList}
            setPaginatedList={setPaginatedList}
            patients={patients}
            setPatients={setPatients}
            resetTable={resetTable}
            setResetTable={setResetTable}
            refreshTable={refreshTable}
            setRefreshTable={setRefreshTable}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            resetPage={resetPage}
            setResetPage={setResetPage}
          ></PatientListTable>
        </Grid>

        {addPatients ? (
          <div className="buttonRow">
            <Link
              onClick={() => {
                setAddPatients(false);
              }}
              className="clearButtonStyling"
              style={{
                font: "14px QuicksandMedium",
                color: "#313133",
                textDecoration: "underline",
                display: "inline-block",
                marginRight: "20px",
              }}
            >
              Cancel
            </Link>
            <div className="orangeButton" onClick={addToList}>
              Add Patients to list
            </div>
          </div>
        ) : (
          <>
            <div className="remove-patient-add-patient-container">
              <div className="orangeButton" onClick={removeFromList}>
                {" "}
                Remove Patients{" "}
              </div>
              <div
                className="orangeButton"
                style={{ backgroundColor: "red" }}
                onClick={deleteList}
              >
                {" "}
                Delete List{" "}
              </div>
              <div
                className="orangeButton"
                onClick={() => setAddPatients(true)}
              >
                Add New Patients
              </div>
            </div>
          </>
        )}
      </GeneralModal>
  );
};

export default EditPatientList;
