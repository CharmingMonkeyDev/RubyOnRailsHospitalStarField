// Library Imports
import * as React from "react";
import {
  Button,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import QuestionnaireTypeSelection from "../../../modals/QuestionTypeSelection";
import AddIcon from "@mui/icons-material/Add";

// app setting imports
import { AuthenticationContext, ImagesContext } from "../../../Context";

// importing header helpers
import { getHeaders } from "../../../utils/HeaderHelper";
import { formatToUsDateFromUTC } from "../../../utils/DateHelper";
import { snakeCaseToTitleCase } from "../../../utils/CaseFormatHelper";
import { useParams } from "react-router-dom";
import { setSortOrder } from "../../../shared/tables/TableHelper";
import PatientQuestionnaireAnswers from "../../../questionnaires/PatientQuestionnairesAnswers";
import { Box } from "@mui/system";

interface Props {}

const QuestionnnairePanel: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  let { id: patientId } = useParams();

  // other states
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [renderingKey, setRenderingKey] = React.useState<number>(Math.random());
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    React.useState<any>();
  const [questAssignment, setQuestAssignment] = React.useState<any>([]);
  const [filteredQuestAssignment, setFilteredQuestAssignment] =
    React.useState<any>([]);
  const [filterCategory, setFilterCategory] = React.useState<string>("");
  const [filterStatus, setFilterStatus] = React.useState<string>("");
  const [categoryOptions, setCategoryOptions] = React.useState<any>([]);

  React.useEffect(() => {
    getAssignedQuestionnaire();
  }, [patientId, renderingKey]);

  const getAssignedQuestionnaire = () => {
    fetch(`/questionnaire_assignments?patient_id=${patientId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.error(result.error);
        } else {
          if (result?.resource) {
            setCategoryOptions([
              ...new Set(result?.resource.map((q) => q.category)),
            ]);
            setQuestAssignment(result?.resource);
            setFilteredQuestAssignment(result?.resource);
          } else {
            alert("Something went wrong, cannot fetch questionnaire");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewModalOpen = () => {
    setModalOpen(true);
  };

  const formatStatus = (status) => {
    if (status == "pending") {
      return "Pending Response";
    } else if (status == "submitted") {
      return "Response Received";
    }
  };

  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });

  React.useEffect(() => {
    if (setQuestAssignment) {
      sortList();
    }
  }, [sortObject]);

  React.useEffect(() => {
    sortList();
  }, [filterCategory, filterStatus]);

  const clearFitler = () => {
    setFilterCategory("");
    setFilterStatus("");
  };

  const sortList = () => {
    const questionnaireList = getSortedAndSearchedList();
    setFilteredQuestAssignment(questionnaireList);
  };
  const images = React.useContext(ImagesContext);

  const getSortIcon = (column) => {
    return sortObject.field == column ? (
      <span className="sortIndicator">
        {sortObject.direction == "ascending" ? (
          <img
            src={images.sort_ascending_src}
            width="10"
            className="sort-icon"
            alt="Sort Asc"
          />
        ) : (
          <img
            src={images.sort_descending_src}
            width="10"
            className="sort-icon"
            alt="Sort Desc"
          />
        )}
      </span>
    ) : (
      <span className="sortIndicator">
        <img
          src={images.sort_plain_src}
          width="10"
          className="sort-icon"
          alt="Sort Asc"
        />
      </span>
    );
  };

  const getSortedAndSearchedList = () => {
    let questAssignmentList = [...questAssignment];
    if (!!filterCategory && filterCategory !== "") {
      questAssignmentList = questAssignmentList?.filter(
        (q) => q.category?.toLowerCase() == filterCategory?.toLowerCase()
      );
    }
    if (!!filterStatus && filterStatus !== "") {
      questAssignmentList = questAssignmentList?.filter(
        (q) => q.submission_status?.toLowerCase() == filterStatus?.toLowerCase()
      );
    }
    questAssignmentList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "name") {
      questAssignmentList.sort((a, b) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "created_at") {
      questAssignmentList.sort((a, b) =>
        new Date(a["created_at"]) > new Date(b["created_at"]) ? 1 : -1
      );
    }

    if (sortObject.field == "category") {
      questAssignmentList.sort((a, b) =>
        a.category?.toLowerCase() > b.category?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "submission_status") {
      questAssignmentList.sort((a, b) =>
        a.submission_status?.toLowerCase() > b.submission_status?.toLowerCase()
          ? 1
          : -1
      );
    }

    if (sortObject.direction == "descending") {
      questAssignmentList.reverse();
    }
    return questAssignmentList;
  };

  return (
    <>
      <Grid container className="panel-container">
        <Grid item xs={12}>
          <QuestionnaireTypeSelection
            patient_id={patientId}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            setRenderingKey={setRenderingKey}
          />
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
                      <h3>Questionnaires</h3>
                    </Grid>
                    <Link
                      className="action-link add-encounter"
                      onClick={handleNewModalOpen}
                    >
                      <AddIcon className="plus-icon" />{" "}
                      <span className="app-user-text">Add Questionnaire</span>
                    </Link>
                  </Stack>
                </Grid>
              </Grid>
              <Grid
                container
                className="grey-container"
                style={{
                  marginTop: "-11px",
                }}
              >
                <Grid item xs={12}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"end"}
                    py={1}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      minWidth={"50%"}
                    >
                      <FormControl sx={{ mr: 2, minWidth: "250px" }}>
                        <Select
                          value={filterCategory}
                          onChange={(event) => {
                            setFilterCategory(event.target.value);
                          }}
                          autoWidth
                          displayEmpty
                          sx={{
                            background: "white",
                            border: "0px",
                            color: "black",
                          }}
                        >
                          <MenuItem value={""} selected>
                            Select Category
                          </MenuItem>
                          {categoryOptions?.map((catOption) => (
                            <MenuItem key={catOption} value={catOption}>
                              {snakeCaseToTitleCase(catOption)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ mr: 2, minWidth: "250px" }}>
                        <Select
                          value={filterStatus}
                          onChange={(event) => {
                            setFilterStatus(event.target.value);
                          }}
                          autoWidth
                          displayEmpty
                          sx={{
                            background: "white",
                            border: "0px",
                            color: "black",
                          }}
                        >
                          <MenuItem value={""} selected>
                            Select Status
                          </MenuItem>
                          <MenuItem value={"pending"} selected>
                            {formatStatus("pending")}
                          </MenuItem>
                          <MenuItem value={"submitted"} selected>
                            {formatStatus("submitted")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        sx={{ p: "10px", width: "200px" }}
                        onClick={clearFitler}
                      >
                        Clear Filters
                      </Button>
                    </Stack>
                    <Box fontSize={"0.9em"}>
                      Select a questionnaire to view the detailed responses.
                    </Box>
                  </Stack>
                </Grid>
                <Grid
                  container
                  className="tabs-container"
                  style={{
                    paddingTop: "10px",
                  }}
                >
                  <Grid item xs={12} className="panel-body">
                    <Grid item xs={12} className="medication-table-container">
                      <TableContainer>
                        <Table>
                          <TableHead className="table-header-box">
                            <TableRow>
                              <TableCell
                                className="nowrap-header"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSortOrder(
                                    "created_at",
                                    sortObject.direction == "ascending"
                                      ? "descending"
                                      : "ascending",
                                    setSortObject
                                  );
                                }}
                              >
                                Date Sent {getSortIcon("created_at")}
                              </TableCell>
                              <TableCell
                                className="nowrap-header"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSortOrder(
                                    "category",
                                    sortObject.direction == "ascending"
                                      ? "descending"
                                      : "ascending",
                                    setSortObject
                                  );
                                }}
                              >
                                Category
                                {getSortIcon("category")}
                              </TableCell>
                              <TableCell
                                className="nowrap-header"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSortOrder(
                                    "name",
                                    sortObject.direction == "ascending"
                                      ? "descending"
                                      : "ascending",
                                    setSortObject
                                  );
                                }}
                              >
                                Questionnaire Name
                                {getSortIcon("name")}
                              </TableCell>
                              <TableCell
                                className="nowrap-header"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSortOrder(
                                    "submission_status",
                                    sortObject.direction == "ascending"
                                      ? "descending"
                                      : "ascending",
                                    setSortObject
                                  );
                                }}
                              >
                                Status
                                {getSortIcon("submission_status")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredQuestAssignment?.map((assignment) => {
                              return (
                                <TableRow
                                  key={assignment?.id}
                                  onClick={() =>
                                    setSelectedQuestionnaire(assignment)
                                  }
                                  sx={{
                                    cursor: "pointer",
                                    bgcolor:
                                      selectedQuestionnaire?.id == assignment.id
                                        ? "#FFF0DF"
                                        : "",
                                  }}
                                >
                                  <TableCell>
                                    {formatToUsDateFromUTC(
                                      assignment.created_at
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {assignment?.category == "copd"
                                      ? "COPD"
                                      : snakeCaseToTitleCase(
                                          assignment.category
                                        )}
                                  </TableCell>
                                  <TableCell>{assignment.name}</TableCell>
                                  <TableCell>
                                    {assignment.submission_status ===
                                    "pending" ? (
                                      <Link
                                        target="_blank"
                                        href={`/questionnaire_assignments_submission_prov/${assignment.uuid}`}
                                      >
                                        <a>
                                          {formatStatus(
                                            assignment.submission_status
                                          )}
                                        </a>
                                      </Link>
                                    ) : (
                                      formatStatus(assignment.submission_status)
                                    )}
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
      </Grid>
      {selectedQuestionnaire?.id && (
        <PatientQuestionnaireAnswers
          category={selectedQuestionnaire?.category}
          patientId={patientId}
          questionniarerId={selectedQuestionnaire?.questionnaire_id}
        />
      )}
    </>
  );
};

export default QuestionnnairePanel;
