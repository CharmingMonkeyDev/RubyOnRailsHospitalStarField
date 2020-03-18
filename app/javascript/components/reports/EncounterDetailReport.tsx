// libs
import * as React from "react";
import {
  Grid,
  Link,
  InputLabel,
  MenuItem,
  Card,
  FormControl,
  Select,
  Button,
  Switch,
  Box,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ImportExportIcon from "@mui/icons-material/ImportExport";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

// helpers import
import { formatToUsDateFromUTC } from "../utils/DateHelper";
import { snakeCaseToTitleCase, toTitleCase } from "../utils/CaseFormatHelper";
import { useRef, useState } from "react";
import { PrivilegesContext } from "../PrivilegesContext";
import { checkPrivileges } from "../utils/PrivilegesHelper";
import { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Props {}

const EncounterDetailReport: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);

  // first mount  controller
  const isInitialMount = useRef(true);

  // other states
  const [customer, setCustomer] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [encounterType, setEncounterType] = useState("");
  const [billingCode, setBillingCode] = useState("");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

  // data
  const [imData, setImData] = useState<any>([]);

  // filter options
  const [customerOptions, setCustomerOptions] = useState<any>();
  const [associatedCustomerOptions, setAssociatedCustomerOptions] =
    useState<any>();
  const [allCustomerOptions, setAllCustomerOptions] = useState<any>();
  const [insuranceTypeOptions, setInsuranceTypeOptions] = useState<any>();
  const [encounterTypeOptions, setEncounterTypeOptions] = useState<any>();
  const [billingCodeOptions, setBillingCodeOptions] = useState<any>();
  const [adminReport, setAdminReport] = useState(false);
  const userPrivileges = React.useContext(PrivilegesContext);

  const columns: GridColDef[] = [
    {
      field: "",
      headerName: "",
      width: 40,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "customer_name",
      headerName: "Customer Name",
      disableColumnMenu: true,
      minWidth: 200,
    },
    {
      field: "customer_county",
      headerName: "Customer County",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "first_name",
      headerName: "First Name",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "middle_name",
      headerName: "Middle Name",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "date_of_birth",
      headerName: "Date of Birth",
      description: "Date of Birth",
      width: 170,
      disableColumnMenu: true,
      valueFormatter: (params) => {
        return formatToUsDateFromUTC(params?.value);
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "mrn_number",
      headerName: "MRN",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "address",
      headerName: "Address",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "city",
      headerName: "City",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "state",
      headerName: "State",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "zip",
      headerName: "ZIP Code",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "county",
      headerName: "County",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "race",
      headerName: "Race",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "ethnicity",
      headerName: "Ethnicity",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "insurance_type",
      headerName: "Insurance Type",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "plan_name",
      headerName: "Insurance Name",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "insured_id",
      headerName: "Insurance ID#",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "provider_name",
      headerName: "Provider Name",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },

    {
      field: "day_of_encounter",
      headerName: "Encounter Date",
      type: "string",
      width: 200,
      disableColumnMenu: true,
      valueFormatter: (params) => {
        if (params.value) {
          return formatToUsDateFromUTC(params?.value);
        }
      },
    },
    {
      field: "encounter_type",
      headerName: "Encounter Type",
      type: "string",
      width: 200,
      disableColumnMenu: true,
      valueFormatter: (params) => {
        if (params.value) {
          return snakeCaseToTitleCase(params?.value);
        }
      },
    },
    {
      field: "place_of_service",
      headerName: "Place of Service",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "date_claim_sent",
      headerName: "Claim Date Sent",
      type: "string",
      width: 200,
      disableColumnMenu: true,
      valueFormatter: (params) => {
        if (params.value) {
          return formatToUsDateFromUTC(params?.value);
        }
      },
    },
    {
      field: "cpt_codes",
      headerName: "Billing CPT Code(s)",
      type: "string",
      width: 200,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params?.value) {
          return (
            <div style={{ whiteSpace: "pre-wrap" }}>
              {params?.value.replace(", ", "\n")}
            </div>
          );
        }
      },
    },
    {
      field: "diagnosis_codes",
      headerName: "Diagnosis Codes",
      type: "string",
      width: 200,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params?.value) {
          return (
            <div style={{ whiteSpace: "pre-wrap" }}>
              {params?.value.replace(", ", "\n")}
            </div>
          );
        }
      },
    },
    {
      field: "modifier",
      headerName: "Modifier",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "rendering_provider",
      headerName: "Rendering Provider",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "total_charge",
      headerName: "Charge Dollar Amount",
      type: "string",
      width: 200,
      disableColumnMenu: true,
      valueFormatter: (params) => {
        if (params.value) {
          return `$${params?.value}`;
        }
      },
    },
  ];

  React.useEffect(() => {
    getAssets();
  }, []);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      getData();
    }
  }, [customer, insuranceType, encounterType, billingCode]);

  React.useEffect(() => {
    if (adminReport) {
      setCustomerOptions(allCustomerOptions);
    } else {
      setCustomerOptions(associatedCustomerOptions);
    }
  }, [adminReport]);

  const getAssets = () => {
    fetch(`/admin/reports/encounter_detail/assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setCustomerOptions(result?.resource?.customers);
          setAllCustomerOptions(result?.resource?.all_customers);
          setAssociatedCustomerOptions(result?.resource?.customers);
          setInsuranceTypeOptions(result?.resource?.insurance_types);
          setEncounterTypeOptions(result?.resource?.encounter_types);
          setBillingCodeOptions(result?.resource?.billing_codes);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = () => {
    fetch(
      `/admin/reports/encounter_detail/report_data?` +
        new URLSearchParams({
          customer_id: customer,
          encounter_type: encounterType,
          insurance_type: insuranceType,
          billing_code: billingCode,
          start_date: startDate ? startDate.toString() : "",
          end_date: endDate ? endDate.toString() : "",
          admin_report: adminReport ? "1" : "0",
        }),
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setImData(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearchSave = () => {
    getData();
  };

  return (
    <div className="main-content-outer">
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
                <p className="secondary-label">Encounter Detail Report</p>
              </Grid>
            </Grid>
            <Grid
              container
              className="form-container"
              style={{ paddingTop: "15px", paddingRight: "40px" }}
            >
              {/* column 1 */}
              <Grid item xs={2} className="left-column">
                <Card className="box-outlined" variant="outlined">
                  <Link className="report-nav-link" href={`/reports`}>
                    <ArrowBackIosIcon
                      className="report-back-arrow"
                      style={{ verticalAlign: "bottom" }}
                    />
                    Back
                  </Link>
                </Card>
                <h3> Date Range </h3>

                <p>Encounter Date Range</p>

                <Grid item xs={12} className="field-container">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        width: "100%",
                      }}
                    >
                      <DemoContainer
                        components={["DatePicker", "DatePicker"]}
                        sx={{ height: "50px" }}
                      >
                        <DatePicker
                          value={startDate}
                          onChange={(value) => {
                            setStartDate(value);
                          }}
                          slotProps={{
                            textField: {
                              variant: "standard",
                            },
                          }}
                          className="report-date-input"
                        />
                      </DemoContainer>
                    </Box>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} className="field-container">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        width: "100%",
                      }}
                    >
                      <DemoContainer
                        components={["DatePicker", "DatePicker"]}
                        sx={{ height: "50px" }}
                      >
                        <DatePicker
                          value={endDate}
                          onChange={(value) => {
                            setEndDate(value);
                          }}
                          slotProps={{
                            textField: {
                              variant: "standard",
                            },
                          }}
                          className="report-date-input"
                        />
                      </DemoContainer>
                    </Box>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} className="field-container">
                  <Button
                    className="basic-button"
                    onClick={handleSearchSave}
                    style={{ height: "40px" }}
                  >
                    Search
                  </Button>
                </Grid>

                <div className="divider-orange"></div>

                <h3> Filters </h3>

                <Grid item xs={12} className="field-container">
                  <FormControl variant="standard" style={{ width: "100%" }}>
                    <InputLabel
                      id="demo-simple-select-helper-label"
                      htmlFor="customer_id"
                    >
                      Customer
                    </InputLabel>
                    <Select
                      labelId="customer_id"
                      id="customer_id"
                      value={customer}
                      label="Customer"
                      onChange={(event) => {
                        setCustomer(event.target.value.toString());
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      <MenuItem
                        aria-label="None"
                        value=""
                        style={{ padding: 10 }}
                      >
                        Select
                      </MenuItem>
                      {customerOptions?.map((customer, index) => (
                        <MenuItem
                          key={index}
                          value={customer.id}
                          style={{ padding: 10 }}
                        >
                          {customer.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  className="field-container"
                  style={{ marginTop: "20px" }}
                >
                  <FormControl variant="standard" style={{ width: "100%" }}>
                    <InputLabel
                      id="demo-simple-select-helper-label"
                      htmlFor="insurance_type"
                    >
                      Insurance Type
                    </InputLabel>
                    <Select
                      labelId="insurance_type"
                      id="insurance_type"
                      value={insuranceType}
                      label="Insurance Type"
                      onChange={(event) => {
                        setInsuranceType(event.target.value.toString());
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      <MenuItem
                        aria-label="None"
                        value=""
                        style={{ padding: 10 }}
                      >
                        Select
                      </MenuItem>
                      {insuranceTypeOptions?.map((ito, index) => (
                        <MenuItem
                          key={index}
                          value={ito}
                          style={{ padding: 10 }}
                        >
                          {ito}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  className="field-container"
                  style={{ marginTop: "20px" }}
                >
                  <FormControl variant="standard" style={{ width: "100%" }}>
                    <InputLabel
                      id="demo-simple-select-helper-label"
                      htmlFor="encounter_type"
                    >
                      Encounter Type
                    </InputLabel>
                    <Select
                      labelId="encounter_type"
                      id="encounter_type"
                      value={encounterType}
                      label="Action Status"
                      onChange={(event) => {
                        setEncounterType(event.target.value.toString());
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      <MenuItem
                        aria-label="None"
                        value=""
                        style={{ padding: 10 }}
                      >
                        Select
                      </MenuItem>
                      {encounterTypeOptions?.map((type, index) => (
                        <MenuItem
                          key={index}
                          value={type}
                          style={{ padding: 10, textTransform: "capitalize" }}
                        >
                          {toTitleCase(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  className="field-container"
                  style={{ marginTop: "20px" }}
                >
                  <FormControl variant="standard" style={{ width: "100%" }}>
                    <InputLabel
                      id="demo-simple-select-helper-label"
                      htmlFor="billing_code"
                    >
                      Billing Code
                    </InputLabel>
                    <Select
                      labelId="billing_code"
                      id="billing_code"
                      value={billingCode}
                      label="Billing Code"
                      onChange={(event) => {
                        setBillingCode(event.target.value.toString());
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      <MenuItem
                        aria-label="None"
                        value=""
                        style={{ padding: 10 }}
                      >
                        Select
                      </MenuItem>
                      {billingCodeOptions?.map((code, index) => {
                        return (
                          code && (
                            <MenuItem
                              key={index}
                              value={code}
                              style={{
                                padding: 10,
                                textTransform: "capitalize",
                              }}
                            >
                              {toTitleCase(code)}
                            </MenuItem>
                          )
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {/* column 2 */}
              <Grid item xs={10} className="right-column">
                {/* overview row */}
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
                        <Grid item>
                          <p className="secondary-label"> Report Details </p>
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            justifyContent="flex-end"
                            alignItems="center"
                            style={{ paddingRight: 10 }}
                          >
                            {checkPrivileges(
                              userPrivileges,
                              "Admin Level Reporting"
                            ) && (
                              <div
                                className="privilegeToggle"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  marginRight: 40,
                                  fontSize: "14px",
                                }}
                              >
                                <span>
                                  <Switch
                                    value={adminReport}
                                    checked={adminReport}
                                    onChange={() =>
                                      setAdminReport(!adminReport)
                                    }
                                    color="primary"
                                  />
                                </span>
                                <span>Admin Reporting</span>
                              </div>
                            )}

                            <Link
                              href={`/admin/reports/encounter_detail/generate_csv.csv?${new URLSearchParams(
                                {
                                  customer_id: customer,
                                  encounter_type: encounterType,
                                  insurance_type: insuranceType,
                                  billing_code: billingCode,
                                  start_date: startDate
                                    ? startDate.toString()
                                    : "",
                                  end_date: endDate ? endDate.toString() : "",
                                  admin_report: adminReport ? "1" : "0",
                                }
                              )}`}
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
                              <span>Export CSV</span>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid className="action-table-container">
                        <div style={{ height: "auto", width: "100%" }}>
                          {imData?.length >= 1 && (
                            <DataGrid
                              rows={imData}
                              columns={columns}
                              pageSize={20}
                              rowsPerPageOptions={[5]}
                              autoHeight={true}
                              rowHeight={78}
                              pagination={true}
                              getRowId={(row) =>
                                `${row.id}-${row.customer_name}`
                              }
                            />
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default EncounterDetailReport;
