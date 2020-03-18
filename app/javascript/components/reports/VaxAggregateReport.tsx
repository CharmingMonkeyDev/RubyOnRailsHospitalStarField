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
import { toSnakeCase, toTitleCase } from "../utils/CaseFormatHelper";
import { PrivilegesContext } from "../PrivilegesContext";
import { checkPrivileges } from "../utils/PrivilegesHelper";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
interface Props {}

const VaxAggregateReport: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);

  // first mount  controller
  const isInitialMount = React.useRef(true);

  // other states
  const [customer, setCustomer] = React.useState("");
  const [insuranceType, setInsuranceType] = React.useState("");
  const [startDate, setStartDate] =
  React.useState<Dayjs | null>(dayjs().subtract(1, "month"));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

  // data
  const [vaxData, setVaxData] = React.useState<any>([]);

  // filter options
  const [customerOptions, setCustomerOptions] = React.useState<any>();
  const [associatedCustomerOptions, setAssociatedCustomerOptions] = React.useState<any>();
  const [allCustomerOptions, setAllCustomerOptions] = React.useState<any>();
  const [insuranceTypeOptions, setInsuranceTypeOptions] = React.useState<any>();
  const [imTypeOptions, setImTypeOptions] = React.useState<any>();
  const userPrivileges = React.useContext(PrivilegesContext);
  const [adminReport, setAdminReport] = React.useState(false);

  const [columns, setColumns] = React.useState<any>();

  const baseColumns: GridColDef[] = [
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
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "zip",
      headerName: "Customer ZIP",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "county",
      headerName: "Customer County",
      width: 200,
      disableColumnMenu: true,
    },
  ];

  const lastColumns: GridColDef[] = [
    {
      field: "total_forecasted",
      headerName: "Total Forecasted",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "total_given",
      headerName: "Total Given",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "total_deferred",
      headerName: "Total Deferred",
      width: 200,
      disableColumnMenu: true,
    },
  ];

  React.useEffect(() => {
    getAssets();
  }, []);

  React.useEffect(() => {
    if (adminReport) {
      setCustomerOptions(allCustomerOptions);
    } else {
      setCustomerOptions(associatedCustomerOptions);
    }
  }, [adminReport]);

  React.useEffect(() => {
    if (!!imTypeOptions) {
      const additionalColumns: GridColDef[] = [];
      imTypeOptions.map((imType: string) => {
        additionalColumns.push(
          {
            field: `${toSnakeCase(imType)}_forecasted`,
            headerName: `${toTitleCase(imType)} Forecasted`,
            width: 200,
            disableColumnMenu: true,
          },
          {
            field: `${toSnakeCase(imType)}_given`,
            headerName: `${toTitleCase(imType)} Given`,
            width: 200,
            disableColumnMenu: true,
          },
          {
            field: `${toSnakeCase(imType)}_deferred`,
            headerName: `${toTitleCase(imType)} Deferred`,
            width: 200,
            disableColumnMenu: true,
          }
        );
      });
      setColumns([...baseColumns, ...additionalColumns, ...lastColumns]);
    }
  }, [imTypeOptions]);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      getData();
    }
  }, [customer, insuranceType]);

  const getAssets = () => {
    fetch(`/admin/reports/vax_aggregate/assets`, {
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
          setImTypeOptions(result?.resource?.im_types);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getData = () => {
    fetch(
      `/admin/reports/vax_aggregate/report_data?` +
        new URLSearchParams({
          customer_id: customer,
          insurance_type: insuranceType,
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
          console.error(result.error);
        } else {
          setVaxData(result?.resource);
        }
      })
      .catch((error) => {
        console.error(error);
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
                <p className="secondary-label">Vax Aggregate Report</p>
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

                <p>Due Date</p>

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
                        setCustomer(event.target.value as string);
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      <MenuItem
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
                        setInsuranceType(event.target.value as string);
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      <MenuItem
                          value={''}
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
                              href={`/admin/reports/vax_aggregate/generate_csv.csv?${new URLSearchParams(
                                {
                                  customer_id: customer,
                                  insurance_type: insuranceType,
                                  start_date: startDate ? startDate.toString() :  "",
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
                          {vaxData?.length >= 1 && (
                            <DataGrid
                              rows={vaxData}
                              columns={columns}
                              pageSize={20}
                              rowsPerPageOptions={[5]}
                              autoHeight={true}
                              rowHeight={78}
                              pagination={true}
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

export default VaxAggregateReport;
