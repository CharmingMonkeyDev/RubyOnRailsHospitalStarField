import * as React from "react";
import { Grid } from "@mui/material";
import moment from "moment/moment";

interface Props {
  patient_insurance: any;
}

const InsuranceDetails: React.FC<Props> = (props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={2.5} className="patient-info-left-container">
        <div className="detail-container">
          <h4 className="detail-header">Name (Last, First, Middle)</h4>
          <p className="detail-text">{props.patient_insurance?.last_name}</p>
          <p className="detail-text">{props.patient_insurance?.first_name}</p>
          <p className="detail-text">{props.patient_insurance?.middle_name}</p>
        </div>
      </Grid>
      <Grid item xs={2.5} className="patient-info-left-container">
        <div className="detail-container">
          <h4 className="detail-header">Address</h4>
          <p className="detail-text">{props.patient_insurance?.address}</p>
          <p className="detail-text">
            {props.patient_insurance?.city}, {props.patient_insurance?.state}{" "}
            {props.patient_insurance?.zip}
          </p>
          <p className="detail-text">{props.patient_insurance?.county}</p>
        </div>
      </Grid>
      <Grid item xs={2.5} className="patient-info-left-container">
        <div className="detail-container">
          <h4 className="detail-header">Demographics</h4>
          <p className="detail-text">
            DOB:{" "}
            {moment(props.patient_insurance?.insured_dob).format(
              "MMMM Do, YYYY"
            )}
          </p>
        </div>
      </Grid>
      <Grid item xs={4} className="patient-info-left-container">
        <div className="detail-container">
          <h4 className="detail-header">Contact</h4>
          <p className="detail-text">{props.patient_insurance?.phone_number}</p>
        </div>
      </Grid>
    </Grid>
  );
};

export default InsuranceDetails;