import { Grid, Link, TableContainer, Table, TableBody } from "@mui/material";
import { Stack } from "@mui/system";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { getHeaders } from "../../../../utils/HeaderHelper";
import { AuthenticationContext, ImagesContext } from "../../../../Context";
import ProgramRow from "./ProgramRow";
import AssignProgramModal from "./AssignProgramModal";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import AssignmentHistoryModal from "./AssignmentHistoryModal";
import useFetchAssignmentHistories from "../../../../hooks/patients/useFetchAssignmentHistories";

const AssignedPrograms = () => {
  let { id: patientId } = useParams();
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [addProgramsModal, setAddProgramsModal] = React.useState(false);
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [publishedPrograms, setPublishedPrograms] = React.useState<any>([]);
  const [assignedPrograms, setAssignedPrograms] = React.useState<any>([]);
  const [reFetchingKey, setReFetchingKey] = React.useState(Math.random());
  const images = React.useContext(ImagesContext);
  const { assignmentHistories, loading, error } = useFetchAssignmentHistories(
    patientId,
    "program",
    reFetchingKey
  );

  React.useEffect(() => {
    fetchPublishedPrograms();
    fetchAssignedPrograms();
  }, [patientId]);

  const fetchPublishedPrograms = async () => {
    try {
      const response = await fetch(`/programs?status=published`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      const result = await response.json();

      setPublishedPrograms(result.data.programs);
    } catch (err) {
      alert("Error fetching programs");
      console.error(err);
    }
  };

  const fetchAssignedPrograms = async () => {
    try {
      const response = await fetch(`/patients/${patientId}/assigned_programs`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      const result = await response.json();
      setAssignedPrograms(result.resource);
    } catch (err) {
      alert("Error fetching programs");
      console.error(err);
    }
  };

  const handleCloseAssignProgramModal = () => {
    setAddProgramsModal(false);
  };

  return (
    <Grid container className="panel-container" borderRadius={"4px"}>
      <Grid item xs={12}>
        <Grid container className="panel-show-container">
          <Grid container direction="row" className="admin-header">
            <Grid item xs={12} className="box-header">
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                paddingX={3}
                alignItems={"center"}
                display={"flex"}
              >
                <Grid item>
                  <h3>Assigned Programs</h3>
                </Grid>
                <Stack direction={"row"} alignItems={"center"} display={"flex"}>
                  <Link
                    className="action-link add-encounter"
                    onClick={() => setShowHistoryModal(true)}
                    sx={{ mr: 3 }}
                  >
                    <img
                      src={images.history_icon}
                      alt="History Icon"
                      style={{
                        width: "28px",
                        marginBottom: "-8px",
                        marginRight: "2px",
                      }}
                    />
                    <span className="app-user-text">
                      Show Program Assignment History
                    </span>
                  </Link>
                  <Link
                    className="action-link add-encounter"
                    onClick={() => setAddProgramsModal(true)}
                    sx={{ mr: 3 }}
                  >
                    <img
                      src={images.add_icon}
                      alt="Edit Patient"
                      style={{
                        width: "25px",
                        marginBottom: "-8px",
                        marginRight: "2px",
                      }}
                    />
                    <span className="app-user-text">Assign Program</span>
                  </Link>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Grid
            container
            className="tabs-container"
            sx={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            <Grid item xs={12} className="panel-body">
              <Grid
                item
                xs={12}
                className="medication-table-container"
                sx={{ bgcolor: "#EFE9E8" }}
              >
                {assignedPrograms?.map((assignedProgram, index) => (
                  <ProgramRow
                    patientId={patientId}
                    assignedProgram={assignedProgram}
                    key={assignedProgram.id}
                    expandedInitially={index === 0}
                    onProgramComplete={() => {
                      fetchAssignedPrograms();
                      setReFetchingKey(Math.random());
                    }}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AssignProgramModal
        patientId={patientId}
        open={addProgramsModal}
        onAddProgram={() => {
          fetchAssignedPrograms();
          setReFetchingKey(Math.random());
          handleCloseAssignProgramModal();
        }}
        onCloseModal={handleCloseAssignProgramModal}
        publishedPrograms={publishedPrograms}
      />
      <AssignmentHistoryModal
        type={"program"}
        open={showHistoryModal}
        onCloseModal={() => setShowHistoryModal(false)}
        histories={assignmentHistories}
      />
    </Grid>
  );
};

export default AssignedPrograms;
