// Library Imports
import * as React from "react";
import { Grid, Link, Switch, Modal, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

// component imports
import FlashMessage from "../shared/FlashMessage";
import EncounterInformationPanel from "./encounter_infomation_panel";
import EncounterNotesPanel from "./encounter_notes_panel";
import PatientInstructionsPanel from "./patient_instructions_panel";
import ClaimInformationPanel from "./claim_information_panel";
import PatientAndInsuranceInfoPanel from "./patient_and_insurance_info_panel";
import Billing1500Panel from "./billing_1500_panel";
import EncounterLogsPanel from "./encounter_logs_panel";

// app setting imports
import { AuthenticationContext, BackContext } from "../Context";

// helpers
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patientId?: string;
}

const NewEncounter: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // patient id
  const { id } = useParams();
  const patientId = id || props.patientId;

  // Error handling states
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  // form states
  const [encounterBillingId, setEncounterBillingId] =
    React.useState<string>("");
  const [generateClaim, setGenerateClaim] = React.useState<boolean>(false);
  const [encounterType, setEncounterType] = React.useState<string>("");
  const [dayOfEncounter, setDayOfEncounter] = React.useState<any>(new Date());
  const [placeOfService, setPlaceOfService] = React.useState<string>("");

  const [show1500form, setShow1500Form] = React.useState<boolean>(false);
  const [encounteTypeOptions, setEncounterTypeOptions] = React.useState<any>();
  const [encounterStatus, setEncounterStatus] = React.useState<string>("");

  const [claimObj, setClaimObj] = React.useState<any>(null); //for structure of claim object check claim_onformation_panel.tsx
  const [renderingProv, setRenderingProv] = React.useState<any>(null);
  const [insuranceObj, setInsuranceObj] = React.useState<any>(null); //for structure of claim object checl patient_and_insurance_info_panel.tsx
  const [billing1500Obj, setBilling1500Obj] = React.useState<any>(null); //for structure of claim object checl billing_1500_panel.tsx

  const [x12FileObj, setX12FileObj] = React.useState<any>(null);
  const [x12ModalOpen, setX12ModalOpen] = React.useState<boolean>(false);

  const [blocks, setBlocks] = React.useState<any>([{ note: "", order: 1 }]);
  const [instructionBlocks, setInstructionBlocks] = React.useState<any>([
    { note: "", order: 1 },
  ]);
  const [disableSave, setDisableSave] = React.useState<boolean>(false);
  const { backPath, setBackPath } = React.useContext(BackContext);
  const url_string = window.location.href;
  const url = new URL(url_string);

  // this is to reset timeout if mouseMove
  const [mouseMove, setMouseMove] = React.useState<number>(0);
  const latestCount = React.useRef(mouseMove);
  const [readOnly, setReadOnly] = React.useState(false);

  const [reloadLogger, setReloadLogger] = React.useState<string>("");
  // for existing encounters, if the encounter id is present then it is existing encounter otherwise it is a new encounter
  const getEncounterId = () => {
    // encouter ids are UUID

    const flashMessage = url.searchParams.get("msg");
    const msgType = url.searchParams.get("msg_type");
    setFlashMessage({ message: flashMessage || "", type: msgType || "error" });
    return url.searchParams.get("encounter_id");
  };

  React.useEffect(() => {
    getAssets();
    if (
      url.searchParams.get("view_only") &&
      url.searchParams.get("view_only") == "1"
    ) {
      setReadOnly(true);
    }
  }, []);

  const getAssets = () => {
    // for assets structure checkout encounters#new
    const encounterId = getEncounterId(); //this is UUID not db id
    let url = `/encounters/new`;
    if (encounterId) {
      url = `/encounters/new?encounter_id=${encounterId}`;
    }
    fetch(url, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          if (result?.resource?.BILLING_INTEGRATON_ON != "true") {
            setFlashMessage({
              message: "This feature is not available now",
              type: "success",
            });
            window.location.href = "/";
          }

          if (result?.resource?.creation_type == "existing") {
            setEncounterBillingId(result?.resource?.encounter_billing_id);
          }
          setEncounterStatus(result?.resource?.status);
          setPlaceOfService(result?.resource?.place_of_service);
          setEncounterTypeOptions(result?.resource?.encounter_types);
          setEncounterType(
            result?.resource?.encounter_types?.med_administration
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEncounterObj = (status) => {
    return {
      encounter_billing_id: encounterBillingId,
      patient_id: patientId,
      generate_claim: generateClaim,
      encounter_type: encounterType,
      day_of_encounter: new Date(dayOfEncounter).toDateString(),
      place_of_service: placeOfService,
      status: status,
      blocks: blocks,
      instruction_blocks: instructionBlocks,
      claim_information_object: claimObj,
      rendering_provider: renderingProv,
      insurance_object: insuranceObj,
      billing_1500_obj: billing1500Obj,
    };
  };

  const submitForm = (status) => {
    setDisableSave(true);
    fetch(`/encounters/pend`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        encounter: getEncounterObj(status),
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          console.log(result);
          setEncounterBillingId(result?.resource?.id);
          setEncounterStatus(result?.resource?.status);
          // window.location.href = `/patient_reports/${patientId}/patient_encounters/new?encounter_id=${result?.resource?.uuid}&msg=${result.message}&msg_type=success`;
          setFlashMessage({
            message: "Encounter billing saved",
            type: "success",
          });
        }
        setDisableSave(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = () => {
    if (encounterBillingId) {
      fetch(`/encounter/${encounterBillingId}`, {
        method: "DELETE",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setFlashMessage({ message: result.message, type: "success" });
            window.location.href = `/patient_reports/${patientId}/encounters`;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      window.location.href = `/patient_reports/${patientId}/encounters`;
    }
  };

  const handleSendCharges = () => {
    if (encounterBillingId) {
      fetch(`/encounters/send_charges/${encounterBillingId}`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setFlashMessage({
              message: `Claim validation: ${result.resource?.validation_status}. Claim submission: ${result.resource?.submission_status}`,
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    if (x12FileObj) {
      setX12ModalOpen(true);
    }
  }, [x12FileObj]);

  React.useEffect(() => {
    setBackPath(`/patient_reports/${patientId}/encounters`);
  }, []);

  const downloadTxtFile = () => {
    const fileObj = x12FileObj;
    const element = document.createElement("a");
    const file = new Blob([fileObj?.content], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = fileObj?.fileName;
    document.body.appendChild(element);
    element.click();
    setX12ModalOpen(false);
  };

  // not letting session out if there is mouse movement
  const handleMouseMove = () => {
    setMouseMove(mouseMove + 1);
    latestCount.current = mouseMove + 1;
  };

  const resetSession = () => {
    if (latestCount.current > 0) {
      fetch(`/reset_timeout_session`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => {
          if (result.status == 200) {
            setMouseMove(0);
            latestCount.current = 0;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      resetSession();
    }, 60000); // 60,000 milliseconds = 60 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Grid className="cgm-report-container" ml={0} onMouseMove={handleMouseMove}>
      <FlashMessage flashMessage={flashMessage} />

      <Grid container className="form-panel">
        {encounteTypeOptions && (
          <EncounterInformationPanel
            generateClaim={generateClaim}
            setGenerateClaim={setGenerateClaim}
            encounterType={encounterType}
            setEncounterType={setEncounterType}
            dayOfEncounter={dayOfEncounter}
            setDayOfEncounter={setDayOfEncounter}
            placeOfService={placeOfService}
            setPlaceOfService={setPlaceOfService}
            readOnly={readOnly || encounterStatus === "signed"}
            encounterTypeOptions={Object.entries(encounteTypeOptions)} //making the encounterTypeOption array so that we can pass to select options
          />
        )}

        <EncounterNotesPanel
          blocks={blocks}
          setBlocks={setBlocks}
          encounterStatus={encounterStatus}
          encounterBillingId={encounterBillingId}
          setReloadLogger={setReloadLogger}
          readOnly={readOnly || encounterStatus === "signed"}
        />

        <PatientInstructionsPanel
          blocks={instructionBlocks}
          setBlocks={setInstructionBlocks}
          encounterStatus={encounterStatus}
          encounterBillingId={encounterBillingId}
          setReloadLogger={setReloadLogger}
          readOnly={readOnly || encounterStatus === "signed"}
        />

        {generateClaim && (
          <ClaimInformationPanel
            setClaimObj={setClaimObj}
            setRenderingProv={setRenderingProv}
            patient_id={patientId}
          />
        )}

        {generateClaim && (
          <PatientAndInsuranceInfoPanel
            patient_id={patientId}
            setInsuranceObj={setInsuranceObj}
            encounterStatus={encounterStatus}
            encounterBillingId={encounterBillingId}
          />
        )}

        {show1500form && generateClaim && (
          <Billing1500Panel setBilling1500Obj={setBilling1500Obj} />
        )}

        <Grid
          container
          item
          xs={12}
          spacing={1}
          justifyContent="space-between"
          className="action-container"
        >
          {generateClaim ? (
            <Grid item xs={2} style={{ color: "white", minWidth: "250px" }}>
              Additional Billing Fields
              <Switch
                checked={show1500form}
                onChange={() => setShow1500Form(!show1500form)}
              />
            </Grid>
          ) : (
            <Grid item xs={2}></Grid>
          )}

          {!readOnly && (
            <Grid item xs={6}>
              <Grid
                container
                justifyContent="center"
                className="button-container"
              >
                {disableSave ? (
                  <>
                    <Link className="btn pend-btn" onClick={() => void 0}>
                      Saving...
                    </Link>
                    <Link className="btn sign-btn" onClick={() => void 0}>
                      Saving...
                    </Link>
                  </>
                ) : (
                  <>
                    {encounterStatus != "signed" && (
                      <Link
                        className="btn pend-btn"
                        onClick={() => submitForm("pended")}
                        style={{ width: "160px" }}
                      >
                        Pend Note
                      </Link>
                    )}
                    <Link
                      className="btn sign-btn"
                      onClick={() => submitForm("signed")}
                      style={{ width: "160px" }}
                    >
                      Sign Note
                    </Link>
                  </>
                )}
                {generateClaim && encounterStatus == "signed" && (
                  <Link
                    className="btn send-charges-btn"
                    onClick={handleSendCharges}
                  >
                    Send Charges
                  </Link>
                )}
              </Grid>
            </Grid>
          )}
          {encounterStatus == "pended" ? (
            <Grid item xs={1} className="trash-container">
              <Link onClick={handleDelete}>
                <DeleteIcon
                  style={{
                    fontSize: 30,
                    color: "#FF890A",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                />
              </Link>
            </Grid>
          ) : (
            <Grid item xs={1} className="trash-container"></Grid>
          )}
        </Grid>

        <Grid container item xs={12}>
          {encounterBillingId && (
            <EncounterLogsPanel
              encounterBillingId={encounterBillingId}
              reloadLogger={reloadLogger}
            />
          )}
        </Grid>
      </Grid>
      {/* send charges modal */}
      <Modal open={x12ModalOpen} className="unsaved-changes-modal-container">
        <div className="paper">
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <p className="main-header">Send Charges</p>
                <p style={{ textAlign: "center" }}>
                  {" "}
                  This will create an extract file that can be uploaded to the
                  claims management system.
                </p>
              </Grid>
              <Grid item xs={12}>
                <p>File Name</p>
                <TextField
                  id="customer_id"
                  size="small"
                  className="textInput"
                  value={x12FileObj?.fileName}
                  variant="outlined"
                  disabled
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={6} className="cancel-link-container">
                <Link
                  className="cancel-link"
                  onClick={() => setX12ModalOpen(false)}
                >
                  Cancel
                </Link>
              </Grid>
              <Grid item xs={6} className="confirm-btn-container">
                <Link onClick={downloadTxtFile} className="confirm-btn">
                  Submit
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </Grid>
  );
};

export default NewEncounter;
