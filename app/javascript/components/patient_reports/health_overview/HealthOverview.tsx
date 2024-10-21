/* eslint-disable prettier/prettier */

// library imports
import * as React from "react";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";

// components import
import PatientInfo from "../PatientInfo";
import Labs from "./panels/labs";
import Medications from "./panels/medications";
import CarePlan from "./panels/care_plan";
import AdtNotifications from "./panels/adt_notification";
import ProviderAction from "./panels/ProviderAction";
import PatientEncounterSummary from "./panels/patient_encounter_summary";
import PatientNotes from "./panels/PatientNotes";
import PatientImmunizations from "./panels/PatientImmunizations";
import QuestionnnairePanel from "./panels/QuestionnairePanel";

// app setting imports
import { AuthenticationContext, BackContext } from "../../Context";
import { PrivilegesContext } from "../../PrivilegesContext";
import { checkPrivileges } from "../../utils/PrivilegesHelper";

// helpers import
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {}

const HealthOverview: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const userPrivileges = React.useContext<any>(PrivilegesContext);

  // patient id
  const { id } = useParams();

  const [patient, setPatient] = React.useState<any>(null);
  const [adtTurnedOn, setAdtTurnedOn] = React.useState<any>(false);
  const [adtDisableMinutes, setAdtDisableMiniutes] = React.useState<number>(0);
  const { backPath, setBackPath } = React.useContext(BackContext);

  React.useEffect(() => {
    getPatientInformation();
  }, []);

  React.useEffect(() => {
    setBackPath(`/patients?patient_id=${id}`);
  }, []);

  const getPatientInformation = async() => {
    if (id) {
      const response = await fetch(`/data_fetching/patient_information/${id}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      if (response.status === 404) {
        window.location.href = "/not-found";
        return;
      }
      const result = await response.json();
      if (result.success == false) {
        console.log("result", result);
        if (result.status === 404) {
          console.error(result.message);
        }
      } else {
        setPatient(result?.resource);
        setAdtTurnedOn(result?.resource?.adt_notifications_turned_on);
        setAdtDisableMiniutes(result?.resource?.adt_disable_minutes);
      }
    }
  };

  return (
    <Grid className="cgm-report-container">
      {/* <PatientInfo patient_id={id} /> */}

      <Grid container spacing={1} item xs={12}>
        <Grid item xs={6}>
          {checkPrivileges(userPrivileges, "View Patient Labs") && (
            <Labs />
          )}
          <Medications />
          <CarePlan patient_id={id} />
          <QuestionnnairePanel />
          <PatientNotes />
        </Grid>
        <Grid item xs={6}>
          <AdtNotifications />

          <PatientEncounterSummary />
          <ProviderAction patient_id={id} />
          <PatientImmunizations />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HealthOverview;
