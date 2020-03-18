import * as React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  TableHead,
  TextField,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// auth
import { AuthenticationContext, FlashContext } from "../Context";

const AUTOMATION_TYPES = { questionnaire: "questionnaire" };

// helper
import { getHeaders } from "../utils/HeaderHelper";
import { toTitleCase } from "../utils/CaseFormatHelper";
import GeneralModal from "../modals/GeneralModal";
import { Modal } from "../modals/Modal";

interface Props {
  readOnly: boolean;
  automations: Array<any>;
  onAutomationSave: Function;
  onAutomationDelete: Function;
}

const Automation: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  const [selectedAutomationType, setSelectedAutomationType] =
    React.useState<string>(AUTOMATION_TYPES.questionnaire);
  const [showAddAutomationModal, setShowAddAutomationModal] =
    React.useState<boolean>(false);
  const [removeAutomationId, setRemoveAutomationId] = React.useState<number>();
  const [removeAutomationModal, setRemoveAutomationModal] =
    React.useState(false);

  const [showAddQuestionniaresModal, setShowAddQuestionniaresModal] =
    React.useState<boolean>(false);

  const [categoryOptions, setCategoryOptions] = React.useState<any>([]);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] =
    React.useState<number>(null);
  const [questionnaireList, setQuestionnaireList] = React.useState<any>([]);
  const [filteredQuestionnaireList, setFilteredQuestionnaireList] =
    React.useState<any>([]);
  const [filterQuestionnairecategoryId, setFilterQuestionnairecategoryId] =
    React.useState<any>(null);

  React.useEffect(() => {
    getAssets();
    fetchQuestionnaireList();
  }, []);

  React.useEffect(() => {
    const filtered = !filterQuestionnairecategoryId
      ? questionnaireList
      : questionnaireList.filter(
          (q) => q.questionnaire_category_id === filterQuestionnairecategoryId
        );

    setFilteredQuestionnaireList(filtered);
    setSelectedQuestionnaireId(filtered.length > 0 ? filtered[0].id : null);
  }, [filterQuestionnairecategoryId]);

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

  const getCategoryName = (catId) => {
    const cat = categoryOptions.find((c) => c.id == catId);

    return cat?.display_name;
  };

  const fetchQuestionnaireList = () => {
    fetch(`/questionnaires?status=published`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          const q = result.resource;
          setQuestionnaireList(q);
          setFilteredQuestionnaireList(q);
          setSelectedQuestionnaireId(q.length > 0 ? q[0].id : null);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleContinueAddingAutomation = () => {
    if (selectedAutomationType === AUTOMATION_TYPES.questionnaire) {
      setShowAddAutomationModal(false);
      setShowAddQuestionniaresModal(true);
    } else {
      handleAddAutomation();
    }
  };

  const setErrorFlash = (message) => {
    flashContext.setMessage({
      text: message,
      type: "error",
    });
  };
  const validateFields = () => {
    if (selectedAutomationType === AUTOMATION_TYPES.questionnaire) {
      setErrorFlash("Please select a questionnaire.");
      return !!selectedQuestionnaireId;
    }
    return true;
  };

  const handleAddAutomation = () => {
    if (validateFields()) {
      let url = `/action_step_automations`;
      let method = "POST";

      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          automation: {
            automation_type: selectedAutomationType,
            questionnaire_id:
              selectedAutomationType == AUTOMATION_TYPES.questionnaire
                ? selectedQuestionnaireId
                : null,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            props.onAutomationSave(result.resource);
            flashContext.setMessage({
              text: result.message,
              type: "success",
            });
            setShowAddAutomationModal(false);
            setShowAddQuestionniaresModal(false);
            resetForm();
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
    return false;
  };

  const handleAutomationRemove = (id) => {
    setRemoveAutomationId(id);
    if (id) {
      setRemoveAutomationModal(true);
    }
  };

  const closeAddAutomationModal = () => {
    setShowAddAutomationModal(false);
    resetForm();
  };

  const closeRemoveModal = () => {
    setRemoveAutomationModal(false);
    setRemoveAutomationId(undefined);
  };

  const resetForm = () => {
    setSelectedAutomationType(AUTOMATION_TYPES.questionnaire);
    setSelectedQuestionnaireId(null);
    setFilterQuestionnairecategoryId(null);
    setSelectedQuestionnaireId(
      questionnaireList.length > 0 ? questionnaireList[0].id : null
    );
  };

  return (
    <>
      <Modal
        successModalOpen={removeAutomationModal}
        setSuccessModalOpen={setRemoveAutomationModal}
        successHeader={"Remove Automation?"}
        successContent={
          "You are attempting to remove this Automation item. Would you like to continue?"
        }
        successCallback={() => {
          props.onAutomationDelete(removeAutomationId);
          closeRemoveModal();
        }}
        closeCallback={closeRemoveModal}
        confirmButtonText="Remove"
      />
      <GeneralModal
        open={showAddQuestionniaresModal}
        title={"Send Questionnaire Automation Selection"}
        successCallback={handleAddAutomation}
        closeCallback={() => setShowAddQuestionniaresModal(false)}
        fullWidth={true}
        containerClassName="template-select-container template-container"
        width="70%"
      >
        <Grid container>
          <Grid
            container
            style={{ margin: 10, paddingLeft: 15, marginBottom: 20 }}
          >
            <Grid item xs={12}>
              <InputLabel
                htmlFor="name"
                className="field-label"
                style={{ color: "#000000", fontWeight: 700, lineHeight: 2 }}
              >
                Filter
              </InputLabel>
            </Grid>
            <Grid item xs={6} className="field-container">
              <TextField
                id="q_cat"
                size="small"
                value={filterQuestionnairecategoryId}
                className="the-field"
                required
                variant="outlined"
                fullWidth={true}
                onChange={(event) => {
                  setFilterQuestionnairecategoryId(event.target.value);
                }}
                placeholder="Select Category"
                disabled={props.disabled}
                select
              >
                <MenuItem value={null} style={{ display: "flex" }}>
                  <span>Select Category</span>
                </MenuItem>
                {categoryOptions.map((cat) => (
                  <MenuItem
                    key={cat.id}
                    value={cat.id}
                    style={{ display: "flex" }}
                  >
                    <span>{cat.display_name}</span>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <TableContainer>
            <Table size="small" aria-label="questionnaire table">
              <TableHead>
                <TableRow>
                  <TableCell
                    component="th"
                    className="bold-font-face"
                    style={{ paddingLeft: 50 }}
                  >
                    Category
                  </TableCell>
                  <TableCell component="th" className="bold-font-face">
                    Name
                  </TableCell>
                  <TableCell component="th" className="bold-font-face">
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestionnaireList.map((questionnaire, index) => (
                  <TableRow
                    key={questionnaire.id}
                    className={index % 2 == 0 && "panel-grey-background"}
                  >
                    <TableCell style={{ paddingLeft: 50 }}>
                      <RadioGroup
                        aria-label="start_on_program_start"
                        name="start_on_program_start"
                        value={selectedQuestionnaireId}
                        onChange={() => {
                          setSelectedQuestionnaireId(questionnaire.id);
                        }}
                      >
                        <FormControlLabel
                          value={questionnaire.id}
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center">
                              {getCategoryName(
                                questionnaire.questionnaire_category_id
                              )}
                            </Box>
                          }
                          disabled={props.readOnly}
                        />
                      </RadioGroup>
                    </TableCell>
                    <TableCell>{questionnaire.name}</TableCell>
                    <TableCell>{questionnaire.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </GeneralModal>
      <GeneralModal
        open={showAddAutomationModal}
        title={"Automation"}
        successCallback={handleContinueAddingAutomation}
        closeCallback={closeAddAutomationModal}
        width="500px"
      >
        <Grid container style={{ marginTop: 25, lineHeight: "2" }}>
          <Grid item xs={12} className="field-container">
            <FormControl component="fieldset">
              <b style={{ marginBottom: 10 }}>I want to automate</b>
              <RadioGroup
                aria-label="selectedAutomationType"
                name="selectedAutomationType"
                value={selectedAutomationType}
                onChange={(event) => {
                  setSelectedAutomationType(event.target.value);
                }}
              >
                <FormControlLabel
                  value={AUTOMATION_TYPES.questionnaire}
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      Questionnaire
                    </Box>
                  }
                  style={{ marginBottom: 10 }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </GeneralModal>
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
          <div>Automation</div>
        </Grid>
        <Grid container item xs={12} className="field-container">
          {props.automations.length == 0 ? (
            <Grid item xs={12} style={{ paddingTop: "16px" }}>
              You have no automation associated with this step.
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
                      <TableCell component="th" className="bold-font-face">
                        Name
                      </TableCell>
                      <TableCell
                        component="th"
                        className="bold-font-face"
                        align="center"
                      />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.automations.map((automation, index) => (
                      <TableRow
                        key={automation.id}
                        className={index % 2 == 0 && "panel-grey-background"}
                      >
                        <TableCell>
                          {toTitleCase(
                            automation.activity_type == "sending"
                              ? "Send"
                              : automation.activity_type
                          )}
                        </TableCell>
                        <TableCell>
                          {automation.questionnaire
                            ? toTitleCase(automation.questionnaire?.name)
                            : "-"}
                        </TableCell>
                        <TableCell align="right">
                          {!props.readOnly && (
                            <Link
                              onClick={() => {
                                handleAutomationRemove(automation.id);
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
              <Link
                onClick={() => {
                  setShowAddAutomationModal(true);
                }}
                className="grey-font"
                style={{
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "15px",
                  marginTop: "10px",
                }}
              >
                <img
                  src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png"
                  width="20"
                  alt="Add Resource"
                  style={{ padding: "5px" }}
                />
                <b>Add Automation</b>
              </Link>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Automation;
