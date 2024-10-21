import * as React from "react";
import { Grid } from "@mui/material";
import BloodGlucose from "../patient-dashboard/BloodGlucose";
import { useParams } from "react-router";

// helper
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  menu_track_src: string;
  button_src: string;
}

const DataRpm: React.FC<Props> = (props: any) => {
  const [patient, setPatient] = React.useState<any>([]);
  const [patientDevice, setPatientDevice] = React.useState<any>([]);
  const { id } = useParams();

  React.useEffect(() => {
    fetch(`/patient_rpm`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        user: {
          id: id,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          alert(result.error);
        } else {
          setPatient(result.data.patient);
          setPatientDevice(result.data.patient_device);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const calculateAge = (dateOfBirth) => {
    var today = new Date();
    var birthDate = new Date(dateOfBirth);
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    return age_now;
  };

  const formatDate = (dateString) => {
    let date = new Date(dateString);
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      date.getFullYear()
    );
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      className="container"
    >
      <Grid item xs={12}>
        {patient.id && (
          <div className="patientInformation">
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={12} md={5}>
                <p className="patientText">
                  <strong className="patientName">{patient.name}</strong>
                  <br />
                  {patient.gender && (
                    <>{patient.gender}&nbsp;&nbsp;&nbsp;&nbsp;</>
                  )}
                  {calculateAge(patient.date_of_birth)} yrs.
                  <br />
                  {formatDate(patient.date_of_birth)}
                  <br />
                  {patient.city}
                  {patient.city && <>,</>} {patient.state} {patient.zip}
                </p>

                <BloodGlucose
                  csrfToken={props.csrfToken}
                  user_id={patient.id}
                  patient_device={patientDevice}
                  menu_track_src={props.menu_track_src}
                  button_src={props.button_src}
                  source="core_team"
                />
              </Grid>
            </Grid>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default DataRpm;
