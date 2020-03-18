import * as React from "react";
import {
  Grid,
  Link,
  InputLabel,
  Snackbar,
  MenuItem,
  Card,
  FormControl,
  Select,
  Button,
  Box,
} from "@mui/material";
import { Alert } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ImportExportIcon from "@mui/icons-material/ImportExport";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

// helpers import
import { toTitleCase } from "../utils/CaseFormatHelper";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Props {}

const AdtDischargeReport: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);

  // first mount  controller
  const isInitialMount = React.useRef(true);

  // other states
  const [error, setError] = React.useState<string>("");
  const [customer, setCustomer] = React.useState<any>("");
  const [provider, setProvider] = React.useState<any>("");
  const [patientClass, setPatientClass] = React.useState<any>("");
  const [actionStatus, setActionStatus] = React.useState<any>("");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs().subtract(7, "day")
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

  // data
  const [adtData, setAdtData] = React.useState<any>([]);
  const [actionStatusData, setActionStatusData] = React.useState<any>({});

  // filter options
  const [customerOptions, setCustomerOptions] = React.useState<any>();
  const [providerOptions, setProviderOptions] = React.useState<any>();
  const [patientClassOptions, setPatientClassOptions] = React.useState<any>();
  const [actionStatusOtions, setActionStatusOptions] = React.useState<any>();

  const columns: GridColDef[] = [
    {
      field: "",
      headerName: "",
      width: 40,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "provider",
      headerName: "Provider",
      width: 170,
      disableColumnMenu: true,
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 170,
      disableColumnMenu: true,
    },
    {
      field: "patient",
      headerName: "Patient",
      width: 170,
      disableColumnMenu: true,
    },
    {
      field: "patient_class",
      headerName: "Patient Class",
      type: "string",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "action_status",
      headerName: "Action Status",
      description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 170,
      disableColumnMenu: true,
    },
    {
      field: "event_date",
      headerName: "ADT Event Date",
      type: "string",
      width: 170,
      disableColumnMenu: true,
    },
    {
      field: "created_at_date",
      headerName: "Received from NDHIN",
      type: "string",
      width: 170,
      disableColumnMenu: true,
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
  }, [customer, provider, patientClass, actionStatus]);

  const getAssets = () => {
    fetch(`/admin/reports/adt_discharge/assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setCustomerOptions(result?.resource?.customers);
          setProviderOptions(result?.resource?.providers);
          setPatientClassOptions(result?.resource?.patient_classes);
          setActionStatusOptions(result?.resource?.actions);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = () => {
    fetch(
      `/admin/reports/adt_discharge/action_panel_data?` +
        new URLSearchParams({
          customer_id: customer,
          provider_id: provider,
          patient_class: patientClass,
          action_status: actionStatus,
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
          console.log(result);
          console.log(result?.resource?.adt_data);
          setAdtData(result?.resource?.adt_data);
          setActionStatusData(result?.resource?.action_status_counter);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTotalActionCount = () => {
    return (
      actionStatusData?.unassigned_count +
      actionStatusData?.incomplete_count +
      actionStatusData?.complete_count
    );
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
          {error.length > 0 && (
            <Snackbar
              open={error.length > 0}
              autoHideDuration={6000}
              onClose={() => {
                setError("");
              }}
            >
              <Alert severity="error">{error}</Alert>
            </Snackbar>
          )}
          <Grid container>
            <Grid
              className="patient-edit-header"
              container
              justifyContent="space-between"
            >
              <Grid item xs={4}>
                <p className="secondary-label"> ADT Discharge</p>
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
                    />{" "}
                    Back
                  </Link>
                </Card>
                <h3> Date Range </h3>

                <p>ADT Event Date</p>

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
                <Grid item xs={12}></Grid>

                <Grid item xs={12}>
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
                      htmlFor="customer_id"
                    >
                      Provider
                    </InputLabel>
                    <Select
                      labelId="provider_id"
                      id="provider_id"
                      value={provider}
                      label="Provider"
                      onChange={(event) => {
                        setProvider(event.target.value);
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      {providerOptions?.map((provider, index) => (
                        <MenuItem
                          key={index}
                          value={provider.id}
                          style={{ padding: 10 }}
                        >
                          {provider.name}
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
                      htmlFor="customer_id"
                    >
                      Action Status
                    </InputLabel>
                    <Select
                      labelId="action_status_id"
                      id="action_status_id"
                      value={actionStatus}
                      label="Action Status"
                      onChange={(event) => {
                        setActionStatus(event.target.value);
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      {actionStatusOtions?.map((actionStatus, index) => (
                        <MenuItem
                          key={index}
                          value={actionStatus}
                          style={{ padding: 10, textTransform: "capitalize" }}
                        >
                          {toTitleCase(actionStatus)}
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
                      htmlFor="customer_id"
                    >
                      Patient Class
                    </InputLabel>
                    <Select
                      labelId="provider_id"
                      id="provider_id"
                      value={patientClass}
                      label="Provider"
                      onChange={(event) => {
                        setPatientClass(event.target.value);
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      {
                        // PatientClassOptions is an array
                        patientClassOptions?.map((patientClass, index) => (
                          <MenuItem
                            key={index}
                            value={patientClass}
                            style={{ padding: 10 }}
                          >
                            {toTitleCase(patientClass)}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {/* column 2 */}
              <Grid item xs={10} className="right-column">
                {/* overview row */}
                <Grid container>
                  <Grid item xs={12} className="shadowed-box">
                    <Grid container>
                      <Grid
                        className="patient-edit-header"
                        container
                        justifyContent="space-between"
                      >
                        <Grid item xs={4}>
                          <p className="secondary-label"> Overview </p>
                        </Grid>
                      </Grid>
                      <Grid className="overview-contents">
                        <div>
                          {" "}
                          Unassigned Actions －{" "}
                          <b className="bold-font-face">
                            {actionStatusData?.unassigned_count}
                          </b>{" "}
                        </div>
                        <div>
                          {" "}
                          Incomplete Actions －{" "}
                          <b className="bold-font-face">
                            {actionStatusData?.incomplete_count}
                          </b>{" "}
                        </div>
                        <div>
                          {" "}
                          Complete Actions －{" "}
                          <b className="bold-font-face">
                            {actionStatusData?.complete_count}
                          </b>{" "}
                        </div>
                        <div>
                          {" "}
                          Total Actions －{" "}
                          <b className="bold-font-face">
                            {getTotalActionCount()}
                          </b>{" "}
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
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
                          <p className="secondary-label"> Actions </p>
                        </Grid>
                        <Grid item xs={1}>
                          <Link
                            href={`/admin/reports/adt_discharge/action_panel_generate_csv.csv?${new URLSearchParams(
                              {
                                customer_id: customer,
                                provider_id: provider,
                                patient_class: patientClass,
                                action_status: actionStatus,
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
                          {adtData?.length >= 1 && (
                            <DataGrid
                              rows={adtData}
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

export default AdtDischargeReport;
