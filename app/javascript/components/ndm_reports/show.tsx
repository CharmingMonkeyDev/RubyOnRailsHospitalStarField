import DateFnsUtils from "@date-io/date-fns";
import {
  Grid,
  Link,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Checkbox,
  ListItemText,
  FormControlLabel,
} from "@mui/material";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Stack } from "@mui/system";
import * as React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useParams } from "react-router-dom";
import { AuthenticationContext, ImagesContext, FlashContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import { formatToUsDate } from "../utils/DateHelper";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import { toTitleCase } from "../utils/CaseFormatHelper";
import moment from "moment";
import FlashMessage from "../shared/FlashMessage";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "fit-content",
    },
  },
};

interface Props {}

const NdmReportDetail: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const [ndmReport, setNdmReport] = React.useState<any>(null);
  const [filteredNdmReport, setFilteredNdmReport] = React.useState<any>(null);
  const [startDateFilter, setStartDateFilter] = React.useState<any>(null);
  const [endDateFilter, setEndDateFilter] = React.useState<any>(null);
  const [customerFilter, setCustomerFilter] = React.useState<any>([]);
  const [customers, setCustomers] = React.useState<any>([]);
  const [drugFilter, setDrugFilter] = React.useState<any>([]);
  const [filterStarfieldPatients, setFilterStarfieldPatients] =
    React.useState(false);
  const [drugs, setDrugs] = React.useState<any>([]);
  const [diagnosisCodeFilter, setDiagnosisCodeFilter] = React.useState<any>([]);
  const [diagnosisCodes, setDiagnosisCodes] = React.useState<any>([]);
  const [checkedRows, setCheckedRows] = React.useState<any>([]);
  const [reportStatus, setReportStatus] = React.useState<string>(null);
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<
    { originalIndex: number; message: string }[]
  >([]);

  React.useEffect(() => {
    getData();
  }, []);
  const imagesList = React.useContext(ImagesContext);
  const { id } = useParams();

  const getData = async () => {
    const response = await fetch(`/ndm-reports/${id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    });
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    setNdmReport(result.resource.ndm_report);
    setFilteredNdmReport(result.resource.ndm_report);
    populateFilters(result.resource.ndm_report.data);
    setReportStatus(result.resource.ndm_report.status);
  };

  const handleCustomerFilterChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setCustomerFilter(typeof value === "string" ? value.split(",") : value);
  };

  const handleDrugFilterChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setDrugFilter(typeof value === "string" ? value.split(",") : value);
  };

  const handleDiagnosisCodeChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodeFilter(
      typeof value === "string" ? value.split(",") : value
    );
  };

  React.useEffect(() => {
    handleFilter();
  }, [
    customerFilter,
    drugFilter,
    diagnosisCodeFilter,
    startDateFilter,
    endDateFilter,
    filterStarfieldPatients,
  ]);

  const populateFilters = (data) => {
    populateCustomers(data);
    populateDrugs(data);
    populateDiagnosisCodes(data);
  };

  const createBulkPatient = async () => {
    setLoading(true);
    var newErrors = [];

    const element: HTMLElement = document.getElementById("create-bulk");
    element.style.color = "#ff890a";

    const checkedData = filteredNdmReport?.data?.reduce((acc, row, index) => {
      if (checkedRows.includes(index)) {
        acc.push({
          ...row,
          originalIndex: index,
        });
      }
      return acc;
    }, []);

    fetch("/ndm-reports/bulk_patient", {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        data: checkedData,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          if (newErrors.length > 0) {
            setErrors([]);
          } else {
            alert(result.error);
          }
        } else {
          if (result["failed_records"]) {
            result["failed_records"].forEach((error) => newErrors.push(error));
            setFlashMessage({
              message: "Some records failed to create a Patient",
              type: "warning",
            });
          } else if (result["existing_patients"]) {
            result["existing_patients"].forEach((error) =>
              newErrors.push(error)
            );
            setFlashMessage({
              message: "Some records are duplicates",
              type: "warning",
            });
          } else {
            flashContext.setMessage({
              text: "Patients created successfully.",
              type: "success",
            });
          }
          setErrors(newErrors);
        }
        setCheckedRows([]);
        element.style.color = null;
      })
      .finally(() => {
        console.log("Fetch attempt finished.");
        setLoading(false);
      });
  };

  const getCsvData = () => {
    const checkedData = filteredNdmReport?.data?.filter((row, index) =>
      checkedRows.includes(index)
    );

    const formattedData = checkedData?.map(
      ({
        first_name,
        last_name,
        middle_name,
        dob,
        gender,
        address_line_1,
        city,
        state,
        zip,
      }) => ({
        "first_name*": first_name,
        middle_name,
        "last_name*": last_name,
        "birth_date*": format(new Date(dob), "yyyyMMdd"),
        email_adress: "",
        gender,
        "Mobile Phone Number": "",
        address: address_line_1,
        city,
        state,
        zip,
        "Insurance Type": "",
        "Insurance Plan or Program Name": "",
        "Insured's ID #": "",
        "Insured's First Name": "",
        "Insured's Last Name": "",
        "Insured's Date of Birth": "",
        "Insured's Address": "",
        "Insured's City": "",
        "Insured's State": "",
        "Insured's Zip": "",
        "Insured's Phone Number": "",
        "Patient Relationship to Insured": "",
      })
    );

    return formattedData ?? [];
  };

  const populateCustomers = (data) => {
    const uniqueCustomerNames = Array.from(
      new Set(
        data?.flatMap((claim) => {
          const medicalClaimNames = Array.isArray(claim.medical_claims)
            ? claim.medical_claims.map((claim) => claim.customer_name)
            : [];

          const drugClaimNames = Array.isArray(claim.drug_claims)
            ? claim.drug_claims.map((claim) => claim.customer_name)
            : [];

          return [...medicalClaimNames, ...drugClaimNames].filter(Boolean);
        })
      )
    );

    setCustomers(uniqueCustomerNames);
  };

  const populateDrugs = (data) => {
    const uniqueDrugNames = Array.from(
      new Set(
        data?.flatMap((claim) => {
          const drugClaimNames = Array.isArray(claim.drug_claims)
            ? claim.drug_claims.map((claim) => claim.drug_name)
            : [];

          return [...drugClaimNames];
        })
      )
    );

    setDrugs(uniqueDrugNames);
  };

  const populateDiagnosisCodes = (data) => {
    const uniqueDiagnosisCodes = new Set(
      data?.flatMap((person) =>
        (person.medical_claims || []).flatMap(
          (claim) => claim.diagnosis_codes || []
        )
      )
    );

    setDiagnosisCodes(Array.from(uniqueDiagnosisCodes));
  };
  const handleFilter = () => {
    let filteredData = ndmReport?.data;

    if (!!startDateFilter || !!endDateFilter) {
      const startDate = startDateFilter ? new Date(startDateFilter) : null;
      const endDate = endDateFilter ? new Date(endDateFilter) : null;

      filteredData = filteredData?.filter((ndm) => {
        const claims = (ndm?.drug_claims || []).concat(
          ndm?.medical_claims || []
        );

        if (Array.isArray(claims)) {
          return claims.some((claim) => {
            const serviceDate = new Date(claim?.service_date);

            return (
              (!startDate || serviceDate >= startDate) &&
              (!endDate || serviceDate <= endDate)
            );
          });
        } else {
          return false;
        }
      });
    }
    if (customerFilter.length > 0) {
      filteredData = filteredData?.filter((claim) => {
        const claims = (claim?.drug_claims || []).concat(
          claim?.medical_claims || []
        );
        const customerNames = claims.map((c) => c?.customer_name);

        return customerFilter?.some((selectedCustomer) =>
          customerNames?.includes(selectedCustomer)
        );
      });
    }
    if (drugFilter.length > 0) {
      filteredData = filteredData?.filter((claim) => {
        const claims = claim?.drug_claims || [];
        const drugNames = claims?.map((c) => c.drug_name);

        return drugFilter?.some((selectedDrug) =>
          drugNames?.includes(selectedDrug)
        );
      });
    }
    if (diagnosisCodeFilter.length > 0) {
      filteredData = filteredData?.filter((claim) => {
        const claims = claim?.medical_claims || [];
        const diagnosisCodes = claims
          ?.map((medicalClaim) => medicalClaim?.diagnosis_codes)
          ?.flat();

        return diagnosisCodeFilter?.some((selectedCode) =>
          diagnosisCodes?.includes(selectedCode)
        );
      });
    }

    if (filterStarfieldPatients) {
      filteredData = filteredData?.filter((claim) => {
        return claim.starfield_user_id === null;
      });
    }

    setCheckedRows([]);

    setFilteredNdmReport({ ...ndmReport, data: filteredData });
  };

  const resetFilters = () => {
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCustomerFilter([]);
    setDrugFilter([]);
    setDiagnosisCodeFilter([]);
    setFilterStarfieldPatients(false);
  };

  return (
    <div className="main-content-outer">
      <FlashMessage flashMessage={flashMessage} />
      {(!ndmReport || !ndmReport.status) && <div>Loading....</div>}
      {ndmReport?.status === "completed" && (
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          className="main-content"
        >
          <Grid
            item
            xs={12}
            id="provider-action-report"
            className="patient-edit-container patient-edit-form provider-action-report"
          >
            <Grid container>
              <Grid
                className="patient-edit-header"
                container
                justifyContent="space-between"
              >
                <Grid item xs={4}>
                  <p className="secondary-label">NDM Report</p>
                </Grid>
              </Grid>
              <Grid
                container
                className="form-container"
                style={{ paddingTop: "15px", paddingRight: "40px" }}
              >
                <Grid item xs={2} className="left-column">
                  <Card className="box-outlined" variant="outlined">
                    <Link className="report-nav-link" href={`/ndm-report`}>
                      <ArrowBackIosIcon
                        className="report-back-arrow"
                        style={{ verticalAlign: "bottom" }}
                      />
                      Back
                    </Link>
                  </Card>
                  <h3> Date Range </h3>
                  <p>Encounter Date</p>
                  <Grid item xs={12} className="field-container">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        autoOk={true}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={startDateFilter}
                        onChange={(value) => {
                          setStartDateFilter(value);
                        }}
                        className="report-date-input"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={12} className="field-container">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        autoOk={true}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={endDateFilter}
                        onChange={(value) => {
                          setEndDateFilter(value);
                        }}
                        className="report-date-input"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <p>Search</p>
                  <Grid item xs={12}>
                    <FormControl variant="standard" style={{ width: "100%" }}>
                      <InputLabel
                        id="demo-simple-select-helper-label"
                        htmlFor="drug"
                      >
                        Search Drug(s)
                      </InputLabel>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} className="field-container">
                    <FormControl variant="standard" style={{ width: "100%" }}>
                      <Select
                        labelId="drug_filter"
                        id="drug_filter"
                        multiple
                        style={{ width: "100%", marginLeft: 0, paddingTop: 20 }}
                        value={drugFilter}
                        onChange={handleDrugFilterChange}
                        renderValue={(selected: Array<string>) =>
                          selected.join(", ")
                        }
                        MenuProps={MenuProps}
                      >
                        {drugs.map((d, index) => (
                          <MenuItem
                            key={index}
                            value={d}
                            style={{ padding: 10 }}
                          >
                            <Checkbox
                              checked={drugFilter && drugFilter.indexOf(d) > -1}
                            />
                            <ListItemText primary={toTitleCase(d)} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl variant="standard" style={{ width: "100%" }}>
                      <InputLabel
                        id="demo-simple-select-helper-label"
                        htmlFor="drug"
                      >
                        Search Diagnosis Code(s)
                      </InputLabel>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} className="field-container">
                    <FormControl variant="standard" style={{ width: "100%" }}>
                      <Select
                        labelId="diagnosis_code_filter"
                        id="diagnosis_code_filter"
                        multiple
                        style={{ width: "100%", marginLeft: 0, paddingTop: 20 }}
                        value={diagnosisCodeFilter}
                        onChange={handleDiagnosisCodeChange}
                        renderValue={(selected: Array<string>) =>
                          selected.join(", ")
                        }
                        MenuProps={MenuProps}
                      >
                        {diagnosisCodes.map((d, index) => (
                          <MenuItem
                            key={index}
                            value={d}
                            style={{ padding: 1 }}
                          >
                            <Checkbox
                              checked={
                                diagnosisCodeFilter &&
                                diagnosisCodeFilter.indexOf(d) > -1
                              }
                            />
                            <ListItemText primary={d} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} className="field-container">
                    <Button
                      className="basic-button"
                      onClick={handleFilter}
                      style={{ height: "40px" }}
                    >
                      Search
                    </Button>
                  </Grid>
                  <div className="divider-orange"></div>

                  <h3> Filter </h3>

                  <Grid item xs={12} className="field-container">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel
                        id="demo-simple-select-helper-label"
                        htmlFor="customer"
                      >
                        Customer
                      </InputLabel>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    className="field-container"
                    style={{ marginTop: "20px" }}
                  >
                    <FormControl variant="standard" style={{ width: "100%" }}>
                      <Select
                        labelId="customer_filter"
                        id="customer_filter"
                        multiple
                        style={{ width: "100%", marginLeft: 0 }}
                        value={customerFilter}
                        onChange={handleCustomerFilterChange}
                        renderValue={(selected: Array<string>) =>
                          selected.join(", ")
                        }
                        MenuProps={MenuProps}
                      >
                        {customers.map((c) => (
                          <MenuItem key={c} value={c} style={{ padding: 10 }}>
                            <Checkbox
                              checked={
                                customerFilter && customerFilter.indexOf(c) > -1
                              }
                            />
                            <ListItemText primary={c} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: "15px" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filterStarfieldPatients}
                          onClick={() =>
                            setFilterStarfieldPatients(!filterStarfieldPatients)
                          }
                          size="small"
                        />
                      }
                      label={
                        <span style={{ fontSize: "10px" }}>
                          Do not show current Starfield patients
                        </span>
                      }
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item style={{ textAlign: "right" }}>
                    <p
                      onClick={resetFilters}
                      style={{
                        color: "red",
                        marginTop: "30px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Clear Filters
                    </p>
                  </Grid>
                </Grid>
                <Grid item xs={10} className="right-column">
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      className="shadowed-box"
                      style={{ marginTop: "15px" }}
                    >
                      <Grid container>
                        <Grid
                          className="patient-edit-header"
                          container
                          justifyContent="space-between"
                        >
                          <Grid item xs={4}>
                            <p className="secondary-label"> Report Details </p>
                          </Grid>
                          <Grid item xs={2}>
                            <Stack direction="row">
                              <Stack
                                direction="column"
                                onClick={() => {
                                  createBulkPatient();
                                }}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "20px",
                                }}
                                id="create-bulk"
                              >
                                <span
                                  className="text-center"
                                  style={{ marginTop: "10px" }}
                                >
                                  {isLoading ? (
                                    <img
                                      src={imagesList.spinner_src}
                                      style={{ width: "24px" }}
                                    ></img>
                                  ) : (
                                    <PersonAddIcon />
                                  )}
                                </span>
                                <p
                                  style={{
                                    textDecoration: "none",
                                    textAlign: "center",
                                    fontSize: "14px",
                                    margin: "0px",
                                  }}
                                >
                                  Create Patients
                                </p>
                              </Stack>
                              <Link
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  marginTop: "10px",
                                }}
                              >
                                <span>
                                  <ImportExportIcon />
                                </span>
                                <CSVLink
                                  data={getCsvData()}
                                  filename={"patient-details.csv"}
                                  style={{
                                    textDecoration: "none",
                                    textAlign: "center",
                                  }}
                                >
                                  Export CSV
                                </CSVLink>
                              </Link>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <TableContainer
                            component={Paper}
                            className="ndm-reports-table"
                            style={{ overflowX: "auto" }}
                          >
                            <Table
                              className="table"
                              aria-label="collapsible table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  />
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  />
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Import?
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Patient
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    DOB
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    className="table-header"
                                  >
                                    Customer
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Drug
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Drug Name
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    NDC
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Fill Date
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Quantity Dispensed
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Diagnosis Code(s)
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Medicaid ID
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Patient MMIS ID
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Medicaid End Date
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Servicing Provider NPI
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="table-header"
                                  >
                                    Prescriber NPI
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredNdmReport && filteredNdmReport.data ? (
                                  filteredNdmReport.data.map(
                                    (report, index) => {
                                      return (
                                        <CollapsibleTableRow
                                          row={report}
                                          index={index}
                                          checkedRows={checkedRows}
                                          errorMessage={
                                            errors.length > 0 &&
                                            errors.find(
                                              (e) => e.originalIndex === index
                                            )
                                              ? errors.find(
                                                  (e) =>
                                                    e.originalIndex === index
                                                )["error"]
                                              : ""
                                          }
                                          handleRowSelect={(i) => {
                                            if (checkedRows.includes(i)) {
                                              setCheckedRows(
                                                checkedRows.filter(
                                                  (id) => id !== i
                                                )
                                              );
                                            } else {
                                              setCheckedRows([
                                                ...checkedRows,
                                                i,
                                              ]);
                                            }
                                          }}
                                          key={index}
                                        />
                                      );
                                    }
                                  )
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={10}
                                      align="center"
                                      width={"100%"}
                                    >
                                      No data found.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {ndmReport?.status === "invalid" && (
        <div className="resource-catalog">
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="container"
          >
            <Grid item xs={12}>
              <div className="userAdminInformation">
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="stretch"
                  className="adminHeader"
                >
                  <Grid item xs={12} md={6}>
                    <h3>Payer Patient Data Import</h3>
                  </Grid>
                </Grid>
                <div className="divider"></div>
                <div
                  className="userAdminInformation"
                  style={{ margin: "20px" }}
                >
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    className="adminHeader"
                  >
                    <Grid item xs={12} md={6}>
                      <h3>Failed Data Report</h3>
                    </Grid>
                  </Grid>
                  <div className="divider"></div>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="stretch"
                  >
                    <Grid item xs={12}>
                      <div className="careHeader">
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-start"
                        >
                          <Grid item xs={12} md={12}>
                            <p
                              style={{
                                textAlign: "left",
                                font: "16px QuicksandMedium",
                                marginBottom: 30,
                              }}
                            >
                              {formatToUsDate(new Date())} <br />
                              {moment(ndmReport.created_at).format(
                                "MM/DD/YY HH:mm A"
                              )}{" "}
                              upload started <br />
                              {moment(ndmReport.updated_at).format(
                                "MM/DD/YY HH:mm A"
                              )}{" "}
                              upload ended
                            </p>
                            <p
                              style={{
                                textAlign: "left",
                                font: "16px QuicksandMedium",
                                marginBottom: 30,
                              }}
                            >
                              Failed Data:
                            </p>
                            <TableContainer
                              component={Paper}
                              style={{ marginRight: 20 }}
                            >
                              <Table aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="left">
                                      <strong
                                        style={{
                                          fontFamily: "QuicksandMedium",
                                        }}
                                      >
                                        Name
                                      </strong>
                                    </TableCell>
                                    <TableCell align="left">
                                      <strong
                                        style={{
                                          fontFamily: "QuicksandMedium",
                                        }}
                                      >
                                        Reason Failed
                                      </strong>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {ndmReport.issues?.map((error, index) => (
                                    <TableRow
                                      key={index}
                                      className={
                                        index % 2 == 0 ? "rowEven" : "row"
                                      }
                                    >
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                          fontFamily: "QuicksandMedium",
                                          fontSize: 12,
                                          paddingLeft: 10,
                                          paddingRight: 10,
                                        }}
                                      >
                                        {error.param}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          fontFamily: "QuicksandMedium",
                                          fontSize: 12,
                                          paddingLeft: 10,
                                          paddingRight: 10,
                                        }}
                                      >
                                        {error.reason}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      )}
      {ndmReport?.status === "processing" && (
        <div className="resource-catalog">
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="container"
          >
            <Grid item xs={12}>
              Processing...
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

const CollapsibleTableRow = ({
  row,
  index,
  checkedRows,
  handleRowSelect,
  errorMessage,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const claims = (row.drug_claims || []).concat(row.medical_claims || []);

  const handleToggle = () => {
    setOpen(!open);
  };

  const onCheckboxChange = (event) => {
    event.stopPropagation();
    handleRowSelect(index);
  };

  return (
    <>
      <TableRow
        onClick={handleToggle}
        style={{
          background:
            errorMessage.length > 0
              ? "#FFFF00"
              : checkedRows.includes(index)
              ? "#efe9e7"
              : "none",
        }}
        id={`table-row-${index}`}
      >
        <TableCell
          className="table-row"
          style={
            claims.length > 1 && errorMessage.length > 0
              ? { position: "relative", height: "3.5rem" }
              : { position: "relative", height: "3.5rem" }
          }
        >
          {claims.length > 1 ? (
            <div>
              <IconButton aria-label="expand row" size="small">
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
              <p style={{ marginTop: "-5px" }}>
                <small>
                  {claims.length} of {claims.length}
                </small>
              </p>
              <div
                className="error-container"
                style={
                  errorMessage.length > 0
                    ? {
                        position: "absolute",
                        color: "#ff0000",
                        bottom: ".5rem",
                      }
                    : {}
                }
              >
                {errorMessage.length > 0 ? `Failed: ${errorMessage}` : ""}
              </div>
            </div>
          ) : (
            <div
              className="error-container"
              style={
                errorMessage.length > 0
                  ? { position: "absolute", color: "#ff0000", bottom: ".5rem" }
                  : {}
              }
            >
              {errorMessage.length > 0 ? `Failed: ${errorMessage}` : ""}
            </div>
          )}
        </TableCell>
        <TableCell className="table-row">
          {row.starfield_user_id ? props.small_logo_src : null}
        </TableCell>
        <TableCell className="table-row">
          <Checkbox
            checked={checkedRows.includes(index)}
            onChange={onCheckboxChange}
            onClick={(event) => event.stopPropagation()}
          />
        </TableCell>
        <TableCell className="table-row">{`${row.last_name}, ${row.first_name}`}</TableCell>
        <TableCell className="table-row">{formatToUsDate(row.dob)}</TableCell>
        {claims && claims.length > 1 ? (
          <>
            <TableCell className="table-row">
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>{claims[0].customer_name}</p>
                </div>
              )}
              <Collapse in={open} timeout="auto" unmountOnExit>
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>{claim.customer_name}</p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>
            <TableCell className="table-row">
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>{claims[0].drug}</p>
                </div>
              )}
              <Collapse in={open} timeout="auto" unmountOnExit>
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>{claim.drug}</p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>
            <TableCell className="table-row">
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>{toTitleCase(claims[0].drug_name)}</p>
                </div>
              )}
              <Collapse in={open} timeout="auto" unmountOnExit>
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>{toTitleCase(claim.drug_name)}</p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>
            <TableCell className="table-row">
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>{claims[0].ndc_code}</p>
                </div>
              )}
              <Collapse in={open} timeout="auto" unmountOnExit>
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>{claim.ndc_code}</p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>

            <TableCell className="table-row">
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>
                    {claims[0].service_date
                      ? formatToUsDate(claims[0].service_date)
                      : null}
                  </p>
                </div>
              )}
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                collapsedSize={100}
              >
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>
                        {claim.service_date
                          ? formatToUsDate(claim.service_date)
                          : null}
                      </p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>

            <TableCell className="table-row">
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>{claims[0].quantity_dispensed}</p>
                </div>
              )}
              <Collapse in={open} timeout="auto" unmountOnExit>
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>{claim.quantity_dispensed}</p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>

            <TableCell className="table-row">
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>{claims[0].diagnosis_codes?.join(", ")}</p>
                </div>
              )}
              <Collapse in={open} timeout="auto" unmountOnExit>
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>{claim.diagnosis_codes?.join(", ")}</p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>
            <TableCell className="table-row">{row.medicaid_id}</TableCell>
            <TableCell className="table-row">{row.mmis_id}</TableCell>
            <TableCell className="table-row">{row.medicaid_end_date}</TableCell>
            <TableCell>
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>{claims[0].servicing_provider_npi}</p>
                </div>
              )}
              <Collapse in={open} timeout="auto" unmountOnExit>
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>{claim.servicing_provider_npi}</p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>
            <TableCell>
              {!open && claims && claims.length > 0 && (
                <div>
                  <p>{claims[0].prescribing_provider_npi}</p>
                </div>
              )}
              <Collapse in={open} timeout="auto" unmountOnExit>
                {claims &&
                  claims.map((claim, index) => (
                    <div key={index}>
                      <p>{claim.prescribing_provider_npi}</p>
                    </div>
                  ))}
              </Collapse>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
          </>
        )}
      </TableRow>
    </>
  );
};

export default NdmReportDetail;
