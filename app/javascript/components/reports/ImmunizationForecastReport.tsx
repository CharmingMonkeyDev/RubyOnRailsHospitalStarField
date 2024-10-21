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
  Box,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ImportExportIcon from "@mui/icons-material/ImportExport";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

// helpers import
import {
  formatToUsDate,
  formatToUsDateFromUTC,
  daysAgo,
} from "../utils/DateHelper";
import { toTitleCase } from "../utils/CaseFormatHelper";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Props {}

const ImmunizationForecastReport: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);

  // first mount  controller
  const isInitialMount = React.useRef(true);

  // other states
  const [customer, setCustomer] = React.useState<any>("");
  const [insuranceType, setInsuranceType] = React.useState<any>("");
  const [imType, setImType] = React.useState<any>("");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs().subtract(1, "month")
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

  // data
  const [imData, setImData] = React.useState<any>([]);

  // filter options
  const [customerOptions, setCustomerOptions] = React.useState<any>();
  const [insuranceTypeOptions, setInsuranceTypeOptions] = React.useState<any>();
  const [imTypeOptions, setImTypeOptions] = React.useState<any>();

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
      headerName: "zip",
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
      field: "prov_name",
      headerName: "Provider Name",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "vaccine_type",
      headerName: "Imunization Type",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "recommended_date",
      headerName: "Immunization Due Date",
      type: "string",
      width: 200,
      disableColumnMenu: true,
      valueFormatter: (params) => {
        return formatToUsDateFromUTC(params?.value);
      },
    },
    {
      field: "given_date",
      headerName: "Immunization Given Date",
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
      field: "defer_date",
      headerName: "Immunization Deferred Date",
      type: "string",
      width: 200,
      disableColumnMenu: true,
      valueFormatter: (params) => {
        if (params.value) {
          return formatToUsDateFromUTC(params?.value);
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
  }, [customer, insuranceType, imType]);

  const getAssets = () => {
    fetch(`/admin/reports/im_forecasts/assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setCustomerOptions(result?.resource?.customers);
          setInsuranceTypeOptions(result?.resource?.insurance_types);
          setImTypeOptions(result?.resource?.im_types);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sanitizeDate = (date) => {
    // first load gives us string date, subsequesnt load gives us other date so we sanitizing
    if (typeof date == "string") {
      return new Date(date);
    }
    return date;
  };

  const getData = () => {
    fetch(
      `/admin/reports/im_forecasts/report_data?` +
        new URLSearchParams({
          customer_id: customer,
          im_type: imType,
          insurance_type: insuranceType,
          start_date: startDate ? startDate.toString() : "",
          end_date: endDate ? endDate.toString() : "",
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
                <p className="secondary-label">
                  Immunization Forecaster Detail Report
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
                <h3> Date Range </h3>

                <p>Immunizaton Forecast Due Date</p>

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
                        setCustomer(event.target.value);
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
                        setInsuranceType(event.target.value);
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
                      Immunization Type
                    </InputLabel>
                    <Select
                      labelId="im_type"
                      id="im_type"
                      value={imType}
                      label="Action Status"
                      onChange={(event) => {
                        setImType(event.target.value);
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
                      {imTypeOptions?.map((ito, index) => (
                        <MenuItem
                          key={index}
                          value={ito}
                          style={{ padding: 10, textTransform: "capitalize" }}
                        >
                          {toTitleCase(ito)}
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
                        <Grid item xs={4}>
                          <p className="secondary-label"> Report Details </p>
                        </Grid>
                        <Grid item xs={1}>
                          <Link
                            href={`/admin/reports/im_forecasts/generate_csv.csv?${new URLSearchParams(
                              {
                                customer_id: customer,
                                im_type: imType,
                                insurance_type: insuranceType,
                                start_date: startDate
                                  ? startDate.toString()
                                  : "",
                                end_date: endDate ? endDate.toString() : "",
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

export default ImmunizationForecastReport;
