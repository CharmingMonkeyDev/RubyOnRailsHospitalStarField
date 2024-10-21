import * as React from "react";
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { snakeCaseToTitleCase } from "../utils/CaseFormatHelper";

export type ActionRecurrence = {
  start_on_program_start: boolean;
  start_after_program_start: boolean;
  start_after_program_start_value: number;
  start_after_program_start_unit: string;
  repeat: boolean;
  repeat_value: number;
  repeat_unit: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  end_timing: string;
  occurences: number;
  end_date_value: number;
  end_after_program_start_value: number;
  end_after_program_start_unit: string;
  action_id?: number;
};

interface Props {
  readOnly: boolean;
  // setHasUnsavedChanges: any;
  recurrence?: ActionRecurrence;
  onDataChange: Function;
}

export const TIME_UNITS = ["day", "week"];
export const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const FormPanel: React.FC<Props> = (props: any) => {
  const handleBooleanChange = (event: any) => {
    props.onDataChange({
      ...props.recurrence,
      [event.target.name]: isTrue(event.target.value),
    });
  };

  const handleStringChange = (event: any) => {
    props.onDataChange({
      ...props.recurrence,
      [event.target.name]: event.target.value,
    });
  };

  const handleDayChange = (event: any) => {
    props.onDataChange({
      ...props.recurrence,
      [event.target.name]: event.target.checked,
    });
  };

  const isTrue = (value) => {
    return value === "true";
  };

  return (
    <Grid
      container
      className="form-container form-panel-container"
      style={{
        margin: "5px 0 0 0",
        padding: "10px 20px 0 20px",
      }}
    >
      <Grid
        item
        xs={12}
        style={{
          color: "#000000",
          fontWeight: 800,
          fontSize: "1.2em",
        }}
      >
        <div>Action Recurrence</div>
      </Grid>
      <Grid item container xs={12} style={{ margin: "20px 0 0 10px" }}>
        <Grid
          item
          xs={12}
          className="field-container"
          style={{ paddingBottom: 20, borderBottom: "1px solid #EFE9E7" }}
        >
          <FormControl component="fieldset">
            <b>This action should start on</b>
            <RadioGroup
              aria-label="start_on_program_start"
              name="start_on_program_start"
              value={props.recurrence?.start_on_program_start}
              onChange={handleBooleanChange}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    Program start date
                  </Box>
                }
                disabled={props.readOnly}
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                disabled={props.readOnly}
                label={
                  <Box display="flex" alignItems="center">
                    <TextField
                      id="start_after_program_start_value"
                      name="start_after_program_start_value"
                      size="small"
                      type="number"
                      value={props.recurrence?.start_after_program_start_value}
                      className="the-field"
                      required
                      variant="outlined"
                      onChange={handleStringChange}
                      placeholder="Unit"
                      style={{ width: "5em", marginRight: "5px" }}
                      disabled={
                        props.readOnly ||
                        props.recurrence?.start_on_program_start
                      }
                    />
                    <TextField
                      id="start_after_program_start_unit"
                      name="start_after_program_start_unit"
                      onChange={handleStringChange}
                      size="small"
                      value={props.recurrence?.start_after_program_start_unit}
                      variant="outlined"
                      select
                      style={{ width: "6em", marginRight: "10px" }}
                      disabled={
                        props.readOnly ||
                        props.recurrence?.start_on_program_start
                      }
                      className="the-field"
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>
                      {TIME_UNITS.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}(s)
                        </MenuItem>
                      ))}
                    </TextField>{" "}
                    after program start date
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          className="field-container"
          style={{
            padding: "20px 0 20px 0",
            borderBottom: "1px solid #EFE9E7",
          }}
        >
          <FormControl component="fieldset">
            <b>This action should repeat</b>
            <RadioGroup
              aria-label="repeat"
              name="repeat"
              value={props.recurrence?.repeat}
              onChange={handleBooleanChange}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                disabled={props.readOnly}
                label={
                  <Box display="flex" alignItems="center">
                    Does not repeat
                  </Box>
                }
              />
              <FormControlLabel
                value={true}
                disabled={props.readOnly}
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <span>Repeat every &nbsp; </span>
                    <TextField
                      id="repeat_value"
                      name="repeat_value"
                      type="number"
                      onChange={handleStringChange}
                      size="small"
                      value={props.recurrence?.repeat_value}
                      className="the-field"
                      required
                      variant="outlined"
                      placeholder="Unit"
                      style={{ width: "5em", marginRight: "5px" }}
                      disabled={props.readOnly || !props.recurrence?.repeat}
                    />
                    <TextField
                      id="repeat_unit"
                      name="repeat_unit"
                      onChange={handleStringChange}
                      size="small"
                      value={props.recurrence?.repeat_unit}
                      variant="outlined"
                      select
                      style={{ width: "6em", marginRight: "10px" }}
                      disabled={props.readOnly || !props.recurrence?.repeat}
                      className="the-field"
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>
                      {TIME_UNITS.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}(s)
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                }
              />
            </RadioGroup>
            {props.recurrence?.repeat &&
              props.recurrence?.repeat_unit === "week" && (
                <FormGroup>
                  <Grid container spacing={1} style={{ padding: 15 }}>
                    {daysOfWeek.map((day) => (
                      <Grid item xs={4} key={day}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={props.recurrence?.[day]}
                              onChange={handleDayChange}
                              name={day}
                              disabled={props.readOnly}
                            />
                          }
                          label={snakeCaseToTitleCase(day)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              )}
          </FormControl>
        </Grid>
        {props.recurrence?.repeat && (
          <Grid
            item
            xs={12}
            className="field-container"
            style={{
              padding: "20px 0 20px 0",
            }}
          >
            <FormControl component="fieldset">
              <b>This action should end</b>
              <RadioGroup
                aria-label="end_timing"
                name="end_timing"
                value={props.recurrence?.end_timing}
                onChange={handleStringChange}
              >
                <FormControlLabel
                  value={"after_n_occurences"}
                  control={<Radio />}
                  disabled={props.readOnly}
                  label={
                    <Box display="flex" alignItems="center">
                      <span>After: &nbsp;</span>
                      <TextField
                        id="occurences"
                        name="occurences"
                        type="number"
                        onChange={handleStringChange}
                        size="small"
                        value={props.recurrence?.occurences}
                        className="the-field"
                        required
                        variant="outlined"
                        placeholder="Unit"
                        style={{ width: "5em", marginRight: "5px" }}
                        disabled={
                          props.readOnly ||
                          props.recurrence?.end_timing !== "after_n_occurences"
                        }
                      />
                      <span>&nbsp; occurrences</span>
                    </Box>
                  }
                />
                <FormControlLabel
                  value={"after_program_start_date"}
                  control={<Radio />}
                  disabled={props.readOnly}
                  label={
                    <Box display="flex" alignItems="center">
                      <TextField
                        id="end_after_program_start_value"
                        name="end_after_program_start_value"
                        type="number"
                        onChange={handleStringChange}
                        size="small"
                        value={props.recurrence?.end_after_program_start_value}
                        className="the-field"
                        required
                        variant="outlined"
                        placeholder="Unit"
                        style={{ width: "5em", marginRight: "5px" }}
                        disabled={
                          props.readOnly ||
                          props.recurrence?.end_timing !==
                            "after_program_start_date"
                        }
                      />
                      <TextField
                        id="end_after_program_start_unit"
                        name="end_after_program_start_unit"
                        onChange={handleStringChange}
                        size="small"
                        value={props.recurrence?.end_after_program_start_unit}
                        variant="outlined"
                        select
                        style={{ width: "6em", marginRight: "10px" }}
                        disabled={
                          props.readOnly ||
                          props.recurrence?.end_timing !==
                            "after_program_start_date"
                        }
                        className="the-field"
                      >
                        <MenuItem value="" disabled>
                          Select
                        </MenuItem>
                        {TIME_UNITS.map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}(s)
                          </MenuItem>
                        ))}
                      </TextField>{" "}
                      after program start date
                    </Box>
                  }
                />
                <FormControlLabel
                  value={"no_end_date"}
                  control={<Radio />}
                  disabled={props.readOnly}
                  label={
                    <Box display="flex" alignItems="center">
                      No End Date
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default FormPanel;
