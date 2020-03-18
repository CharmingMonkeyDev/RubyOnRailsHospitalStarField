import * as React from "react";
import {
  Button,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

// auth
import { AuthenticationContext, FlashContext } from "../Context";

// helper
import { getHeaders } from "../utils/HeaderHelper";
import { categories } from "../CategoryIcons";
import SVG from "react-inlinesvg";
import { toTitleCase } from "../utils/CaseFormatHelper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddResourceButton from "../resource/AddResourceButton";
import ResourceSelection from "../resource/ResourceSelection";
import Modal from "../modals/Modal";
import { OutlinedInput } from "@mui/material";
import QuickLaunch from "./QuickLaunch";
import UnsavedDataConfirmation from "../modals/UnsavedDataConfirmation";
import Automation from "./Automation";
interface Props {
  stepId: any;
  setShowActionStepForm: any;
  onStepSave: Function;
  readOnly: boolean;
}

const ActionStepForm: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const [hasUnsavedChanges, setHasUnsavedChanges] =
    React.useState<boolean>(false);
  const [unsavedModalOpen, setUnsavedModalOpen] =
    React.useState<boolean>(false);

  const [title, setTitle] = React.useState<string>("");
  const [subtext, setSubtext] = React.useState<string>("");
  const [icon, setIcon] = React.useState<string>("");
  const [showResourceSelection, setShowResourceSelection] =
    React.useState<boolean>(false);
  const [selectedResourceIds, setSelectedResourceIds] = React.useState<any>([]);
  const [selectedResources, setSelectedResources] = React.useState<any>([]);
  const [removeResourceId, setRemoveResourceId] = React.useState<number>();
  const [removeResourceModal, setRemoveResourceModal] = React.useState(false);

  const [selectedQuickLaunchIds, setSelectedQuickLaunchIds] =
    React.useState<any>([]);
  const [selectedQuickLaunches, setSelectedQuickLaunches] = React.useState<any>(
    []
  );
  const [selectedAutomationIds, setSelectedAutomationIds] = React.useState<any>(
    []
  );
  const [selectedAutomations, setSelectedAutomations] = React.useState<any>([]);

  React.useEffect(() => {
    if (props.stepId) {
      getActionStep();
    } else {
      resetForm();
    }
  }, []);

  const resetForm = () => {
    setTitle("");
    setSubtext("");
    setIcon("");
  };

  const getActionStep = () => {
    fetch(`/action_steps/${props.stepId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          const actionStep = result.resource;
          setTitle(actionStep?.title);
          setSubtext(actionStep?.subtext);
          setIcon(actionStep?.icon);
          setSelectedResourceIds(actionStep?.resource_item_ids);
          setSelectedQuickLaunches(actionStep?.action_step_quick_launches);
          setSelectedAutomations(actionStep?.action_step_automations);
        }
      })
      .catch((error) => {
        alert(error);
      });
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
  // field validation
  const validateFields = () => {
    if (isBlank(title)) {
      setErrorFlash("Title cannot be blank");
      return false;
    }

    if (isBlank(icon)) {
      setErrorFlash("Please select an icon");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (validateFields()) {
      let url = `/action_steps`;
      let method = "POST";
      if (props.stepId) {
        url = `/action_steps/${props.stepId}`;
        method = "PUT";
      }
      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          action_step: {
            title: title,
            subtext: subtext,
            icon: icon,
          },
          resource_ids: selectedResourceIds,
          quick_launch_ids: selectedQuickLaunchIds,
          automation_ids: selectedAutomationIds,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            props.onStepSave(result.resource);
            flashContext.setMessage({
              text: result.message,
              type: "success",
            });
            setHasUnsavedChanges(false);
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
    return false;
  };

  React.useEffect(() => {
    setSelectedQuickLaunchIds(selectedQuickLaunches.map((ql) => ql.id));
  }, [selectedQuickLaunches]);
  React.useEffect(() => {
    setSelectedAutomationIds(selectedAutomations.map((ql) => ql.id));
  }, [selectedAutomations]);

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

  const removeQuickLaunch = (qlToRemoveId) => {
    setSelectedQuickLaunches((selectedQuickLaunches) =>
      selectedQuickLaunches.filter((ql) => ql.id !== qlToRemoveId)
    );
    setHasUnsavedChanges(true);
  };

  const handleBackToAction = () => {
    if (hasUnsavedChanges) {
      setUnsavedModalOpen(true);
    } else {
      props.setShowActionStepForm(false);
    }
  };

  const removeAutomation = (automationToRemoveId) => {
    setSelectedAutomations((selectedAutomations) =>
      selectedAutomations.filter(
        (automation) => automation.id !== automationToRemoveId
      )
    );
    setHasUnsavedChanges(true);
  };

  return (
    <>
      <UnsavedDataConfirmation
        modalOpen={unsavedModalOpen}
        setModalOpen={setUnsavedModalOpen}
        objectName={"Action Step"}
        onConfirmation={() => props.setShowActionStepForm(false)}
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
      {showResourceSelection ? (
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
                  <p className="secondary-label" style={{ marginLeft: "0px" }}>
                    Add Step to Action
                  </p>
                </Grid>

                <Grid item xs={6} className="q-btn-container">
                  <Link
                    style={{ marginRight: "16px" }}
                    onClick={handleBackToAction}
                  >
                    Back to Action
                  </Link>
                  {!props.readOnly && (
                    <Button
                      className="orange-btn"
                      onClick={handleSave}
                      style={{
                        height: "40px",
                        marginRight: "16px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                      }}
                      disabled={props.readOnly}
                    >
                      Save Step
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
                        <div>Step Details</div>
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
                            onChange={(event) => {
                              setTitle(event.target.value);
                            }}
                            onKeyUp={(event) => {
                              setHasUnsavedChanges(true);
                            }}
                            disabled={props.readOnly}
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
                            value={subtext}
                            className="the-field"
                            required
                            variant="outlined"
                            onChange={(event) => {
                              setSubtext(event.target.value);
                            }}
                            onKeyUp={(event) => {
                              setHasUnsavedChanges(true);
                            }}
                            disabled={props.readOnly}
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
                            Icon*
                          </InputLabel>
                        </Grid>
                        <Grid item xs={12} className="field-container">
                          {props.readOnly ? (
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
                              disabled={props.disabled}
                              select
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
                        <Grid container>*Required</Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {/* column 2 */}
                <Grid item xs={9} className="right-column">
                  <Grid
                    container
                    className="form-container form-panel-container"
                    style={{
                      margin: "5px 0 0 0",
                      padding: "10px 20px 0 20px",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      style={{
                        color: "#000000",
                        fontWeight: 800,
                        fontSize: "1.2em",
                        marginBottom: 15,
                      }}
                    >
                      <div>Attached Resources</div>
                    </Grid>
                    <Grid container item xs={12} className="field-container">
                      {selectedResources.length == 0 ? (
                        <Grid item xs={12} style={{ paddingTop: "16px" }}>
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
                                    width={"25%"}
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
                                    <TableCell align="right">
                                      <Link
                                        href={resource.link}
                                        target="_blank"
                                      >
                                        <VisibilityIcon />
                                      </Link>
                                      {!props.readOnly && (
                                        <Link
                                          onClick={() => {
                                            handleResourceRemove(resource.id);
                                          }}
                                          style={{ marginLeft: 10 }}
                                        >
                                          <DeleteIcon />
                                        </Link>
                                      )}
                                    </TableCell>
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
                        {!props.readOnly && (
                          <AddResourceButton
                            noPadding={true}
                            onLinkClick={() => {
                              setShowResourceSelection(true);
                            }}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <QuickLaunch
                    onQuickLaunchSave={(ql) => {
                      setSelectedQuickLaunches([...selectedQuickLaunches, ql]);
                      setHasUnsavedChanges(true);
                    }}
                    onQuickLaunchDelete={removeQuickLaunch}
                    quickLaunches={selectedQuickLaunches}
                    readOnly={props.readOnly}
                  />
                  <Automation
                    onAutomationSave={(automation) => {
                      setSelectedAutomations([
                        ...selectedAutomations,
                        automation,
                      ]);
                      setHasUnsavedChanges(true);
                    }}
                    onAutomationDelete={removeAutomation}
                    automations={selectedAutomations}
                    readOnly={props.readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ActionStepForm;
