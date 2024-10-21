/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link, Radio, Typography } from "@mui/material";

// Componenets import
import PatienInsuranceEdit from "./PatientInsuranceEdit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

// App setting imports
import { AuthenticationContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patient_id: string;
  pencil_grey: string;
  insuranceReloader: boolean;
  setInsuranceReloader: any;
}

const insuranceInfoSection = (label, value) => {
  return (
    <>
      <Typography variant="body1" className="info-label">
        {label}
      </Typography>
      <Typography variant="subtitle1" className="info-value">
        {value}
      </Typography>
    </>
  );
};

const PatientInsuranceShow: React.FC<Props> = (props: any) => {
  // authenticationContext
  const authenticationSetting = React.useContext(AuthenticationContext);

  // states
  const [patientInsurance, setPatientInsurance] = React.useState<any>(null);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [panelExpanded, setPanelExpanded] = React.useState<boolean>(false);

  React.useEffect(() => {
    getPatientInsurance();
  }, [props.patient_id, props.insuranceReloader]);

  const getPatientInsurance = () => {
    fetch(`/data_fetching/patient_insurances/${props.patient_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setPatientInsurance(result.resource?.patient_insurance);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {editMode ? (
        <PatienInsuranceEdit
          patient_id={props.patient_id}
          setEditMode={setEditMode}
          insuranceReloader={props.insuranceReloader}
          setInsuranceReloader={props.setInsuranceReloader}
        />
      ) : (
        <Grid container className="insurance-show-container">
          <Grid container className="information-container">
            <Grid container direction="row" className="admin-header">
              <Grid item xs={12} lg={6}>
                <h3>Insurance Information</h3>
              </Grid>

              {panelExpanded ? (
                <Grid
                  container
                  item
                  lg={6}
                  direction="row"
                  justifyContent="flex-end"
                  style={{ flexWrap: "nowrap" }}
                >
                  <span>
                    <Link
                      className="action-icon"
                      onClick={() => setEditMode(true)}
                    >
                      <img
                        src={props.pencil_grey}
                        width="35"
                        alt="Edit Patient"
                      />
                      {patientInsurance ? <p>Edit</p> : <p>Add</p>}
                    </Link>
                  </span>
                  <span>
                    <Link
                      className="action-icon"
                      onClick={() => setPanelExpanded(false)}
                    >
                      <ArrowDropUpIcon className="expand-icon" />
                    </Link>
                  </span>
                </Grid>
              ) : (
                <Grid
                  container
                  item
                  lg={6}
                  direction="row"
                  justifyContent="flex-end"
                  style={{ flexWrap: "nowrap" }}
                  onClick={() => setPanelExpanded(true)}
                >
                  <span>
                    <Link
                      className="action-icon "
                      onClick={() => setPanelExpanded(true)}
                    >
                      <ArrowDropDownIcon className="expand-icon" />
                    </Link>
                  </span>
                </Grid>
              )}
            </Grid>
            {panelExpanded && (
              <>
                <div className="divider"></div>
                {patientInsurance ? (
                  <Grid container className="table-container">
                    <Grid item xs={6} className="patient-info-left-container">
                      {insuranceInfoSection(
                        "Insurance type",
                        patientInsurance?.insurance_type
                      )}
                      {insuranceInfoSection(
                        "Insurance Plan or Program Name",
                        patientInsurance?.plan_name
                      )}
                      {insuranceInfoSection(
                        "Insured's ID #",
                        patientInsurance?.insured_id
                      )}
                      <Grid item xs={12}>
                        <Typography variant="body1" className="info-label">
                          Patient Relationship to Insured
                        </Typography>
                      </Grid>
                      <Grid container item xs={12}>
                        <Grid item xs={4}>
                          <div>
                            <Radio
                              checked={
                                patientInsurance?.relationship === "self"
                              }
                              value="self"
                              name="radio-buttons"
                              inputProps={{ "aria-label": "Self" }}
                              style={{ backgroundColor: "transparent" }}
                            />
                            Self
                          </div>
                          <div>
                            <Radio
                              checked={
                                patientInsurance?.relationship === "spouse"
                              }
                              value="spouse"
                              name="radio-buttons"
                              inputProps={{ "aria-label": "Spouse" }}
                              style={{ backgroundColor: "transparent" }}
                            />
                            Spouse
                          </div>
                        </Grid>

                        <Grid item xs={4}>
                          <div>
                            <Radio
                              checked={
                                patientInsurance?.relationship === "child"
                              }
                              value="child"
                              name="radio-buttons"
                              inputProps={{ "aria-label": "Child" }}
                              style={{ backgroundColor: "transparent" }}
                            />
                            Child
                          </div>

                          <div>
                            <Radio
                              checked={
                                patientInsurance?.relationship === "other"
                              }
                              value="other"
                              name="radio-buttons"
                              inputProps={{ "aria-label": "Other" }}
                              style={{ backgroundColor: "transparent" }}
                            />
                            Other
                          </div>
                        </Grid>
                      </Grid>

                      {insuranceInfoSection(
                        "Insured's Name*",
                        patientInsurance?.insured_name
                      )}
                    </Grid>
                    <Grid item xs={5} className="patient-info-right-container">
                      {insuranceInfoSection(
                        "Insured's Date of Birth*",
                        patientInsurance?.formatted_insured_dob
                      )}
                      {insuranceInfoSection(
                        "Insured's Address*",
                        patientInsurance?.address
                      )}
                      {insuranceInfoSection("City*", patientInsurance?.city)}
                      <Grid container>
                        <Grid item xs={6}>
                          {insuranceInfoSection(
                            "State*",
                            patientInsurance?.state
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          {insuranceInfoSection("Zip*", patientInsurance?.zip)}
                        </Grid>
                      </Grid>
                      {insuranceInfoSection(
                        "Insured's Phone Number*",
                        patientInsurance?.phone_number
                      )}
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container className="table-container">
                    <Grid item xs={6} className="patient-info-left-container">
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          className="info-label insurance-label"
                        >
                          Patient insurance not available. Please add insurance
                          information.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default PatientInsuranceShow;
