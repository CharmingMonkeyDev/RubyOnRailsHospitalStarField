/* eslint-disable prettier/prettier */
import * as React from "react";
import { useParams } from "react-router-dom";
import { Grid, Link } from "@mui/material";
import "chartjs-adapter-moment";
import { ImagesContext, AuthenticationContext } from "../../Context";

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
  startDate: any;
}

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
);

const AmbulatoryWeek: React.FC<Props> = (props: any) => {
  const [sanitizedData, setSanitizedData] = React.useState<any>([]);
  const [defaultDataType, setDefaultDataType] =
    React.useState<string>("average");
  const [loading, setLoading] = React.useState<boolean>(false);
  const authSettings = React.useContext(AuthenticationContext);
  const userRole = authSettings.userRole;
  var { id } = useParams();
  if (userRole == "patient") {
    id = authSettings.userId;
  }
  const imagesList = React.useContext(ImagesContext);

  React.useEffect(() => {
    console.log("selectedDate or defaultDataType changed");
    getDailyGlucose();
  }, [props.selectedDate, props.startDate, defaultDataType]);

  const getDailyGlucose = (dataType = defaultDataType) => {
    setLoading(true);
    fetch(
      `/reports/cgm_reports_ambulatory_report_weekly/${id}?week_range=${
        props.weekRange
      }&data_type=${dataType}&start_date=${props.startDate || ""}`,
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

  // Note: changes to the plugin code is not reflected to the chart, because the plugin is loaded at chart construction time and editor changes only trigger an chart.update().
  const image = new Image();
  image.src = imagesList.cgm_chart_background;
  const plugin = {
    id: "customCanvasBackgroundImage",
    beforeDraw: (chart) => {
      if (image.complete) {
        const ctx = chart.ctx;
        const { top, left, width, height } = chart.chartArea;
        image.style.width = width;
        image.style.height = height;
        const x = left + width / 2 - image.width / 2;
        const y = top + height / 2 - image.height / 2;
        ctx.drawImage(image, left, top, width, height);
      } else {
        image.onload = () => chart.draw();
      }
    },
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
    },
    scales: {
      x: {
        type: "time" as const,
        grid: { display: false, drawBorder: false },
      },
      y: {
        position: "right" as "right",
        min: 0,
        max: 400,
        ticks: {
          stepSize: 20,
          callback: (value) => {
            if ([40, 100, 200, 300, 400].includes(value)) {
              return value.toString();
            } else {
              return "";
            }
          },
        },
        grid: { display: false, drawBorder: false },
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
                  <Grid
                    item
                    xs={12}
                    className="ambu-header"
                    style={{ marginLeft: "7px" }}
                  >
                    Glucose Trend
                  </Grid>
                  <Grid item className="circle-legend">
                    <span className="legend-circle high"> </span>{" "}
                    <span className="legend-label"> = high range</span>
                    <span className="legend-circle target"> </span>{" "}
                    <span className="legend-label"> = target range</span>
                    <span className="legend-circle low"> </span>{" "}
                    <span className="legend-label"> = low range</span>
                  </Grid>
                  <Grid item xs={6} style={{ display: "none" }}>
                    <Grid container>
                      <Grid item xs={6}>
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
                      <Grid item xs={6} className="trend-container">
                        <Link
                          onClick={() => handleDataTypeChange("overlay")}
                          className={
                            defaultDataType == "overlay"
                              ? "trend-button"
                              : "link"
                          }
                        >
                          Trend
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
                            {defaultDataType == "overlay" && (
                              <Grid className="legend-container">
                                <span>
                                  <span className="legend-dot monday"></span> =
                                  Monday
                                </span>
                                <span>
                                  {" "}
                                  <span className="legend-dot tuesday"></span> =
                                  Tuesday
                                </span>{" "}
                                <span>
                                  <span className="legend-dot wednesday"></span>{" "}
                                  = Wednesday
                                </span>{" "}
                                <span>
                                  <span className="legend-dot thursday"></span>{" "}
                                  = Thursday
                                </span>{" "}
                                <span>
                                  <span className="legend-dot friday"></span> =
                                  Friday
                                </span>{" "}
                                <span>
                                  <span className="legend-dot saturday"></span>{" "}
                                  = Saturday
                                </span>{" "}
                                <span>
                                  <span className="legend-dot sunday"></span> =
                                  Sunday
                                </span>
                              </Grid>
                            )}
                            <div>
                              <Scatter
                                height={420}
                                width={900}
                                options={options}
                                data={{ datasets: st?.data?.datasets }}
                                plugins={[plugin]}
                              />
                            </div>
                          </Grid>
                        );
                      })}
                    </>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AmbulatoryWeek;
