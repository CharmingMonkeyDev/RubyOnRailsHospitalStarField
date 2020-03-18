/* eslint-disable prettier/prettier */
import * as React from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

interface Props {
  graphData: any;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GlucoseRanges: React.FC<Props> = ({ graphData }) => {
  const labels = [""];
  const data = {
    labels,
    datasets: [
      {
        label: graphData?.very_low?.label,
        data: [graphData?.very_low?.data],
        backgroundColor: graphData?.very_low?.background_color,
      },
      {
        label: graphData?.low?.label,
        data: [graphData?.low?.data],
        backgroundColor: graphData?.low?.background_color,
      },
      {
        label: graphData?.in_target?.label,
        data: [graphData?.in_target?.data],
        backgroundColor: graphData?.in_target?.background_color,
      },
      {
        label: graphData?.high?.label,
        data: [graphData?.high?.data],
        backgroundColor: graphData?.high?.background_color,
      },
      {
        label: graphData?.very_high?.label,
        data: [graphData?.very_high?.data],
        backgroundColor: graphData?.very_high?.background_color,
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
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
  };

  const options2 = {
    indexAxis: "y" as const,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        display: false,
        ticks: {
          display: false,
        },
      },
      y: {
        stacked: true,
        display: false,
        ticks: {
          display: false,
        },
      },
    },
  };
  return (
    <Grid container className="graph-container">
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12} className="info-widget">
            <Grid container>
              <Grid item xs={12} className="header-container">
                Glucose Ranges
              </Grid>

              {/* Mobile graph */}
              <Grid container className="mobile-content-container">
                <Grid item xs={12}>
                  <Grid container className="label-container">
                    <Grid item xs={2} className="label-row">
                      <div className="legend-header">Very High</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor:
                            graphData?.very_high?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">&gt;250 mg/dL</div>

                      <div>
                        {graphData?.very_high?.data == null
                          ? "NA"
                          : `${graphData?.very_high?.data}%`}
                      </div>
                    </Grid>

                    <Grid item xs={2} className="label-row">
                      <div className="legend-header">High</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor: graphData?.high?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">&gt;180 mg/dL</div>
                      <div>
                        {graphData?.high?.data == null
                          ? "NA"
                          : `${graphData?.high?.data}%`}
                      </div>
                    </Grid>

                    <Grid item xs={2} className="label-row">
                      <div className="legend-header">In Target Range</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor:
                            graphData?.in_target?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">70-180 mg/dL</div>
                      <div>
                        {graphData?.in_target?.data == null
                          ? "NA"
                          : `${graphData?.in_target?.data}%`}
                      </div>
                    </Grid>

                    <Grid item xs={2} className="label-row">
                      <div className="legend-header">Low</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor: graphData?.low?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">&lt;70 mg/dL</div>
                      <div>
                        {graphData?.low?.data == null
                          ? "NA"
                          : `${graphData?.low?.data}%`}
                      </div>
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      className="label-row"
                      style={{ borderRight: "0" }}
                    >
                      <div className="legend-header">Very Low</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor:
                            graphData?.very_low?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">&lt;34 mg/dL</div>
                      <div>
                        {graphData?.very_low?.data == null
                          ? "NA"
                          : `${graphData?.very_low?.data}%`}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="chart-container">
                  <Bar
                    options={options2}
                    data={data}
                    style={{ height: "60px" }}
                  />
                </Grid>
              </Grid>

              {/* Desktop graph */}
              <Grid container className="content-container">
                <Grid item xs={6}>
                  <Grid container className="label-container">
                    <Grid item xs={12} className="label-row">
                      <div className="legend-header">Very High</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor:
                            graphData?.very_high?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">&gt;250 mg/dL</div>

                      <div>
                        {graphData?.very_high?.data == null
                          ? "NA"
                          : `${graphData?.very_high?.data}%`}
                      </div>
                    </Grid>

                    <Grid item xs={12} className="label-row">
                      <div className="legend-header">High</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor: graphData?.high?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">&gt;180 mg/dL</div>
                      <div>
                        {graphData?.high?.data == null
                          ? "NA"
                          : `${graphData?.high?.data}%`}
                      </div>
                    </Grid>

                    <Grid item xs={12} className="label-row">
                      <div className="legend-header">In Target Range</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor:
                            graphData?.in_target?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">70-180 mg/dL</div>
                      <div>
                        {graphData?.in_target?.data == null
                          ? "NA"
                          : `${graphData?.in_target?.data}%`}
                      </div>
                    </Grid>

                    <Grid item xs={12} className="label-row">
                      <div className="legend-header">Low</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor: graphData?.low?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">&lt;70 mg/dL</div>
                      <div>
                        {graphData?.low?.data == null
                          ? "NA"
                          : `${graphData?.low?.data}%`}
                      </div>
                    </Grid>

                    <Grid item xs={12} className="label-row">
                      <div className="legend-header">Very Low</div>
                      <div
                        className="the-dot"
                        style={{
                          backgroundColor:
                            graphData?.very_low?.background_color,
                        }}
                      ></div>
                      <div className="bench-data">&lt;34 mg/dL</div>
                      <div>
                        {graphData?.very_low?.data == null
                          ? "NA"
                          : `${graphData?.very_low?.data}%`}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} className="chart-container">
                  <Bar options={options} data={data} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GlucoseRanges;
