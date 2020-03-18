/* eslint-disable prettier/prettier */
import * as React from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
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
  dataDate: any;
  setDataDate: any;
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

const AmbulatoryDaily: React.FC<Props> = (props: any) => {
  const [graphData, setGraphData] = React.useState<any>(null);
  const authenticationSettings = React.useContext(AuthenticationContext);
  const userRole = authenticationSettings.userRole;
  var { id } = useParams();
  if (userRole == "patient") {
    id = authenticationSettings.userId;
  }
  const imagesList = React.useContext(ImagesContext);

  React.useEffect(() => {
    getDailyGlucose();
  }, [props.selectedDate]);

  const getDailyGlucose = (selectedDate = null) => {
    fetch(
      `/reports/cgm_reports_ambulatory_report_daily/${id}?selected_date=${selectedDate}`,
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
          setGraphData(result?.resource?.graph_data);
          // setDataDate(result?.resource?.date_label);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const data = {
    datasets: [
      {
        data: graphData,
        backgroundColor: "#3C3C3C",
        radius: 3,
      },
    ],
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
        callbacks: {
          label: (yDatapoint) => {
            return `${yDatapoint?.formattedValue} mg/dL - ${yDatapoint?.label}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        grid: { display: false, drawBorder: false },
        border: { display: false },
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
        border: { display: false },
      },
    },
  };

  React.useEffect(() => {
    getDailyGlucose(props.dataDate);
  }, [props.dataDate]);

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
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} className="chart-container">
                  {graphData?.length > 0 ? (
                    <Scatter
                      height={420}
                      width={900}
                      options={options}
                      data={data}
                      plugins={[plugin]}
                    />
                  ) : (
                    <p>No Data</p>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AmbulatoryDaily;
