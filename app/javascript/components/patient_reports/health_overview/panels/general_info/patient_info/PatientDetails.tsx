import * as React from "react";
import { Grid } from "@mui/material";
import moment from "moment/moment";

interface Props {
  patient: any;
}

const PatientDetails: React.FC<Props> = (props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={2.5} className="patient-info-left-container">
        <div className="detail-container">
          <h4 className="detail-header">Name (Last, First, Middle)</h4>
          <p className="detail-text">{props.patient?.last_name}</p>
          <p className="detail-text">{props.patient?.first_name}</p>
          <p className="detail-text">{props.patient?.middle_name}</p>
        </div>
      </Grid>
      <Grid item xs={2.5} className="patient-info-left-container">
        <div className="detail-container">
          <h4 className="detail-header">Address</h4>
          <p className="detail-text">{props.patient?.address}</p>
          <p className="detail-text">
            {props.patient?.city}
            {props.patient?.city && ","} {props.patient?.state}{" "}
            {props.patient?.zip}
          </p>
          <p className="detail-text">{props.patient?.county}</p>
        </div>
      </Grid>
      <Grid item xs={2.5} className="patient-info-left-container">
        <div className="detail-container">
          <h4 className="detail-header">Demographics</h4>
          <p className="detail-text">
            DOB: {moment(props.patient?.date_of_birth).format("MMMM Do, YYYY")}
          </p>
          {props.patient?.ethnicity && (
            <p className="detail-text">{props.patient?.ethnicity}</p>
          )}
          {props.patient?.race && (
            <p className="detail-text">{props.patient?.race}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={4} className="patient-info-left-container">
        <div className="detail-container">
          <h4 className="detail-header">Contact</h4>
          <p className="detail-text">{props.patient?.email}</p>
          <p className="detail-text">{props.patient?.mobile_phone_number}</p>
        </div>
      </Grid>
    </Grid>
  );
};

export default PatientDetails;