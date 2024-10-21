import {
  Box,
  Grid,
  Link,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import SVG from "react-inlinesvg";

interface Props {
  sort_ascending_src: string;
  sort_descending_src: string;
  sort_plain_src: string;
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const ActionBuilder: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [showArchiveModal, setShowArchiveModal] =
    React.useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] =
    React.useState<boolean>(false);
  const [deleteProviderAction, setDeleteProviderAction] = React.useState<any>();
  const [publishProviderActionId, setPublishProviderActionId] =
    React.useState<string>("");
  const [allActions, setAllActions] = React.useState<any>([]);
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
    fetch(`/actions`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setAllActions(result?.resource); // Store all actions as they come
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
    if (deleteProviderAction?.id) {
      setShowArchiveModal(true);
    }
  }, [deleteProviderAction?.id]);

  React.useEffect(() => {
    if (publishProviderActionId) {
      setShowPublishModal(true);
    }
  }, [publishProviderActionId]);

  React.useEffect(() => {
    if (allActions) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const actionList = getSortedAndSearchedList();
    setAllActions(actionList);
  };

  const getSortedAndSearchedList = () => {
    let actionList = [...allActions];
    actionList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "category") {
      actionList.sort((a, b) =>
        a.category?.toLowerCase() > b.category?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "title") {
      actionList.sort((a, b) =>
        a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
      );
    }
    if (sortObject.field == "subject") {
      actionList.sort((a, b) =>
        a.subject?.toLowerCase() > b.subject?.toLowerCase() ? 1 : -1
      );
    }
    if (sortObject.field == "date_published") {
      actionList.sort((a, b) =>
        new Date(a["date_published"]) > new Date(b["date_published"]) ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      actionList.reverse();
    }
    return actionList;
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const closeArchiveModal = () => {
    setDeleteProviderAction(undefined);
    setShowArchiveModal(false);
  };

  const closePublishModal = () => {
    setPublishProviderActionId(null);
    setShowPublishModal(false);
  };

  const publishAction = () => {
    if (publishProviderActionId) {
      fetch(`/actions_publish/${publishProviderActionId}`, {
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
            setPublishProviderActionId(null);
            setFlashMessage({
              message: "You have successfully published this action",
              type: "success",
            });
          }
        })
        .catch((error) => {
          setFlashMessage({
            message: `Failed to publish action: " + ${error.message}`,
            type: "warning",
          });
        });
    }
  };

  const searchIcon = require("../../../assets/images/search.svg");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleArchiveBtnClick = (action) => {
    setDeleteProviderAction(action);
  };

  const handlePublishBtnClick = (actionId) => {
    setPublishProviderActionId(actionId);
  };

  const archiveAction = () => {
    if (deleteProviderAction?.id) {
      fetch(`/actions/${deleteProviderAction.id}`, {
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
              message: "You have successfully archived this action",
              type: "success",
            });
            setDeleteProviderAction(undefined);
            setShowArchiveModal(false);
            getData();
          }
        })
        .catch((error) => {
          setFlashMessage({
            message: `Failed to archive action: " + ${error.message}`,
            type: "warning",
          });
        });
    }
  };

  const filteredActions = allActions?.filter((action) => {
    const searchLower = searchKey.toLowerCase();
    return (
      action.title.toLowerCase().includes(searchLower) &&
      (!showArchived ? !action.is_archived : true)
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
          deleteProviderAction?.status == "draft" ? "Delete" : "Archive"
        } Action?`}
        successContent={`You are attempting to ${
          deleteProviderAction?.status == "draft" ? "delete" : "archive"
        } this action. This cannot be undone. Would you like to continue?`}
        successCallback={archiveAction}
        closeCallback={closeArchiveModal}
        confirmButtonText={`${
          deleteProviderAction?.status == "draft" ? "Delete" : "Archive"
        } Action`}
        width="430px"
      />
      <Modal
        successModalOpen={showPublishModal}
        setSuccessModalOpen={setShowPublishModal}
        successHeader={"Publishing an Action"}
        successContent={
          "You are attempting to publish this action. Would you like to continue?"
        }
        successCallback={publishAction}
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
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="action tabs"
          // classes={{
          //   indicator: "indicator",
          //   flexContainer: "tabContainer",
          // }}
        >
          <Tab label="Provider Actions" className="tab" />
          <Tab label="Patient Actions" className="tab" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Grid
            item
            xs={12}
            className="patient-edit-container patient-edit-form"
          >
            <Grid container>
              <Grid
                className="patient-edit-header"
                container
                justifyContent="space-between"
              >
                <Grid item xs={4}>
                  <p className="secondary-label" style={{ marginLeft: "0px" }}>
                    Provider Action Builder
                  </p>
                </Grid>

                <Grid item xs={6} className="q-btn-container">
                  <span className="font-16px grey-font">
                    <Switch
                      checked={showArchived}
                      onChange={handleShowArchieved}
                      color="primary"
                    />
                    Show Archived Actions
                  </span>

                  <Link
                    href="/new-provider-action"
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
                    Add New Provider Action
                  </Link>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} className="form-container">
                  <Grid
                    container
                    // className="patient-chat-search"
                    style={{ padding: "24px" }}
                  >
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
                            onClick={() => {
                              setSortOrder(
                                "category",
                                sortObject.direction == "ascending"
                                  ? "descending"
                                  : "ascending"
                              );
                            }}
                            style={{ cursor: "pointer" }}
                            className="table-header name-header bold-font-face first-column nowrap-header"
                          >
                            <strong>Category</strong>
                            {getSortIcon("category")}
                          </TableCell>
                          <TableCell
                            component="th"
                            className="bold-font-face nowrap-header"
                          >
                            Icon
                          </TableCell>
                          <TableCell
                            component="th"
                            className="bold-font-face nowrap-header"
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
                                "subject",
                                sortObject.direction == "ascending"
                                  ? "descending"
                                  : "ascending"
                              );
                            }}
                          >
                            <strong>Subject</strong>
                            {getSortIcon("subject")}
                          </TableCell>
                          <TableCell
                            align="left"
                            component="th"
                            className="bold-font-face nowrap-header"
                          >
                            Reccurrence
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
                            Date Published
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
                            className="bold-font-face last-column nowrap-header"
                            align="center"
                          >
                            Archive
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {filteredActions?.map((action, index) => (
                        <TableRow
                          key={action.id}
                          className={
                            index % 2 === 0 ? `panel-grey-background` : ""
                          }
                        >
                          <TableCell className="first-column">
                            {action.category}
                          </TableCell>
                          <TableCell>
                            <SVG
                              src={action.icon_url}
                              width={25}
                              height={25}
                              fill={"black"}
                              aria-placeholder={"Icon"}
                              style={{
                                marginRight: 8,
                              }}
                            />
                          </TableCell>
                          <TableCell>{action.title}</TableCell>
                          <TableCell>{action.subject}</TableCell>
                          <TableCell>{action.readable_recurrence}</TableCell>
                          <TableCell align="center">
                            {!action.published_at
                              ? !action.is_archived && (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Link
                                      onClick={() =>
                                        handlePublishBtnClick(action.id)
                                      }
                                      style={{ color: "#fff" }}
                                      className="basic-button orange-btn"
                                    >
                                      Publish
                                    </Link>
                                  </div>
                                )
                              : formatToUsDate(action.published_at)}
                          </TableCell>
                          <TableCell align="center">
                            <Link
                              href={`/new-provider-action/${action.id}`}
                              style={{
                                color: "black",
                              }}
                            >
                              {!action.published_at ? (
                                <CreateIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </Link>
                          </TableCell>
                          <TableCell align="center" className="last-column">
                            {action.status !== "archived" && (
                              <Link
                                onClick={() => handleArchiveBtnClick(action)}
                                style={{
                                  color: "black",
                                }}
                              >
                                {action.status !== "draft" ? (
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
        </TabPanel>
        <TabPanel value={value} index={1} style={{ width: "100%" }}>
          <Grid
            item
            xs={12}
            className="patient-edit-container patient-edit-form"
          >
            <Grid container>
              <Grid
                className="patient-edit-header"
                container
                justifyContent="space-between"
              >
                <Grid item xs={4}>
                  <p className="secondary-label" style={{ marginLeft: "0px" }}>
                    Patient Action Builder
                  </p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
      </Grid>
    </div>
  );
};

export default ActionBuilder;
