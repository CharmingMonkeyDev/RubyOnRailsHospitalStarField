import * as React from "react";
import {
  Grid,
  Link,
  InputLabel,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  OutlinedInput,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import SVG from "react-inlinesvg";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";

// components
import CategoryManagement from "./CategoryManagement";
import ResourceSelection from "./ResourceSelection";

// helper
import { useState } from "react";
import { toTitleCase } from "../utils/CaseFormatHelper";
import FormPanel, { ActionRecurrence } from "./FormPanel";
import { categories } from "../CategoryIcons";
import Modal from "../modals/Modal";
import UnsavedDataConfirmation from "../modals/UnsavedDataConfirmation";
import CreateIcon from "@mui/icons-material/Create";
import ActionStepForm from "./ActionStepForm";
import AddResourceButton from "../resource/AddResourceButton";

interface Props {}

const NewProviderAction: React.FC<Props> = (props: any) => {
  // auth
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  // actionId
  const { id } = useParams();

  // action states
  const [actionId, setActionId] = React.useState<string>(null);
  const [categoryOptions, setCategoryOptions] = React.useState<any>([]);
  const [title, setTitle] = React.useState<string>("");
  const [subject, setSubject] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [icon, setIcon] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<any>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState<boolean>(false);

  const [newField, setNewField] = React.useState<any>({
    title: "",
    type: "short_answer",
    options: [],
  });

  const [published, setPublished] = React.useState<boolean>(false); //disable fields after published
  const [archived, setArchived] = React.useState<boolean>(false); //disable fields after archived
  const [renderingKey, setRenderingKey] = useState<number>(Math.random);
  const [showResourceSelection, setShowResourceSelection] =
    useState<boolean>(false);
  const [selectedResourceIds, setSelectedResourceIds] = useState<any>([]);
  const [selectedResources, setSelectedResources] = useState<any>([]);
  const [removeResourceId, setRemoveResourceId] = useState<number>();
  const [removeResourceModal, setRemoveResourceModal] = useState(false);

  const [showActionStepForm, setShowActionStepForm] = useState<boolean>(false);
  const [actionSteps, setActionSteps] = useState<any>([]);
  const [selectedStepId, setSelectedStepId] = useState<number>();
  const [removeStepId, setRemoveStepId] = useState<number>();
  const [removeStepModal, setRemoveStepModal] = useState(false);

  const [recurrence, setRecurrence] = React.useState<ActionRecurrence>({
    start_on_program_start: true,
    start_after_program_start: null,
    start_after_program_start_value: null,
    start_after_program_start_unit: null,
    repeat: false,
    repeat_value: null,
    repeat_unit: null,
    end_timing: "no_end_date",
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
    occurences: null,
    end_date_value: null,
    end_after_program_start_value: null,
    end_after_program_start_unit: null,
    action_id: null,
  });

  // fetching inital data
  React.useEffect(() => {
    getAssets();
    if (id) {
      getAction();
    }
  }, [renderingKey, id]);

  const handleBackToList = () => {
    if (hasUnsavedChanges) {
      setUnsavedModalOpen(true);
    } else {
      window.location.href = "/action-builder-list";
    }
  };

  const getAction = async () => {
    const response = await fetch(`/actions/${id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    });
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    if (result.success == false) {
      alert(result.error);
    } else {
      const action = result.resource;
      setActionId(action?.id);
      setTitle(action?.title);
      setSubject(action?.subject);
      setCategory(action?.category);
      setIcon(action?.icon);
      setSelectedCategory(action?.action_category);
      setPublished(action?.status == "published");
      setArchived(action?.status == "archived");
      setSelectedResourceIds(action?.resource_item_ids);
      setRecurrence(action?.action_recurrence);
      setActionSteps(action?.action_steps);
    }
  };

  const getAssets = async () => {
    fetch(`/actions_assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          setCategoryOptions(result.resource.categories);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  // handlers
  const handleSave = (saveType = "draft") => {
    if (validateFields()) {
      let url = `/actions`;
      let method = "POST";
      if (actionId) {
        url = `/actions/${actionId}`;
        method = "PUT";
      }
      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          p_action: {
            title: title,
            subject: subject,
            category: selectedCategory.name,
            icon: icon,
            status: saveType,
            action_category_id: selectedCategory.id,
          },
          resource_ids: selectedResourceIds,
          recurrence: recurrence,
          action_step_ids: actionSteps?.map((step) => step.id),
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            setActionId(result.resource.id);
            if (result.resource.status == "published") {
              setPublished(true);
            }
            setHasUnsavedChanges(false);
            window.location.href = `/new-provider-action/${result.resource.id}`;
            flashContext.setMessage({
              text: result.message,
              type: "success",
            });
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
    return false; //this is to preventDefault action
  };

  // field validation
  const validateFields = () => {
    if (isBlank(title)) {
      setErrorFlash("Title cannot be blank");
      return false;
    }

    if (isBlank(selectedCategory?.name)) {
      setErrorFlash("Category cannot be blank");
      return false;
    }
    if (!recurrence.start_on_program_start) {
      if (isBlank(recurrence.start_after_program_start_unit)) {
        setErrorFlash(
          "Program Start Date after-value and unit cannot be blank"
        );
        return false;
      }
      if (recurrence.start_after_program_start_value < 0) {
        setErrorFlash("Program Start Date after-value must be at least 1");
        return false;
      }
    }
    if (!!recurrence.repeat) {
      if (isBlank(recurrence.repeat_unit)) {
        setErrorFlash("Repeat unit cannot be blank");
        return false;
      }
      if (recurrence.repeat_value < 1 || recurrence.repeat_value > 90) {
        setErrorFlash("Repeat value should be between 1 and 90.");
        return false;
      }
    }
    if (recurrence.end_timing === "after_program_start_date") {
      if (
        recurrence.end_after_program_start_value < 1 ||
        recurrence.end_after_program_start_value > 999
      ) {
        setErrorFlash(
          "Action End value cannot be blank and must be between 1 and 999."
        );
        return false;
      }
      if (isBlank(recurrence.end_after_program_start_unit)) {
        setErrorFlash("Action End unit cannot be blank.");
        return false;
      }
    } else if (recurrence.end_timing === "after_n_occurences") {
      if (recurrence.occurences < 1 || recurrence.occurences > 999) {
        setErrorFlash(
          "Occurences at End Settings cannot be blank and must be between 1 and 999."
        );
        return false;
      }
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

  // getting resources when selected
  React.useEffect(() => {
    fetch(`/filter_resource`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        resource_ids: selectedResourceIds,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          setSelectedResources(result.resource);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, [selectedResourceIds]);

  const handleResourceRemove = (id) => {
    setRemoveResourceId(id);
    if (id) {
      setRemoveResourceModal(true);
    }
  };

  const removeResouce = () => {
    let tempSelectedResources = [...selectedResourceIds];
    let removedList = tempSelectedResources.filter(
      (item) => item != removeResourceId
    );
    setSelectedResourceIds(removedList);
    setRemoveResourceModal(false);
    setRemoveResourceId(undefined);
    setHasUnsavedChanges(true);
  };

  const handleStepRemove = (id) => {
    setRemoveStepId(id);
    if (id) {
      setRemoveStepModal(true);
    }
  };

  const removeStep = () => {
    let tempSelectedSteps = [...actionSteps];
    let removedList = tempSelectedSteps.filter(
      (step) => step.id != removeStepId
    );
    setActionSteps(removedList);
    setRemoveStepModal(false);
    setRemoveStepId(undefined);
    setHasUnsavedChanges(true);
  };

  const handleCategoryChange = (categoryId) => {
    const selectedCate = categoryOptions.find(
      (category) => category.id == parseInt(categoryId)
    );
    setSelectedCategory(selectedCate);
    setHasUnsavedChanges(true);
  };

  const onStepSave = (step) => {
    const index = actionSteps.findIndex((s) => s.id === step.id);
    const steps = actionSteps;
    if (index !== -1) {
      steps[index] = { ...steps[index], ...step };
    } else {
      steps.push(step);
    }

    setActionSteps(steps);
    setShowActionStepForm(false);
    setHasUnsavedChanges(true);
  };

  return (
    <>
      <UnsavedDataConfirmation
        modalOpen={unsavedModalOpen}
        setModalOpen={setUnsavedModalOpen}
        objectName={"Action"}
        redirectUrl={"/action-builder-list"}
      />
      <Modal
        successModalOpen={removeResourceModal}
        setSuccessModalOpen={setRemoveResourceModal}
        successHeader={"Remove Resource?"}
        successContent={
          "You are attempting to remove this resource. Would you like to continue?"
        }
        successCallback={removeResouce}
        closeCallback={() => {
          setRemoveResourceModal(false);
          setRemoveResourceId(undefined);
        }}
        confirmButtonText="Remove"
      />
      <Modal
        successModalOpen={removeStepModal}
        setSuccessModalOpen={setRemoveStepModal}
        successHeader={"Remove Step?"}
        successContent={
          "You are attempting to remove this step. Would you like to continue?"
        }
        successCallback={removeStep}
        closeCallback={() => {
          setRemoveStepModal(false);
          setRemoveStepId(undefined);
        }}
        confirmButtonText="Remove"
      />
      <div className="main-content-outer">
        {showActionStepForm ? (
          <ActionStepForm
            stepId={selectedStepId}
            setShowActionStepForm={setShowActionStepForm}
            onStepSave={onStepSave}
            readOnly={published || archived}
          />
        ) : showResourceSelection ? (
          <ResourceSelection
            setSelectedResourceIds={setSelectedResourceIds}
            selectedResourceIds={selectedResourceIds}
            setShowResourceSelection={setShowResourceSelection}
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
                      Add New Action
                    </p>
                  </Grid>

                  <Grid item xs={6} className="q-btn-container">
                    <Link
                      style={{ marginRight: "16px" }}
                      onClick={handleBackToList}
                    >
                      Back to List
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
                  <Grid item xs={3}>
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
                          <div>Action Details</div>
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
                              id="subject"
                              size="small"
                              value={subject}
                              className="the-field"
                              required
                              variant="outlined"
                              onKeyUp={(event) => {
                                setHasUnsavedChanges(true);
                              }}
                              onChange={(event) => {
                                setSubject(event.target.value);
                              }}
                              disabled={published || archived}
                              placeholder="Enter Subtext"
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
                              Icon
                            </InputLabel>
                          </Grid>
                          <Grid item xs={12} className="field-container">
                            {published || archived ? (
                              <OutlinedInput
                                id="input-with-icon-adornment"
                                className="the-field"
                                disabled
                                value={
                                  categories.find((c) => c.key === icon)?.label
                                }
                                startAdornment={
                                  <InputAdornment position="start">
                                    <SVG
                                      src={
                                        categories.find((c) => c.key === icon)
                                          ?.icon
                                      }
                                      width={25}
                                      height={25}
                                      fill={"black"}
                                    />
                                  </InputAdornment>
                                }
                              />
                            ) : (
                              <TextField
                                id="icon"
                                size="small"
                                value={icon}
                                className="the-field"
                                required
                                variant="outlined"
                                onChange={(event) => {
                                  setIcon(event.target.value);
                                  setHasUnsavedChanges(true);
                                }}
                                placeholder="Select Icon"
                                select={!published && !archived}
                                disabled={published || archived}
                              >
                                {categories.map((icon) => (
                                  <MenuItem
                                    key={icon.key}
                                    value={icon.key}
                                    style={{ display: "flex" }}
                                  >
                                    <SVG
                                      src={icon.icon}
                                      width={25}
                                      height={25}
                                      fill={"black"}
                                      aria-placeholder={icon.label}
                                      style={{
                                        marginRight: 8,
                                        marginBottom: "-3px",
                                      }}
                                    />
                                    <span>{icon.label}</span>
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          </Grid>
                        </Grid>

                        <Grid container>
                          <Grid item xs={12}>
                            <InputLabel
                              htmlFor="Category"
                              className="field-label"
                              style={{ color: "#000000", fontWeight: 700 }}
                            >
                              Category*
                            </InputLabel>
                          </Grid>
                          <Grid item xs={12} className="field-container">
                            <TextField
                              id="category"
                              size="small"
                              value={
                                published || archived
                                  ? category
                                  : `${selectedCategory?.id}`
                              }
                              className="the-field"
                              required
                              variant="outlined"
                              onChange={(event) => {
                                handleCategoryChange(event.target.value);
                              }}
                              select={!published && !archived}
                              disabled={published || archived}
                            >
                              {!published &&
                                !archived &&
                                categoryOptions.map((catOption) => (
                                  <MenuItem
                                    key={catOption.id}
                                    value={catOption.id}
                                  >
                                    {catOption.name}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Grid>
                        </Grid>
                        {!published && !archived && (
                          <>
                            <Grid container>
                              <CategoryManagement
                                categories={categoryOptions}
                                renderingKey={renderingKey}
                                setRenderingKey={() => {
                                  setRenderingKey(Math.random);
                                  setSelectedCategory({});
                                }}
                              />
                            </Grid>
                            <Grid container>*Required</Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* column 2 */}
                  <Grid item xs={6} className="right-column">
                    <FormPanel
                      readOnly={published || archived}
                      recurrence={recurrence}
                      onDataChange={(recurrence) => {
                        setRecurrence(recurrence);
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </Grid>

                  {/* column 3 resource column */}
                  <Grid
                    item
                    xs={3}
                    style={{ paddingRight: "10px", paddingLeft: "10px" }}
                  >
                    <Grid container style={{ marginTop: "30px" }}>
                      <Grid
                        item
                        xs={12}
                        style={{
                          paddingTop: "10px",
                        }}
                      >
                        <InputLabel
                          htmlFor="Category"
                          className="field-label"
                          style={{
                            color: "black",
                            paddingLeft: "16px",
                            paddingBottom: "10px",
                          }}
                        >
                          Attached Resource
                        </InputLabel>
                      </Grid>
                      <Grid container item xs={12} className="field-container">
                        {selectedResources.length == 0 ? (
                          <Grid item xs={12} style={{ padding: "16px" }}>
                            You have no resources attached.
                          </Grid>
                        ) : (
                          <Grid item xs={12}>
                            <TableContainer>
                              <Table size="small" aria-label="a dense table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      component="th"
                                      className="bold-font-face"
                                    >
                                      Type
                                    </TableCell>
                                    <TableCell
                                      component="th"
                                      className="bold-font-face"
                                    >
                                      Name
                                    </TableCell>
                                    <TableCell
                                      component="th"
                                      className="bold-font-face"
                                      align="center"
                                    ></TableCell>
                                    {!published && !archived && (
                                      <TableCell
                                        component="th"
                                        className="bold-font-face"
                                        align="center"
                                      ></TableCell>
                                    )}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {selectedResources.map((resource, index) => (
                                    <TableRow
                                      key={resource.id}
                                      className={
                                        index % 2 == 0 && "panel-grey-background"
                                      }
                                    >
                                      <TableCell>
                                        {resource.resource_type == "pdf"
                                          ? "PDF"
                                          : toTitleCase(resource.resource_type)}
                                      </TableCell>
                                      <TableCell>{resource.name}</TableCell>
                                      <TableCell align="center">
                                        <Link
                                          href={resource.link}
                                          target="_blank"
                                        >
                                          <VisibilityIcon />
                                        </Link>
                                      </TableCell>
                                      {!published && !archived && (
                                        <TableCell align="center">
                                          <Link
                                            onClick={() => {
                                              handleResourceRemove(resource.id);
                                            }}
                                          >
                                            <DeleteIcon />
                                          </Link>
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        )}
                        <Grid
                          item
                          style={{
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "30px",
                            width: "100%",
                          }}
                        >
                          {!published && !archived && (
                            <AddResourceButton
                              onLinkClick={() => {
                                setShowResourceSelection(true);
                              }}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: "30px" }}>
                      <Grid
                        item
                        xs={12}
                        style={{
                          paddingTop: "10px",
                        }}
                      >
                        <InputLabel
                          htmlFor="Category"
                          className="field-label"
                          style={{
                            color: "black",
                            paddingLeft: "16px",
                            paddingBottom: "10px",
                          }}
                        >
                          Action Steps
                        </InputLabel>
                      </Grid>
                      <Grid container item xs={12} className="field-container">
                        <Grid item xs={12}>
                          <TableContainer>
                            <Table size="small" aria-label="a dense table">
                              <TableBody>
                                {actionSteps.map((step, index) => (
                                  <TableRow key={step.id}>
                                    <TableCell
                                      align="right"
                                      style={{
                                        paddingRight: 0,
                                        borderBottom: 0,
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      {step.icon_url ? (
                                        <SVG
                                          src={step.icon_url}
                                          width={20}
                                          height={20}
                                          fill={"black"}
                                          aria-placeholder={"Icon"}
                                        />
                                      ) : (
                                        <Box width={20}></Box>
                                      )}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{
                                        paddingRight: 0,
                                        borderBottom: 0,
                                        paddingLeft: 10,
                                        width: "100%",
                                      }}
                                    >
                                      {step.title}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        borderBottom: 0,
                                        display: "flex",
                                        flexDirection: "row",
                                        paddingRight: 0,
                                      }}
                                    >
                                      {!published && !archived ? (
                                        <>
                                          <Link
                                            onClick={() => {
                                              setSelectedStepId(step.id);
                                              setShowActionStepForm(true);
                                            }}
                                          >
                                            <CreateIcon
                                              style={{ color: "grey" }}
                                            />
                                          </Link>
                                          <Link
                                            onClick={() => {
                                              handleStepRemove(step.id);
                                            }}
                                            style={{
                                              marginLeft: 10,
                                              color: "grey",
                                            }}
                                          >
                                            <DeleteIcon />
                                          </Link>
                                        </>
                                      ) : (
                                        <Link
                                          onClick={() => {
                                            setSelectedStepId(step.id);
                                            setShowActionStepForm(true);
                                          }}
                                        >
                                          <VisibilityIcon
                                            style={{ color: "black" }}
                                          />
                                        </Link>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        {!published && !archived && (
                          <Link
                            onClick={() => {
                              setSelectedStepId(undefined);
                              setShowActionStepForm(true);
                            }}
                            className="grey-font"
                            style={{
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "15px",
                              paddingLeft: "10px",
                              marginTop: "20px",
                            }}
                          >
                            <img
                              src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png"
                              width="20"
                              alt="Add Step"
                              style={{ padding: "5px" }}
                            />
                            <b>Add Step</b>
                          </Link>
                        )}
                      </Grid>
                    </Grid>
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

export default NewProviderAction;
