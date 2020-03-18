import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";
import ArchiveIcon from "@mui/icons-material/Archive";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatToUsDate } from "../utils/DateHelper";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";
import Modal from "../modals/Modal";

interface Props {
  ndm_reports: any[];
  onArchive: Function;
}

const modalContent = (
  <div className="modal-content">
    <p className="align-center">
      You are attempting to archive this ndm report. Would you like to continue?
    </p>
  </div>
);

const PreviouslyUploadedReports: React.FC<Props> = (props: any) => {
  const ndmReports = props.ndm_reports;
  const flashContext = React.useContext(FlashContext);
  const authContext = React.useContext(AuthenticationContext);
  const [archiveModal, setArchiveModal] = React.useState<boolean>(false);
  const [reportId, setReportId] = React.useState<string>(null);

  const handleArchive = () => {
    if (!reportId) {
      return;
    }
    fetch(`ndm-reports/${reportId}/archive`, {
      method: "PATCH",
      headers: getHeaders(authContext.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        flashContext.setMessage({
          text: result.message,
          type: "success",
        });
        handleCloseArchiveModal();
        props.onArchive();
      })
      .catch((error) => {
        console.error(error);
        handleCloseArchiveModal();
        flashContext.setMessage({
          text: "Something went wrong!",
          type: "error",
        });
      });
  };

  const handleCloseArchiveModal = () => {
    setReportId(null);
    setArchiveModal(false);
  };

  return (
    <div className="adminFunctions">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container"
      >
        <Grid
          container
          item
          xs={11}
          className="userAdminInformation ndm-report-container"
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12}>
            <h3 style={{ paddingLeft: 16 }}>Previously Uploaded Files</h3>
            <div
              className="divider-orange"
              style={{ margin: "0px", width: "100%" }}
            ></div>
          </Grid>
          <Grid item container>
            <Grid item xs={12} className="ndm-report-subheader">
              Below is a list of previously uploaded reports.
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper} className="ndm-reports-table">
                <Table className="table" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="left"
                        className="table-header"
                        width={"20%"}
                      >
                        Payer Name
                      </TableCell>
                      <TableCell
                        align="left"
                        className="table-header"
                        width={"20%"}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="left"
                        className="table-header"
                        width={"15%"}
                      >
                        Date Uploaded
                      </TableCell>
                      <TableCell
                        align="left"
                        className="table-header"
                        width={"20%"}
                      >
                        Number of Unique Patients
                      </TableCell>
                      <TableCell
                        align="center"
                        className="table-header"
                        width={"2%"}
                      >
                        Archive
                      </TableCell>
                      <TableCell
                        align="center"
                        className="table-header"
                        width={"2%"}
                      >
                        View
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ndmReports ? (
                      ndmReports.map((report) => {
                        return (
                          <TableRow key={report.id}>
                            <TableCell align="left">
                              {"North Dakota Medicaid"}
                            </TableCell>
                            <TableCell align="left">
                              {report.status == "processing" && (
                                <>
                                  <span className="processing-circle"></span>
                                  <span>Upload In Progress</span>
                                </>
                              )}
                              {report.status == "invalid" && (
                                <>
                                  <span className="invalid-circle"></span>
                                  <span>Report Failed-Ready to Review</span>
                                </>
                              )}
                              {report.status == "completed" && (
                                <>
                                  <span className="completed-circle"></span>
                                  <span>Report Processed-Ready to Review</span>
                                </>
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {formatToUsDate(report.created_at)}
                            </TableCell>
                            <TableCell align="left">{"N/A"}</TableCell>
                            <TableCell align="center">
                              <ArchiveIcon
                                onClick={() => {
                                  setArchiveModal(true);
                                  setReportId(report.id);
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <a
                                href={
                                  report.status === "processing"
                                    ? undefined
                                    : `/ndm-report/${report.id}`
                                }
                                style={{ color: "black" }}
                                aria-disabled={true}
                              >
                                <VisibilityIcon
                                  className="pencil"
                                  color={
                                    report.status === "processing"
                                      ? "disabled"
                                      : undefined
                                  }
                                />
                              </a>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" width={"100%"}>
                          No actions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        successModalOpen={archiveModal}
        setSuccessModalOpen={handleCloseArchiveModal}
        successHeader={"Archive NDM Rport"}
        successContent={modalContent}
        successCallback={handleArchive}
        closeCallback={handleCloseArchiveModal}
        confirmButtonText={"Archive"}
      />
    </div>
  );
};

export default PreviouslyUploadedReports;
