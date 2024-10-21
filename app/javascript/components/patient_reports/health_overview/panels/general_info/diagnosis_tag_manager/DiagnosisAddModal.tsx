import * as React from "react";
import {
  Autocomplete,
  Button,
  Grid,
  Modal as MuiModal,
  TextField,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import { getHeaders } from "../../../../../utils/HeaderHelper";
import {
  AuthenticationContext,
  FlashContext,
  ImagesContext,
} from "../../../../../Context";

interface Props {
  patient: any;
  assignedDiagnoses: any;
  diagnoses: any;
  openModel: boolean;
  setOpenModal: Function;
  onConfirmSuccess: Function;
  isLoading: boolean;
  setIsLoading: Function;
}

const DiagnosisAddModal: React.FC<Props> = (props) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const images = React.useContext(ImagesContext);
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState<any>(null);
  const [diagnoses, setDiagnoses] = React.useState<any>([]);

  React.useEffect(() => {
    setDiagnoses(props.diagnoses);
  }, []);

  const resetStates = () => {
    setSelectedDiagnosis(null);
  };

  const getNewOptions = (newInput) => {
    setSelectedDiagnosis(null);
    fetch(
      `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${newInput}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        console.log('getNewOptions', result[3])
        setDiagnoses(result[3]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreate = () => {
    // Check if the selected codeId is already assigned
    if ( selectedDiagnosis &&
      props.assignedDiagnoses.some(
        (obj) => obj.diagnosis_code_value == selectedDiagnosis[0]
      )
    ) {
      flashContext.setMessage({
        text: "This diagnosis is already assigned to this patient",
        type: "error",
      });
    } else {
      if (validForm()) {
        props.setIsLoading(true);
        fetch(`/diagnosis_assignments/`, {
          method: "POST",
          headers: getHeaders(authenticationSetting.csrfToken),
          body: JSON.stringify({
            diagnosis_code_value: selectedDiagnosis[0],
            diagnosis_code_desc: selectedDiagnosis[1],
            user_id: props.patient?.id,
            action_type: "assign",
          }),
        })
          .then((result) => result.json())
          .then((result) => {
            if (result.success == false) {
              flashContext.setMessage({ text: result.error, type: "error" });
            } else {
              props.setOpenModal(false);
              resetStates();
              flashContext.setMessage({
                text: "You have successfully add this diagnosis to this patient.",
                type: "success",
              });
              props.onConfirmSuccess();
            }
            props.setIsLoading(false);
          })
          .catch((error) => {
            props.setIsLoading(false);
            flashContext.setMessage({
              text: error,
              type: "error",
            });
          });
      }
    }
  };

  const validForm = () => {
    let errorFields = [];

    if (selectedDiagnosis?.id?.length < 1) {
      errorFields.push("Code");
    }

    if (errorFields.length > 0) {
      let message = `${errorFields.join(", ")} required`;
      flashContext.setMessage({ text: message, type: "error" });
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <MuiModal
        open={props.openModel}
        className="modal-primary"
        onClose={resetStates}
      >
        <div className="paper" style={{ width: 430 }}>
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <div className="main-header">
                  Add New Diagnosis
                  <span
                    id="dismiss-button"
                    onClick={() => {
                      props.setOpenModal(false);
                      resetStates();
                    }}
                  >
                    <ClearIcon sx={{ width: 30, height: 30 }} />
                  </span>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  className="content"
                  style={{ padding: "24px 24px 15px 24px" }}
                >
                  <p
                    className="facility-text"
                    style={{ marginBottom: 4, marginTop: 0 }}
                  >
                    Diagnosis Details
                  </p>
                  <Grid container className="form-container">
                    <Grid item xs={12} className="field-container">
                      <Grid item xs={12} className="field-container">
                        <Autocomplete
                          id="codeId"
                          options={diagnoses}
                          getOptionLabel={(option) =>
                            option
                              ? `${option[0]} - ${option[1]}`
                              : "Select Code"
                          }
                          className="facility-field facility-text"
                          value={selectedDiagnosis}
                          onChange={(event, diagnosis) => {
                            setSelectedDiagnosis(diagnosis);
                          }}
                          onInputChange={(event, newInput) => {
                            getNewOptions(newInput);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Diagnosis Code*"
                              placeholder="Select Code"
                              variant="outlined"
                              InputLabelProps={{
                                shrink: true,
                                sx: {
                                  transform: "translate(16px, 8px) scale(1)",
                                  transformOrigin: "top left",
                                  color: "#4A4442",
                                  fontSize: 12,
                                  fontWeight: 500,
                                },
                              }}
                              InputProps={{
                                sx: {
                                  paddingTop: "16px !important",
                                  paddingLeft: "5px !important",
                                  color: "#1E1E1E",
                                  fontSize: 16,
                                  fontWeight: 500,
                                },
                                ...params.InputProps,
                              }}
                              sx={{
                                height: 56,
                                "& .MuiSelect-select span::before": {
                                  content: "'Select'",
                                  color: "#1E1E1E",
                                  fontSize: 16,
                                  fontWeight: 500,
                                },
                                "& .MuiInputBase-input::placeholder": {
                                  color: "#1E1E1E",
                                  fontSize: 16,
                                  fontWeight: 500,
                                  opacity: 1,
                                  lineHeight: 22,
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className="modal-footer"
            >
              <Grid item xs={12} className="confirm-btn-container">
                <div
                  onClick={() => {
                    props.setOpenModal(false);
                    resetStates();
                  }}
                  className="cancel-link"
                >
                  Cancel
                </div>
                {!props.isLoading ? (
                  <Button
                    onClick={handleCreate}
                    className="confirm-btn"
                    style={{ width: 156 }}
                  >
                    Add Diagnosis
                  </Button>
                ) : (
                  <div className="cancel-link" style={{ padding: 0 }}>
                    <img src={images.spinner_src} style={{ width: 24 }}></img>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </MuiModal>
    </>
  );
};

export default DiagnosisAddModal;