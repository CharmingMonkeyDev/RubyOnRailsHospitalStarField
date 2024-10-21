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

const LAUNCH_TYPES = { questionnaire: "questionnaire", encounter: "encounter" };

// helper
import { getHeaders } from "../utils/HeaderHelper";
import { toTitleCase } from "../utils/CaseFormatHelper";
import GeneralModal from "../modals/GeneralModal";
import { Modal } from "../modals/Modal";

interface Props {
  readOnly: boolean;
  quickLaunches: Array<any>;
  onQuickLaunchSave: Function;
  onQuickLaunchDelete: Function;
}

const QuickLaunch: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  const [selectedLaunchType, setSelectedLaunchType] = React.useState<string>(
    LAUNCH_TYPES.questionnaire
  );
  const [showAddQuickLaunchModal, setShowAddQuickLaunchModal] =
    React.useState<boolean>(false);
  const [removeQuickLaunchId, setRemoveQuickLaunchId] =
    React.useState<number>();
  const [removeQuickLaunchModal, setRemoveQuickLaunchModal] =
    React.useState(false);

  const [showAddQuestionniaresModal, setShowAddQuestionniaresModal] =
    React.useState<boolean>(false);

  const [categoryOptions, setCategoryOptions] = React.useState<any>([]);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = React.useState<number>(null);
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

  const handleContinueAddingQuickLaunch = () => {
    if (selectedLaunchType === LAUNCH_TYPES.questionnaire) {
      setShowAddQuickLaunchModal(false);
      setShowAddQuestionniaresModal(true);
    } else {
      handleAddQuickLaunch();
    }
  };

  const setErrorFlash = (message) => {
    flashContext.setMessage({
      text: message,
      type: "error",
    });
  };
  const validateFields = () => {
    if (selectedLaunchType === LAUNCH_TYPES.questionnaire) {
      setErrorFlash("Please select a questionnaire.");
      return !!selectedQuestionnaireId;
    }
    return true;
  };

  const handleAddQuickLaunch = () => {
    if (validateFields()) {
      let url = `/action_step_quick_launches`;
      let method = "POST";

      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          quick_launch: {
            launch_type: selectedLaunchType,
            questionnaire_id:
              selectedLaunchType == LAUNCH_TYPES.questionnaire
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
            props.onQuickLaunchSave(result.resource);
            flashContext.setMessage({
              text: result.message,
              type: "success",
            });
            setShowAddQuickLaunchModal(false);
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

  const handleQuickLaunchRemove = (id) => {
    setRemoveQuickLaunchId(id);
    if (id) {
      setRemoveQuickLaunchModal(true);
    }
  };

  const closeAddQuickLaunchModal = () => {
    setShowAddQuickLaunchModal(false);
    resetForm();
  };

  const closeRemoveModal = () => {
    setRemoveQuickLaunchModal(false);
    setRemoveQuickLaunchId(undefined);
  };

  const resetForm = () => {
    setSelectedLaunchType(LAUNCH_TYPES.questionnaire);
    setSelectedQuestionnaireId(null);
    setFilterQuestionnairecategoryId(null);
    setSelectedQuestionnaireId(
      questionnaireList.length > 0 ? questionnaireList[0].id : null
    );
  };

  return (
    <>
      <Modal
        successModalOpen={removeQuickLaunchModal}
        setSuccessModalOpen={setRemoveQuickLaunchModal}
        successHeader={"Remove Quick Launch?"}
        successContent={
          "You are attempting to remove this quick launch item. Would you like to continue?"
        }
        successCallback={() => {
          props.onQuickLaunchDelete(removeQuickLaunchId);
          closeRemoveModal();
        }}
        closeCallback={closeRemoveModal}
        confirmButtonText="Remove"
      />
      <GeneralModal
        open={showAddQuestionniaresModal}
        title={"Quick Launch"}
        successCallback={handleAddQuickLaunch}
        closeCallback={() => setShowAddQuestionniaresModal(false)}
        fullWidth={true}
        containerClassName="template-select-container template-container"
        width="70%"
      >
        <Grid container>
          <Grid
            container
            style={{ margin: 5, paddingLeft: 15, marginBottom: 20 }}
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
        open={showAddQuickLaunchModal}
        title={"Quick Launch"}
        successCallback={handleContinueAddingQuickLaunch}
        closeCallback={closeAddQuickLaunchModal}
        width="500px"
      >
        <Grid container style={{ marginTop: 25, lineHeight: "2" }}>
          <Grid item xs={12} className="field-container">
            <FormControl component="fieldset">
              <b style={{ marginBottom: 10 }}>I want to quick launch</b>
              <RadioGroup
                aria-label="selectedLaunchType"
                name="selectedLaunchType"
                value={selectedLaunchType}
                onChange={(event) => {
                  setSelectedLaunchType(event.target.value);
                }}
              >
                <FormControlLabel
                  value={LAUNCH_TYPES.questionnaire}
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      Questionnaire
                    </Box>
                  }
                  style={{ marginBottom: 10 }}
                />
                <FormControlLabel
                  value={LAUNCH_TYPES.encounter}
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      New Encounter Note
                    </Box>
                  }
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
          <div>Quick Launch</div>
        </Grid>
        <Grid container item xs={12} className="field-container">
          {props.quickLaunches.length == 0 ? (
            <Grid item xs={12} style={{ paddingTop: "16px" }}>
              You have no quick launch links associated.
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
                    {props.quickLaunches.map((ql, index) => (
                      <TableRow
                        key={ql.id}
                        className={index % 2 == 0 && "panel-grey-background"}
                      >
                        <TableCell>{toTitleCase(ql.launch_type)}</TableCell>
                        <TableCell>
                          {ql.questionnaire
                            ? toTitleCase(ql.questionnaire?.name)
                            : "-"}
                        </TableCell>
                        <TableCell align="right">
                          {!props.readOnly && (
                            <Link
                              onClick={() => {
                                handleQuickLaunchRemove(ql.id);
                              }}
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
                  setShowAddQuickLaunchModal(true);
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
                <b>Add Quick Launch</b>
              </Link>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default QuickLaunch;
