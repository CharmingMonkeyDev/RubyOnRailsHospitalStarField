// Library Imports
import * as React from "react";
import {
  Grid,
  Link,
  TextField,
  InputLabel,
  MenuItem,
  Radio,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import InputMask from "react-input-mask";

// app setting imports
import { AuthenticationContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";

// helper import
import globals from "../globals/globals";

interface Props {
  patient_id: string;
  setInsuranceObj: any;
  encounterStatus: string;
  encounterBillingId: string;
}

const PatientAndInsuranceInfoPanel: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [panelExpanded, setPanelExpanded] = React.useState<boolean>(false);

  const [servicePartnerId, setServicePartnerId] = React.useState<string>("");
  const [claimFilingCode, setClaimFilingCode] = React.useState<string>("");
  const [insuranceType, setInsuranceType] = React.useState<string>("");
  const [planName, setPlanName] = React.useState<string>("");
  const [insuredId, setInsuredId] = React.useState<string>("");
  const [relationship, setRelationship] = React.useState<string>("");
  const [insuredName, setInsuredName] = React.useState<string>("");
  const [insuredDob, setInsuredDob] = React.useState<any>(new Date(null));
  const [address, setAddress] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [zip, setZip] = React.useState<string>("");
  const [insuredPhoneNumber, setInsuredPhoneNumber] =
    React.useState<string>("");

  const [fecaNumber, setFecaNumber] = React.useState<string>("");
  const [insuredSex, setInsuredSex] = React.useState<string>("");
  const [otherClaimId, setOtherClaimId] = React.useState<string>("");
  const [medicarePlanName, setMedicarePlanName] = React.useState<string>("");
  const [anotherBenefitPlanPresent, setAnotherBenefitPlanPresent] =
    React.useState<boolean>(false);

  // Object caller state
  const [patientInsurance, setPatientInsurance] = React.useState<any>(null);
  const [insuranceTypeOptions, setInsuranceTypeOptions] = React.useState<any>(
    []
  );

  // options
  // the codes comes this list https://www.whainfocenter.com/Data-Submitters/WiPop/Ambulatory-Surgery-Centers/ASC_Appendix3.pdf
  const claimFilingCodeOptions = [
    {
      code: "09",
      label: "Self-pay",
    },
    {
      code: "BL",
      label: "Blue Cross",
    },
    {
      code: "CH",
      label:
        "CHAMPUS – Civilian Health and Medical Program of the Uniformed Services ",
    },
    {
      code: "CI",
      label:
        "Commercial Insurance (Map to correct “A” Code to represent Commercial Payer) Non-Medicare payer",
    },
    {
      code: "DS",
      label: "Disability",
    },
  ];

  React.useEffect(() => {
    props.setInsuranceObj({
      service_partner_id: servicePartnerId,
      claim_filing_code: claimFilingCode,
      insurance_type: insuranceType,
      plan_name: planName,
      insured_id: insuredId,
      relationship: relationship,
      insured_name: insuredName,
      insured_dob: insuredDob,
      address: address,
      city: city,
      state: state,
      zip: zip,
      insured_phone_number: insuredPhoneNumber,
      feca_number: fecaNumber,
      insured_sex: insuredSex,
      other_claim_id: otherClaimId,
      medicare_plan_name: medicarePlanName,
      another_benefit_plan_present: anotherBenefitPlanPresent,
    });
  }, [
    servicePartnerId,
    claimFilingCode,
    insuranceType,
    planName,
    insuredId,
    relationship,
    insuredName,
    insuredDob,
    address,
    city,
    state,
    zip,
    insuredPhoneNumber,
    fecaNumber,
    insuredSex,
    otherClaimId,
    medicarePlanName,
    anotherBenefitPlanPresent,
  ]);

  React.useEffect(() => {
    getInsuranceInformation();
  }, [props.patient_id, props.ecounter_billing_id]);

  const getEncounterId = () => {
    // encounter ID is UUID to make it HIPPA Compliant
    const url_string = window.location.href;
    const url = new URL(url_string);
    return url.searchParams.get("encounter_id");
  };

  const getInsuranceInformation = () => {
    const encounterId = getEncounterId();
    if (encounterId) {
      getEncounterBillingPatientInsurance(encounterId);
    } else {
      getPatientInsurance();
    }
  };

  React.useEffect(() => {
    // the patientInsurance type can be either patient_insurance or encounter_insurance_information
    setServicePartnerId(patientInsurance?.service_partner_id);
    setClaimFilingCode(patientInsurance?.claim_filing_code);
    setInsuranceType(patientInsurance?.insurance_type);
    setRelationship(patientInsurance?.relationship);
    setPlanName(patientInsurance?.plan_name);
    setInsuredId(patientInsurance?.insured_id);
    setInsuredName(patientInsurance?.insured_name);
    setInsuredDob(patientInsurance?.insured_dob);
    setAddress(patientInsurance?.address);
    setCity(patientInsurance?.city);
    setState(patientInsurance?.state);
    setZip(patientInsurance?.zip);
    setInsuredPhoneNumber(patientInsurance?.insured_phone_number);
    setFecaNumber(patientInsurance?.feca_number);
    setInsuredSex(patientInsurance?.insured_sex);
    setOtherClaimId(patientInsurance?.other_claim_id);
    setMedicarePlanName(patientInsurance?.medicare_plan_name);
    setAnotherBenefitPlanPresent(
      patientInsurance?.another_benefit_plan_present
    );
  }, [patientInsurance]);

  const getEncounterBillingPatientInsurance = (encounterId) => {
    fetch(`/encounters/patient_and_insurance_panel_data/${encounterId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          if (result.resource?.patient_insurance) {
            setPatientInsurance(result.resource?.patient_insurance);
            setInsuranceTypeOptions(result.resource?.insurance_types);
          } else {
            getPatientInsurance();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPatientInsurance = () => {
    fetch(`/data_fetching/patient_insurances/${props.patient_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setPatientInsurance(result.resource?.patient_insurance);
          setInsuranceTypeOptions(result.resource?.insurance_types);
          setInsuredSex(result?.resource?.basic_patient_info?.insuredSex);
          setInsuredPhoneNumber(
            result?.resource?.basic_patient_info?.insuredPhoneNumber
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const stateOptions = globals.states.map((state) => {
    return (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    );
  });

  const handleDateChange = (date) => {
    setInsuredDob(date);
  };

  const checkDisabled = (field) => {
    if (relationship == "self" && patientInsurance) {
      if (field == "name") {
        return insuredName?.length >= 0;
      }
      if (field == "address") {
        return address?.length >= 0;
      }
      if (field == "city") {
        return city?.length >= 0;
      }
      if (field == "state") {
        return state?.length >= 0;
      }
      if (field == "zip") {
        return zip?.length >= 0;
      }

      if (field == "dob") {
        return true;
      }
    }
  };

  return (
    <Grid container item xs={12} className="single-panel">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        className="admin-header"
      >
        <Grid item xs={11}>
          <h3>Patient&apos;s Insurance Information</h3>
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
        {panelExpanded && (
          <Grid container className="form-body" spacing={1}>
            {/* column #1 */}
            <Grid item xs={4}>
              <Grid container>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="insurance_type"
                    className="field-label-1"
                  >
                    *Service Partner ID
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="service_partner_id"
                    size="small"
                    value={servicePartnerId}
                    className="field field-1"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      setServicePartnerId(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="insurance_type"
                    className="field-label-1"
                  >
                    *Claim Filing Code
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="plan_name"
                    size="small"
                    value={claimFilingCode}
                    className="field field-1"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      setClaimFilingCode(event.target.value);
                    }}
                    select
                  >
                    {claimFilingCodeOptions.map((code) => {
                      return (
                        <MenuItem key={code.code} value={code.code}>
                          {code.label}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="insurance_type"
                    className="field-label-1"
                  >
                    *Insurance Type
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="insurance_type"
                    value={insuranceType}
                    required
                    size="small"
                    variant="outlined"
                    className="field field-1"
                    onChange={(event) => {
                      setInsuranceType(event.target.value);
                    }}
                    select
                  >
                    {insuranceTypeOptions.map((insuranceTypeOption) => {
                      return (
                        <MenuItem
                          key={insuranceTypeOption.id}
                          value={insuranceTypeOption.insurance_type}
                        >
                          {insuranceTypeOption.insurance_type}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel htmlFor="plan_name" className="field-label-1">
                    *Insurance Plan Name or Program
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="plan_name"
                    size="small"
                    value={planName}
                    className="field field-1"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      setPlanName(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel htmlFor="insured_id" className="field-label-1">
                    *Insured&#39;s ID #
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="insured_id"
                    size="small"
                    value={insuredId}
                    className="field field-1"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      setInsuredId(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="relation" className="field-label-1">
                  Patient’s Relationship to Insured (If not self)
                </InputLabel>
              </Grid>
              <Grid item xs={12} style={{ marginTop: "18.5px" }}>
                <Radio
                  checked={relationship === "self"}
                  onChange={(event) => setRelationship(event.target.value)}
                  value="self"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Self" }}
                  style={{ paddingLeft: "0px" }}
                />
                Self
                <Radio
                  checked={relationship === "spouse"}
                  onChange={(event) => setRelationship(event.target.value)}
                  value="spouse"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Spouse" }}
                />
                Spouse
                <Radio
                  checked={relationship === "child"}
                  onChange={(event) => setRelationship(event.target.value)}
                  value="child"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Child" }}
                />
                Child
                <Radio
                  checked={relationship === "other"}
                  onChange={(event) => setRelationship(event.target.value)}
                  value="other"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Other" }}
                />
                Other
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel htmlFor="insured_name" className="field-label-1">
                    Insured&#39;s Name (Last, First, MI)
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="insured_name"
                    size="small"
                    value={insuredName}
                    className="field field-1"
                    required
                    variant="outlined"
                    disabled={checkDisabled("name")}
                    onChange={(event) => {
                      setInsuredName(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* column #2 */}
            <Grid item xs={4}>
              <Grid container>
                <Grid item xs={12}>
                  <InputLabel htmlFor="address" className="field-label-1">
                    *Insured&#39;s Address
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="address"
                    size="small"
                    value={address}
                    disabled={checkDisabled("address")}
                    required
                    variant="outlined"
                    className="field field-1"
                    onChange={(event) => {
                      setAddress(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel htmlFor="city" className="field-label-1">
                    *City
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="city"
                    size="small"
                    value={city}
                    disabled={checkDisabled("city")}
                    required
                    variant="outlined"
                    className="field field-1"
                    onChange={(event) => {
                      setCity(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel htmlFor="state" className="field-label-1">
                    *State
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="state"
                    value={state}
                    disabled={checkDisabled("state")}
                    required
                    size="small"
                    variant="outlined"
                    className="field field-1"
                    onChange={(event) => {
                      setState(event.target.value);
                    }}
                    select
                  >
                    {stateOptions}
                  </TextField>
                </Grid>

                <Grid item container xs={12}>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="zip" className="field-label-1">
                      *Zip
                    </InputLabel>
                  </Grid>
                  <Grid item xs={12} className="field-container">
                    <TextField
                      id="zip"
                      size="small"
                      value={zip}
                      disabled={checkDisabled("zip")}
                      required
                      variant="outlined"
                      className="field field-1"
                      onChange={(event) => {
                        setZip(event.target.value);
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12}>
                    <InputLabel
                      htmlFor="Phone Number"
                      className="field-label-1"
                    >
                      *Insured&#39;s Phone Number
                    </InputLabel>
                  </Grid>
                  <Grid item xs={12} className="field-container">
                    <InputMask
                      style={{ borderBottom: "none" }}
                      id="insured-phone-number"
                      mask="999-999-9999"
                      value={insuredPhoneNumber}
                      disabled={false}
                      maskChar=""
                      className="field field-1"
                      variant="outlined"
                      size="small"
                      onChange={(event) => {
                        setInsuredPhoneNumber(event.target.value);
                      }}
                    >
                      {() => (
                        <TextField
                          className="field field-1"
                          variant="outlined"
                          required
                          size="small"
                        />
                      )}
                    </InputMask>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* column #3 */}
            <Grid item xs={4}>
              <Grid container>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="place_of_service"
                    className="field-label-1"
                  >
                    Insured&#39;s Policy Group or FECA Number
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="plan_name"
                    size="small"
                    value={fecaNumber}
                    className="field field-1"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      setFecaNumber(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <InputLabel
                      htmlFor="date_of_birth"
                      className="field-label-1"
                    >
                      Insured&#39;s Date of Birth
                    </InputLabel>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="field-container"
                    style={{ marginRight: "0px" }}
                  >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        id="date-picker-inline"
                        value={insuredDob}
                        onChange={handleDateChange}
                        disabled={checkDisabled("dob")}
                        style={{
                          width: "92%",
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="gender" className="field-label-1">
                      Sex
                    </InputLabel>
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: "20px" }}>
                    <Radio
                      checked={insuredSex === "male"}
                      onChange={(event) => setInsuredSex(event.target.value)}
                      value="male"
                      name="radio-buttons"
                      inputProps={{ "aria-label": "Self" }}
                      style={{ paddingLeft: "0px" }}
                    />
                    Male
                    <Radio
                      checked={insuredSex === "female"}
                      onChange={(event) => setInsuredSex(event.target.value)}
                      value="female"
                      name="radio-buttons"
                      inputProps={{ "aria-label": "Spouse" }}
                    />
                    Female
                  </Grid>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="place_of_service"
                    className="field-label-1"
                  >
                    Other Claim ID (Designated by NUCC)
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="plan_name"
                    size="small"
                    value={otherClaimId}
                    className="field field-1"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      setOtherClaimId(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="place_of_service"
                    className="field-label-1"
                  >
                    Insurance Plan Name or Program Name
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="plan_name"
                    size="small"
                    value={medicarePlanName}
                    className="field field-1"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      setMedicarePlanName(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="gender" className="field-label-1">
                  Is there another health benefit plan?
                </InputLabel>
              </Grid>
              <Grid item xs={12}>
                <Radio
                  checked={anotherBenefitPlanPresent === true}
                  onChange={(event) => setAnotherBenefitPlanPresent(true)}
                  value={true}
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Self" }}
                  style={{ paddingLeft: "0px" }}
                />
                Yes
                <Radio
                  checked={anotherBenefitPlanPresent === false}
                  onChange={(event) => setAnotherBenefitPlanPresent(false)}
                  value={false}
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Spouse" }}
                />
                No
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default PatientAndInsuranceInfoPanel;
