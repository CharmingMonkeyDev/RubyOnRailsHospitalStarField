/* eslint-disable prettier/prettier */
import * as React from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import "chartjs-adapter-moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { AuthenticationContext } from "../../Context";
import annotationPlugin from "chartjs-plugin-annotation";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";

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

interface Props {
  csrfToken: string;
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

const AmbulatoryDaily: React.FC<Props> = (props: any) => {
  const [graphData, setGraphData] = React.useState<any>(null);
  const [dataDate, setDataDate] = React.useState<any>(null);
  const authenticationSettings = React.useContext(AuthenticationContext);
  const userRole = authenticationSettings.userRole;
  var { id } = useParams();
  if (userRole == "patient") {
    id = authenticationSettings.userId;
  }

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
          setDataDate(result?.resource?.date_label);
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
      autocolors: false,
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

  const handleDateSelection = (date) => {
    getDailyGlucose(date);
  };
  return (
    <Grid container className="graph-container">
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={11} className="info-widget">
            <Grid container>
              <Grid item xs={12} className="header-container">
                <Grid container>
                  <Grid
                    item
                    xs={userRole == "patient" ? 12 : 6}
                    className="ambu-header"
                  >
                    Glucose Trend
                  </Grid>
                  <Grid item xs={userRole == "patient" ? 12 : 6}>
                    <Grid item xs={userRole == "patient" ? 6 : 5}>
                      {dataDate && (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            value={dataDate}
                            onChange={handleDateSelection}
                            className="custom-date"
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid className="legend-container">
                  <span>
                    <span className="legend-line target-range"></span> = Target
                    Range
                  </span>
                </Grid>
                <Grid item xs={12} className="chart-container">
                  {graphData?.length > 0 ? (
                    <Scatter
                      height={500}
                      width={900}
                      options={options}
                      data={data}
                    />
                  ) : (
                    <p>No Data</p>
                  )}
                </Grid>
              </Grid>
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

export default AmbulatoryDaily;
