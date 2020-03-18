/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link } from "@mui/material";
import { useParams } from "react-router-dom";
import GlucoseExposure from "./GlucoseExposure";
import GlucoseVariability from "./GlucoseVariability";
import GlucoseRanges from "./GlucoseRanges";
import { AuthenticationContext } from "../../Context";
import { Link as RouterLink } from "react-router-dom";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";
import { useGetGlucoseData } from "../../hooks/patients/useGetGlusoceData";

interface Props {
  csrfToken: string;
  setDateSelectionType: any;
  dateSelectionType: string;
  dataDate: any;
  setDataDate: any;
}

const ReportOverview: React.FC<Props> = (props: any) => {
  const authSettings = React.useContext(AuthenticationContext);
  const userRole = authSettings.userRole;
  var { id } = useParams(); // accession params id value
  if (userRole == "patient") {
    id = authSettings.userId;
  }

  const [dateRange, setDateRange] = React.useState<any>(null);
  const [selectedDateRange, setSelectedDateRange] = React.useState<any>({
    start_date: null,
    end_date: null,
  });
  const [customStartDate, setCustomStartDate] = React.useState<string>("");
  const [customEndDate, setCustomEndDate] = React.useState<string>("");
  const [showDateFilter, setShowDateFilter] = React.useState<boolean>(false);

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

  const handleDateSelection = (selectionType) => {
    if (selectionType == "daily") {
      props.setDateSelectionType("daily");
      setSelectedDateRange({
        start_date: dateRange?.daily_dates?.start_date,
        end_date: dateRange?.daily_dates?.end_date,
      });
    }

    if (selectionType == "7_days") {
      props.setDateSelectionType("7_days");
      setSelectedDateRange({
        start_date: dateRange?.dates_7_days?.start_date,
        end_date: dateRange?.dates_7_days?.end_date,
      });
    }

    if (selectionType == "14_days") {
      props.setDateSelectionType("14_days");
      setSelectedDateRange({
        start_date: dateRange?.dates_14_days?.start_date,
        end_date: dateRange?.dates_14_days?.end_date,
      });
    }

    if (selectionType == "30_days") {
      props.setDateSelectionType("30_days");
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

  const moveDaily = (days) => {
    var end = new Date(dateRange?.daily_dates?.end_date);
    var start = new Date(dateRange?.daily_dates?.start_date);

    end.setDate(end.getDate() + days);
    start.setDate(start.getDate() + days);

    if (start > new Date()) {
      console.log("out of date range");
      return;
    }

    var newDateRange = dateRange;

    if (newDateRange?.daily_dates?.end_date) {
      newDateRange.daily_dates.end_date = `${end.getFullYear()}/${
        end.getMonth() + 1
      }/${end.getDate()}`;
    }
    if (newDateRange?.daily_dates?.start_date) {
      newDateRange.daily_dates.start_date = `${start.getFullYear()}/${
        start.getMonth() + 1
      }/${start.getDate()}`;
    }
    setDateRange(newDateRange);
    setSelectedDateRange({
      start_date: newDateRange?.daily_dates?.start_date,
      end_date: newDateRange?.daily_dates?.end_date,
    });
  };

  const moveBiWeekly = (weeks) => {
    var end = new Date(dateRange?.dates_14_days?.end_date);
    var start = new Date(dateRange?.dates_14_days?.start_date);
    var today = new Date();
    var ago30days = new Date();
    ago30days.setDate(ago30days.getDate() - 31);

    end.setDate(end.getDate() + weeks * 7);
    start.setDate(start.getDate() + weeks * 7);

    if (start > today || start < ago30days) {
      console.log("out of date range");
      return;
    }

    var newDateRange = dateRange;

    if (newDateRange?.dates_14_days?.end_date) {
      newDateRange.dates_14_days.end_date = `${end.getFullYear()}/${
        end.getMonth() + 1
      }/${end.getDate()}`;
    }
    if (newDateRange?.dates_14_days?.start_date) {
      newDateRange.dates_14_days.start_date = `${start.getFullYear()}/${
        start.getMonth() + 1
      }/${start.getDate()}`;
    }
    setDateRange(newDateRange);
    setSelectedDateRange({
      start_date: newDateRange?.dates_14_days?.start_date,
      end_date: newDateRange?.dates_14_days?.end_date,
    });
  };

  React.useEffect(() => {
    props.setDataDate(selectedDateRange.start_date);
  }, [selectedDateRange]);

  const {
    glucoseExposure,
    graphData,
    glucoseVariability,
    dateLabel,
    dateLabelBiWeekly,
    dateLabelDaily,
  } = useGetGlucoseData(id, selectedDateRange, authSettings.csrfToken);

  return (
    <Grid
      container
      item
      xs={12}
      className="overview-report-container patient-overview-report"
    >
      <Grid container className="overview-header-container">
        <Grid item xs={12}>
          {userRole == "patient" ? (
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              className="patient-page-heading"
            >
              <Grid item xs={2} className="center-text">
                <RouterLink
                  to="/?menu=false"
                  className="patient-back-botton"
                  style={{ color: "#4A4442" }}
                >
                  &lt;
                </RouterLink>
              </Grid>
              <Grid
                item
                xs={8}
                className="patient-page-title"
                style={{
                  textAlign: "center",
                }}
              >
                <span>CGM Report</span>
              </Grid>
              {props.source == "patient" && (
                <Grid item xs={2}>
                  &nbsp;
                </Grid>
              )}
            </Grid>
          ) : (
            <div className="overview-header">Overview Report</div>
          )}
        </Grid>

        <Grid item xs={12} className="filter-container">
          {/* Mobile date filter */}
          <Grid
            container
            className="mobile-date-filter"
            justifyContent="center"
          >
            <Grid
              item
              xs={12}
              style={{
                marginBottom: "10px",
              }}
            >
              {props.dateSelectionType == "daily" ? (
                <div className="header-date" style={{ textAlign: "center" }}>
                  <a
                    className="date-mover"
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => {
                      moveDaily(-1);
                    }}
                  >
                    {" "}
                    &lt;
                  </a>
                  {dateLabelDaily}
                  <a
                    className="date-mover"
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => {
                      moveDaily(1);
                    }}
                  >
                    {" "}
                    &gt;
                  </a>
                </div>
              ) : (
                <div className="header-date" style={{ textAlign: "center" }}>
                  <a
                    className="date-mover"
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => {
                      moveBiWeekly(-2);
                    }}
                  >
                    {" "}
                    &lt;
                  </a>
                  {dateLabelBiWeekly}
                  <a
                    className="date-mover"
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => {
                      moveBiWeekly(2);
                    }}
                  >
                    {" "}
                    &gt;{" "}
                  </a>
                </div>
              )}
            </Grid>
            <Grid
              item
              style={{ textAlign: "center" }}
              className={
                props.dateSelectionType == "daily" ? "active-container" : ""
              }
            >
              <Link
                className={
                  props.dateSelectionType == "daily" ? "links active" : "links"
                }
                onClick={() => handleDateSelection("daily")}
                underline="none"
              >
                Daily
              </Link>
            </Grid>
            <Grid
              item
              style={{ textAlign: "left" }}
              className={
                props.dateSelectionType == "14_days" ? "active-container" : ""
              }
            >
              <Link
                className={
                  props.dateSelectionType == "14_days"
                    ? "links active"
                    : "links"
                }
                onClick={() => handleDateSelection("14_days")}
                underline="none"
              >
                2 Week Avg
              </Link>
            </Grid>

            <h3 style={{ textAlign: "center", width: "100%" }}>
              {" "}
              Glucose Statistics{" "}
            </h3>
          </Grid>
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
