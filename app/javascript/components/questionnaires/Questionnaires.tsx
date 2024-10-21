import * as React from "react";
import { Grid, Link, Switch } from "@mui/material";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CreateIcon from "@mui/icons-material/Create";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import { snakeCaseToTitleCase } from "../utils/CaseFormatHelper";

// components
import { Modal as DeleteModal } from "../modals/Modal";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

// helper
import { toTitleCase } from "../utils/CaseFormatHelper";
import { formatToUsDate } from "../utils/DateHelper";

// hooks
import { useCustomerPermission } from "../hooks/useCustomerPermission";

interface Props {}

const Questionnaires: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);

  const [showArchiveModal, setShowArchiveModal] =
    React.useState<boolean>(false);
  const [deleteQuestionnaire, setDeleteQuestionnnaire] = React.useState<any>();

  // questionnaire states
  const [allQuestionnaires, setAllQuestionnaires] = React.useState<any>([]);
  const [questionnaires, setQuestionnaires] = React.useState<any>([]);
  const [showArchived, setShowArchived] = React.useState<boolean>(false);
  const tabletPermitted = useCustomerPermission(
    "Allow questionnaires to display on local device"
  );

  // fetching inital data
  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch(`/questionnaires`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          setAllQuestionnaires(result.resource);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleShowArchieved = () => {
    setShowArchived(!showArchived);
  };

  React.useEffect(() => {
    if (showArchived) {
      setQuestionnaires([...allQuestionnaires]);
    } else {
      const tempQs = allQuestionnaires.filter((q) => q.status != "archived");
      setQuestionnaires(tempQs);
    }
  }, [showArchived, allQuestionnaires]);

  // Archive handlers
  const handleArchiveBtnClick = (questionnanire) => {
    setDeleteQuestionnnaire(questionnanire);
  };

  React.useEffect(() => {
    if (deleteQuestionnaire?.id) {
      setShowArchiveModal(true);
    }
  }, [deleteQuestionnaire?.id]);

  const handleDelete = () => {
    if (deleteQuestionnaire?.id) {
      fetch(`/questionnaires/${deleteQuestionnaire?.id}`, {
        method: "DELETE",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            setDeleteQuestionnnaire(undefined);
            setShowArchiveModal(false);
            getData();
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  const closeModal = () => {
    setDeleteQuestionnnaire(undefined);
    setShowArchiveModal(false);
  };

  const updateShowOnTablet = (questionnaireId) => {
    if (questionnaireId) {
      fetch(`/questionnaires_toggle_display_tablet/${questionnaireId}`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            getData();
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const publishQuestionnaire = (questionnaireId) => {
    if (questionnaireId) {
      fetch(`/questionnaires_publish/${questionnaireId}`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            getData();
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  return (
    <div className="main-content-outer">
      <DeleteModal
        successModalOpen={showArchiveModal}
        setSuccessModalOpen={setShowArchiveModal}
        successHeader={`${
          deleteQuestionnaire?.status == "draft" ? "Delete" : "Archive"
        } Questionnaire?`}
        successContent={`You are attempting to ${
          deleteQuestionnaire?.status == "draft" ? "delete" : "archive"
        } this questionnaire. This cannot be undone. Would you like to continue?`}
        successCallback={handleDelete}
        closeCallback={closeModal}
        confirmButtonText="Continue"
      />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="main-content"
      >
        <Grid item xs={12} className="patient-edit-container patient-edit-form">
          <Grid container>
            <Grid
              className="patient-edit-header"
              container
              justifyContent="space-between"
            >
              <Grid item xs={4}>
                <p className="secondary-label" style={{ marginLeft: "0px" }}>
                  Questionnaire Builder
                </p>
              </Grid>

              <Grid item xs={6} className="q-btn-container">
                <span className="font-16px grey-font">
                  <Switch
                    checked={showArchived}
                    onChange={handleShowArchieved}
                    color="primary"
                  />
                  Show Archived Questionnaires
                </span>

                <Link
                  href="/new-questionnaire"
                  className="grey-font"
                  style={{
                    height: "40px",
                    marginRight: "16px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px",
                    position: "relative",
                    top: "-2px",
                  }}
                >
                  <img
                    src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png"
                    width="40"
                    alt="Add New Questionnaire"
                    style={{ padding: "5px" }}
                  />
                  Add New Questionnaire
                </Link>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" className="bold-font-face">
                          Category
                        </TableCell>
                        <TableCell component="th" className="bold-font-face">
                          Questionnaire Name
                        </TableCell>
                        <TableCell component="th" className="bold-font-face">
                          Description
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          align="center"
                        >
                          Status
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          align="center"
                        >
                          Date Published
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          align="center"
                        >
                          Display on Tablet?
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          align="center"
                        >
                          Edit/View
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          align="center"
                        >
                          Archive
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {questionnaires.map(
                        (questionnaire, index) =>
                          (showArchived ||
                            questionnaire.status !== "archived") && (
                            <TableRow
                              key={questionnaire.id}
                              className={
                                index % 2 == 0 && `panel-grey-background`
                              }
                            >
                              <TableCell>
                                {questionnaire.category?.toLowerCase() === "copd"
                                  ? "COPD"
                                  : snakeCaseToTitleCase(
                                      questionnaire.category
                                    )}
                              </TableCell>
                              <TableCell>{questionnaire.name}</TableCell>
                              <TableCell>{questionnaire.description}</TableCell>
                              <TableCell align="center">
                                {toTitleCase(questionnaire.status)}
                              </TableCell>
                              <TableCell align="center">
                                {questionnaire.published_at ? (
                                  formatToUsDate(questionnaire.published_at)
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Link
                                      onClick={() => {
                                        publishQuestionnaire(questionnaire.id);
                                      }}
                                      className="basic-button orange-btn"
                                      style={{
                                        width: "100px",
                                      }}
                                    >
                                      Publish
                                    </Link>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <Switch
                                  value={questionnaire.id}
                                  checked={questionnaire.display_on_tablet}
                                  onChange={() =>
                                    updateShowOnTablet(questionnaire.id)
                                  }
                                  color="primary"
                                  disabled={!tabletPermitted}
                                />
                              </TableCell>
                              <TableCell align="center">
                                {(questionnaire.status === "published" ||
                                  questionnaire.status === "archived") ? (
                                  <Link
                                    href={`/new-questionnaire/${questionnaire.id}`}
                                    style={{
                                      color: "black",
                                    }}
                                  >
                                    <VisibilityIcon />
                                  </Link>
                                )
                                :
                                (questionnaire.status === "draft" && (
                                  <Link
                                    href={`/new-questionnaire/${questionnaire.id}`}
                                    style={{
                                      color: "black",
                                    }}
                                  >
                                    <CreateIcon />
                                  </Link>
                                ))
                                }
                              </TableCell>
                              <TableCell align="center">
                                {questionnaire.status !== "archived" && (
                                  <Link
                                    onClick={() =>
                                      handleArchiveBtnClick(questionnaire)
                                    }
                                    style={{
                                      color: "black",
                                    }}
                                  >
                                    {questionnaire.status !== "draft" ? (
                                      <ArchiveIcon />
                                    ) : (
                                      <DeleteIcon />
                                    )}
                                  </Link>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Questionnaires;
