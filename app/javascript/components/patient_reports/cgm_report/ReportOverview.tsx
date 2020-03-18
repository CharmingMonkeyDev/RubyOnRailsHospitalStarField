import * as React from "react";
import { Grid, Link } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CreateIcon from "@mui/icons-material/Create";
import GlucoseExposure from "./GlucoseExposure";
import GlucoseVariability from "./GlucoseVariability";
import GlucoseRanges from "./GlucoseRanges";
import { AuthenticationContext, FlashContext } from "../../Context";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import InfoIcon from "@mui/icons-material/Info";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";
import { useGetPatientInfo } from "../../hooks/patients/useGetPatientInfo";
import { useGetGlucoseData } from "../../hooks/patients/useGetGlusoceData";

// components
import { useRef } from "react";
import ReactDOM from "react-dom";
import CgmInfoPage from "../../pages/CgmInfoPage";

interface Props {
  csrfToken: string;
}

const ReportOverview: React.FC<Props> = (props: any) => {
  const authSettings = React.useContext(AuthenticationContext);
  const userRole = authSettings.userRole;
  var { id } = useParams(); // accession params id value
  if (userRole == "patient") {
    id = authSettings.userId;
  }

  // states
  const [dateRange, setDateRange] = React.useState<any>(null);
  const [selectedDateRange, setSelectedDateRange] = React.useState<any>({
    start_date: null,
    end_date: null,
  });
  const [customStartDate, setCustomStartDate] = React.useState<string>("");
  const [customEndDate, setCustomEndDate] = React.useState<string>("");
  const [showDateFilter, setShowDateFilter] = React.useState<boolean>(false);
  const flashContext = React.useContext(FlashContext);
  const patient = useGetPatientInfo(id, authSettings.csrfToken);
  const [dateSelectionType, setDateSelectionType] =
    React.useState<string>("daily");

  const [daysRatio, setDaysRatio] = React.useState<any>(null);
  const { glucoseExposure, graphData, glucoseVariability, dateLabel } =
    useGetGlucoseData(id, selectedDateRange, authSettings.csrfToken);

  const newWindowRef = useRef(null);
  
  React.useEffect(() => {
    getDateRanges();
  }, []);

  const getDateRanges = () => {
    fetch(`/reports/cgm_reports_get_date_range/${id}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setDateRange(result.resource);
          setCustomStartDate(result?.resource?.daily_dates?.start_date);
          setCustomEndDate(result?.resource?.daily_dates?.end_date);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCustomStartDateChange = (date) => {
    setCustomStartDate(date);
  };

  const handleCustomEndDateChange = (date) => {
    setCustomEndDate(date);
  };

  const handleDateSelection = (selectionType) => {
    if (selectionType == "daily") {
      setDateSelectionType("daily");
      setSelectedDateRange({
        start_date: dateRange?.daily_dates?.start_date,
        end_date: dateRange?.daily_dates?.end_date,
      });
    }

    if (selectionType == "7_days") {
      setDateSelectionType("7_days");
      setSelectedDateRange({
        start_date: dateRange?.dates_7_days?.start_date,
        end_date: dateRange?.dates_7_days?.end_date,
      });
    }

    if (selectionType == "14_days") {
      setDateSelectionType("14_days");
      setSelectedDateRange({
        start_date: dateRange?.dates_14_days?.start_date,
        end_date: dateRange?.dates_14_days?.end_date,
      });
    }

    if (selectionType == "30_days") {
      setDateSelectionType("30_days");
      setSelectedDateRange({
        start_date: dateRange?.dates_30_days?.start_date,
        end_date: dateRange?.dates_30_days?.end_date,
      });
    }
  };

  const processCustomRangeSearch = () => {
    // the star_date and end_date move backwards for eg from yesterday to 10 days ago
    setSelectedDateRange({
      start_date: customEndDate,
      end_date: customStartDate,
    });
    setShowDateFilter(false);
  };

  const toggleDateFilterShow = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handleCopyToClipboard = async () => {
    const dateOnlyOptions = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    };
    const dateOptions = {
      ...dateOnlyOptions,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZoneName: "short",
    };

    const text = `
    -----------------------------

    Dexcom Clarity
    
    -----------------------------
    
    NAME: ${patient?.name}
    
    Date of Birth: ${patient?.date_of_birth}
    ${/* @ts-ignore */ ""}
    Generated at: ${new Date().toLocaleString("en-US", dateOptions)}
    ${/* @ts-ignore */ ""}
    Reporting period: ${dateLabel}
    
    -----------------------------
    
    Glucose Details
    
    Average glucose: ${
      glucoseExposure?.egv_value ? glucoseExposure?.egv_value + " mg/dL" : "N/A"
    } 
    
    Standard deviation: ${
      glucoseVariability?.standard_deviation === null
        ? "N/A"
        : glucoseVariability?.standard_deviation + " mg/dL"
    } 
    
    GMI: ${glucoseExposure?.gmi ? glucoseExposure?.gmi + "%" : "N/A"}
    
    -----------------------------
    
    Time in Range
    
    Very High: ${
      graphData?.very_high?.data !== null
        ? graphData?.very_high?.data + "%"
        : "N/A"
    }
    
    High: ${
      graphData?.high?.data !== null ? graphData?.high?.data + "%" : "N/A"
    }
    
    In Range: ${
      graphData?.in_target?.data !== null
        ? graphData?.in_target?.data + "%"
        : "N/A"
    }
    
    Low: ${graphData?.low?.data !== null ? graphData?.low?.data + "%" : "N/A"}
    
    Very Low: ${
      graphData?.very_low?.data !== null
        ? graphData?.very_low?.data + "%"
        : "N/A"
    }
    
    
    
    Target Range
    
    70-180 mg/dL
    
    
    
    -----------------------------
    
    CGM Details
    
    Sensor usage: ${
      glucoseVariability?.cgm_active_percentage === null
        ? "N/A"
        : glucoseVariability?.cgm_active_percentage + "%"
    }
    
    Days with CGM data: ${daysRatio ?? "N/A"}
    `;
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
    flashContext.setMessage({
      text: "Data has been successfully copied to your clipboard.",
      type: "success",
    });
  };

  const openCgmInfoPage = () => {
    const newWindow = window.open(
      "",
      "_blank",
      "height='+screen.height+', width='+screen.width"
    );
    newWindowRef.current = newWindow;
    newWindow.document.body.style.margin = "0";
    newWindow.document.body.style.padding = "0";
    newWindow.document.title = "Glucose Monitoring Resource";
    const root = document.createElement("div");
    root.id = "root";
    newWindow.document.body.appendChild(root);

    ReactDOM.render(<CgmInfoPage />, root);
  };

  return (
    <Grid container item xs={12} className="overview-report-container">
      <Grid container className="overview-header-container">
        <Grid item xs={12}>
          <Grid container justifyContent="space-between">
            <Grid
              item
              className="overview-header"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Overview Report
              <InfoIcon
                style={{ color: "grey", marginLeft: "8px", marginTop: "2px" }}
                onClick={openCgmInfoPage}
              />
            </Grid>
            <Grid item>
              <FileCopyIcon
                style={{ color: "grey" }}
                onClick={handleCopyToClipboard}
              />
            </Grid>
          </Grid>
          <div className="header-date">
            {dateLabel}
            <span
              style={{
                color: "grey",
                display: "inline-block",
                marginLeft: 10,
                position: "relative",
                bottom: -5,
              }}
            >
              <CreateIcon className="edit" onClick={toggleDateFilterShow} />
            </span>
          </div>
        </Grid>

        <Grid item xs={12} className="filter-container">
          {showDateFilter && (
            <Grid container>
              <Grid item xs={12} className="filter-header">
                Number of days(most recent):
              </Grid>
              <Grid
                item
                xs={3}
                className={
                  dateSelectionType == "daily"
                    ? "single-container active"
                    : "single-container"
                }
              >
                <Link
                  className={
                    dateSelectionType == "daily" ? "links active" : "links"
                  }
                  onClick={() => handleDateSelection("daily")}
                  underline="none"
                >
                  Daily
                </Link>
              </Grid>
              <Grid
                item
                xs={3}
                className={
                  dateSelectionType == "7_days"
                    ? "single-container active"
                    : "single-container"
                }
              >
                <Link
                  className={
                    dateSelectionType == "7_days" ? "links active" : "links"
                  }
                  onClick={() => handleDateSelection("7_days")}
                  underline="none"
                >
                  7
                </Link>
              </Grid>
              <Grid
                item
                xs={3}
                className={
                  dateSelectionType == "14_days"
                    ? "single-container active"
                    : "single-container"
                }
              >
                <Link
                  className={
                    dateSelectionType == "14_days" ? "links active" : "links"
                  }
                  onClick={() => handleDateSelection("14_days")}
                  underline="none"
                >
                  14
                </Link>
              </Grid>
              <Grid
                item
                xs={3}
                className={
                  dateSelectionType == "30_days"
                    ? "single-container active"
                    : "single-container"
                }
              >
                <Link
                  className={
                    dateSelectionType == "30_days" ? "links active" : "links"
                  }
                  onClick={() => handleDateSelection("30_days")}
                  underline="none"
                >
                  30
                </Link>
              </Grid>

              <Grid item xs={12}>
                <hr className="line-breaker" />
              </Grid>

              <Grid item xs={12} className="filter-header">
                Or select a custom date range:
              </Grid>

              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={5} className="custom-date-container">
                    <div className="header">Start Date: </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        autoOk={true}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={customStartDate}
                        onChange={handleCustomStartDateChange}
                        className="custom-date"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        PopoverProps={{
                          classes: {
                            paper: "calendarOutline", // Add this class to the MuiPopover-paper element
                          },
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={5} className="custom-date-container">
                    <div className="header">End Date: </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        autoOk={true}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={customEndDate}
                        onChange={handleCustomEndDateChange}
                        className="custom-date"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container className="button-container">
                      <Grid item xs={5}>
                        <div className="cancel-link-container">
                          <Link
                            className="cancel-link"
                            onClick={toggleDateFilterShow}
                          >
                            Cancel
                          </Link>
                        </div>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item className="save-btn-container" xs={5}>
                        <Link
                          className="save-btn"
                          onClick={processCustomRangeSearch}
                        >
                          Save
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid item xs={12}>
          <GlucoseExposure glucoseExposure={glucoseExposure} />

          <GlucoseRanges graphData={graphData} />

          <GlucoseVariability glucoseVariability={glucoseVariability} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReportOverview;
