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
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ImportExportIcon from "@mui/icons-material/ImportExport";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

// helpers import
import { formatToUsDateFromUTC } from "../utils/DateHelper";
import { toTitleCase } from "../utils/CaseFormatHelper";
import { useContext, useEffect, useRef, useState } from "react";
import { checkPrivileges } from "../utils/PrivilegesHelper";
import { PrivilegesContext } from "../PrivilegesContext";

interface Props {}

const BasicPatientDemographicReport: React.FC<Props> = (props: any) => {
  const authenticationSetting = useContext(AuthenticationContext);

  // first mount  controller
  const isInitialMount = useRef(true);

  // other states
  const [customer, setCustomer] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [linkedToIIS, setLinkedToIIS] = useState("");
  const [linkedToHIE, setLinkedToHIE] = useState("");
  const [adminReport, setAdminReport] = useState(false);
  const userPrivileges = React.useContext(PrivilegesContext);

  // data
  const [data, setData] = useState<any>([]);

  // filter options
  const [customerOptions, setCustomerOptions] = useState<any>();
  const [associatedCustomerOptions, setAssociatedCustomerOptions] = useState<any>();
  const [allCustomerOptions, setAllCustomerOptions] = useState<any>();
  const [insuranceTypeOptions, setInsuranceTypeOptions] = useState<any>();

  const columns: GridColDef[] = [
    {
      field: "",
      headerName: "",
      width: 40,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "name",
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
        return params?.value ? formatToUsDateFromUTC(params?.value) : "";
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
      field: "email",
      headerName: "Email",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "mobile_phone_number",
      headerName: "Phone",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "linked_to_iis",
      headerName: "Linked to IIS?",
      type: "string",
      width: 200,
    },
    {
      field: "linked_to_hie",
      headerName: "Linked to HIE?",
      type: "string",
      width: 200,
    },
  ];

  useEffect(() => {
    getAssets();
    // getData();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      getData();
    }
  }, [adminReport]);

  React.useEffect(() => {
    if (adminReport) {
      setCustomerOptions(allCustomerOptions);
    } else {
      setCustomerOptions(associatedCustomerOptions);
    }
  }, [adminReport]);

  useEffect(() => {
    getData();
  }, [customer, insuranceType, linkedToIIS, linkedToHIE]);

  const getAssets = () => {
    fetch(`/admin/reports/patient_demographics/assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.error(result.error);
        } else {
          setCustomerOptions(result?.resource?.customers);
          setAllCustomerOptions(result?.resource?.all_customers);
          setAssociatedCustomerOptions(result?.resource?.customers);
          setInsuranceTypeOptions(result?.resource?.insurance_types);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getData = () => {
    fetch(
      `/admin/reports/patient_demographics/report_data?` +
        new URLSearchParams({
          customer_id: customer,
          linked_to_iis: linkedToIIS.toString(),
          linked_to_hie: linkedToHIE.toString(),
          insurance_type: insuranceType,
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
          setData(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                <p className="secondary-label">
                  Basic Patient Demographics Report
                </p>
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
                      htmlFor="im_type"
                    >
                      Linked to IIS
                    </InputLabel>
                    <Select
                      labelId="linked_to_iis"
                      id="linked_to_iis"
                      value={linkedToIIS}
                      label="Linked to IIS"
                      onChange={(event) => {
                        setLinkedToIIS(event.target.value.toString());
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
                      <MenuItem
                        aria-label="None"
                        value={"yes"}
                        style={{ padding: 10 }}
                      >
                        Yes
                      </MenuItem>
                      <MenuItem
                        aria-label="None"
                        value={"no"}
                        style={{ padding: 10 }}
                      >
                        No
                      </MenuItem>
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
                      htmlFor="im_type"
                    >
                      Linked to HIE
                    </InputLabel>
                    <Select
                      labelId="linked_to_hie"
                      id="linked_to_hie"
                      value={linkedToHIE}
                      label="Linked To HIE"
                      onChange={(event) => {
                        setLinkedToHIE(event.target.value.toString());
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
                      <MenuItem
                        aria-label="None"
                        value={"yes"}
                        style={{ padding: 10 }}
                      >
                        Yes
                      </MenuItem>
                      <MenuItem
                        aria-label="None"
                        value={"no"}
                        style={{ padding: 10 }}
                      >
                        No
                      </MenuItem>
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
                              href={`/admin/reports/patient_demographics/generate_csv.csv?${new URLSearchParams(
                                {
                                  customer_id: customer,
                                  linked_to_iis: linkedToIIS.toString(),
                                  linked_to_hie: linkedToHIE.toString(),
                                  insurance_type: insuranceType,
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
                            {/* <Link
                              href={`/admin/reports/encounter_detail/generate_csv.csv?${new URLSearchParams(
                                {
                                  customer_id: customer,
                                  encounter_type: encounterType,
                                  insurance_type: insuranceType,
                                  billing_code: billingCode,
                                  start_date: sanitizeDate(startDate),
                                  end_date: endDate,
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
                            </Link> */}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid className="action-table-container">
                        <div style={{ height: "auto", width: "100%" }}>
                          {data?.length >= 1 && (
                            <DataGrid
                              rows={data}
                              columns={columns}
                              autoHeight={true}
                              pageSize={20}
                              rowHeight={78}
                              pagination={true}
                              getRowId={(row) => `${row.id}-${row.c_id}`}
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

export default BasicPatientDemographicReport;
