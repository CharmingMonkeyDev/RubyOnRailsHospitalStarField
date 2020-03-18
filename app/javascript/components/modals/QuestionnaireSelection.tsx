import React, { FC, useState } from "react";
import { Grid, Link, Modal, Radio, InputLabel, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// helpers imports
import { AuthenticationContext, FlashContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import { toTitleCase } from "../utils/CaseFormatHelper";
import { snakeCaseToTitleCase } from "../utils/CaseFormatHelper";

interface Props {
  patient_id: string;
  modalOpen: boolean;
  setModalOpen: any;
  setRenderingKey: any;
  assignmentType: string;
  setAssignmentSelectionModalOpen: any;
}

const QuestionnaireSelection: FC<Props> = (props: Props) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  //option are manual, and sending
  const [selectedTab, setSelectedTab] = useState<number>();
  const [questionnaires, setQuestionnaires] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [selectedQId, setSelectedQId] = useState<number>(null);
  const [submitting, setSubmitting] = useState(false);

  const defualtExpirationDate = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 8);
    const defaultDateString = defaultDate.toISOString().split("T")[0];
    return defaultDateString;
  };
  const [expirationDate, setExpirationDate] = useState<any>(
    defualtExpirationDate
  );

  // getting inital data
  React.useEffect(() => {
    getQuestionnnaires();
  }, []);

  React.useEffect(() => {
    handleTabChange(undefined, 0);
  }, [categories]);

  const getQuestionnnaires = () => {
    fetch(`/questionnaire_assignments_assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            setQuestionnaires(result?.resource?.questionnaires);
            setCategories(result?.resource?.categories);
          } else {
            alert("Something is wrong questionnaires cannot be fetched");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTabChange = (event, selectedTab) => {
    const selectedCat = categories[selectedTab];
    const matchingQuestionnaires = questionnaires.filter(
      (item) => item.category?.toLowerCase() === selectedCat?.toLowerCase()
    );
    if (matchingQuestionnaires[0]?.id) {
      setSelectedQId(matchingQuestionnaires[0].id);
    }
    setSelectedTab(selectedTab);
  };

  const handleDateChange = (date) => {
    setExpirationDate(date);
  };

  const handleQuestionnaireSelectionChange = (qId) => {
    setSelectedQId(qId);
  };

  const getSelectedTabName = () => {
    const selectedCat = categories[selectedTab];
    if (!selectedCat) {
      return;
    }
    if (selectedCat == "copd") {
      return "COPD";
    } else {
      return snakeCaseToTitleCase(selectedCat);
    }
  };

  const assignQuestionnaire = () => {
    if (selectedQId) {
      setSubmitting(true);
      fetch(`/questionnaire_assignments`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          questionnaire_assignment: {
            user_id: props.patient_id,
            questionnaire_id: selectedQId,
            assignment_type: props.assignmentType,
            expiration_date: expirationDate,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          setSubmitting(false);
          if (result.success == false) {
            alert(result.error);
          } else {
            if (result?.success) {
              props.setRenderingKey(Math.random);
              props.setModalOpen(false);
              props.setAssignmentSelectionModalOpen(false);
              // opening a new tab if questionnaire is manual assigmnet
              if (result.resource?.assignment_type == "manual") {
                window.open(
                  `/questionnaire_assignments_submission_prov/${result.resource?.uuid}`
                );
              }
              flashContext.setMessage({
                text: result.message,
                type: "success",
              });
            } else {
              flashContext.setMessage({
                text: result.message,
                type: "error",
              });
            }
          }
        })
        .catch((error) => {
          setSubmitting(false);
          console.log(error);
        });
    } else {
      flashContext.setMessage({
        text: "Cannot assign without selecting questionnaire",
        type: "error",
      });
    }
  };

  //   getting tab content
  const getTabContent = () => {
    const selectedCat = categories[selectedTab];
    const matchingQuestionnaires = questionnaires.filter(
      (item) => item.category?.toLowerCase() === selectedCat?.toLowerCase()
    );

    return matchingQuestionnaires.map((questionnaire) => (
      <Grid item xs={12} key={questionnaire.id} style={{ padding: "5px" }}>
        <Radio
          checked={questionnaire.id === selectedQId}
          onChange={(event) =>
            handleQuestionnaireSelectionChange(questionnaire.id)
          }
          value={true}
          name="radio-buttons"
          inputProps={{ "aria-label": "Self" }}
        />
        {questionnaire.name}
      </Grid>
    ));
  };

  return (
    <Modal open={props.modalOpen} className="follow-up-modal">
      <div className="paper" style={{ width: "700px", padding: "0px" }}>
        <div className="paperInner" style={{ padding: "0px" }}>
          <Grid
            container
            className="fum-header-container"
            style={{ textAlign: "center" }}
          >
            <Grid item xs={12}>
              <h1 className="fum-header">Choose a Questionnaire</h1>
            </Grid>
          </Grid>
          <div className="divider-orange" style={{ margin: "0px" }}></div>
          <Grid
            container
            className="fum-form-container"
            style={{ margin: "20px" }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={selectedTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: { display: "none" },
              }}
            >
              {categories.map((category, index) => {
                return (
                  <Tab
                    key={index}
                    label={snakeCaseToTitleCase(category)}
                    className={`tab-box ${
                      index == selectedTab && "tab-box--active"
                    }`}
                    style={{ marginBottom: "10px" }}
                  />
                );
              })}
            </Tabs>
            <div className="tab-container">
              <div className="tab-container__header">
                {getSelectedTabName()}
              </div>
              <div className="divider-orange" style={{ margin: "0px" }}></div>
              {getTabContent()}
            </div>
          </Grid>
          {props.assignmentType === "sending" && (
            <Grid
              container
              justifyContent="center"
              direction="column"
              alignItems="center"
            >
              <Grid item xs={6}>
                <InputLabel htmlFor="date_of_birth" className="field-label">
                  Questionnaire Expiration Date*
                </InputLabel>
              </Grid>
              <Grid item xs={6} className="field-container">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk={true}
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    className="patient-dob-field"
                    value={expirationDate}
                    style={{
                      width: "95%",
                      marginBottom: "6px",
                    }}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          )}
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ padding: "24px" }}
            spacing={4}
          >
            <Grid
              item
              className="cancel-link-container"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Link
                className="cancel-link"
                onClick={() => props.setModalOpen(false)}
              >
                Cancel
              </Link>
            </Grid>
            <Grid item className="confirm-btn-container">
              <Button
                onClick={assignQuestionnaire}
                style={{ width: "135px" }}
                className="confirm-btn text-normal"
                component="span"
                disabled={submitting}
              >
                Assign {props.assignmentType == "sending" && "& Send"}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionnaireSelection;
