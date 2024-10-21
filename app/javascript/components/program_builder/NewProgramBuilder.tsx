import * as React from "react";
import { Grid, Link, InputLabel, Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext, ImagesContext } from "../Context";

// helper
import { useState } from "react";
import UnsavedDataConfirmation from "../modals/UnsavedDataConfirmation";
import ProgramActionsListing from "./ProgramActionsListing";
import ActionSelection from "./ActionSelection";
import Modal from "../modals/Modal";

interface Props {}

const NewProgramBuilder: React.FC<Props> = (props: any) => {
  // auth
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  // programId
  const { id } = useParams();

  // program states
  const [programId, setProgramId] = React.useState<string>(null);
  const [title, setTitle] = React.useState<string>("");
  const [subtext, setSubtext] = React.useState<string>("");

  const [showActionSelection, setShowActionSelection] =
    useState<boolean>(false);
  const [selectedActionIds, setSelectedActionIds] = useState<any>([]);
  const [selectedActions, setSelectedActions] = useState<any>([]);
  const [removeActionId, setRemoveActionId] = useState<number>();
  const [removeActionModal, setRemoveActionModal] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState<boolean>(false);

  const [published, setPublished] = React.useState<boolean>(false); //disable fields after published
  const [archived, setArchived] = React.useState<boolean>(false); //disable fields after archived
  const [renderingKey, setRenderingKey] = useState<number>(Math.random);

  React.useEffect(() => {
    setSelectedActionIds(selectedActions.map((a) => a.id));
  }, [selectedActions]);

  // fetching inital data
  React.useEffect(() => {
    if (id) {
      getProgramData();
    }
  }, [renderingKey, id]);

  const handleBackToList = () => {
    if (hasUnsavedChanges) {
      setUnsavedModalOpen(true);
    } else {
      window.location.href = "/program-builder";
    }
  };

  const getProgramData = () => {
    fetch(`/programs/${id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          const program = result.resource;
          setProgramId(program?.id);
          setTitle(program?.title);
          setSubtext(program?.subtext);
          setPublished(program?.status == "published");
          setArchived(program?.status == "archived");
          setSelectedActions(program?.actions);
          setSelectedActionIds(program?.action_ids);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  // handlers
  const handleSave = (saveType = "draft") => {
    if (validateFields()) {
      let url = `/programs`;
      let method = "POST";
      if (programId) {
        url = `${url}/${programId}`;
        method = "PUT";
      }
      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          program: {
            title: title,
            subtext: subtext,
            status: saveType,
          },
          action_ids: selectedActionIds,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            setProgramId(result.resource.id);
            if (result.resource.status == "published") {
              setPublished(true);
            }
            setHasUnsavedChanges(false);
            flashContext.setMessage({
              text: result.message,
              type: "success",
            });
            window.location.href = `/new-program/${result.resource.id}`;
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
    return false; //this is to preventDefault action
  };

  const saveActionsChangeToDB = async (
    selectedIds: Array<string>,
    deleting = false
  ) => {
    try {
      if (programId) {
        let url = `/programs/${programId}/save_actions_to_db`;
        const response = await fetch(url, {
          method: "PUT",
          headers: getHeaders(authenticationSetting.csrfToken),
          body: JSON.stringify({
            action_ids: selectedIds,
          }),
        });
        const result = await response.json();
        if (result.success == false) {
          alert(result.error);
        } else {
          getProgramData();
        }
      }
      flashContext.setMessage({
        text: `You have successfully ${
          deleting
            ? "deleted this action from the"
            : "added these actions to your"
        } program.`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // field validation
  const validateFields = () => {
    if (isBlank(title)) {
      setErrorFlash("Title cannot be blank");
      return false;
    }

    return true;
  };

  const isBlank = (str) => {
    return !str || str === undefined || str.trim() === "";
  };

  const setErrorFlash = (message) => {
    flashContext.setMessage({
      text: message,
      type: "error",
    });
  };

  const handleActionRemove = (id) => {
    setRemoveActionId(id);
    if (id) {
      setRemoveActionModal(true);
    }
  };

  const removeAction = () => {
    let tempSelectedActions = [...selectedActions];
    let removedList = tempSelectedActions.filter(
      (action) => action.id != removeActionId
    );
    setSelectedActions(removedList);
    setRemoveActionModal(false);
    setRemoveActionId(undefined);
    setHasUnsavedChanges(true);
    saveActionsChangeToDB(removedList.map((a) => a.id), true);
  };

  const images = React.useContext(ImagesContext);

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const [sortObject, setSortObject] = React.useState<any>({
    field: "category",
    direction: "ascending",
  });

  const sortList = () => {
    let actionList = [...selectedActions];
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
    if (sortObject.field == "subtext") {
      actionList.sort((a, b) =>
        a.subtext?.toLowerCase() > b.subtext?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      actionList.reverse();
    }

    setSelectedActions(actionList);
  };

  React.useEffect(() => {
    if (selectedActions) {
      sortList();
    }
  }, [sortObject]);

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

  return (
    <>
      <UnsavedDataConfirmation
        modalOpen={unsavedModalOpen}
        setModalOpen={setUnsavedModalOpen}
        objectName={"Program"}
        redirectUrl={"/program-builder"}
      />
      <Modal
        successModalOpen={removeActionModal}
        setSuccessModalOpen={setRemoveActionModal}
        successHeader={"Remove Action?"}
        successContent={
          "You are attempting to remove this action from this program. Would you like to continue?"
        }
        successCallback={removeAction}
        closeCallback={() => {
          setRemoveActionModal(false);
          setRemoveActionId(undefined);
        }}
        confirmButtonText="Remove"
      />
      <div className="main-content-outer">
        {showActionSelection ? (
          <ActionSelection
            handleSaveSelection={(selectedActions) => {
              setSelectedActions(selectedActions);
              setSelectedActionIds(selectedActions.map((a) => a.id));
              saveActionsChangeToDB(selectedActions.map((a) => a.id));
            }}
            selectedActionIds={selectedActionIds}
            setShowActionSelection={setShowActionSelection}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        ) : (
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="main-content"
          >
            <Grid
              item
              xs={12}
              id="provider-action-report"
              className="patient-edit-container patient-edit-form provider-action-report new-action-container"
            >
              <Grid container>
                <Grid
                  className="patient-edit-header"
                  container
                  justifyContent="space-between"
                >
                  <Grid item xs={4}>
                    <p
                      className="secondary-label"
                      style={{ marginLeft: "0px" }}
                    >
                      {!programId
                        ? "Add New "
                        : archived || published
                        ? "View "
                        : "Edit "}
                      Program
                    </p>
                  </Grid>

                  <Grid item xs={6} className="q-btn-container">
                    <Link
                      style={{ marginRight: "16px" }}
                      onClick={handleBackToList}
                    >
                      Back to Program List
                    </Link>
                    {!published && !archived && (
                      <Button
                        className="orange-btn"
                        onClick={() => handleSave("draft")}
                        style={{
                          height: "40px",
                          marginRight: "16px",
                          paddingLeft: "16px",
                          paddingRight: "16px",
                        }}
                        disabled={published || archived}
                      >
                        Save Draft
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <Grid container>
                  {/* column 1 */}
                  <Grid item xs={4}>
                    <Grid container className="form-container">
                      <Grid
                        item
                        xs={12}
                        className="patient-info-left-container form-left-container"
                        style={{
                          marginLeft: "30px",
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          className="field-label"
                          style={{
                            color: "#000000",
                            fontWeight: 800,
                            fontSize: "1.2em",
                            margin: "5px 0 0 0",
                            padding: "10px 0 0 0",
                          }}
                        >
                          <div>Program Details</div>
                        </Grid>
                        <Grid container>
                          <Grid item xs={12}>
                            <InputLabel
                              htmlFor="name"
                              className="field-label"
                              style={{ color: "#000000", fontWeight: 700 }}
                            >
                              Title*
                            </InputLabel>
                          </Grid>
                          <Grid item xs={12} className="field-container">
                            <TextField
                              id="title"
                              size="small"
                              value={title}
                              className="the-field"
                              required
                              variant="outlined"
                              onKeyUp={(event) => {
                                setHasUnsavedChanges(true);
                              }}
                              onChange={(event) => {
                                setTitle(event.target.value);
                              }}
                              disabled={published || archived}
                              placeholder="Enter Title"
                            />
                          </Grid>
                        </Grid>

                        <Grid container>
                          <Grid item xs={12}>
                            <InputLabel
                              htmlFor="subtext"
                              className="field-label"
                              style={{ color: "#000000", fontWeight: 700 }}
                            >
                              Subtext
                            </InputLabel>
                          </Grid>
                          <Grid item xs={12} className="field-container">
                            <TextField
                              id="subtext"
                              size="small"
                              value={subtext}
                              className="the-field"
                              required
                              variant="outlined"
                              onKeyUp={(event) => {
                                setHasUnsavedChanges(true);
                              }}
                              onChange={(event) => {
                                setSubtext(event.target.value);
                              }}
                              disabled={published || archived}
                              placeholder="Enter Subtext"
                            />
                          </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: 10 }}>
                          *Required
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* column 2 */}
                  <Grid item xs={8} className="right-column">
                    <ProgramActionsListing
                      setShowActionSelection={setShowActionSelection}
                      actions={selectedActions}
                      handleActionRemove={handleActionRemove}
                      getSortIcon={getSortIcon}
                      sortObject={sortObject}
                      setSortOrder={setSortOrder}
                      readOnly={published || archived}
                      programId={programId}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>
    </>
  );
};

export default NewProgramBuilder;
