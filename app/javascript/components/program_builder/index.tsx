import { Grid, Link, Switch, TextField } from "@mui/material";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as React from "react";
import { AuthenticationContext } from "../Context";
import { Modal } from "../modals/Modal";
import FlashMessage from "../shared/FlashMessage";
import { formatToUsDate } from "../utils/DateHelper";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  sort_ascending_src: string;
  sort_descending_src: string;
  sort_plain_src: string;
}

const ProgramBuilder: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [showArchiveModal, setShowArchiveModal] =
    React.useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] =
    React.useState<boolean>(false);
  const [deleteProgram, setDeleteProgram] = React.useState<any>();
  const [publishProgramId, setPublishProgramId] = React.useState<string>("");
  const [allPrograms, setAllPrograms] = React.useState<any>([]);
  const [showArchived, setShowArchived] = React.useState<boolean>(false);
  const [searchKey, setSearchKey] = React.useState<string>("");
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  const [sortObject, setSortObject] = React.useState<any>({
    field: "category",
    direction: "ascending",
  });
  const afterFetch = React.useRef(false);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch(`/programs`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          setAllPrograms(result?.data?.programs);
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
    if (deleteProgram?.id) {
      setShowArchiveModal(true);
    }
  }, [deleteProgram?.id]);

  React.useEffect(() => {
    if (publishProgramId) {
      setShowPublishModal(true);
    }
  }, [publishProgramId]);

  React.useEffect(() => {
    if (allPrograms) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const programList = getSortedAndSearchedList();
    setAllPrograms(programList);
  };

  const getSortedAndSearchedList = () => {
    let programList = [...allPrograms];
    programList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "category") {
      programList.sort((a, b) =>
        a.category?.toLowerCase() > b.category?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "title") {
      programList.sort((a, b) =>
        a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
      );
    }
    if (sortObject.field == "subtext") {
      programList.sort((a, b) =>
        a.subtext?.toLowerCase() > b.subtext?.toLowerCase() ? 1 : -1
      );
    }
    if (sortObject.field == "date_published") {
      programList.sort((a, b) =>
        new Date(a["date_published"]) > new Date(b["date_published"]) ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      programList.reverse();
    }
    return programList;
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const closeArchiveModal = () => {
    setDeleteProgram(undefined);
    setShowArchiveModal(false);
  };

  const closePublishModal = () => {
    setPublishProgramId(null);
    setShowPublishModal(false);
  };

  const publishprogram = () => {
    if (publishProgramId) {
      fetch(`/programs/${publishProgramId}/publish`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.error) {
            setFlashMessage({
              message: "Something went wrong",
              type: "warning",
            });
          } else {
            setShowPublishModal(false);
            getData();
            setPublishProgramId(null);
            setFlashMessage({
              message: "You have successfully published this program",
              type: "success",
            });
          }
        })
        .catch((error) => {
          setFlashMessage({
            message: `Failed to publish program: " + ${error.message}`,
            type: "warning",
          });
        });
    }
  };

  const searchIcon = require("../../../assets/images/search.svg");

  const handleArchiveBtnClick = (program) => {
    setDeleteProgram(program);
  };

  const handlePublishBtnClick = (programId) => {
    setPublishProgramId(programId);
  };

  const archiveProgram = () => {
    if (deleteProgram?.id) {
      fetch(`/programs/${deleteProgram.id}`, {
        method: "DELETE",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success === false) {
            setFlashMessage({
              message: "Something went wrong",
              type: "warning",
            });
          } else {
            setFlashMessage({
              message: "You have successfully archived this program",
              type: "success",
            });
            setDeleteProgram(undefined);
            setShowArchiveModal(false);
            getData();
          }
        })
        .catch((error) => {
          setFlashMessage({
            message: `Failed to archive program: " + ${error.message}`,
            type: "warning",
          });
        });
    }
  };

  const filteredprograms = allPrograms?.filter((program) => {
    const searchLower = searchKey.toLowerCase();
    return (
      program.title.toLowerCase().includes(searchLower) &&
      (!showArchived ? !program.is_archived : true)
    );
  });

  const getSortIcon = (column) => {
    return sortObject.field == column ? (
      <span className="sortIndicator">
        {sortObject.direction == "ascending" ? (
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
    );
  };

  return (
    <div className="main-content-outer">
      <Modal
        successModalOpen={showArchiveModal}
        setSuccessModalOpen={setShowArchiveModal}
        successHeader={`${
          deleteProgram?.status == "draft" ? "Delete" : "Archive"
        } program?`}
        successContent={`You are attempting to ${
          deleteProgram?.status == "draft" ? "delete" : "archive"
        } this program. This cannot be undone. Would you like to continue?`}
        successCallback={archiveProgram}
        closeCallback={closeArchiveModal}
        confirmButtonText={`${
          deleteProgram?.status == "draft" ? "Delete" : "Archive"
        } program`}
        width="430px"
      />
      <Modal
        successModalOpen={showPublishModal}
        setSuccessModalOpen={setShowPublishModal}
        successHeader={"Publishing an program"}
        successContent={
          "You are attempting to publish this program. Would you like to continue?"
        }
        successCallback={publishprogram}
        closeCallback={closePublishModal}
        confirmButtonText="Publish"
        width="430px"
      />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="main-content"
      >
        <FlashMessage flashMessage={flashMessage} />
        <Grid item xs={12} className="patient-edit-container patient-edit-form">
          <Grid container>
            <Grid
              className="patient-edit-header"
              container
              justifyContent="space-between"
            >
              <Grid item xs={4}>
                <p className="secondary-label" style={{ marginLeft: "0px" }}>
                  Program Builder
                </p>
              </Grid>

              <Grid item xs={6} className="q-btn-container">
                <span className="font-16px grey-font">
                  <Switch
                    checked={showArchived}
                    onChange={handleShowArchieved}
                    color="primary"
                  />
                  Show Archived Programs
                </span>

                <Link
                  href="/new-program"
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
                    alt="Add New Program"
                    style={{ padding: "5px" }}
                  />
                  Add New Program
                </Link>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} className="form-container">
                <Grid container style={{ padding: "24px" }}>
                  <Grid
                    item
                    xs={12}
                    className="patient-chat-search__box field-container"
                    style={{
                      position: "relative",
                      marginLeft: "0px !important",
                    }}
                  >
                    <img
                      src={searchIcon}
                      style={{
                        width: "15px",
                        position: "absolute",
                        top: "13px",
                        left: "15px",
                        zIndex: 10,
                      }}
                    />
                    <TextField
                      id="search-builder"
                      placeholder="Search"
                      value={searchKey}
                      onChange={(event) => {
                        setSearchKey(event.target.value);
                      }}
                      style={{ width: "100%", backgroundColor: "#EFE9E7" }}
                      className="the-field the-search"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          component="th"
                          className="bold-font-face first-column nowrap-header"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortOrder(
                              "title",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending"
                            );
                          }}
                        >
                          <strong>Title</strong>
                          {getSortIcon("title")}
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          className="bold-font-face nowrap-header"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortOrder(
                              "subtext",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending"
                            );
                          }}
                        >
                          <strong>Subtext</strong>
                          {getSortIcon("subtext")}
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face nowrap-header"
                          align="center"
                          width={"5% !important"}
                          style={{ cursor: "pointer", width: "5%" }}
                          onClick={() => {
                            setSortOrder(
                              "date_published",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending"
                            );
                          }}
                        >
                          Publish Date
                          {getSortIcon("date_published")}
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face nowrap-header"
                          align="center"
                        >
                          Edit/View
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face nowrap-header last-column"
                          align="center"
                        >
                          Archive
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {filteredprograms?.map((program, index) => (
                      <TableRow
                        key={program.id}
                        className={
                          index % 2 === 0 ? `panel-grey-background` : ""
                        }
                      >
                        <TableCell className="first-column">
                          {program.title}
                        </TableCell>
                        <TableCell>{program.subtext}</TableCell>
                        <TableCell align="center">
                          {!program.published_at
                            ? !program.is_archived && (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Link
                                    onClick={() =>
                                      handlePublishBtnClick(program.id)
                                    }
                                    style={{ color: "#fff" }}
                                    className="basic-button orange-btn"
                                  >
                                    Publish
                                  </Link>
                                </div>
                              )
                            : formatToUsDate(program.published_at)}
                        </TableCell>
                        <TableCell align="center">
                          <Link
                            href={`/new-program/${program.id}`}
                            style={{
                              color: "black",
                            }}
                          >
                            {!program.published_at ? (
                              <CreateIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </Link>
                        </TableCell>
                        <TableCell align="center" className="last-column">
                          {program.status !== "archived" && (
                            <Link
                              onClick={() => handleArchiveBtnClick(program)}
                              style={{
                                color: "black",
                              }}
                            >
                              {program.status !== "draft" ? (
                                <ArchiveIcon />
                              ) : (
                                <DeleteIcon />
                              )}
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
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

export default ProgramBuilder;
