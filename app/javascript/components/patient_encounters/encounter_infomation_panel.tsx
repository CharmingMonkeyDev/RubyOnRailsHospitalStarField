// Library Imports
import * as React from "react";
import { Grid, InputLabel, Switch, TextField, MenuItem } from "@mui/material";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// helper imports
import { snakeCaseToTitleCase } from "../utils/CaseFormatHelper";

// header import
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import { AuthenticationContext } from "../Context";

interface Props {
  generateClaim: boolean;
  setGenerateClaim: any;
  encounterType: string;
  setEncounterType: any;
  dayOfEncounter: string;
  setDayOfEncounter: any;
  placeOfService: string;
  setPlaceOfService: any;
  encounterTypeOptions: any;
  readOnly: boolean;
}

const EncounterInformationPanel: React.FC<Props> = (props: any) => {
  console.log("props", props)
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  React.useEffect(() => {
    checkExistingBillingRecords();
  }, []);

  const getEncounterId = () => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    return url.searchParams.get("encounter_id");
  };

  const checkExistingBillingRecords = () => {
    const encounterId = getEncounterId();
    if (encounterId) {
      fetch(`/encounters/encounter_information_panel_data/${encounterId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            const encounterBilling = result?.resource;
            props.setGenerateClaim(encounterBilling?.generate_claim);
            props.setEncounterType(encounterBilling?.encounter_type);
            props.setDayOfEncounter(encounterBilling?.formatted_date);
            props.setPlaceOfService(encounterBilling?.place_of_service);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString("en-US");
    props.setDayOfEncounter(formattedDate);
  };

  // const handleSwitchChange = () => {
  //   props.setGenerateClaim(!props.generateClaim);
  // };

  const encounterTypes = props.encounterTypeOptions.map((type) => {
    return (
      <MenuItem key={type[0]} value={type[0]}>
        {snakeCaseToTitleCase(type[0])}
      </MenuItem>
    );
  });

  return (
    <Grid container item xs={12} className="single-panel">
      <Grid item xs={12}>
        <Grid container direction="row" className="admin-header">
          <Grid item xs={12} lg={6}>
            <h3>Encounter Information</h3>
          </Grid>
        </Grid>
        <Grid container className="form-body" spacing={1}>
          {/* <Grid container item xs={2}>
            <Grid item xs={12}>
              <InputLabel htmlFor="generate_claim" className="field-label">
                Generate Claim?
              </InputLabel>
            </Grid>
            <Grid item xs={12} className="field-container">
              <span className="grey-font">No</span>
              <Switch
                checked={props.generateClaim}
                onChange={handleSwitchChange}
                color="primary"
              />
              <span className="grey-font">Yes</span>
            </Grid>
          </Grid> */}
          <Grid container item xs={4}>
            <Grid item xs={12}>
              <InputLabel htmlFor="encounter_type" className="field-label">
                Encounter Type
              </InputLabel>
            </Grid>
            <Grid item xs={12} className="field-container">
              <TextField
                id="encounter_type"
                size="small"
                value={props.encounterType}
                className="field field-1"
                required
                variant="outlined"
                onChange={(event) => {
                  props.setEncounterType(event.target.value);
                }}
                select
                disabled={props.readOnly}
              >
                {encounterTypes}
              </TextField>
            </Grid>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={12}>
              <InputLabel htmlFor="day_of_encounter" className="field-label">
                Date of Encounter
              </InputLabel>
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  value={props.dayOfEncounter}
                  onChange={handleDateChange}
                  className="field field-1"
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  disabled={props.readOnly}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={12}>
              <InputLabel htmlFor="place_of_service" className="field-label">
                Place of Service
              </InputLabel>
            </Grid>
            <Grid item xs={12} className="field-container">
              <TextField
                id="place_of_service"
                size="small"
                value={props.placeOfService}
                className="field field-1"
                required
                variant="outlined"
                onChange={(event) => {
                  props.setPlaceOfService(event.target.value);
                }}
                style={{ width: "100%" }}
                disabled={props.readOnly}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EncounterInformationPanel;
