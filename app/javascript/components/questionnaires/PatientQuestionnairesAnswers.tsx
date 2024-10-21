import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Link,
  Modal,
} from "@mui/material";
import PatientInfo from "../patient_reports/PatientInfo";
import { AuthenticationContext } from "../Context";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHeaders } from "../utils/HeaderHelper";
import { formatToUsDate } from "../utils/DateHelper";
import { MoreVert, ExpandMore, ImportContacts } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { Stack } from "@mui/system";

interface Props {
  patientId: string;
  questionniarerId: string;
  category: string;
}

const PatientQuestionnaireAnswers: React.FC<Props> = (props: any) => {
  // users id
  console.log("props", props);
  const { patientId, category, questionniarerId } = props;
  const authSettings = React.useContext(AuthenticationContext);
  const [questionnaires, setQuestionnaires] = useState<any>([]);
  const [questionnaireDetailsModalOpen, setQuestionnaireDetailsModalOpen] =
    useState(false);
  const [questionnaireDetails, setQuestionnaireDetails] = useState<any>();
  const [expanded, setExpanded] = useState<boolean[]>(Array(5).fill(true)); //Leave the first 5 accordions expanded by default on page load.
  const [resourceItemLinksModalOpen, setResourceItemLinksModalOpen] =
    useState(false);
  const [resourceItemLinks, setResourceItemLinks] = useState<any>([]);

  useEffect(() => {
    getQuestionnaireAnswers();
  }, [patientId, category]);

  const getQuestionnaireAnswers = () => {
    fetch(`/patients/${patientId}/questionnaire_submissions/${category}`, {
      method: "GET",
      headers: getHeaders(authSettings.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setQuestionnaires(result.resource.questionnaires);
          setExpanded(Array(result.resource.questionnaires.length).fill(true));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDetailModalOpen = (questionnaire, assignment) => {
    const detail = {
      name: questionnaire.name,
      category: questionnaire.category,
      categoryDisplay: questionnaire.questionnaire_category.display_name,
      description: questionnaire.description,
      assigned_by: assignment.provider
        ? `${assignment.provider.last_name}, ${assignment.provider.first_name}`
        : "-",
      answered_by: assignment.questionnaire_submission?.submitter
        ? `${assignment.questionnaire_submission?.submitter.last_name}, ${assignment.questionnaire_submission?.submitter.first_name}`
        : "-",
    };
    setQuestionnaireDetails(detail);
    setQuestionnaireDetailsModalOpen(true);
  };

  const handleAccordionChange =
    (panel) => (event: React.ChangeEvent, isExpanded: boolean) => {
      const newExpanded = [...expanded];
      newExpanded[panel] = isExpanded;
      setExpanded(newExpanded);
    };

  const handleShowReource = (event, questionnaire) => {
    event.stopPropagation();
    if (questionnaire?.resource_items?.length === 1) {
      window.open(questionnaire?.resource_items[0].link, "_blank");
    } else {
      const links = questionnaire?.resource_items?.map((item) => item.link);
      setResourceItemLinksModalOpen(true);
      setResourceItemLinks(links);
    }
  };

  //answering rending function
  const renderSignatureCapture = (submission) => {
    if (submission?.signature_url) {
      return <img src={submission.signature_url} alt="signature" height={65} />;
    } else {
      return "-";
    }
  };

  // Function to render answers based on question type
  const renderAnswer = (question, submission, index) => {
    switch (question?.type) {
      case "signature_capture":
        return renderSignatureCapture(submission);
      default:
        return submission?.answers[index]?.answer || "-";
    }
  };

  // Main rendering function
  const renderSubmissionAnswer = (assignment, question, index) => {
    const submission = assignment?.questionnaire_submission;
    return submission ? renderAnswer(question, submission, index) : "-";
  };

  return (
    <Grid className="cgm-report-container" ml={0} mr={"auto"}>
      {questionnaires.length <= 0 ? (
        <Grid
          container
          spacing={1}
          item
          xs={12}
          className="question-container questionnaire-show-container"
          justifyContent="center"
          alignItems="center"
          width={"100% !important"}
          maxWidth={"100% !important"}
        >
          <Grid item xs={12}>
            No related questionnaire for this patient.
          </Grid>
        </Grid>
      ) : (
        questionnaires
          ?.filter((q) => q.id == questionniarerId)
          ?.map((questionnaire, index) => {
            return (
              <Grid
                container
                spacing={1}
                item
                xs={12}
                key={index}
                className="question-container questionnaire-show-container"
              >
                <Grid item xs={12}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    paddingX={3}
                    alignItems={"center"}
                    display={"flex"}
                  >
                    <h2>{questionnaire.name}</h2>
                    {true && (
                      <ImportContacts
                        style={{ color: "grey", fontSize: "1.9em" }}
                        onClick={(event) =>
                          handleShowReource(event, questionnaire)
                        }
                      />
                    )}
                  </Stack>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      className="questionnaire-table-container"
                      sx={{
                        maxWidth: "calc(100vw - 163px) !important",
                        overflow: "auto",
                      }}
                    >
                      <table className="questionnaire-table">
                        <thead className="divider">
                          <tr>
                            <th className="first-column-header">Questions</th>
                            {questionnaire.questionnaire_assignments.map(
                              (assignment) => {
                                return (
                                  <th key={assignment.id}>
                                    <Grid
                                      container
                                      justifyContent="space-between"
                                      style={{ padding: "0 20px" }}
                                    >
                                      <span>
                                        {assignment?.questionnaire_submission
                                          ?.created_at
                                          ? formatToUsDate(
                                              assignment
                                                ?.questionnaire_submission
                                                ?.created_at
                                            )
                                          : `Not answered yet (Sent at ${formatToUsDate(
                                              assignment?.created_at
                                            )})`}
                                      </span>
                                      <Link
                                        onClick={() =>
                                          handleDetailModalOpen(
                                            questionnaire,
                                            assignment
                                          )
                                        }
                                        className="linkDark"
                                      >
                                        <MoreVert />
                                      </Link>
                                    </Grid>
                                  </th>
                                );
                              }
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {questionnaire.questions?.map((question, index) => (
                            <tr key={index}>
                              <td className="first-column-data">
                                {question.title}
                              </td>
                              {questionnaire.questionnaire_assignments.map(
                                (assignment, i) => (
                                  <td
                                    key={assignment.id}
                                    className={
                                      i % 2 !== 0
                                        ? "background-subtle-orange"
                                        : ""
                                    }
                                  >
                                    {renderSubmissionAnswer(
                                      assignment,
                                      question,
                                      index
                                    )}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            );
          })
      )}

      <Modal open={questionnaireDetailsModalOpen} className="modal-primary">
        <div className="paper" style={{ width: 500 }}>
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <div className="main-header">
                  Questionnaire Details
                  <span
                    id="dismiss-button"
                    onClick={() => {
                      setQuestionnaireDetailsModalOpen(false);
                      setQuestionnaireDetails(undefined);
                    }}
                  >
                    <ClearIcon />
                  </span>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  className="content"
                  style={{ padding: "30px" }}
                  spacing={3}
                >
                  <Grid item xs={12}>
                    <div className="header">
                      <b>Questionnaire Name</b>
                    </div>
                    <div className="data-point">
                      {questionnaireDetails?.name}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="header">
                      <b>Category</b>
                    </div>
                    <div className="data-point">
                      {questionnaireDetails?.categoryDisplay}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="header">
                      <b>Description</b>
                    </div>
                    <div className="data-point">
                      {questionnaireDetails?.description}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      <b className="header">Assigned by: </b>
                      <span className="data-point">
                        {questionnaireDetails?.assigned_by}
                      </span>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      <b className="header">Answered by: </b>
                      <span className="data-point">
                        {questionnaireDetails?.answered_by}
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>

      <Modal open={resourceItemLinksModalOpen} className="modal-primary">
        <div className="paper" style={{ width: 500 }}>
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <div className="main-header">
                  Questionnaire Resource(s)
                  <span
                    id="dismiss-button"
                    onClick={() => {
                      setResourceItemLinksModalOpen(false);
                      setResourceItemLinks([]);
                    }}
                  >
                    <ClearIcon />
                  </span>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  className="content"
                  style={{ padding: "30px" }}
                  spacing={3}
                >
                  {resourceItemLinks?.map((link) => (
                    <Grid item xs={12}>
                      <Link
                        href={link}
                        target="_blank"
                        style={{
                          wordWrap: "break-word",
                        }}
                      >
                        {
                          link
                            .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
                            .split("/")[0]
                        }
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </Grid>
  );
};

export default PatientQuestionnaireAnswers;
