// libs imports
import * as React from "react";
import { useParams } from "react-router-dom";
import { Grid, Link } from "@mui/material";
import "chartjs-adapter-moment";
import annotationPlugin from "chartjs-plugin-annotation";

// helpers imports
import { AuthenticationContext } from "../../Context";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  weekRange: any;
}

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  annotationPlugin
);

const AmbulatoryWeek: React.FC<Props> = (props: any) => {
  const [sanitizedData, setSanitizedData] = React.useState<any>([]);
  const [defaultDataType, setDefaultDataType] =
    React.useState<string>("overlay");
  const [loading, setLoading] = React.useState<boolean>(false);
  const authSettings = React.useContext(AuthenticationContext);
  const userRole = authSettings.userRole;
  var { id } = useParams();
  if (userRole == "patient") {
    id = authSettings.userId;
  }

  React.useEffect(() => {
    getDailyGlucose();
  }, [props.selectedDate, defaultDataType]);

  const getDailyGlucose = (dataType = defaultDataType) => {
    setLoading(true);
    fetch(
      `/reports/cgm_reports_ambulatory_report_weekly/${id}?week_range=${props.weekRange}&data_type=${dataType}`,
      {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          console.log(result);
          setSanitizedData(result?.resource?.sanitized_data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      annotation: {
        annotations: {
          line1: {
            type: "line" as const,
            yMin: 80,
            yMax: 80,
            borderColor: "green",
            borderWidth: 2,
          },
          line2: {
            type: "line" as const,
            yMin: 180,
            yMax: 180,
            borderColor: "green",
            borderWidth: 2,
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
      },
      y: {
        position: "right" as "right",
        min: 0,
        max: 400,
        title: {
          display: true,
          text: "mg/dL",
          align: "center" as "center",
        },
      },
    },
  };

  const handleDataTypeChange = (type) => {
    setDefaultDataType(type);
  };

  return (
    <Grid container className="graph-container">
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12} className="info-widget">
            <Grid container>
              <Grid item xs={12} className="header-container">
                <Grid container>
                  <Grid item xs={5} className="ambu-header">
                    Glucose Trend
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Link
                          onClick={() => handleDataTypeChange("average")}
                          className={
                            defaultDataType == "average"
                              ? "trend-button"
                              : "link"
                          }
                        >
                          Average
                        </Link>
                      </Grid>
                      <Grid item xs={3} className="trend-container">
                        <Link
                          onClick={() => handleDataTypeChange("overlay")}
                          className={
                            defaultDataType == "overlay"
                              ? "trend-button"
                              : "link"
                          }
                        >
                          Overlay
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {loading ? (
                <Grid container>
                  <Grid item xs={12} className="chart-container">
                    <Grid item xs={12} className="weekly-header">
                      Loading...
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid container>
                  {sanitizedData.length > 0 && (
                    <>
                      {sanitizedData.map((st, index) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            className="chart-container"
                            key={index}
                          >
                            <Grid item xs={12} className="weekly-header">
                              {st?.label}{" "}
                              <span className="vertical-thing">|</span>{" "}
                              {st?.data?.start_date} - {st?.data?.end_date}
                            </Grid>
                            {defaultDataType == "overlay" ? (
                              <Grid className="legend-container">
                                <span>
                                  <span className="legend-dot monday"></span> =
                                  Monday
                                </span>
                                <span>
                                  <span className="legend-dot tuesday"></span> =
                                  Tuesday
                                </span>
                                <span>
                                  <span className="legend-dot wednesday"></span>
                                  = Wednesday
                                </span>
                                <span>
                                  <span className="legend-dot thursday"></span>=
                                  Thursday
                                </span>
                                <span>
                                  <span className="legend-dot friday"></span> =
                                  Friday
                                </span>
                                <span>
                                  <span className="legend-dot saturday"></span>=
                                  Saturday
                                </span>
                                <span>
                                  <span className="legend-dot sunday"></span> =
                                  Sunday
                                </span>
                                <span>
                                  <span>
                                    <span
                                      className="legend-line target-range"
                                      style={{ marginLeft: "4px" }}
                                    ></span>
                                    = Target Range
                                  </span>
                                </span>
                              </Grid>
                            ) : (
                              <Grid className="legend-container">
                                <span>
                                  <span>
                                    <span
                                      className="legend-line target-range"
                                      style={{ marginLeft: "4px" }}
                                    ></span>
                                    = Target Range
                                  </span>
                                </span>
                              </Grid>
                            )}
                            <div>
                              <Scatter
                                height={500}
                                width={900}
                                options={options}
                                data={{ datasets: st?.data?.datasets }}
                              />
                            </div>

                            {index != sanitizedData?.length - 1 && (
                              <div className="divider-orange"></div>
                            )}
                          </Grid>
                        );
                      })}
                    </>
                  )}
                </Grid>
              )}
              <Grid container>
                <p style={{ fontSize: 12 }}>Dexcom CGM Data</p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AmbulatoryWeek;
