/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid } from "@mui/material";
import { Switch, Route } from "react-router-dom";
import ReportNavigation from "./ReportNavigation";
import CgmReport from "./cgm_report/CgmReport";
import HealthOverview from "./health_overview/HealthOverview";
import { useParams } from "react-router-dom";
import NewEncounter from "../patient_encounters/new_encounter";
import { BackContext } from "../Context";
import PatientQuestionnaireAnswers from "../questionnaires/PatientQuestionnairesAnswers";
import BloodPressurePanel from "./user_report/BloodPressurePanel";
import WeightPanel from "./user_report/WeightPanel";
import GlucosePanel from "./user_report/GlucosePanel";
import PatientInfo from "./PatientInfo";
import PatientEncounterSummary from "./health_overview/panels/patient_encounter_summary";
import Labs from "./health_overview/panels/labs";
import Medications from "./health_overview/panels/medications";
import QuestionnnairePanel from "./health_overview/panels/QuestionnairePanel";
import AdtNotifications from "./health_overview/panels/adt_notification";
import PatientNotes from "./health_overview/panels/PatientNotes";
import PatientImmunizations from "./health_overview/panels/PatientImmunizations";
import ActionCenter from "./health_overview/panels/ActionCenter";
import GeneralInfo from "./health_overview/panels/GeneralInfo";

interface Props {
  csrfToken: string;
  menu_track_src: string;
}

const PatientReportIndex: React.FC<Props> = (props: any) => {
  const { id } = useParams(); // accession params id value which is patient id
  const [backPath, setBackPath] = React.useState<string>("");

  return (
    <BackContext.Provider value={{ backPath, setBackPath }}>
      <div className="patient-report-container">
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          className="container3"
        >
          <Grid container className="cgm-report-container">
            <Grid item xs={12}>
              <PatientInfo patient_id={id} />
            </Grid>
            <Grid item xs={12}>
              <ReportNavigation patient_id={id} />
            </Grid>
            <Grid item xs={12}>
              <Switch>
                <Route exact path="/patient_reports/:id/action_center">
                  <ActionCenter />
                </Route>
                <Route exact path="/patient_reports/:id/general_info">
                  <GeneralInfo />
                </Route>
                <Route exact path="/patient_reports/:id/new_action">
                  <HealthOverview />
                </Route>
                <Route exact path="/patient_reports/:id/cgm_report">
                  <CgmReport />
                </Route>
                <Route exact path="/patient_reports/:id/health_overview">
                  <HealthOverview />
                </Route>
                <Route exact path="/patient_reports/:id/encounters">
                  <PatientEncounterSummary />
                </Route>
                <Route exact path="/patient_reports/:id/questionnaires">
                  <QuestionnnairePanel />
                </Route>
                <Route exact path="/patient_reports/:id/patient_encounters/new">
                  <NewEncounter />
                </Route>
                <Route exact path="/patient_reports/:patient_id/questionnaires/:category">
                  <PatientQuestionnaireAnswers patientId={""} category={""} questionniarerId={""} />
                </Route>
                <Route exact path="/patient_reports/:id/labs">
                  <Labs />
                </Route>
                <Route exact path="/patient_reports/:id/medications">
                  <Medications />
                </Route>
                <Route exact path="/patient_reports/:id/blood_pressure">
                  <BloodPressurePanel />
                </Route>
                <Route exact path="/patient_reports/:id/adt_notifications">
                  <AdtNotifications />
                </Route>
                <Route exact path="/patient_reports/:id/immunizations">
                  <PatientImmunizations />
                </Route>
                <Route exact path="/patient_reports/:id/important_notes">
                  <PatientNotes />
                </Route>
                <Route exact path="/patient_reports/:id/blood_glucose">
                  <GlucosePanel />
                </Route>
                <Route exact path="/patient_reports/:id/weight">
                  <WeightPanel />
                </Route>
              </Switch>
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        </Grid>
      </div>
    </BackContext.Provider>
  );
};

export default PatientReportIndex;
