// Library Imports
import * as React from "react";
import {
  Grid,
  Link,
  TextField,
  InputLabel,
  Radio,
  MenuItem,
  TextareaAutosize,
  useMediaQuery,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Textarea from "@mui/joy/Textarea";

// header import
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import { AuthenticationContext } from "../Context";

// helper import
import globals from "../globals/globals";

interface Props {
  setBilling1500Obj: any;
}

const Billing1500Panel: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [panelExpanded, setPanelExpanded] = React.useState<boolean>(false);

  // first column states
  const [employmentPresent, setEmploymentPresent] =
    React.useState<boolean>(null);
  const [accidentPresent, setAccidentPresent] = React.useState<boolean>(null);
  const [accidentState, setAccidentState] = React.useState<string>("");
  const [otherAccidentPresent, setOtherAccidentPresent] =
    React.useState<boolean>(null);
  const [currentIllnessDate, setCurrentIllnessDate] = React.useState<any>(
    new Date()
  );
  const [qual1, setQual1] = React.useState<string>("");
  const [otherDate, setOtherDate] = React.useState<any>(new Date());
  const [qual2, setQual2] = React.useState<string>("");
  const [unableToWorkStartDate, setUnableToWorkStartDate] = React.useState<any>(
    new Date()
  );
  const [unableToWorkEndDate, setUnableToWorkEndDate] = React.useState<any>(
    new Date()
  );

  // second column states
  const [refProvName, setRefProvName] = React.useState<string>("");
  const [refProvAField, setRefProvAField] = React.useState<string>("");
  const [refProvNpi, setRefProvNpi] = React.useState<string>("");
  const [hospitalizationStartDate, setHospitalizationStartDate] =
    React.useState<any>(new Date());
  const [hospitalizationEndDate, setHospitalizationEndDate] =
    React.useState<any>(new Date());
  const [additionalClaim, setAdditionalClaim] = React.useState<string>("");
  const [outsideLab, setOutsideLab] = React.useState<boolean>(null);
  const [charges, setCharges] = React.useState<string>("");

  // third columns states
  const [resubmissionCode, setResubmissionCode] = React.useState<string>("");
  const [originalRefNumber, setOriginalRefNumber] = React.useState<string>("");
  const [priorAuthNumber, setPriorAuthNumber] = React.useState<string>("");
  const [fedTaxIdType, setFedTaxIdType] = React.useState<string>("");
  const [fedTaxIdNo, setFedTaxIdNo] = React.useState<string>("");
  const [acceptAssignment, setAcceptAssignment] = React.useState<boolean>(null);
  const [totalCharge, setTotalCharge] = React.useState<string>("");
  const [amountPaid, setTotalAmountPaid] = React.useState<string>("");

  // fourth column states
  const [servFacName, setServFacName] = React.useState<string>("");
  const [servFacAddress, setServFacAddress] = React.useState<string>("");
  const [servFacPhone, setServFacPhone] = React.useState<string>("");
  const [servFacNpi, setServFacNpi] = React.useState<string>("");
  const [servFacFieldB, setServFacFieldB] = React.useState<string>("");
  const [provName, setProvName] = React.useState<string>("");
  const [provAddress, setProvAddress] = React.useState<string>("");
  const [provPhone, setProvPhone] = React.useState<string>("");
  const [provNpi, setProvNpi] = React.useState<string>("");
  const [provFieldB, setProvFieldB] = React.useState<string>("");

  React.useEffect(() => {
    props.setBilling1500Obj({
      employment_present: employmentPresent,
      accident_present: accidentPresent,
      accident_state: accidentState,
      other_accident_present: otherAccidentPresent,
      current_illness_date: currentIllnessDate,
      qual_1: qual1,
      other_date: otherDate,
      qual_2: qual2,
      unable_to_work_start_date: unableToWorkStartDate,
      unable_to_work_end_date: unableToWorkEndDate,
      ref_prov_name: refProvName,
      ref_prov_a_field: refProvAField,
      ref_prov_npi: refProvNpi,
      hospitalization_start_date: hospitalizationStartDate,
      hospitalization_end_date: hospitalizationEndDate,
      additional_claim: additionalClaim,
      outside_lab: outsideLab,
      charges: charges,
      resubmission_code: resubmissionCode,
      original_ref_number: originalRefNumber,
      prior_auth_number: priorAuthNumber,
      fed_tax_id_type: fedTaxIdType,
      fed_tax_id_no: fedTaxIdNo,
      accept_assignment: acceptAssignment,
      total_charge: totalCharge,
      amount_paid: amountPaid,
      serv_fac_name: servFacName,
      serv_fac_address: servFacAddress,
      serv_fac_phone: servFacPhone,
      serv_fac_npi: servFacNpi,
      serv_fac_field_b: servFacFieldB,
      prov_name: provName,
      prov_address: provAddress,
      prov_phone: provPhone,
      prov_npi: provNpi,
      prov_field_b: provFieldB,
    });
  }, [
    employmentPresent,
    accidentPresent,
    accidentState,
    otherAccidentPresent,
    currentIllnessDate,
    qual1,
    otherDate,
    qual2,
    unableToWorkStartDate,
    unableToWorkEndDate,
    refProvName,
    refProvAField,
    refProvNpi,
    hospitalizationStartDate,
    hospitalizationEndDate,
    additionalClaim,
    outsideLab,
    charges,
    resubmissionCode,
    originalRefNumber,
    priorAuthNumber,
    fedTaxIdType,
    fedTaxIdNo,
    acceptAssignment,
    totalCharge,
    amountPaid,
    servFacName,
    servFacAddress,
    servFacPhone,
    servFacNpi,
    servFacFieldB,
    provName,
    provAddress,
    provPhone,
    provNpi,
    provFieldB,
  ]);

  const isImmunizationPage = () => {
    const currentURL = window.location.href;
    return currentURL.includes("immunization-list");
  };

  const isTablet = useMediaQuery("(max-width:1300px)") || isImmunizationPage();

  React.useEffect(() => {
    get1500BillingFormRecord();
  }, []);

  const getEncounterId = () => {
    // the encounter id is UUID for HIPPA compliant
    const url_string = window.location.href;
    const url = new URL(url_string);
    return url.searchParams.get("encounter_id");
  };

  const get1500BillingFormRecord = () => {
    const encounterId = getEncounterId();
    if (encounterId) {
      fetch(`/encounters/billing1500_panel_data/${encounterId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            const resource = result?.resource;
            setEmploymentPresent(resource?.employment_present);
            setAccidentPresent(resource?.accident_present);
            setAccidentState(resource?.accident_state);
            setOtherAccidentPresent(resource?.other_accident_present);
            setCurrentIllnessDate(resource?.current_illness_date);
            setQual1(resource?.qual_1);
            setOtherDate(resource?.other_date);
            setQual2(resource?.qual_2);
            setUnableToWorkStartDate(resource?.unable_to_work_start_date);
            setUnableToWorkEndDate(resource?.unable_to_work_end_date);

            // second column states
            setRefProvName(resource?.ref_prov_name);
            setRefProvAField(resource?.ref_prov_a_field);
            setRefProvNpi(resource?.ref_prov_npi);
            setHospitalizationStartDate(resource?.hospitalization_start_date);
            setHospitalizationEndDate(resource?.hospitalization_end_date);
            setAdditionalClaim(resource?.additional_claim);
            setOutsideLab(resource?.outside_lab);
            setCharges(resource?.charges);

            // third columns states
            setResubmissionCode(resource?.resubmission_code);
            setOriginalRefNumber(resource?.original_ref_number);
            setPriorAuthNumber(resource?.prior_auth_number);
            setFedTaxIdType(resource?.fed_tax_id_type);
            setFedTaxIdNo(resource?.fed_tax_id_no);
            setAcceptAssignment(resource?.accept_assignment);
            setTotalCharge(resource?.total_charge);
            setTotalAmountPaid(resource?.amount_paid);

            // fourth column states
            setServFacName(resource?.serv_fac_name);
            setServFacAddress(resource?.serv_fac_address);
            setServFacPhone(resource?.serv_fac_phone);
            setServFacNpi(resource?.serv_fac_npi);
            setServFacFieldB(resource?.serv_fac_field_b);
            setProvName(resource?.prov_name);
            setProvAddress(resource?.prov_address);
            setProvPhone(resource?.prov_phone);
            setProvNpi(resource?.prov_npi);
            setProvFieldB(resource?.prov_field_b);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const stateOptions = globals.states.map((state) => {
    return (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    );
  });

  const handleCurrentIllenessDateChange = (date) => {
    setCurrentIllnessDate(date);
  };

  const handleOtherDateChange = (date) => {
    setOtherDate(date);
  };

  const handleUnableToWorkStartDateChange = (date) => {
    setUnableToWorkStartDate(date);
  };

  const handleUnableToWorkEndDateChange = (date) => {
    setUnableToWorkEndDate(date);
  };

  const handleHospitalizationStartDateChange = (date) => {
    setHospitalizationStartDate(date);
  };

  const handleHospitalizationEndDateChange = (date) => {
    setHospitalizationEndDate(date);
  };

  return (
    <Grid container item xs={12} className="single-panel">
      <Grid item xs={12}>
        <Grid container direction="row" className="admin-header">
          <Grid item xs={12} lg={6}>
            <h3>Full 1500 Form Information </h3>
          </Grid>
          <Grid
            container
            item
            lg={6}
            direction="row"
            justifyContent="flex-end"
            style={{ flexWrap: "nowrap" }}
          >
            {panelExpanded ? (
              <>
                <span>
                  <Link className="action-icon">
                    <ArrowDropUpIcon className="expand-icon" />
                  </Link>
                </span>
              </>
            ) : (
              <>
                <span>
                  <Link className="action-icon ">
                    <ArrowDropDownIcon className="expand-icon" />
                  </Link>
                </span>
              </>
            )}
          </Grid>
        </Grid>

        <Grid container className="form-body" spacing={1}>
          {/* first column */}
          <Grid item xs={isTablet ? 6 : 3}>
            <Grid container>
              <Grid item xs={12} style={{ marginTop: "10px" }}>
                <InputLabel htmlFor="encounter_type" className="field-label">
                  Is patient&apos;s condition related to:
                </InputLabel>
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ marginTop: "25px" }}>
              <InputLabel htmlFor="gender" className="field-label-1">
                Employment? (Current or previous)
              </InputLabel>
            </Grid>
            <Grid item xs={12} style={{ marginBottom: "10px" }}>
              <Radio
                checked={employmentPresent === true}
                onChange={(event) => setEmploymentPresent(true)}
                value={true}
                name="radio-buttons"
                inputProps={{ "aria-label": "Self" }}
                style={{ paddingLeft: "0px" }}
              />
              Yes
              <Radio
                checked={employmentPresent === false}
                onChange={(event) => setEmploymentPresent(false)}
                value={false}
                name="radio-buttons"
                inputProps={{ "aria-label": "Spouse" }}
              />
              No
            </Grid>

            <Grid container>
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                  <InputLabel htmlFor="gender" className="field-label-1">
                    Auto Accident
                  </InputLabel>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "10px" }}>
                  <Radio
                    checked={accidentPresent === true}
                    onChange={(event) => setAccidentPresent(true)}
                    value={true}
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Self" }}
                    style={{ paddingLeft: "0px" }}
                  />
                  Yes
                  <Radio
                    checked={accidentPresent === false}
                    onChange={(event) => setAccidentPresent(false)}
                    value={false}
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Spouse" }}
                  />
                  No
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid item xs={12}>
                  <InputLabel htmlFor="state" className="field-label-1">
                    Place(State)
                  </InputLabel>
                </Grid>
                <Grid
                  item
                  xs={12}
                  className="field-container"
                  style={{ marginTop: "5px" }}
                >
                  <TextField
                    id="state"
                    value={accidentState}
                    required
                    size="small"
                    variant="outlined"
                    className="field field-2"
                    onChange={(event) => {
                      setAccidentState(event.target.value);
                    }}
                    select
                  >
                    {stateOptions}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ marginTop: "20px" }}>
              <InputLabel htmlFor="gender" className="field-label-1">
                Other Accident?
              </InputLabel>
            </Grid>
            <Grid item xs={12} style={{ marginBottom: "10px" }}>
              <Radio
                checked={otherAccidentPresent === true}
                onChange={(event) => setOtherAccidentPresent(true)}
                value={true}
                name="radio-buttons"
                inputProps={{ "aria-label": "Self" }}
                style={{ paddingLeft: "0px" }}
              />
              Yes
              <Radio
                checked={otherAccidentPresent === false}
                onChange={(event) => setOtherAccidentPresent(false)}
                value={false}
                name="radio-buttons"
                inputProps={{ "aria-label": "Spouse" }}
              />
              No
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel htmlFor="date_of_birth" className="field-label-1">
                  Date of Current Illness, Injury, or Pregnancy (LMP)
                </InputLabel>
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk={true}
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={currentIllnessDate}
                    onChange={handleCurrentIllenessDateChange}
                    className="field field-2"
                    style={{ marginBottom: 0 }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  placeholder="Qual"
                  value={qual1}
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setQual1(event.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel htmlFor="date_of_birth" className="field-label-1">
                  Other Date
                </InputLabel>
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={otherDate}
                    onChange={handleOtherDateChange}
                    className="field field-1"
                    style={{ marginBottom: 0 }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  placeholder="Qual"
                  value={qual2}
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setQual2(event.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="date_of_birth" className="field-label-1">
                  Dates Unable to Work in Current Occupation
                </InputLabel>
              </Grid>
              <Grid item xs={12} style={{ paddingTop: "0" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={unableToWorkStartDate}
                    onChange={handleUnableToWorkStartDateChange}
                    className="field field-1 date-picker"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} className="field-container">
                To
              </Grid>
              <Grid item xs={12} style={{ paddingTop: "0" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={unableToWorkEndDate}
                    onChange={handleUnableToWorkEndDateChange}
                    className="field field-1 date-picker"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={isTablet ? 6 : 3}>
            {/* second column */}
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label-1">
                  Name of Referring Provider or Other Source
                </InputLabel>
              </Grid>

              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  placeholder="Name"
                  value={refProvName}
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setRefProvName(event.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  placeholder="A"
                  value={refProvAField}
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setRefProvAField(event.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  placeholder="NPI"
                  value={refProvNpi}
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setRefProvNpi(event.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="date_of_birth" className="field-label-1">
                  Hospitalization Dates Related to Current Services
                </InputLabel>
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={hospitalizationStartDate}
                    onChange={handleHospitalizationStartDateChange}
                    className="field field-2 date-picker"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} className="field-container">
                TO
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={hospitalizationEndDate}
                    onChange={handleHospitalizationEndDateChange}
                    className="field field-2 date-picker"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label-1">
                  Additional Claim Information
                </InputLabel>
              </Grid>
              <Grid
                item
                xs={10}
                className="field-container"
                style={{ marginTop: "18px" }}
              >
                <TextField
                  id="plan_name"
                  value={additionalClaim}
                  className="field field-2 fixed-width"
                  required
                  minRows={5}
                  onChange={(event) => {
                    setAdditionalClaim(event.target.value);
                  }}
                  style={{ height: "112px" }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <InputLabel htmlFor="gender" className="field-label-1">
                    Outside Lab?
                  </InputLabel>
                </Grid>
                <Grid item xs={12} style={{ marginTop: "10px" }}>
                  <Radio
                    checked={outsideLab === true}
                    onChange={(event) => setOutsideLab(true)}
                    value={true}
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Self" }}
                    style={{ paddingLeft: "0px" }}
                  />
                  Yes
                  <Radio
                    checked={outsideLab === false}
                    onChange={(event) => setOutsideLab(false)}
                    value={false}
                    name="radio-buttons"
                    inputProps={{ "aria-label": "Spouse" }}
                  />
                  No
                </Grid>
              </Grid>

              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <InputLabel htmlFor="state" className="field-label-1">
                    Charges
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="state"
                    value={charges}
                    required
                    size="small"
                    variant="outlined"
                    className="field field-2"
                    onChange={(event) => {
                      setCharges(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={isTablet ? 6 : 3}>
            {/* third column */}
            <Grid container>
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <InputLabel htmlFor="state" className="field-label-1">
                    Resubmission Code
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="state"
                    value={resubmissionCode}
                    required
                    size="small"
                    variant="outlined"
                    className="field field-2"
                    onChange={(event) => {
                      setResubmissionCode(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <InputLabel htmlFor="state" className="field-label-1">
                    Original Ref No.
                  </InputLabel>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <TextField
                    id="state"
                    value={originalRefNumber}
                    required
                    size="small"
                    variant="outlined"
                    className="field field-2"
                    onChange={(event) => {
                      setOriginalRefNumber(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={12}>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label-1">
                  Prior Authorization Number
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={priorAuthNumber}
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setPriorAuthNumber(event.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6}>
                <InputLabel htmlFor="address" className="field-label-1">
                  Federal Tax ID Number
                </InputLabel>
              </Grid>
              <Grid item xs={6}>
                <Radio
                  checked={fedTaxIdType === "ssn"}
                  onChange={(event) => setFedTaxIdType("ssn")}
                  value="ssn"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Self" }}
                />
                SSN
                <Radio
                  checked={fedTaxIdType === "ein"}
                  onChange={(event) => setFedTaxIdType("ein")}
                  value="ein"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Spouse" }}
                />
                EIN
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={fedTaxIdNo}
                  required
                  variant="outlined"
                  className="field field-2"
                  placeholder="Federal Tax #"
                  onChange={(event) => {
                    setFedTaxIdNo(event.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="gender" className="field-label-1">
                Accept Assignment?
              </InputLabel>
            </Grid>
            <Grid item xs={12} style={{ marginBottom: "20px" }}>
              <Radio
                checked={acceptAssignment === true}
                onChange={(event) => setAcceptAssignment(true)}
                value={true}
                name="radio-buttons"
                inputProps={{ "aria-label": "Self" }}
                style={{ paddingLeft: "0px" }}
              />
              Yes
              <Radio
                checked={acceptAssignment === false}
                onChange={(event) => setAcceptAssignment(false)}
                value={false}
                name="radio-buttons"
                inputProps={{ "aria-label": "Spouse" }}
              />
              No
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label-1">
                  Total Charge
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={totalCharge}
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setTotalCharge(event.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label-1">
                  Amount Paid
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={amountPaid}
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setTotalAmountPaid(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={isTablet ? 6 : 3}>
            {/* fourth column */}
            <Grid container>
              <Grid item xs={12}>
                <InputLabel htmlFor="address" className="field-label-1">
                  Service Facility Location Information
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={servFacName}
                  placeholder="Name"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setServFacName(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={servFacAddress}
                  placeholder="Address"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setServFacAddress(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={servFacPhone}
                  placeholder="Phone"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setServFacPhone(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={servFacNpi}
                  placeholder="A/NPI"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setServFacNpi(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={servFacFieldB}
                  placeholder="B"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setServFacFieldB(event.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} style={{ marginTop: "10px" }}>
                <InputLabel htmlFor="address" className="field-label-1">
                  Billing Provider Info and Phone #
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={provName}
                  placeholder="Name"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setProvName(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={provAddress}
                  placeholder="Address"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setProvAddress(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={provPhone}
                  placeholder="Phone"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setProvPhone(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={provNpi}
                  placeholder="A/NPI"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setProvNpi(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} className="field-container">
                <TextField
                  id="address"
                  size="small"
                  value={provFieldB}
                  placeholder="B"
                  required
                  variant="outlined"
                  className="field field-2"
                  onChange={(event) => {
                    setProvFieldB(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Billing1500Panel;
