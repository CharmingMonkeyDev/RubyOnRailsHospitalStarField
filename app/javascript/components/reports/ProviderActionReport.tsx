// library imports
import * as React from "react";
import {
  Grid,
  Link,
  Snackbar,
  Button,
  MenuItem,
  Card,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";
import { Alert } from "@mui/material";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatToUsDate } from "../utils/DateHelper";
import ImportExportIcon from "@mui/icons-material/ImportExport";
// utils import
import { toTitleCase } from "../utils/CaseFormatHelper";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
interface Props {
  customers: any;
}

const ProviderActionReport: React.FC<Props> = (props: any) => {
  // first mount  controller
  const isInitialMount = React.useRef(true);

  const [error, setError] = React.useState<string>("");
  const [customer, setCustomer] = React.useState<any>("");
  const [customers, setCustomers] = React.useState<any>();
  const [provider, setProvider] = React.useState<any>("");
  const [providers, setProviders] = React.useState<any>();
  const [assignmentDateStart, setAssignmentDateStart] =
    React.useState<Dayjs | null>(dayjs().subtract(14, "day"));

  const [assignmentDateEnd, setAssignmentDateEnd] =
    React.useState<Dayjs | null>(dayjs());
  const [completed, setCompleted] = React.useState<number>();
  const [incomplete, setIncomplete] = React.useState<number>();
  const [actions, setActions] = React.useState<any>();
  const [actionStatus, setActionStatus] = React.useState<any>("");
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [rows, setRows] = React.useState<any>([]);

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
      width: 160,
      disableColumnMenu: true,
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 160,
      disableColumnMenu: true,
    },
    {
      field: "patient",
      headerName: "Patient",
      width: 160,
      disableColumnMenu: true,
    },
    {
      field: "actionDescription",
      headerName: "Description",
      type: "string",
      width: 260,
      disableColumnMenu: true,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.actionDescription}`,
    },
    {
      field: "assignmentDate",
      headerName: "Assign Date",
      type: "string",
      width: 120,
      disableColumnMenu: true,
    },
    {
      field: "actionStatus",
      headerName: "Status",
      description: "This column has a value getter and is not sortable.",
      width: 100,
      disableColumnMenu: true,
    },
    {
      field: "actionCompleteDate",
      headerName: "Complete Date",
      type: "string",
      width: 120,
      disableColumnMenu: true,
    },
  ];

  React.useEffect(() => {
    var newRows = [];
    actions?.map((action, index) => {
      newRows.push({
        id: index,
        provider: action.provider.last_name + "," + action.provider.first_name,
        customer: action.customer,
        patient: action.patient.last_name + "," + action.patient.first_name,
        actionDescription: action.subtext,
        assignmentDate: action.assigned_at
          ? formatToUsDate(action.assigned_at)
          : "N/A",
        actionStatus: toTitleCase(action.status),
        actionCompleteDate: action.completed_at
          ? formatToUsDate(action.completed_at)
          : "N/A",
      });
    });
    setRows(newRows);
  }, [actions]);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      getData();
    }
  }, [
    customer,
    provider,
    assignmentDateStart,
    assignmentDateEnd,
    actionStatus,
  ]);

  const getData = () => {
    fetch(
      "/reports/provider_actions_data?" +
        new URLSearchParams({
          customer_id: customer,
          provider_id: provider,
          assignment_date_start: assignmentDateStart
            ? assignmentDateStart.format("MM/DD/YYYY")
            : "",
          assignment_date_end: assignmentDateEnd
            ? assignmentDateEnd.format("MM/DD/YYYY")
            : "",
          action_status: actionStatus,
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
          setCustomers(result.resource.customers);
          setProviders(result.resource.providers);
          setIncomplete(result.resource.incomplete_actions);
          setCompleted(result.resource.completed_actions);
          setActions(result.resource.actions);
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
                <p className="secondary-label"> Provider Actions </p>
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

                <p>Assignment Date</p>
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
                          value={assignmentDateStart}
                          onChange={(value) => {
                            setAssignmentDateStart(value);
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
                          value={assignmentDateEnd}
                          onChange={(value) => {
                            setAssignmentDateEnd(value);
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
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      autoOk={true}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      value={assignmentDateEnd}
                      onChange={(value) => {
                        setAssignmentDateEnd(formatToUsDate(value));
                      }}
                      className="report-date-input"
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
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
                      {customers?.map((customer, index) => (
                        <MenuItem key={index} value={customer.id}>
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
                      {providers?.map((provider, index) => (
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
                      labelId="action_status"
                      id="action_status"
                      value={actionStatus}
                      label="Action Status"
                      onChange={(event) => {
                        setActionStatus(event.target.value);
                      }}
                      style={{ width: "100%", marginLeft: 0 }}
                    >
                      <MenuItem key={0} value="incomplete">
                        Incomplete
                      </MenuItem>
                      <MenuItem key={1} value="complete">
                        Complete
                      </MenuItem>
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
                          Incomplete Actions －{" "}
                          <b className="bold-font-face"> {incomplete} </b>{" "}
                        </div>
                        <div>
                          {" "}
                          Complete Actions －{" "}
                          <b className="bold-font-face"> {completed} </b>{" "}
                        </div>
                        <div>
                          {" "}
                          Total Actions －{" "}
                          <b className="bold-font-face">
                            {" "}
                            {actions?.length || 0}{" "}
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
                            href={`/reports/provider_actions/generate_csv.csv?${new URLSearchParams(
                              {
                                customer_id: customer,
                                provider_id: provider,
                                assignment_date_start: assignmentDateStart
                                  ? assignmentDateStart.format("MM/DD/YYYY")
                                  : "",
                                assignment_date_end: assignmentDateEnd
                                  ? assignmentDateEnd.format("MM/DD/YYYY")
                                  : "",
                                action_status: actionStatus,
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
                          <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={20}
                            rowsPerPageOptions={[5]}
                            style={{ paddingLeft: "0px" }}
                            autoHeight={true}
                            rowHeight={78}
                            pagination={true}
                          />
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

export default ProviderActionReport;
