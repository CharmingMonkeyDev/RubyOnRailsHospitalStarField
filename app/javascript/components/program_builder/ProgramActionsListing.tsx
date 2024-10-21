import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  makeStyles,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SVG from "react-inlinesvg";
import HistoryIcon from "@mui/icons-material/History";
import GeneralModal from "../modals/GeneralModal";
import WarningIcon from "@mui/icons-material/Warning";
import { snakeCaseToTitleCase } from "../utils/CaseFormatHelper";
import { ActionRecurrence, TIME_UNITS, daysOfWeek } from "../actions/FormPanel";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";

type ProgramActionRecurrence = ActionRecurrence & {
  override_recurrence: boolean;
  id?: null | Number;
  readable_recurrence?: string;
};

export const AccordionTableRow = ({
  action,
  className,
  handleActionRemove,
  readOnly = false,
  programId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [overrideRecurrence, setOverrideRecurrence] = useState(true);
  const flashContext = React.useContext(FlashContext);
  const initialValues: ProgramActionRecurrence = {
    start_on_program_start: action?.action_recurrence?.start_on_program_start,
    start_after_program_start:
      action?.action_recurrence?.start_after_program_start,
    start_after_program_start_value:
      action?.action_recurrence?.start_after_program_start_value,
    start_after_program_start_unit:
      action?.action_recurrence?.start_after_program_start_unit,
    repeat: action?.action_recurrence?.repeat,
    repeat_value: action?.action_recurrence?.repeat_value,
    repeat_unit: action?.action_recurrence?.repeat_unit,
    monday: action?.action_recurrence?.monday,
    tuesday: action?.action_recurrence?.tuesday,
    wednesday: action?.action_recurrence?.wednesday,
    thursday: action?.action_recurrence?.thursday,
    friday: action?.action_recurrence?.friday,
    saturday: action?.action_recurrence?.saturday,
    sunday: action?.action_recurrence?.sunday,
    end_timing: action?.action_recurrence?.end_timing,
    occurences: action?.action_recurrence?.occurences,
    end_date_value: action?.action_recurrence?.end_date_value,
    end_after_program_start_value:
      action?.action_recurrence?.end_after_program_start_value,
    end_after_program_start_unit:
      action?.action_recurrence?.end_after_program_start_unit,
    action_id: action?.action_id,
    override_recurrence: action?.override_recurrence,
  };
  const [programAction, setProgramAction] =
    useState<ProgramActionRecurrence>(initialValues);
  const authenticationSetting = React.useContext(AuthenticationContext);

  useEffect(() => {
    getProgramActionData();
  }, []);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const isBlank = (str) => {
    return !str || str === undefined || str.trim() === "";
  };

  const setErrorFlash = (message) => {
    flashContext.setMessage({
      text: message,
      type: "error",
    });
  };

  const validateFields = () => {
    if (!programAction.start_on_program_start) {
      if (isBlank(programAction.start_after_program_start_unit)) {
        setErrorFlash(
          "Program Start Date after-value and unit cannot be blank"
        );
        return false;
      }
      if (programAction.start_after_program_start_value < 0) {
        setErrorFlash("Program Start Date after-value must be at least 1");
        return false;
      }
    }
    if (!!programAction.repeat) {
      if (isBlank(programAction.repeat_unit)) {
        setErrorFlash("Repeat unit cannot be blank");
        return false;
      }
      if (programAction.repeat_value < 1 || programAction.repeat_value > 90) {
        setErrorFlash("Repeat value should be between 1 and 90.");
        return false;
      }
    }
    if (programAction.end_timing === "after_program_start_date") {
      if (
        programAction.end_after_program_start_value < 1 ||
        programAction.end_after_program_start_value > 999
      ) {
        setErrorFlash(
          "Action End value cannot be blank and must be between 1 and 999."
        );
        return false;
      }
      if (isBlank(programAction.end_after_program_start_unit)) {
        setErrorFlash("Action End unit cannot be blank.");
        return false;
      }
    } else if (programAction.end_timing === "after_n_occurences") {
      if (programAction.occurences < 1 || programAction.occurences > 999) {
        setErrorFlash(
          "Occurences at End Settings cannot be blank and must be between 1 and 999."
        );
        return false;
      }
    }

    return true;
  };

  const handleOverrideRecurrence = async () => {
    if (!programAction) {
      return;
    }
    if (validateFields()) {
      try {
        const response = await fetch(`/program_actions/${programAction?.id}`, {
          method: "PUT",
          headers: getHeaders(authenticationSetting.csrfToken),
          body: JSON.stringify({
            program_action: {
              ...programAction,
              override_recurrence: overrideRecurrence,
            },
          }),
        });
        const result = await response.json();
        if (result.success == false) {
          alert(result.error);
        } else {
          flashContext.setMessage({
            text: "Recurrence has been updated.",
            type: "success",
          });
          location.reload();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getProgramActionData = async () => {
    if (!programId) {
      return;
    }
    try {
      const response = await fetch(
        `/program_actions/programs/${programId}/actions/${action.id}`,
        {
          method: "GET",
          headers: getHeaders(authenticationSetting.csrfToken),
        }
      );
      const result = await response.json();
      if (result.success == false) {
        alert(result.error);
      } else {
        if (result.resource.override_recurrence) {
          setProgramAction({
            ...result.resource,
            id: result.resource.id,
          });
        } else {
          setProgramAction({
            ...result.resource,
            ...initialValues,
            id: result.resource.id,
          });
        }
        console.log("result", result);
        console.log("programAction", {
          ...result.resource,
          ...initialValues,
          id: result.resource.id,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveOverride = async () => {
    setOverrideRecurrence(false);
    setProgramAction({
      ...programAction,
      ...initialValues,
      override_recurrence: false,
    });
    return;
  };

  const handleBooleanChange = (event: any) => {
    setProgramAction({
      ...programAction,
      [event.target.name]: isTrue(event.target.value),
    });
  };

  const handleStringChange = (event: any) => {
    setProgramAction({
      ...programAction,
      [event.target.name]: event.target.value,
    });
  };

  const handleDayChange = (event: any) => {
    setProgramAction({
      ...programAction,
      [event.target.name]: event.target.checked,
    });
  };

  const isTrue = (value) => {
    return value === "true";
  };

  return (
    <>
      <GeneralModal
        open={showRecurrenceModal}
        title={"Edit Action Recurrence"}
        successCallback={handleOverrideRecurrence}
        closeCallback={() => setShowRecurrenceModal(false)}
        fullWidth={true}
        containerClassName="template-select-container template-container"
        width="550px"
      >
        <Grid container style={{ padding: 20 }}>
          <Grid container>
            <Grid item xs={12}>
              <WarningIcon style={{ color: "#EBB709", marginBottom: "-5px" }} />
              <strong>
                &nbsp; You are overriding the default recurrence of this action.
              </strong>
            </Grid>
          </Grid>
          <Grid container style={{ height: "10px" }} />
          <Grid container>
            <Grid item xs={12} style={{ textAlign: "right" }}>
              <Button
                size="small"
                className="red-btn"
                style={{
                  marginRight: "16px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  textTransform: "unset",
                }}
                disabled={readOnly}
                onClick={handleRemoveOverride}
              >
                Remove Override
              </Button>
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: "20px" }}>
            <Divider orientation="horizontal" style={{ width: "100%" }} />
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
                    value={programAction?.start_on_program_start}
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
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <TextField
                            id="start_after_program_start_value"
                            name="start_after_program_start_value"
                            size="small"
                            type="number"
                            value={
                              programAction?.start_after_program_start_value
                            }
                            className="the-field"
                            required
                            variant="outlined"
                            onChange={handleStringChange}
                            placeholder="Unit"
                            style={{ width: "5em", marginRight: "5px" }}
                            disabled={programAction?.start_on_program_start}
                          />
                          <TextField
                            id="start_after_program_start_unit"
                            name="start_after_program_start_unit"
                            onChange={handleStringChange}
                            size="small"
                            value={
                              programAction?.start_after_program_start_unit
                            }
                            variant="outlined"
                            select
                            style={{ width: "6em", marginRight: "10px" }}
                            className="the-field"
                            disabled={programAction?.start_on_program_start}
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
                    value={programAction?.repeat}
                    onChange={handleBooleanChange}
                  >
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          Does not repeat
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value={true}
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
                            value={programAction?.repeat_value}
                            className="the-field"
                            required
                            variant="outlined"
                            placeholder="Unit"
                            style={{ width: "5em", marginRight: "5px" }}
                            disabled={!programAction?.repeat}
                          />
                          <TextField
                            id="repeat_unit"
                            name="repeat_unit"
                            onChange={handleStringChange}
                            size="small"
                            value={programAction?.repeat_unit}
                            variant="outlined"
                            select
                            style={{ width: "6em", marginRight: "10px" }}
                            disabled={!programAction?.repeat}
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
                  {programAction?.repeat &&
                    programAction?.repeat_unit === "week" && (
                      <FormGroup>
                        <Grid container spacing={1} style={{ padding: 15 }}>
                          {daysOfWeek.map((day) => (
                            <Grid item xs={4} key={day}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={programAction?.[day]}
                                    onChange={handleDayChange}
                                    name={day}
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
              {programAction?.repeat && (
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
                      value={programAction?.end_timing}
                      onChange={handleStringChange}
                    >
                      <FormControlLabel
                        value={"after_n_occurences"}
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center">
                            <span>After: &nbsp;</span>
                            <TextField
                              id="occurences"
                              name="occurences"
                              type="number"
                              onChange={handleStringChange}
                              size="small"
                              value={programAction?.occurences}
                              className="the-field"
                              required
                              variant="outlined"
                              placeholder="Unit"
                              style={{ width: "5em", marginRight: "5px" }}
                              disabled={
                                programAction?.end_timing !==
                                "after_n_occurences"
                              }
                            />
                            <span>&nbsp; occurrences</span>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value={"after_program_start_date"}
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center">
                            <TextField
                              id="end_after_program_start_value"
                              name="end_after_program_start_value"
                              type="number"
                              onChange={handleStringChange}
                              size="small"
                              value={
                                programAction?.end_after_program_start_value
                              }
                              className="the-field"
                              required
                              variant="outlined"
                              placeholder="Unit"
                              style={{ width: "5em", marginRight: "5px" }}
                              disabled={
                                programAction?.end_timing !==
                                "after_program_start_date"
                              }
                            />
                            <TextField
                              id="end_after_program_start_unit"
                              name="end_after_program_start_unit"
                              onChange={handleStringChange}
                              size="small"
                              value={
                                programAction?.end_after_program_start_unit
                              }
                              variant="outlined"
                              select
                              style={{ width: "6em", marginRight: "10px" }}
                              disabled={
                                programAction?.end_timing !==
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
        </Grid>
      </GeneralModal>
      <TableRow
        onClick={handleChange}
        style={{ cursor: "pointer", borderBottom: 0 }}
        className={className}
      >
        <TableCell
          style={{ borderBottom: !expanded ? "" : 0 }}
          className="first-column"
        >
          <SVG
            src={action?.icon_url}
            width={25}
            height={25}
            fill={"black"}
            aria-placeholder={"Icon"}
            style={{
              marginRight: 8,
            }}
          />
        </TableCell>
        <TableCell style={{ borderBottom: !expanded ? "" : 0 }}>
          {action?.title}
        </TableCell>
        <TableCell style={{ borderBottom: !expanded ? "" : 0 }} align="left">
          {action?.subject}
        </TableCell>
        <TableCell style={{ borderBottom: !expanded ? "" : 0 }} align="left">
          {programAction?.readable_recurrence ?? action?.readable_recurrence}{" "}
          {programAction?.override_recurrence && (
            <HistoryIcon
              fontSize="small"
              style={{ color: "#EBB709", marginBottom: "-5px" }}
            />
          )}
        </TableCell>
        {!readOnly && (
          <TableCell style={{ borderBottom: !expanded ? "" : 0 }} align="left">
            <Link
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleActionRemove(action?.id);
              }}
              style={{ marginLeft: 10 }}
            >
              <DeleteIcon />
            </Link>
          </TableCell>
        )}
        <TableCell style={{ borderBottom: !expanded ? "" : 0 }} align="left">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className={className} style={{ padding: 10 }}>
          <TableCell colSpan={6}>
            <Grid
              container
              spacing={0}
              style={{ padding: "15px 10px 0 10px", paddingBottom: 10 }}
              justifyContent="space-between"
            >
              <Grid item xs={3}>
                <strong>Resources Attached</strong>
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  {action?.action_resources?.map((resource, index) => (
                    <p key={`${resource.id}-${index}`} style={{ margin: 0 }}>
                      <a href={resource.link} target="_blank" rel="noreferrer">
                        {resource.name}
                      </a>
                    </p>
                  ))}
                </div>
              </Grid>
              <Grid item xs={1} style={{ maxWidth: 15 }}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  paddingBottom: 10,
                  paddingLeft: 0,
                  marginRight: 20,
                }}
              >
                <strong>Steps</strong>
                <TableContainer
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Table size="small" aria-label="a dense table">
                    <TableBody>
                      {action?.action_steps?.map((step, index) => (
                        <TableRow key={step.id}>
                          <TableCell
                            align="left"
                            style={{
                              paddingRight: 10,
                              borderBottom: 0,
                              paddingLeft: 0,
                              width: 20,
                            }}
                          >
                            {step.icon_url ? (
                              <SVG
                                src={step.icon_url}
                                width={20}
                                height={20}
                                fill={"black"}
                                aria-placeholder={"Icon"}
                                style={{ marginBottom: "-5px" }}
                              />
                            ) : (
                              <Box width={20}></Box>
                            )}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{
                              paddingRight: 0,
                              borderBottom: 0,
                              paddingLeft: 0,
                            }}
                          >
                            {step.title}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              borderBottom: 0,
                              paddingRight: 0,
                            }}
                          >
                            Quick launch encounter
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={1} style={{ maxWidth: 5 }}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item xs={3}>
                <Grid container justifyContent="space-between">
                  <Grid item xs={9}>
                    <strong>Recurrence</strong>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    {!readOnly && (
                      <Grid
                        item
                        container
                        direction="column"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (programAction?.id) {
                            setShowRecurrenceModal(true);
                          } else {
                            alert(
                              "You must save the new program to override the recurrence."
                            );
                          }
                        }}
                      >
                        <HistoryIcon
                          style={{
                            width: "20px",
                            color: programAction?.override_recurrence
                              ? "#EBB709"
                              : "black",
                          }}
                        />
                        <span style={{ fontSize: "12px" }}>Override</span>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <p>
                  {programAction?.readable_recurrence ??
                    action.readable_recurrence}
                </p>
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const ProgramActionsListing = (props: any) => {
  return (
    <Grid
      container
      className="form-container form-panel-container"
      style={{
        margin: "5px 0 0 0",
        padding: "10px 20px 0 20px",
        borderRadius: 0,
      }}
    >
      <Grid
        item
        style={{
          color: "#000000",
          fontWeight: 800,
          fontSize: "1.2em",
          display: "flex",
          width: "100%",
          borderBottom: "3px solid #ecdede",
          paddingBottom: "6px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>Actions in Program</div>
        {!props.readOnly && (
          <Link
            onClick={() => {
              props.setShowActionSelection(true);
            }}
            className="grey-font"
            style={{
              height: "40px",
              display: "flex",
              alignItems: "center",
              fontSize: "15px",
              // paddingLeft: props.noPadding ? "0" : "10px",
              // marginTop: "10px",
            }}
          >
            <img
              src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png"
              width="20"
              alt="Add Resource"
              style={{ padding: "5px" }}
            />
            <b>Add Action</b>
          </Link>
        )}
      </Grid>
      <Grid item container xs={12} style={{ marginTop: "20px" }}>
        <Grid
          item
          xs={12}
          className="field-container"
          // style={{ paddingBottom: 20, borderBottom: "1px solid #EFE9E7" }}
        >
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    component="th"
                    className="bold-font-face nowrap-header first-column"
                  >
                    Icon
                  </TableCell>
                  <TableCell
                    align="left"
                    component="th"
                    className="bold-font-face nowrap-header"
                    onClick={() => {
                      props.setSortOrder(
                        "title",
                        props.sortObject.direction == "ascending"
                          ? "descending"
                          : "ascending"
                      );
                    }}
                  >
                    Title
                    {props.getSortIcon("title")}
                  </TableCell>
                  <TableCell
                    align="left"
                    component="th"
                    className="bold-font-face nowrap-header"
                    onClick={() => {
                      props.setSortOrder(
                        "subtext",
                        props.sortObject.direction == "ascending"
                          ? "descending"
                          : "ascending"
                      );
                    }}
                  >
                    Subtext
                    {props.getSortIcon("subtext")}
                  </TableCell>
                  <TableCell
                    align="left"
                    component="th"
                    className="bold-font-face nowrap-header"
                  >
                    Recurrence
                  </TableCell>
                  {!props.readOnly && (
                    <TableCell
                      align="left"
                      component="th"
                      className="bold-font-face nowrap-header"
                    >
                      Remove
                    </TableCell>
                  )}
                  <TableCell
                    align="left"
                    component="th"
                    className="bold-font-face nowrap-header last-column"
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.actions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        borderBottom: 0,
                        paddingTop: 15,
                        fontFamily: "unset",
                      }}
                    >
                      {"There are no actions in this program."}
                      <br />
                      {
                        "Use the 'Add Action' button in the top right corner to add actions to this program."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  props.actions?.map((action, index) => (
                    <AccordionTableRow
                      key={action.id}
                      action={action}
                      className={index % 2 === 0 ? `panel-grey-background` : ""}
                      handleActionRemove={props.handleActionRemove}
                      readOnly={props.readOnly}
                      programId={props.programId}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProgramActionsListing;
