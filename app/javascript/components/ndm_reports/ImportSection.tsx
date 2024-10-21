import {
  Button,
  Grid,
  Input,
  Link,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import * as React from "react";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";
interface Props {
  onImport: Function;
}

const ImportSection: React.FC<Props> = (props: any) => {
  const [reportType, setReportType] = React.useState<string>("report_type");
  const [providerFile, setProviderFile] = React.useState<any>();
  const [patientEligibilityFile, setPatientEligibilityFile] =
    React.useState<any>();
  const [drugClaimFile, setDrugClaimFile] = React.useState<any>();
  const [medicalClaimFile, setMedicalClaimFile] = React.useState<any>();
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const [processing, setProcessing] = React.useState(false);

  const handleImport = () => {
    if (!validateFiles()) {
      flashContext.setMessage({
        text: "All 4 files are required.",
        type: "error",
      });
      return;
    }
    setProcessing(true);
    const formData = new FormData();
    formData.append("provider_data", providerFile);
    formData.append("patient_eligibility_data", patientEligibilityFile);
    formData.append("drug_claim_data", drugClaimFile);
    formData.append("medical_claim_data", medicalClaimFile);

    fetch(`/process-ndm-reports`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "X-CSRF-Token": authenticationSetting.csrfToken,
        "X-Frame-Options": "sameorigin",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Content-Security-Policy": "default-src 'self'",
      },
      body: formData,
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          flashContext.setMessage({
            text: result.message,
            type: "success",
          });
          setReportType("report_type");
          props.onImport();
        }
        setProcessing(false);
      })
      .catch((error) => {
        setProcessing(false);
        console.error(error);
        flashContext.setMessage({
          text: error.message,
          type: "error",
        });
      });
  };

  const validateFiles = () => {
    return (
      !!medicalClaimFile &&
      !!drugClaimFile &&
      !!patientEligibilityFile &&
      !!providerFile
    );
  };

  return (
    <div className="adminFunctions">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container"
      >
        <Grid
          container
          item
          xs={11}
          className="userAdminInformation"
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          style={{ paddingBottom: 30 }}
        >
          <Grid item xs={12}>
            <h3 style={{ paddingLeft: 16 }}>Payer Patient Data Import</h3>
            <div
              className="divider-orange"
              style={{ margin: "0px", width: "100%" }}
            ></div>
            <Grid container style={{ paddingLeft: 16 }}>
              <Grid item xs={12}>
                <p>Use the payer patient data import to import patient data</p>
              </Grid>
              {reportType === "report_type" && (
                <>
                  <Grid item xs={12} style={{ marginTop: 10 }}>
                    <b>Select Payer Patient Data Import Type</b>
                  </Grid>
                  <TextField
                    id="role"
                    className="the-field"
                    style={{ width: "30%", marginTop: 10 }}
                    value={reportType}
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                      setReportType(event.target.value.toString());
                    }}
                    select
                  >
                    <MenuItem value={"report_type"}>Report Type</MenuItem>
                    <MenuItem value="ndm_report">
                      North Dakota Medicaid
                    </MenuItem>
                  </TextField>
                  <Grid item xs={12} style={{ marginTop: 10 }}>
                    <Link
                      className="menuLink"
                      style={{ width: "200px", backgroundColor: "#e0e0e0", color: "#8b8b8b"}}
                      onClick={undefined}
                    >
                      Import
                    </Link>
                  </Grid>
                </>
              )}
              {reportType === "ndm_report" && (
                <>
                  <Grid
                    container
                    item
                    xs={12}
                    style={{ marginTop: 10 }}
                    spacing={2}
                  >
                    <Grid item md={6}>
                      <p>
                        <b>Select Provider File</b>
                      </p>
                      <div className="import-button-continer">
                        <Grid container>
                          <Grid item xs={6} className="import-file-name">
                            <p>
                              {!!providerFile
                                ? `${providerFile.name?.substring(0, 30)}...`
                                : "Please select a file"}
                            </p>
                          </Grid>
                          <Grid item xs={6}>
                            <input
                              type="file"
                              accept={".csv"}
                              onChange={(event) => {
                                setProviderFile(event.target.files[0]);
                              }}
                              style={{ display: "none", height: "42px" }}
                              id="file-input"
                            />
                            <label
                              htmlFor="file-input"
                              style={{ width: "50%" }}
                            >
                              <Button className="btn-import" component="span">
                                Browse Files
                              </Button>
                            </label>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    <Grid item md={6}>
                      <p>
                        <b>Select Patient Eligibility File</b>
                      </p>
                      <div className="import-button-continer">
                        <Grid container>
                          <Grid item xs={6} className="import-file-name">
                            <p>
                              {!!patientEligibilityFile
                                ? `${patientEligibilityFile.name?.substring(
                                    0,
                                    30
                                  )}...`
                                : "Please select a file"}
                            </p>
                          </Grid>
                          <Grid item xs={6}>
                            <input
                              type="file"
                              accept={".csv"}
                              onChange={(event) => {
                                setPatientEligibilityFile(
                                  event.target.files[0]
                                );
                              }}
                              style={{ display: "none", height: "42px" }}
                              id="patient-eligibility-file-input"
                            />
                            <label
                              htmlFor="patient-eligibility-file-input"
                              style={{ width: "50%" }}
                            >
                              <Button className="btn-import" component="span">
                                Browse Files
                              </Button>
                            </label>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    <Grid item md={6}>
                      <p>
                        <b>Select Drug Claim File</b>
                      </p>
                      <div className="import-button-continer">
                        <Grid container>
                          <Grid item xs={6} className="import-file-name">
                            <p>
                              {!!drugClaimFile
                                ? `${drugClaimFile.name?.substring(0, 30)}...`
                                : "Please select a file"}
                            </p>
                          </Grid>
                          <Grid item xs={6}>
                            <input
                              type="file"
                              accept={".csv"}
                              onChange={(event) => {
                                setDrugClaimFile(event.target.files[0]);
                              }}
                              style={{ display: "none", height: "42px" }}
                              id="drug-claim-file-input"
                            />
                            <label
                              htmlFor="drug-claim-file-input"
                              style={{ width: "50%" }}
                            >
                              <Button className="btn-import" component="span">
                                Browse Files
                              </Button>
                            </label>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    <Grid item md={6}>
                      <p>
                        <b>Select Medical Claim File</b>
                      </p>
                      <div className="import-button-continer">
                        <Grid container>
                          <Grid item xs={6} className="import-file-name">
                            <p>
                              {!!medicalClaimFile
                                ? `${medicalClaimFile.name?.substring(
                                    0,
                                    30
                                  )}...`
                                : "Please select a file"}
                            </p>
                          </Grid>
                          <Grid item xs={6}>
                            <input
                              type="file"
                              accept={".csv"}
                              onChange={(event) => {
                                setMedicalClaimFile(event.target.files[0]);
                              }}
                              style={{ display: "none", height: "42px" }}
                              id="medical-claim-file-input"
                            />
                            <label
                              htmlFor="medical-claim-file-input"
                              style={{ width: "50%" }}
                            >
                              <Button className="btn-import" component="span">
                                Browse Files
                              </Button>
                            </label>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justifyContent="center"
                    style={{ marginTop: 30 }}
                  >
                    <Grid item>
                      <Link
                        className="btn-cancel"
                        style={{ width: "200px" }}
                        onClick={() => setReportType("report_type")}
                      >
                        Cancel
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link
                        className={processing ? "btn-disabled" : "btn-regular"}
                        style={{ width: "200px" }}
                        onClick={processing ? undefined : handleImport}
                      >
                        Import
                      </Link>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ImportSection;