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
import {
  AuthenticationContext,
  FlashContext,
  ImagesContext,
} from "../../../../../Context";
import { Modal as DeleteModal } from "../../../../../modals/Modal";
import { getHeaders } from "../../../../../utils/HeaderHelper";
import HistoryModal from "../../../../../modals/HistoryModal";
import Delete from "@mui/icons-material/Delete";
import SortComponent from "../../../../../common/SortComponent";
import DiagnosisAddModal from "./DiagnosisAddModal";

interface Props {
  patient: any;
}

const DiagnosisInfo: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  const flashContext = React.useContext(FlashContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [assignedDiagnoses, setAssignedDiagnoses] = React.useState<any>([]);
  const [diagnosisList, setDiagnosisList] = React.useState<any>([]);
  const [diagnosisHistory, setDiagnosisHistory] = React.useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] =
    React.useState<boolean>(false);
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState<any>(null);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });

  React.useEffect(() => {
    if (props.patient) {
      fetchDiagnosisCodes();
      fetchAssignedDiagnoses();
      fetchHistory();
    }
  }, [props.patient]);

  const fetchDiagnosisCodes = () => {
    fetch(`/encounters/previously_used_codes/${props.patient?.id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        console.log('fetchDiagnosisCodes', result);
        if (result.success == false) {
          console.log(result.error);
        } else {
          console.log(result);
          setDiagnosisList(result?.resource?.diag_codes);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchAssignedDiagnoses = () => {
    fetch(`/data_fetching/diagnoses/assigned?patient_id=${props.patient?.id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          setAssignedDiagnoses(result.resource);
        }
      })
      .catch((error) => {
        flashContext.setMessage({ text: error, type: "error" });
      });
  };

  const fetchHistory = () => {
    fetch(`/data_fetching/diagnoses/history?patient_id=${props.patient?.id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          setDiagnosisHistory(result.resource);
        }
      })
      .catch((error) => {
        flashContext.setMessage({ text: error, type: "error" });
      });
  };

  const handleRemove = () => {
    setIsLoading(true);
    fetch(`/diagnosis_assignments/${selectedDiagnosis?.id}`, {
      method: "DELETE",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        user_id: props.patient?.id,
        diagnosis_code_value: selectedDiagnosis?.diagnosis_code_value,
        diagnosis_code_desc: selectedDiagnosis?.diagnosis_code_desc,
        action_type: "remove",
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          onModalClose();
          flashContext.setMessage({
            text: "You have successfully removed this diagnosis from this patient.",
            type: "success",
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        flashContext.setMessage({
          text: error,
          type: "error",
        });
        setIsLoading(false);
      });
  };

  const deleteMessage =
    "You are attempting to remove this diagnosis from this patient.\nWould you like to continue?";
  const deleteMessageLines = deleteMessage.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const onModalClose = () => {
    setSelectedDiagnosis(null);
    setShowDeleteModal(false);
    fetchAssignedDiagnoses();
    fetchHistory();
  };

  const handleOpenRemoveModal = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setShowDeleteModal(true);
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
                    <p className="panel-header">Diagnosis Tag Manager</p>
                  </Grid>
                  <div className="row">
                    <Link
                      className="action-link row"
                      onClick={() => setShowAddModal(true)}
                    >
                      <img
                        src={images.add_icon}
                        alt="Add Facility"
                        className="action-icon-image"
                        style={{ width: 25, height: 25 }}
                      />
                      <span className="app-user-text">Add Diagnosis</span>
                    </Link>
                    {diagnosisHistory.length > 0 && (
                      <Link
                        className="action-link row"
                        sx={{ marginLeft: '24px'}}
                        onClick={() => {
                          setShowHistoryModal(true);
                        }}
                      >
                        <img
                          src={images.clock_icon}
                          alt="Facility History"
                          className="action-icon-image"
                          style={{ width: 25, height: 25 }}
                        />
                        <span className="app-user-text">Diagnosis History</span>
                      </Link>
                    )}
                  </div>
                </Stack>
              </Grid>
            </Grid>
            <Grid container className="general-patient-info-container">
              {!assignedDiagnoses.length ? (
                <Grid item xs={12} className="info-container">
                  <p className="no-result-text">
                    This patient does not have any diagnoses yet. You can create
                    their first diagnosis{" "}
                    <span
                      className="underline_text"
                      onClick={() => setShowAddModal(true)}
                    >
                      here!
                    </span>
                  </p>
                </Grid>
              ) : (
                <Grid item xs={12} style={{ backgroundColor: "white" }}>
                  <TableContainer>
                    <Table className="no-border-table">
                      <TableHead className="table-header-box">
                        <TableRow>
                          <SortComponent
                            column_name={"code"}
                            column_title={"Diagnosis Code"}
                            list={assignedDiagnoses}
                            setList={setAssignedDiagnoses}
                            sortObject={sortObject}
                            setSortObject={setSortObject}
                          />
                          <TableCell className="nowrap-header" width="40%">
                            <p className="table-header">Description</p>
                          </TableCell>
                          <TableCell className="nowrap-header" width="30%">
                            <p className="table-header">Source Type</p>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }} width="10%">
                            <p className="table-header">Remove</p>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignedDiagnoses.map((assignment) => {
                          return (
                            <TableRow key={assignment?.id}>
                              <TableCell>
                                <p className="table-body-text">
                                  {assignment?.diagnosis_code_value}
                                </p>
                              </TableCell>
                              <TableCell>
                                <span className="table-body-text">
                                  {assignment?.diagnosis_code_desc}
                                </span>
                              </TableCell>
                              <TableCell>
                                <p className="table-body-text">
                                  Added Manually
                                </p>
                              </TableCell>
                              <TableCell align="center">
                                <Link
                                  onClick={() => {
                                    handleOpenRemoveModal(assignment);
                                  }}
                                >
                                  <Delete
                                    sx={{ height: 24, color: "#1E1E1E" }}
                                  />
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DiagnosisAddModal
        patient={props.patient}
        assignedDiagnoses={assignedDiagnoses}
        diagnoses={diagnosisList}
        openModel={showAddModal}
        setOpenModal={setShowAddModal}
        onConfirmSuccess={onModalClose}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <DeleteModal
        successModalOpen={showDeleteModal}
        setSuccessModalOpen={setShowDeleteModal}
        successHeader="Remove Diagnosis?"
        successContent={deleteMessageLines}
        successCallback={handleRemove}
        closeCallback={onModalClose}
        confirmButtonText="Remove Diagnosis"
        isLoading={isLoading}
        width="500px"
        buttonWidth="154px"
        padding="24px 120px"
      />
      <HistoryModal
        title="Diagnosis History"
        objectType="Diagnosis"
        removeText="Removed"
        histories={diagnosisHistory}
        open={showHistoryModal}
        onCloseModal={() => setShowHistoryModal(false)}
        descriptionTitle={"Diagnosis"}
        descriptionValue={"diagnosis"}
      />
    </Grid>
  );
};

export default DiagnosisInfo;