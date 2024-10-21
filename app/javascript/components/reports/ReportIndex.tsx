// library imports
import * as React from "react";
import { Grid } from "@mui/material";

interface Props {}

const ReportIndex: React.FC<Props> = (props: any) => {
  return (
    <div className="patient-index-container">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container"
      >
        <Grid item xs={12} md={12}>
          <div className="userAdminInformation">
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="stretch"
              className="adminHeader"
            >
              <Grid item xs={12} md={6}>
                <h3>Reports</h3>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="divider"></div>
        </Grid>
        <Grid item xs={12} className="admin-report">
          <div className="admin-report--container">
            <Grid container justifyContent="space-between">
              <Grid
                item
                xs={3}
                className="report-card"
                onClick={() => (window.location.href = "/adt-discharge-report")}
              >
                <div className="report-card__header">ADT Discharge</div>
                <div className="report-card__body">
                  List of all actions for Discharge events received from NDHIN
                  with optional filtering on Date Range, Customer, Provider,
                  Patient Class, and Action Status.
                </div>
              </Grid>
              <Grid
                item
                xs={3}
                className="report-card"
                onClick={() =>
                  (window.location.href = "/provider-action-report")
                }
              >
                <div className="report-card__header">Provider Actions</div>
                <div className="report-card__body">
                  List of available actions for your Providers with optional
                  filtering on Date Range, Customer, and Provider.
                </div>
              </Grid>
              <Grid
                item
                xs={3}
                className="report-card"
                onClick={() =>
                  (window.location.href = "/encounter-detail-report")
                }
              >
                <div className="report-card__header">Encounter Detail</div>
                <div className="report-card__body">
                  This report returns detailed patient encounter and billing
                  information such as date of service, type of visit, CPT and
                  diagnosis codes, insurance, providers, and charges.
                </div>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              style={{ marginTop: 30 }}
            >
              <Grid
                item
                xs={3}
                className="report-card"
                onClick={() =>
                  (window.location.href = "/immunizaiton-forecast-report")
                }
              >
                <div className="report-card__header">
                  Immunization Forecaster Detail
                </div>
                <div className="report-card__body">
                  List of an individual&apos;s vaccination history and future
                  immunization recommendations. Includes details such as past
                  immunizations, upcoming vaccine schedules, and any potential
                  gaps in vaccination coverage.
                </div>
              </Grid>
              <Grid
                item
                xs={3}
                className="report-card"
                onClick={() => (window.location.href = "/vax-aggregate-report")}
              >
                <div className="report-card__header">Vax Aggregate Report</div>
                <div className="report-card__body">
                  This report returns data on immunizations forecasted,
                  delivered, and deferred in aggregate by vaccine type (TD, flu,
                  etc) at the customer and county level.
                </div>
              </Grid>
              <Grid
                item
                xs={3}
                className="report-card"
                onClick={() =>
                  (window.location.href = "/patient-demographic-report")
                }
              >
                <div className="report-card__header">
                  Basic Patient Demographics
                </div>
                <div className="report-card__body">
                  This report returns basic demographic information such as
                  name, address, ethnicity, insurance information, and
                  connectivity to outside data sources such as HIE and IIS
                  systems.
                </div>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReportIndex;
