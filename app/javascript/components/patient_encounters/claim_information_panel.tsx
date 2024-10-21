// Library Imports
import * as React from "react";
import {
  Grid,
  Link,
  TextField,
  InputLabel,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

// header import
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import { AuthenticationContext } from "../Context";
import CptCodeField from "./cpt_codes_field";

interface Props {
  setClaimObj: any;
  setRenderingProv: any;
  patient_id: string;
}

const ClaimInformationPanel: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [panelExpanded, setPanelExpanded] = React.useState<boolean>(false);
  const [showRenderingProvField, setShowRenderingProvField] =
    React.useState<boolean>(false);
  const [renderingProv, setRenderingProv] = React.useState<string>("");
  const [providerOptions, setProviderOptions] = React.useState<any>([]);
  const [cptCodeOptions, setCptCodeOptions] = React.useState<any>([]);

  // previously used options
  const [prevCptCodes, setPrevCptCodes] = React.useState<any>([]);
  const [prevDiagCode, setPrevDiagCode] = React.useState<any>([]);

  // other states
  const [claimInfoObjs, setclaimInfoObjs] = React.useState<any>([
    {
      id: 1,
      cptCode: "",
      diagnosisCode: "",
      units: "",
      charges: "",
      showModifier: false,
      modifier: "",
      diagnosisCodeOptions: [],
      showPrevCptCode: false,
      showPrevDiagCode: false,
    },
  ]);

  const isImmunizationPage = () => {
    const currentURL = window.location.href;
    return currentURL.includes("immunization-list");
  };

  const isTablet = useMediaQuery("(max-width:1300px)") || isImmunizationPage();

  React.useEffect(() => {
    props.setClaimObj(claimInfoObjs);
  }, [claimInfoObjs, props]);

  React.useEffect(() => {
    props.setRenderingProv(renderingProv);
  }, [props, renderingProv]);

  React.useEffect(() => {
    getRenderingProviders(); //this gives all rendering provider options
    getRenderingProvider(); //this gives selected rendering provider option for selected encounter
    getPreviouslyUsedCodes();
    getClaimInformation();
  }, []);

  const getEncounterId = () => {
    // the encounter id is UUID for HIPPA compliant
    const url_string = window.location.href;
    const url = new URL(url_string);
    return url.searchParams.get("encounter_id");
  };

  const getClaimInformation = () => {
    const encounterId = getEncounterId();

    if (encounterId) {
      fetch(`/encounters/claim_information_panel_data/${encounterId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            if (result?.resource?.length > 0) {
              let tempClaimObj = [];
              for (let obj of result?.resource) {
                let tempObj = {
                  id: obj?.id,
                  cptCode: obj?.cpt_code,
                  diagnosisCode: [
                    obj?.diagnosis_code_value,
                    obj?.diagnosis_code_desc,
                  ],
                  units: obj?.units,
                  charges: obj?.charges,
                  showModifier: obj?.modifier ? true : false,
                  modifier: obj?.modifier,
                  diagnosisCodeOptions: [],
                  showPrevCptCode: false,
                  showPrevDiagCode: false,
                  isManualCptCode: obj?.is_manual_cpt_code || false,
                };
                tempClaimObj.push(tempObj);
              }
              setclaimInfoObjs(tempClaimObj);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getRenderingProvider = () => {
    const encounterId = getEncounterId();

    if (encounterId) {
      fetch(`/encounters/rendering_provider_data/${encounterId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setRenderingProv(result?.resource?.rendering_provider);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getNewOptions = (claimInfo, newInput) => {
    fetch(
      `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${newInput}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        // the third item from the API is list of diagnosis code. To check please go to diagnosis code
        handleDiagnosisCodeOptionsChange(claimInfo, result[3]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTheOptionsLabel = (option: any) => {
    //this function sanitizes the option string for diagnosis code

    if (typeof option == "string") {
      if (option == "") {
        return "";
      } else {
        return option;
      }
    } else if (Array.isArray(option)) {
      return option.length == 2 ? option[0] + " - " + option[1] : "";
    } else {
      return "";
    }
  };

  const getRenderingProviders = () => {
    fetch(`/encounters/claim_information_assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setProviderOptions(result?.resource?.providers);
          setCptCodeOptions(result?.resource?.cpt_code_options);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPreviouslyUsedCodes = () => {
    fetch(`/encounters/previously_used_codes/${props.patient_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          console.log(result);
          setPrevCptCodes(result?.resource?.cpt_codes);
          setPrevDiagCode(result?.resource?.diag_codes); //diag_code is 2d array
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFieldAddition = () => {
    const allClaimObjs = claimInfoObjs.sort((a, b) => (a.id > b.id ? 1 : -1));
    const lastClaimObj = allClaimObjs[allClaimObjs.length - 1];
    const lastClaimObjId = lastClaimObj.id;
    const newClaimObj = {
      id: lastClaimObjId + 1,
      cptCode: "",
      diagnosisCode: "",
      units: "",
      charges: "",
      showModifier: false,
      modifier: "",
      diagnosisCodeOptions: [],
      showPrevCptCode: false,
      showPrevDiagCode: false,
    };

    updateClaimObjState([...allClaimObjs, newClaimObj]);
  };

  const handleFieldRemoval = (claimInfoId) => {
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfoId
    );
    updateClaimObjState([...restOfTheClaimObjs]);
  };

  const handleDiagnosisCodeOptionsChange = (claimInfo, value) => {
    // claimInfo is an object
    // value is an array for this object
    claimInfo.diagnosisCodeOptions = value;
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );
    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };

  const handleCPTCodeChange = (claimInfo, value, manual = false) => {
    // claimInfo is an object
    claimInfo.cptCode = value;

    if (manual) {
      claimInfo.isManualCptCode = true;
    } else {
      claimInfo.isManualCptCode = false;
    }

    claimInfo.showPrevCptCode = false;

    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );

    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };
  const handleShowPrevCptCodeChange = (claimInfo) => {
    // claimInfo is an object
    claimInfo.showPrevCptCode = !claimInfo.showPrevCptCode;
    claimInfo.isManualCptCode = false;
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );
    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };

  const handleDaignosisCodeChange = (claimInfo, value) => {
    // claimInfo is an object
    claimInfo.diagnosisCode = value;
    claimInfo.showPrevDiagCode = false;
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );
    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };

  const handleShowPrevDiagCode = (claimInfo) => {
    // claimInfo is an object
    claimInfo.showPrevDiagCode = !claimInfo.showPrevDiagCode;
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );
    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };

  const handleUnitsChange = (claimInfo, value) => {
    // claimInfo is an object
    claimInfo.units = value;
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );
    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };

  const handleChargesChange = (claimInfo, value) => {
    // claimInfo is an object
    claimInfo.charges = value;
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );
    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };

  const handleModifierChange = (claimInfo, value) => {
    // claimInfo is an object
    claimInfo.modifier = value;
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );
    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };

  const handleModifierToggle = (claimInfo) => {
    claimInfo.showModifier = !claimInfo.showModifier;
    const restOfTheClaimObjs = claimInfoObjs.filter(
      (obj) => obj.id != claimInfo.id
    );
    updateClaimObjState([...restOfTheClaimObjs, claimInfo]);
  };

  const updateClaimObjState = (newClaimObjs) => {
    newClaimObjs.sort((a, b) => (a.id > b.id ? 1 : -1));
    setclaimInfoObjs(newClaimObjs);
  };

  const renderingProvOptions = providerOptions.map((provider) => {
    return (
      <MenuItem key={provider?.id} value={provider?.name}>
        {provider?.name}
      </MenuItem>
    );
  });

  return (
    <Grid container item xs={12} className="single-panel">
      <Grid item xs={12}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className="admin-header"
        >
          <Grid item xs={11}>
            <h3>Claim Information</h3>
          </Grid>
          <Grid
            container
            item
            xs={1}
            direction="row"
            justifyContent="flex-end"
            style={{ flexWrap: "nowrap" }}
          >
            {panelExpanded ? (
              <>
                <span>
                  <Link
                    className="action-icon"
                    onClick={() => setPanelExpanded(false)}
                  >
                    <ArrowDropUpIcon className="expand-icon" />
                  </Link>
                </span>
              </>
            ) : (
              <>
                <span>
                  <Link
                    className="action-icon "
                    onClick={() => setPanelExpanded(true)}
                  >
                    <ArrowDropDownIcon className="expand-icon" />
                  </Link>
                </span>
              </>
            )}
          </Grid>
        </Grid>
        {panelExpanded && (
          <>
            {claimInfoObjs.map((claimInfo) => {
              return (
                <Grid
                  key={claimInfo.id}
                  container
                  className="form-body"
                  spacing={1}
                >
                  <Grid item xs={3}>
                    <Grid container>
                      <Grid item xs={12} className="codes-label-container">
                        <InputLabel
                          htmlFor="encounter_type"
                          className="field-label font-14px"
                        >
                          <span className="float-label">CPT Code</span>
                          {!isTablet && (
                            <span
                              className="prev-code-label pcl--cpt-code"
                              onClick={() =>
                                handleShowPrevCptCodeChange(claimInfo)
                              }
                            >
                              Previously Used Codes
                            </span>
                          )}
                        </InputLabel>
                        {claimInfo.showPrevCptCode && (
                          <div className="previous-codes-container">
                            {prevCptCodes.map((cptCode, index) => {
                              return (
                                <div key={index} className="pcc__item">
                                  <Link
                                    className="pcc__item__link"
                                    onClick={() =>
                                      handleCPTCodeChange(claimInfo, cptCode)
                                    }
                                  >
                                    {cptCode}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Grid>
                      <Grid item xs={12} className="field-container">
                        <CptCodeField
                          cptCodeOptions={cptCodeOptions}
                          updateClaimObjState={updateClaimObjState}
                          claimInfoObjs={claimInfoObjs}
                          claimInfo={claimInfo}
                          handleCPTCodeChange={handleCPTCodeChange}
                        />
                      </Grid>
                      {isTablet && (
                        <Grid item xs={12}>
                          <span
                            className="prev-code-label pcl--cpt-code"
                            onClick={() =>
                              handleShowPrevCptCodeChange(claimInfo)
                            }
                          >
                            Previously Used Codes
                          </span>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>

                  <Grid item xs={3}>
                    <Grid item xs={12} className="codes-label-container">
                      <InputLabel
                        htmlFor="encounter_type"
                        className="field-label font-14px"
                      >
                        <span>Diagnosis Code</span>
                        {!isTablet && (
                          <span
                            className="prev-code-label pcl--diag-code"
                            onClick={() => handleShowPrevDiagCode(claimInfo)}
                          >
                            Previously Used Codes
                          </span>
                        )}
                      </InputLabel>
                      {claimInfo.showPrevDiagCode && (
                        <div className="previous-codes-container diag-codes">
                          {prevDiagCode.map((diagCode, index) => {
                            return (
                              <div key={index} className="pcc__item">
                                <Link
                                  className="pcc__item__link"
                                  onClick={() =>
                                    handleDaignosisCodeChange(
                                      claimInfo,
                                      diagCode
                                    )
                                  }
                                >
                                  {diagCode[0]}-{diagCode[1]}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12} className="field-container">
                      <Autocomplete
                        id="combo-box-demo"
                        options={claimInfo.diagnosisCodeOptions}
                        getOptionLabel={(option) => getTheOptionsLabel(option)}
                        className="field field-2"
                        value={claimInfo.diagnosisCode}
                        onChange={(event, newValue) => {
                          handleDaignosisCodeChange(claimInfo, newValue);
                        }}
                        onInputChange={(event, newInput) => {
                          getNewOptions(claimInfo, newInput);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            className="field field-2"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                    {isTablet && (
                      <Grid item xs={12}>
                        <span
                          className="prev-code-label pcl--diag-code"
                          onClick={() => handleShowPrevDiagCode(claimInfo)}
                        >
                          Previously Used Codes
                        </span>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={1}>
                    <Grid container>
                      <Grid item xs={12}>
                        <InputLabel
                          htmlFor="encounter_type"
                          className="field-label font-14px"
                        >
                          Units
                        </InputLabel>
                      </Grid>
                      <Grid item xs={12} className="field-container">
                        <TextField
                          id="encounter_type"
                          size="small"
                          value={claimInfo.units}
                          className="field field-2"
                          required
                          variant="outlined"
                          onChange={(event) => {
                            handleUnitsChange(claimInfo, event.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={2}>
                    <Grid container>
                      <Grid item xs={12}>
                        <InputLabel
                          htmlFor="encounter_type"
                          className="field-label font-14px"
                        >
                          Charges
                        </InputLabel>
                      </Grid>
                      <Grid item xs={12} className="field-container">
                        <TextField
                          id="encounter_type"
                          size="small"
                          value={claimInfo.charges}
                          className="field field-2"
                          required
                          variant="outlined"
                          onChange={(event) => {
                            handleChargesChange(claimInfo, event.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={2}>
                    <Grid container>
                      <Grid item xs={12}>
                        <InputLabel
                          htmlFor="encounter_type"
                          className="field-label font-14px"
                        >
                          Modifier
                        </InputLabel>
                      </Grid>
                      <Grid item xs={12} className="field-container">
                        {claimInfo.showModifier ? (
                          <>
                            <TextField
                              id="encounter_type"
                              size="small"
                              value={claimInfo.modifier}
                              className="field field-2"
                              required
                              variant="outlined"
                              style={{ width: "80%" }}
                              onChange={(event) => {
                                handleModifierChange(
                                  claimInfo,
                                  event.target.value
                                );
                              }}
                            />
                            <Link
                              onClick={() => handleModifierToggle(claimInfo)}
                              style={{
                                display: "inline-block",
                                paddingTop: "10px",
                              }}
                            >
                              <CloseIcon className="plus-icon orange-icon" />
                            </Link>
                          </>
                        ) : (
                          <div
                            className="action-container"
                            style={{ marginTop: 0, marginLeft: 0 }}
                          >
                            <Link
                              className="action-link"
                              onClick={() => handleModifierToggle(claimInfo)}
                            >
                              <AddIcon className="plus-icon" />{" "}
                              <span className="">Add Modifier</span>
                            </Link>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={1}>
                    {claimInfo.id != 1 && (
                      <Grid container>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={12} className="field-container">
                          <Link
                            onClick={() => handleFieldRemoval(claimInfo.id)}
                          >
                            <DeleteIcon
                              style={{
                                fontSize: 30,
                                color: "#FF890A",
                                display: "inline-block",
                                cursor: "pointer",
                                marginTop: "20px",
                              }}
                            />
                          </Link>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              );
            })}
            <Grid container>
              <Grid item xs={6}>
                <div className="action-container">
                  <Link className="action-link" onClick={handleFieldAddition}>
                    <AddIcon className="plus-icon" />{" "}
                    <span className="">Add Another Charge Code</span>
                  </Link>
                </div>
              </Grid>
              <Grid item xs={6}>
                {showRenderingProvField ? (
                  <div className="action-container right-action-container form-body">
                    <Grid item xs={12}>
                      <Grid item xs={12}>
                        <InputLabel
                          htmlFor="encounter_type"
                          className="field-label font-14px"
                          style={{
                            display: "inline-block",
                            marginRight: "20px",
                          }}
                        >
                          Rendering Provider
                        </InputLabel>
                      </Grid>
                      <Grid item xs={12} className="field-container">
                        <TextField
                          id="state"
                          value={renderingProv}
                          required
                          size="small"
                          variant="outlined"
                          className="field field-2"
                          onChange={(event) => {
                            setRenderingProv(event.target.value);
                          }}
                          style={{ maxWidth: "300px", textAlign: "left" }}
                          select
                        >
                          {renderingProvOptions}
                        </TextField>
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  <div className="action-container right-action-container">
                    <Link
                      className="action-link"
                      onClick={() => setShowRenderingProvField(true)}
                    >
                      <AddIcon className="plus-icon" />{" "}
                      <span className="">Add Rendering Provider</span>
                    </Link>
                  </div>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default ClaimInformationPanel;
