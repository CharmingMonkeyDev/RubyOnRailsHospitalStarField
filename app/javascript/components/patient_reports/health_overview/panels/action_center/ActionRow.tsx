import {
  TableRow,
  TableCell,
  Grid,
  Typography,
  Paper,
  ClickAwayListener,
  Chip,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import * as React from "react";
import {
  ImportContacts,
  EventRepeatOutlined,
  AutoFixHigh,
  Launch,
} from "@mui/icons-material";
import SVG from "react-inlinesvg";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import GeneralModal from "../../../../modals/GeneralModal";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import { getHeaders } from "../../../../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../../../../Context";

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#EFE9E8",
    color: "black",
    fontSize: 14,
    borderRadius: "25px",
    padding: 0,
  },
  [`& .MuiTooltip-arrow`]: {
    color: "#EFE9E8",
    "&::before": {
      content: '""',
      display: "block",
      width: 24,
      height: 24,
      backgroundColor: "#EFE9E8",
      transform: "rotate(45deg)",
      position: "absolute",
      top: "-10px",
      left: "50%",
      marginLeft: "-8px",
    },
  },
}));

const ActionRow = ({
  patientId,
  action,
  actionSteps,
  expandedInitially = false,
}) => {
  const [expanded, setExpanded] = useState(expandedInitially);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceOwner, setResourceOwner] = useState<string>();
  const [resources, setResources] = useState<any>([]);
  const [recurrenceToolTipOpen, setRecurrenceToolTipOpen] =
    React.useState(false);
  const [activeAutomationTooltipId, setActiveAutomationTooltipId] =
    React.useState(null);
  const [activeQLTooltipId, setActiveQLTooltipId] = React.useState(null);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  React.useEffect(() => {
    setExpanded(expandedInitially);
  }, [expandedInitially]);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  const handleShowResourceClick = (event, resources, type = "action") => {
    event.stopPropagation();
    setResourceOwner(type);
    setResources(resources);
    setShowResourceModal(true);
  };

  const handleRecurrenceTooltipClose = () => {
    setRecurrenceToolTipOpen(false);
  };

  const handleRecurrenceTooltipToggle = (event) => {
    event.stopPropagation();
    setRecurrenceToolTipOpen(!recurrenceToolTipOpen);
  };

  const handleAutomationTooltipClose = () => {
    setActiveAutomationTooltipId(null);
  };

  const handleAutomationTooltipToggle = (event, stepId) => {
    event.stopPropagation();
    setActiveQLTooltipId(null);
    setActiveAutomationTooltipId(
      activeAutomationTooltipId === stepId ? null : stepId
    );
  };

  const handleQLTooltipClose = () => {
    setActiveQLTooltipId(null);
  };

  const handleQLTooltipToggle = (event, stepId) => {
    event.stopPropagation();
    setActiveAutomationTooltipId(null);
    setActiveQLTooltipId(activeQLTooltipId === stepId ? null : stepId);
  };

  const handleLaunchQuestionnaire = (event, qId) => {
    event.stopPropagation();
    if (qId) {
      fetch(`/questionnaire_assignments`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          questionnaire_assignment: {
            user_id: patientId,
            questionnaire_id: qId,
            assignment_type: "manual",
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            if (result?.success) {
              if (result.resource?.assignment_type == "manual") {
                window.open(
                  `/questionnaire_assignments_submission_prov/${result.resource?.uuid}`
                );
              }
              flashContext.setMessage({
                text: result.message,
                type: "success",
              });
            } else {
              flashContext.setMessage({
                text: result.message,
                type: "error",
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      flashContext.setMessage({
        text: "Cannot assign without selecting questionnaire",
        type: "error",
      });
    }
  };

  return (
    <>
      <TableRow
        key={action.id}
        onClick={actionSteps.length > 0 ? handleExpandToggle : undefined}
      >
        <TableCell
          style={{
            paddingLeft: "24px",
          }}
        >
          {action.category}
        </TableCell>
        <TableCell>
          <SVG
            src={action.icon_url}
            width={25}
            height={25}
            fill={"black"}
            aria-placeholder={"Icon"}
            style={{
              marginRight: 8,
            }}
          />
        </TableCell>
        <TableCell>{action.title}</TableCell>
        <TableCell>{action.subject}</TableCell>
        <TableCell>{"Provider Action"}</TableCell>
        <TableCell>
          <Stack
            direction={"row"}
            spacing={3}
            alignItems={"baseline"}
            justifyContent={"end"}
            pr={2}
          >
            {!!action?.action_resources &&
              action?.action_resources.length > 0 && (
                <ImportContacts
                  style={{ fontSize: "1.5em", cursor: "pointer" }}
                  onClick={(event) =>
                    handleShowResourceClick(
                      event,
                      action?.action_resources,
                      "action"
                    )
                  }
                />
              )}
            <ClickAwayListener onClickAway={handleRecurrenceTooltipClose}>
              <div>
                <HtmlTooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={handleRecurrenceTooltipClose}
                  open={recurrenceToolTipOpen}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  placement="top"
                  arrow
                  title={
                    <Paper
                      elevation={3}
                      sx={{
                        py: 2,
                        px: 2,
                        background: "#EFE9E8",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ display: "flex", alignItems: "center", mb: -1 }}
                      >
                        Recurrence
                        <EventRepeatOutlined
                          fontSize="small"
                          sx={{ marginLeft: 1 }}
                        />
                      </Typography>
                      <p>{action?.readable_recurrence}</p>
                    </Paper>
                  }
                  sx={{
                    tooltip: {
                      backgroundColor: "white",
                      color: "black",
                    },
                    arrow: {
                      color: "white",
                    },
                  }}
                >
                  <EventRepeatOutlined
                    style={{ fontSize: "1.5em", cursor: "pointer" }}
                    onClick={handleRecurrenceTooltipToggle}
                  />
                </HtmlTooltip>
              </div>
            </ClickAwayListener>
            {actionSteps.length > 0 &&
              (expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
          </Stack>
        </TableCell>
      </TableRow>
      {expanded &&
        actionSteps?.map((step) => (
          <TableRow key={step.id}>
            <TableCell />
            <TableCell>
              <SVG
                src={step.icon_url}
                width={25}
                height={25}
                fill={"black"}
                aria-placeholder={"Icon"}
                style={{
                  marginRight: 8,
                }}
              />
            </TableCell>
            <TableCell>{step.title}</TableCell>
            <TableCell>
              <Stack direction={"row"} gap={4}>
                {step?.action_step_automations?.length > 0 && (
                  <ClickAwayListener onClickAway={handleAutomationTooltipClose}>
                    <div>
                      <HtmlTooltip
                        PopperProps={{
                          disablePortal: true,
                        }}
                        onClose={handleAutomationTooltipClose}
                        open={activeAutomationTooltipId === step.id}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="top"
                        arrow
                        title={
                          <Paper
                            elevation={3}
                            sx={{
                              py: 2,
                              px: 2,
                              background: "#EFE9E8",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: -1,
                              }}
                            >
                              Automation
                              <AutoFixHigh
                                fontSize="small"
                                sx={{ marginLeft: 1 }}
                              />
                            </Typography>
                            {step?.action_step_automations?.map(
                              (automation) => (
                                <p key={automation.id}>
                                  {automation?.automation_type ===
                                  "questionnaire" ? (
                                    <span>
                                      <b
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {automation?.questionnaire?.name}
                                      </b>
                                      {` questionnaire will be sent to the patient.`}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </p>
                              )
                            )}
                          </Paper>
                        }
                        sx={{
                          tooltip: {
                            backgroundColor: "white",
                            color: "black",
                          },
                          arrow: {
                            color: "white",
                          },
                        }}
                      >
                        <Stack
                          direction={"row"}
                          gap={1}
                          alignItems={"center"}
                          sx={{ cursor: "pointer" }}
                          onClick={(event) =>
                            handleAutomationTooltipToggle(event, step.id)
                          }
                        >
                          <AutoFixHigh /> Automation &nbsp;
                          <Chip
                            label={step?.action_step_automations?.length}
                            size="small"
                            sx={{ px: "3px" }}
                          />
                        </Stack>
                      </HtmlTooltip>
                    </div>
                  </ClickAwayListener>
                )}

                {step?.action_step_quick_launches?.length > 0 && (
                  <ClickAwayListener onClickAway={handleQLTooltipClose}>
                    <div>
                      <HtmlTooltip
                        PopperProps={{
                          disablePortal: true,
                        }}
                        onClose={handleQLTooltipClose}
                        open={activeQLTooltipId === step.id}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="top"
                        arrow
                        title={
                          <Paper
                            elevation={3}
                            sx={{
                              py: 2,
                              px: 2,
                              background: "#EFE9E8",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: -1,
                              }}
                            >
                              Quick Launch
                              <Launch fontSize="small" sx={{ marginLeft: 1 }} />
                            </Typography>
                            {step?.action_step_quick_launches?.map((launch) => (
                              <p key={launch.id}>
                                {launch?.launch_type === "encounter" && (
                                  <a
                                    href={`/patient_reports/${patientId}/patient_encounters/new`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    New Encounter Note
                                  </a>
                                )}
                                {launch?.launch_type === "questionnaire" && (
                                  <a
                                    href={`#`}
                                    onClick={(event) =>
                                      handleLaunchQuestionnaire(
                                        event,
                                        launch?.questionnaire?.id
                                      )
                                    }
                                  >
                                    {`Quick Launch "${launch?.questionnaire?.name}" Questionnaire`}
                                  </a>
                                )}
                              </p>
                            ))}
                          </Paper>
                        }
                        sx={{
                          tooltip: {
                            backgroundColor: "white",
                            color: "black",
                          },
                          arrow: {
                            color: "white",
                          },
                        }}
                      >
                        <Stack
                          direction={"row"}
                          gap={1}
                          alignItems={"center"}
                          sx={{ cursor: "pointer" }}
                          onClick={(event) =>
                            handleQLTooltipToggle(event, step.id)
                          }
                        >
                          <Launch /> Quick Launch &nbsp;
                          <Chip
                            label={step?.action_step_quick_launches?.length}
                            size="small"
                            sx={{ px: "3px" }}
                          />
                        </Stack>
                      </HtmlTooltip>
                    </div>
                  </ClickAwayListener>
                )}
              </Stack>
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              {!!step?.action_step_resources &&
                step?.action_step_resources.length > 0 && (
                  <ImportContacts
                    style={{ fontSize: "1.5em", cursor: "pointer" }}
                    onClick={(event) =>
                      handleShowResourceClick(
                        event,
                        step?.action_step_resources,
                        "step"
                      )
                    }
                  />
                )}
            </TableCell>
          </TableRow>
        ))}
      <GeneralModal
        open={showResourceModal}
        title={`Action ${resourceOwner === "step" ? "Step " : ""} Resource(s)`}
        successCallback={undefined}
        closeCallback={() => {
          setShowResourceModal(false);
          setResources([]);
        }}
        showContinueIcon={false}
        showCancelButton={false}
      >
        <Grid container>
          <Grid item xs={12} mt={3}>
            {!!resources && resources.length > 0 ? (
              resources.map((resource) => (
                <li key={resource.id}>
                  <a href={resource.link} target="_blank" rel="noreferrer">
                    {resource.name}
                  </a>
                </li>
              ))
            ) : (
              <div>No associated resources</div>
            )}
          </Grid>
        </Grid>
      </GeneralModal>
    </>
  );
};

export default ActionRow;
