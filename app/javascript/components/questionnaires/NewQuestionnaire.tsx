import * as React from "react";
import {
  Grid,
  Link,
  InputLabel,
  Button,
  TextField,
  MenuItem,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";

// components
import FormPanel from "./FormPanel";
import CategoryManagement from "./CategoryManagement";
import ResourceSelection from "./ResourceSelection";

// helper
import { useRef, useState } from "react";
import { toTitleCase } from "../utils/CaseFormatHelper";

// hooks
import { useCustomerPermission } from "../hooks/useCustomerPermission";
import UnsavedChangesModal from "../modals/UnsavedChangesModal";
import { useHistory } from "react-router-dom";

interface Props {}

const NewQuestionnaire: React.FC<Props> = (props: any) => {
  // auth
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const tabletPermitted = useCustomerPermission(
    "Allow questionnaires to display on local device"
  );

  // templateId
  const { id } = useParams();

  // questionnaire states
  const [questionnaireId, setQuestionnaireId] = React.useState<string>(null);
  const [categoryOptions, setCategoryOptions] = React.useState<any>([]);
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<any>({});
  const [displayOnTablet, setDisplayOnTablet] = React.useState<boolean>(false);

  const [newField, setNewField] = React.useState<any>({
    title: "",
    type: "short_answer",
    options: [],
    _destroy: false,
    position: null,
  });

  const [questions, setQuestions] = React.useState<any>([]);
  const [published, setPublished] = React.useState<boolean>(false); //disable fields after published
  const [archived, setArchived] = React.useState<boolean>(false); //disable fields after archived
  const [renderingKey, setRenderingKey] = useState<number>(Math.random);
  const [showResourceSelection, setShowResourceSelection] =
    useState<boolean>(false);
  const [selectedResourceIds, setSelectedResourceIds] = useState<any>([]);
  const [selectedResources, setSelectedResources] = useState<any>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const history = useHistory();

  // fetching inital data
  React.useEffect(() => {
    getAssets();
    if (id) {
      getQuestionnaire();
    }
  }, [renderingKey]);

  React.useEffect(() => {
    const nextval = questions?.length + 1;

    setNewField({
      title: "",
      type: "short_answer",
      options: [],
      _destroy: false,
      position:
        (questions[questions.length] && questions[questions.length].position
          ? questions[questions.length].position
          : questions.length) + 1,
    });
  }, [questions]);

  const getQuestionnaire = async () => {
    const response = await fetch(`/questionnaires/${id}`, {
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
      const questionnaire = result.resource;
      setQuestionnaireId(questionnaire?.id);
      setName(questionnaire?.name);
      setDescription(questionnaire?.description);
      setSelectedCategory(questionnaire?.questionnaire_category);
      setQuestions(questionnaire?.questions);
      setPublished(questionnaire?.status == "published");
      setArchived(questionnaire?.status == "archived");
      setSelectedResourceIds(questionnaire?.resource_item_ids);
      setDisplayOnTablet(questionnaire?.display_on_tablet);
    }
  };

  const getAssets = () => {
    fetch(`/questionnaires_assets`, {
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
  const handleSave = (saveType) => {
    if (validateFields()) {
      let url = `/questionnaires`;
      let method = "POST";
      if (questionnaireId) {
        url = `/questionnaires/${questionnaireId}`;
        method = "PUT";
      }
      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          questionnaire: {
            name: name,
            description: description,
            category: selectedCategory.db_name,
            status: saveType,
            questions_attributes: questionsAttributes(),
            display_on_tablet: displayOnTablet,
            questionnaire_category_id: selectedCategory.id,
          },
          resource_ids: selectedResourceIds,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            setQuestionnaireId(result.resource.id);
            setQuestions(result.resource?.questions);
            if (result.resource.status == "published") {
              setPublished(true);
            }
            flashContext.setMessage({
              text: result.message,
              type: "success",
            });
            setHasUnsavedChanges(false);
            window.location.href = `/new-questionnaire/${result.resource.id}`;
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
    return false; //this is to preventDefault action
  };

  // questions to submit attributes
  const questionsAttributes = () => {
    return questions.map((question) => {
      return {
        id: question.id,
        title: question.title,
        position: question.position,
        _destroy: question._destroy,
        question_type: question.type,
        options_attributes: question.options,
      };
    });
  };

  // field validation
  const validateFields = () => {
    if (isBlank(name)) {
      setErrorFlash("Name cannot be blank");
      return false;
    }

    if (isBlank(selectedCategory?.db_name)) {
      setErrorFlash("Category cannot be blank");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (isBlank(question.title)) {
        setErrorFlash("Question title cannot be blank");
        return false;
      }

      if (question.type == "true_false" || question.type == "multiple_choice") {
        if (question.options.length == 0) {
          setErrorFlash(
            "Multiple choice or True/False need at least one option"
          );
          return false;
        }
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

  const handleResourceRemove = (resourceId) => {
    let tempSelectedResources = [...selectedResourceIds];
    let removedList = tempSelectedResources.filter(
      (item) => item != resourceId
    );
    setSelectedResourceIds(removedList);
    setHasUnsavedChanges(true);
  };

  const toggleDisplayOnTablet = () => {
    setDisplayOnTablet(!displayOnTablet);
  };

  const handleCategoryChange = (categoryId) => {
    const selectedCate = categoryOptions.find(
      (category) => category.id == parseInt(categoryId)
    );
    setSelectedCategory(selectedCate);
  };

  const latestActivityDetected = React.useRef(false);

  // not letting session out if there is mouse movement
  const handleActivityDetected = () => {
    latestActivityDetected.current = true;
  };

  const resetSession = () => {
    fetch(`/reset_timeout_session`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => {
        if (result.status == 200) {
          latestActivityDetected.current = false;
          setCounter(60);
          setSessionKey((prevKey) => prevKey + 1);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [isLogoutWarningModalOpen, setIsLogoutWarningModalOpen] =
    useState(false);
  const [counter, setCounter] = useState(60);
  const SESSION_TIME = 7;
  const intervalIdRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const [sessionKey, setSessionKey] = useState(0);

  const resetTimers = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    intervalIdRef.current = setInterval(() => {
      if (latestActivityDetected.current) {
        resetSession();
      }
    }, 20000);

    warningTimeoutRef.current = setTimeout(() => {
      setIsLogoutWarningModalOpen(true);
    }, (SESSION_TIME - 1) * 60 * 1000);
  };

  React.useEffect(() => {
    resetTimers();

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [sessionKey]);

  const handleLogout = () => {
    fetch("/users/sign_out", {
      method: "DELETE",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  React.useEffect(() => {
    let countdownInterval;
    if (isLogoutWarningModalOpen) {
      countdownInterval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter === 1) {
            handleLogout();
          }
          return prevCounter - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [isLogoutWarningModalOpen]);

  const handleResumeSession = () => {
    resetSession();
    setIsLogoutWarningModalOpen(false);
    setCounter(60);
  };

  return (
    <div className="main-content-outer">
      <Dialog
        open={isLogoutWarningModalOpen}
        onClose={handleLogout}
        disableEscapeKeyDown={true}
      >
        <DialogTitle>Session Timeout Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will be logged out after {counter} seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2 }}>
          <Button onClick={handleResumeSession} sx={{ background: "#F88909" }}>
            Resume your session
          </Button>
          <Button onClick={handleLogout} color="secondary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      {showResourceSelection ? (
        <ResourceSelection
          setSelectedResourceIds={(ids) => {
            setSelectedResourceIds(ids);
            setHasUnsavedChanges(true);
          }}
          selectedResourceIds={selectedResourceIds}
          setShowResourceSelection={setShowResourceSelection}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onResourcesChange={handleActivityDetected}
        />
      ) : (
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          className="main-content"
          // onMouseMove={handleActivityDetected}
        >
          <UnsavedChangesModal unsavedChanges={hasUnsavedChanges} />
          <Grid
            item
            xs={12}
            id="provider-action-report"
            className="patient-edit-container patient-edit-form provider-action-report new-questionnaire-container"
          >
            <Grid container>
              <Grid
                className="patient-edit-header"
                container
                justifyContent="space-between"
              >
                <Grid item xs={4}>
                  <p className="secondary-label" style={{ marginLeft: "0px" }}>
                    Add New Questionnaire
                  </p>
                </Grid>

                <Grid item xs={6} className="q-btn-container">
                  <Link
                    style={{ marginRight: "16px" }}
                    
                    onClick={() => history.push('/questionnaires-list')}
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
                      <Grid container>
                        <Grid item xs={12}>
                          <InputLabel
                            htmlFor="name"
                            className="field-label"
                            style={{ color: "#000000", fontWeight: 700 }}
                          >
                            Questionnaire Name*
                          </InputLabel>
                        </Grid>
                        <Grid item xs={12} className="field-container">
                          <TextField
                            id="name"
                            size="small"
                            value={name}
                            className="the-field"
                            required
                            variant="outlined"
                            onKeyUp={(event) => {
                              setHasUnsavedChanges(true);
                              handleActivityDetected();
                            }}
                            onChange={(event) => {
                              setName(event.target.value);
                            }}
                            disabled={published || archived}
                            placeholder="Enter Name"
                          />
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs={12}>
                          <InputLabel
                            htmlFor="description"
                            className="field-label"
                            style={{ color: "#000000", fontWeight: 700 }}
                          >
                            Description
                          </InputLabel>
                        </Grid>
                        <Grid item xs={12} className="field-container">
                          <TextField
                            id="description"
                            size="small"
                            value={description}
                            className="the-field"
                            required
                            variant="outlined"
                            onChange={(event) => {
                              setDescription(event.target.value);
                            }}
                            onKeyUp={(event) => {
                              setHasUnsavedChanges(true);
                              handleActivityDetected();
                            }}
                            disabled={published || archived}
                            placeholder="Enter Description"
                          />
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
                            value={`${selectedCategory?.id}`}
                            className="the-field"
                            required
                            variant="outlined"
                            onChange={(event) => {
                              handleCategoryChange(event.target.value);
                              setHasUnsavedChanges(true);
                              handleActivityDetected();
                            }}
                            select
                            disabled={published || archived}
                          >
                            {published || archived ? (
                              <MenuItem value={`${selectedCategory?.id}`}>
                                {selectedCategory?.display_name}
                              </MenuItem>
                            ) : (
                              categoryOptions.map((catOption) => (
                                <MenuItem
                                  key={catOption.id}
                                  value={catOption.id}
                                >
                                  {catOption.display_name}
                                </MenuItem>
                              ))
                            )}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={12}>
                          <InputLabel
                            htmlFor="Category"
                            className="field-label"
                            style={{ color: "#000000", fontWeight: 700 }}
                          >
                            Display on Tablet?
                          </InputLabel>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          className="field-container"
                          style={{ paddingLeft: 54 }}
                        >
                          <Switch
                            checked={displayOnTablet}
                            onChange={() => {
                              toggleDisplayOnTablet();
                              setHasUnsavedChanges(true);
                              handleActivityDetected();
                            }}
                            color="primary"
                            disabled={!tabletPermitted || published || archived}
                          />
                        </Grid>
                      </Grid>
                      {!published && !archived && (
                        <>
                          <Grid container>
                            <CategoryManagement
                              setCategoryOptions={setCategoryOptions}
                              renderingKey={renderingKey}
                              setRenderingKey={setRenderingKey}
                              onCategoryChange={handleActivityDetected}
                            />
                          </Grid>
                          <Grid container>*Required</Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                {/* column 2 */}
                <Grid item xs={5} className="right-column">
                  <FormPanel
                    newField={newField}
                    questions={questions}
                    setQuestions={setQuestions}
                    readOnly={published || archived}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                    onQuestionDataChange={() => {
                      handleActivityDetected();
                      setHasUnsavedChanges(true);
                    }}
                  />
                </Grid>

                {/* column 3 resource column */}
                <Grid
                  item
                  xs={4}
                  style={{ paddingRight: "10px", paddingLeft: "10px" }}
                >
                  <Grid
                    container
                    className="question-container"
                    style={{ marginTop: "30px" }}
                  >
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
                                  Name of Resource
                                </TableCell>
                                <TableCell
                                  component="th"
                                  className="bold-font-face"
                                  align="center"
                                >
                                  View
                                </TableCell>
                                {!published && !archived && (
                                  <TableCell
                                    component="th"
                                    className="bold-font-face"
                                    align="center"
                                  >
                                    Remove
                                  </TableCell>
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
                                      onClick={handleActivityDetected}
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
                                          setHasUnsavedChanges(true);
                                          handleActivityDetected();
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
                      {!published && !archived && (
                        <Link
                          onClick={() => {
                            setShowResourceSelection(true);
                          }}
                          className="grey-font"
                          style={{
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "15px",
                            paddingLeft: "10px",
                          }}
                        >
                          <img
                            src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png"
                            width="20"
                            alt="Add Resource"
                            style={{ padding: "5px" }}
                          />
                          <b>Add Resource</b>
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
  );
};

export default NewQuestionnaire;
