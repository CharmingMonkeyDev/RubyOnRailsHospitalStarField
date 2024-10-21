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
}

const AddPatientList: React.FC<Props> = (props: any) => {
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
  }, [props.openModal]);

  // Other functions
  const resetModal = () => {
    setListName("");
    setFirstName("");
    setLastName("");
    setCheckedList([]);
  };

  const closeModal = () => {
    props.setOpenModal(false);
  };

  const search = () => {
    fetch(
      `/data_fetching/patient_index_patient_list?first_name=${firstName}&last_name=${lastName}`,
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
          setResetTable(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createList = () => {
    if (listName.length > 0 && checkedList.length > 0) {
      fetch(`/patient_lists`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          name: listName,
          patient_ids: getPatientIds(),
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
            flashContext.setMessage({
              text: "New patient list error",
              type: "error",
            });
          } else {
            props.setOpenModal(false);
            flashContext.setMessage({
              text: "New patient list created",
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      flashContext.setMessage({
        text: "Must select users and create list name",
        type: "error",
      });
    }
  };

  const getPatientIds = () => {
    return checkedList.map((patient) => patient.id);
  };

  return (
    <GeneralModal
        open={props.openModal}
        title={"Add Patient List"}
        successCallback={createList}
        closeCallback={closeModal}
        confirmButtonText="Create List"

      >
        <Grid 
          container 
          gap={2} 
          sx={{
            marginTop: "20px", 
            maxHeight: "520px", 
            overflowY: "auto",
          }}
        >
          <Grid container justifyContent="space-between">
            <Grid item xs={12}>
              <Grid container justifyContent="space-between">
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
                    sx={{marginTop: 1, p: "0 !important"}}
                    inputProps={{ style: {padding: "0!important"}}}
                  />
                </Grid>
              </Grid>
              <Grid container mt={3}>
                <InputLabel
                  htmlFor="searchTerm"
                  className="field-label"
                  style={{ paddingLeft: 0, color: "black", marginBottom: "10px" }}
                >
                  Choose Patient to Add to List*
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
                    xs={4}
                    className="field-container"
                    style={{
                      justifyContent: "start",
                      alignContent: "center",
                      display: "grid",
                    }}
                  >
                    <span>
                      <Button onClick={search} sx={{width: "100%", px: 5, py: "10px"}}>Search</Button>
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5} className="search-switch"></Grid>
          </Grid>
          <PatientListTable
            getPatientsUrl="/data_fetching/patient_index_patient_list"
            fullPatients={fullPatients}
            setFullPatients={setFullPatients}
            paginatedList={paginatedList}
            setPaginatedList={setPaginatedList}
            patients={patients}
            setPatients={setPatients}
            resetTable={resetTable}
            setResetTable={setResetTable}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            refreshTable={refreshTable}
            setRefreshTable={setRefreshTable}
            resetPage={false}
            setResetPage={null}
          >
            {" "}
          </PatientListTable>
        </Grid>
      </GeneralModal>
  );
};

export default AddPatientList;
