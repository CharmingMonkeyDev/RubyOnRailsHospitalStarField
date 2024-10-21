import React, { useEffect, useState } from "react";
import { AuthenticationContext, FlashContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import {
  Grid,
  Box,
  Typography,
  Link,
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ClickAwayListener,
  Paper,
  Chip,
} from "@mui/material";
import FlashMessage from "../shared/FlashMessage";
import dayjs from "dayjs";
import { Stack } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  ImportContacts,
  EventRepeatOutlined,
  Schedule,
  AutoFixHigh,
  Launch,
} from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import GeneralModal from "../modals/GeneralModal";
import SVG from "react-inlinesvg";
import ActionQueueHistoryModal from "./ActionQueueHistoryModal";
import { HtmlTooltip } from "../patient_reports/health_overview/panels/action_center/ActionRow";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { dateToString } from "../utils/DateHelper";
import FilterMenu from "./FilterMenu";
import BadgeList from "../common/BadgeList";
import { isValid } from "date-fns";
interface Props {}
interface ChipData {
  key: number;
  label: string;
  type: string;
}
const ActionItem = ({ aq, providers }) => {
  const [expanded, setExpanded] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [showHistoryFor, setShowHistoryFor] = React.useState<number>();

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceOwner, setResourceOwner] = useState<string>();
  const [resources, setResources] = useState<any>([]);
  const [recurrenceToolTipOpen, setRecurrenceToolTipOpen] =
    React.useState(false);
  const [activeAutomationTooltipId, setActiveAutomationTooltipId] =
    React.useState(null);
  const [activeQLTooltipId, setActiveQLTooltipId] = React.useState(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openDropdown = Boolean(anchorEl);
  const handleDropDownClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };
  const [openCompleteActionModal, setOpenCompleteActionModal] = useState(false);
  const handleManualComplete = () => {
    setOpenCompleteActionModal(true);
  };

  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  const handleUnassignAction = async () => {
    try {
      const response = await fetch(
        `/action_queues/${aq.action_queue_id}/unassign`,
        {
          method: "PUT",
          headers: getHeaders(authenticationSetting.csrfToken),
        }
      );
      const result = await response.json();
      flashContext.setMessage({
        text: result.message,
        type: result.success == false ? "error" : "success",
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      flashContext.setMessage({
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleAssignActionToProvider = async (
    providerId,
    assignToMe = false
  ) => {
    try {
      const response = await fetch(
        `/action_queues/${aq.action_queue_id}/assign_to_provider`,
        {
          method: "PUT",
          headers: getHeaders(authenticationSetting.csrfToken),
          body: JSON.stringify({
            provider_id: providerId,
            assign_to_me: assignToMe ? 1 : 0,
          }),
        }
      );
      const result = await response.json();
      flashContext.setMessage({
        text: result.message,
        type: result.success == false ? "error" : "success",
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      flashContext.setMessage({
        text: "Something went wrong.",
        type: "error",
      });
    }
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
            user_id: aq?.patient_id,
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
            {!!resources && resources?.length > 0 ? (
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
      {showHistoryModal && setShowHistoryFor && (
        <ActionQueueHistoryModal
          open={showHistoryModal}
          onCloseModal={() => {
            setShowHistoryFor(undefined);
            setShowHistoryModal(false);
          }}
          actionQueueId={showHistoryFor}
        />
      )}
      <Box
        display={"flex"}
        width={"100%"}
        alignItems={"center"}
        ml={2}
        sx={
          expanded
            ? {
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.6)",
                zIndex: 2,
                py: 1,
                marginTop: 2,
              }
            : {
                marginTop: 2,
              }
        }
      >
        <Box
          className="action-table-row"
          sx={{ flexBasis: "10%", display: "flex", alignItems: "left" }}
        >
          {aq.status}
        </Box>
        <Box className="action-table-row" sx={{ flexBasis: "20%" }}>
          <div>
            <a
              href={`/patient_reports/${aq.patient_id}/action_center`}
              target="_blank"
              style={{
                textTransform: "capitalize",
                color: "black",
              }}
              rel="noreferrer"
            >{`${aq.patient_last_name}, ${aq.patient_first_name}`}</a>
          </div>
        </Box>
        <Box className="action-table-row" sx={{ flexBasis: "20%" }}>
          {aq.action_title}
        </Box>
        <Box className="action-table-row" sx={{ flexBasis: "20%" }}>
          {aq.action_subject}
        </Box>
        <Box className="action-table-row" sx={{ flexBasis: "20%" }}>
          <Stack
            direction={"row"}
            spacing={1}
            display={"flex"}
            alignItems={"center"}
          >
            <List
              component="nav"
              aria-label="Assign Provider"
              sx={{
                bgcolor: "background.paper",
                background: "unset !important",
              }}
            >
              <ListItemButton
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-label="when device is locked"
                aria-expanded={open ? "true" : undefined}
                onClick={handleDropDownClick}
                sx={{ padding: "0 !important", fontSize: "unset" }}
              >
                <ListItemText
                  primary={
                    <Stack direction={"row"} spacing={1} fontSize={"0.875rem"}>
                      {aq.assigned_to_id ? (
                        <>
                          <KeyboardArrowDownIcon /> &nbsp;
                          {`${aq.provider_last_name}, ${aq.provider_first_name}`}
                        </>
                      ) : (
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          Assign Action
                        </a>
                      )}
                    </Stack>
                  }
                />
              </ListItemButton>
            </List>
            <Menu
              id="status-menu"
              anchorEl={anchorEl}
              open={openDropdown}
              onClose={handleCloseDropdown}
              MenuListProps={{
                "aria-labelledby": "lock-button",
                role: "listbox",
              }}
            >
              {!aq?.assigned_to_id ? (
                <MenuItem
                  onClick={() => handleAssignActionToProvider(null, true)}
                >
                  Assign to me
                </MenuItem>
              ) : (
                <MenuItem onClick={handleUnassignAction}>
                  Unassign this Action
                </MenuItem>
              )}
              <Divider />
              {providers?.map((provider, index) => (
                <MenuItem
                  key={`${aq.id} - ${provider.id}`}
                  onClick={() => {
                    console.log(index, provider);
                    handleAssignActionToProvider(provider.id);
                  }}
                >
                  {provider.name}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Box>
        <Box
          className="action-table-row"
          sx={{
            flexBasis: "20%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack
            direction={"row"}
            spacing={3}
            alignItems={"baseline"}
            justifyContent={"space-between"}
            width={"100%"}
            pr={3}
          >
            {!!aq.action_resources && aq.action_resources.length > 0 ? (
              <ImportContacts
                style={{ fontSize: "1.5em", cursor: "pointer" }}
                onClick={(event) =>
                  handleShowResourceClick(event, aq.action_resources, "action")
                }
              />
            ) : (
              <Box width={"25px"}></Box>
            )}
            <Schedule
              style={{ fontSize: "1.5em", cursor: "pointer" }}
              onClick={() => {
                setShowHistoryFor(aq.action_queue_id);
                setShowHistoryModal(true);
              }}
            />
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
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: -1,
                        }}
                      >
                        Recurrence
                        <EventRepeatOutlined
                          fontSize="small"
                          sx={{ marginLeft: 1 }}
                        />
                      </Typography>
                      <p>
                        {aq?.readable_recurrence?.length > 0
                          ? aq?.readable_recurrence
                          : "Does not Repeat"}
                      </p>
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
            <div onClick={handleExpandToggle}>
              {expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </div>
          </Stack>
        </Box>
      </Box>
      {expanded &&
        aq.action_steps?.map((step, index) => (
          <Box
            key={index + "-" + step.id}
            sx={{
              display: "flex",
              alignItems: "center",
              py: 1,
              my: 2,
              width: "100%",
            }}
          >
            <Box
              className="action-table-row"
              sx={{ flexBasis: "10%", display: "flex", alignItems: "left" }}
            ></Box>
            <Box className="action-table-row" sx={{ flexBasis: "20%" }}>
              <Box
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
                ml={1}
              >
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
                {step.title}
              </Box>
            </Box>
            <Box className="action-table-row" sx={{ flexBasis: "20%" }}></Box>
            <Box className="action-table-row" sx={{ flexBasis: "40%" }}>
              <Stack direction={"row"} gap={3}>
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
                          {step?.action_step_automations.length > 0 ? (
                            step?.action_step_automations?.map((automation) => (
                              <p key={automation.id}>
                                {automation?.automation_type ===
                                "questionnaire" ? (
                                  <span>
                                    <b style={{ textTransform: "capitalize" }}>
                                      {automation?.questionnaire?.name}
                                    </b>
                                    {` questionnaire will be sent to the patient.`}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </p>
                            ))
                          ) : (
                            <p>No automations</p>
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
                          {step?.action_step_quick_launches?.length > 0 ? (
                            step?.action_step_quick_launches?.map((launch) => (
                              <p key={launch.id}>
                                {launch?.launch_type === "encounter" && (
                                  <a
                                    href={`/patient_reports/${aq?.patient_id}/patient_encounters/new`}
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
                            ))
                          ) : (
                            <p>No Quick Launch</p>
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
              </Stack>
            </Box>
            <Box
              className="action-table-row"
              sx={{
                flexBasis: "20%",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Stack
                direction={"row"}
                spacing={3}
                alignItems={"baseline"}
                justifyContent={"space-between"}
                width={"100%"}
                pr={3}
              >
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
                <Box width={"20px"}></Box>
                <Box width={"20px"}></Box>
                <Box width={"20px"}></Box>
              </Stack>
            </Box>
          </Box>
        ))}
    </>
  );
};

const ActionRow = ({ aq, providers }) => {
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [showHistoryFor, setShowHistoryFor] = React.useState<number>();

  const getDateColor = (dateStr) => {
    const today = dayjs().startOf("day");
    const date = dayjs(dateStr).startOf("day");
    if (date.isBefore(today)) {
      return { background: "red", text: "white" };
    } else if (date.isSame(today)) {
      return { background: "#FF890A", text: "white" };
    } else {
      return { background: "#EFE9E8", text: "black" };
    }
  };

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resources, setResources] = useState<any>([]);

  return (
    <>
      <GeneralModal
        open={showResourceModal}
        title={`Action/Step Resource(s)`}
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
            {!!resources && resources?.length > 0 ? (
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
      {showHistoryModal && setShowHistoryFor && (
        <ActionQueueHistoryModal
          open={showHistoryModal}
          onCloseModal={() => {
            setShowHistoryFor(undefined);
            setShowHistoryModal(false);
          }}
          actionQueueId={showHistoryFor}
        />
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 11fr",
          alignItems: "center",
          padding: "10px 0",
          width: "100%",
        }}
      >
        <Box
          className="action-table-row"
          display={"flex"}
          height={"100%"}
          alignItems={"flex-start"}
          sx={{ flexBasis: "120px", textAlign: "center", pl: "0 !important" }}
        >
          {aq.due_date && (
            <Grid
              container
              direction="column"
              alignItems="center"
              height={"100%"}
            >
              <Grid item height={"50px"}>
                <Box
                  sx={{
                    backgroundColor: "#F5F5F5",
                    padding: "8px 5px",
                    borderRadius: "4px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    marginTop: "8px",
                    marginBottom: "8px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                    }}
                  >
                    {dayjs(aq.due_date).format("MMMM - YYYY").toUpperCase()}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                item
                sx={{
                  borderRight: `1px solid ${
                    getDateColor(aq?.due_date).background
                  }`,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
                height={"calc(100% - 50px)"}
              >
                <Box
                  sx={{
                    backgroundColor: `${getDateColor(aq?.due_date).background}`,
                    color: `${getDateColor(aq?.due_date).text}`,
                    borderRadius: "4px",
                    padding: "8px 8px",
                    textAlign: "center",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    minWidth: "50px",
                    justifyContent: "center",
                    height: "50px",
                  }}
                >
                  <Typography
                    // variant="caption"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.55rem",
                    }}
                  >
                    {dayjs(aq.due_date).format("dddd").toUpperCase()}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {dayjs(aq.due_date).format("D").toUpperCase()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
        <Box width={"100%"}>
          {aq.action_data?.map((actionQueue, index) => (
            <div key={actionQueue.action_queue_id}>
              <ActionItem aq={actionQueue} providers={providers} />
            </div>
          ))}
        </Box>
      </Box>
    </>
  );
};

const GlobalActionQueue: React.FC<Props> = () => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [globalActionQueues, setGlobalActionQueues] = useState<any>([]);
  const [providers, setProviders] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [globalActionPastDays, setGlobalActionPastDays] = useState<number>(0);
  const [globalActionFutureDays, setGlobalActionFutureDays] =
    useState<number>(0);

  const [checkedAction, setCheckedAction] = React.useState<any>("All Actions");
  const [checkedProviders, setCheckedProviders] = React.useState<any[]>([]);
  const [checkedCategories, setCheckedCategories] = React.useState<any[]>([]);
  const [badgeData, setBadgeData] = React.useState<ChipData[]>([]);

  const [actionTypes, setActionTypes] = useState([]);
  const [providerLists, setProviderLists] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProviders();
    // Reset the state and fetch new data when filter changes
    setGlobalActionQueues([]);
    setPage(1);
    setHasMoreData(false);
    fetchActionQueues(1);
    getFilterOptionsWithCounts();
  }, [startDate, endDate]);

  useEffect(() => {
    fetchActionQueues(1);
    getFilterOptionsWithCounts();
  }, [badgeData]);

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    if (globalActionPastDays === 0 && globalActionFutureDays === 0) {
      // Default to a two-week period: today - 13 days (going backwards)
      const defaultStartDate = dayjs().subtract(13, "day").format("YYYY-MM-DD");
      const defaultEndDate = dayjs().format("YYYY-MM-DD");
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    } else {
      // Use custom settings
      const calculatedStartDate = dayjs()
        .subtract(globalActionPastDays, "day")
        .format("YYYY-MM-DD");
      const calculatedEndDate = dayjs()
        .add(globalActionFutureDays, "day")
        .format("YYYY-MM-DD");
      setStartDate(calculatedStartDate);
      setEndDate(calculatedEndDate);
    }
  }, [globalActionPastDays, globalActionFutureDays]);

  const getSettings = async () => {
    const response = await fetch(`/company_action_settings`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    });
    const result = await response.json();
    if (result.success == false) {
      alert(result.message);
    } else {
      const settings = result.resource;
      if (settings) {
        setGlobalActionPastDays(settings.global_action_past_days);
        setGlobalActionFutureDays(settings.global_action_future_days);
      }
    }
  };

  const getFilterOptionsWithCounts = async () => {
    const queryParams = new URLSearchParams({
      start_date: startDate ? startDate : "",
      end_date: endDate ? endDate : "",
    });
    const response = await fetch(
      `/data_fetching/global_action_filter_options?${queryParams}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    );
    const result = await response.json();

    if (result.success == false) {
      alert(result.message);
    } else {
      const data = result.resource;
      if (data.action_counts) {
        const counts = data?.action_counts[0];
        const initActionType = [
          { title: "All Actions", count: counts.all_actions_count },
          { title: "My Actions", count: counts.my_actions_count },
          { title: "Unassigned Actions", count: counts.unassigned_actions_count },
          { title: "Assigned Actions", count: counts.assigned_actions_count },
          { title: "Overdue Actions", count: counts.overdue_actions_count },
        ];
        setActionTypes(initActionType);
        const initCategories = [
          { title: "ADT Notifications", count: counts.adt_alerts },
          { title: "Questionnaire Submissions", count: counts.questionnaire_submissions },
        ];
        setCategories(initCategories);

      }
      if (data.provider_actions) {
        const initProviders = data.provider_actions.map(provider => {
          return {
            title: provider?.title, count: provider?.counts
          }
        })
        console.log(initProviders);
        setProviderLists(initProviders);
      }
    }

  }

  const fetchActionQueues = async (pageNumber: number) => {
    var actionType = '';
    var providers = [];
    var advancedCategories = [];
    badgeData.map((d) => {
      if (d.type == 'action') actionType = d.label;
      if (d.type == 'provider') providers.push(d.label);
      if (d.type == 'category') advancedCategories.push(d.label);
    });
    const queryParams = new URLSearchParams({
      page: pageNumber.toString(),
      start_date: startDate ? startDate : "",
      end_date: endDate ? endDate : "",
      action_type: actionType,
      providers: providers.join(','),
      advanced_categories: advancedCategories.join(',')
    });

    const response = await fetch(
      `/data_fetching/global_action_queues?${queryParams}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    );
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    if (result.success == false) {
      alert(result.error);
    } else {
      if (pageNumber === 1) {
        // Replace existing data for first page
        setGlobalActionQueues(result.resource?.data || []);
      } else {
        // Append data for subsequent pages
        setGlobalActionQueues((prevActions) => [
          ...prevActions,
          ...(result.resource?.data || []),
        ]);
      }
      setHasMoreData(result.resource?.pagination?.has_more);
      setPage(pageNumber + 1);
    }
  };

  const fetchProviders = async () => {
    const response = await fetch(`/data_fetching/core_teams`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    });
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    if (result.success == false) {
      alert(result.error);
    } else {
      const formattedProviders = result.resource.providers.map((provider) => ({
        id: provider.id,
        name: `${provider.last_name}, ${provider.first_name}`,
      }));
      setProviders(formattedProviders);
    }
  };
  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoadMore = () => {
    fetchActionQueues(page);
  };

  const clearAllFilters = () => {
    setCheckedAction("All Actions");
    setCheckedProviders([]);
    setCheckedCategories([]);
  };

  const handleDeleteBadge = (badgeToDelete) => {
    if (badgeToDelete?.type == "provider") {
      setCheckedProviders((badges) =>
        badges.filter((badge) => badge !== badgeToDelete.label)
      );
    }

    if (badgeToDelete?.type == "category") {
      setCheckedCategories((badges) =>
        badges.filter((badge) => badge !== badgeToDelete.label)
      );
    }

    if (badgeToDelete?.type == "action") {
      setCheckedAction("");
    }
  };

  React.useEffect(() => {
    const providerBadges = checkedProviders.map((provider) => ({
      key: provider,
      label: provider,
      type: "provider",
    }));

    const categoryBadges = checkedCategories.map((category) => ({
      key: category,
      label: category,
      type: "category",
    }));

    const actionBadge = (checkedAction && checkedAction !== "All Actions")
      ? {
          key: checkedAction,
          label: checkedAction,
          type: "action",
        }
      : null;
    let updatedBadgeData: any[] = [];
    if (
      checkedAction === "My Actions" ||
      checkedAction === "Unassigned Actions"
    )
      updatedBadgeData = [actionBadge, ...categoryBadges].filter(Boolean);

    else
      updatedBadgeData = [actionBadge, ...providerBadges, ...categoryBadges].filter(Boolean);

    setBadgeData(updatedBadgeData);
  }, [checkedProviders, checkedCategories, checkedAction]);

  return (
    <div className="main-content-outer">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <FlashMessage flashMessage={flashMessage} />
        <Grid item xs={12} className="patient-edit-container patient-edit-form">
          <Grid container>
            <Grid
              className="patient-edit-header"
              container
              justifyContent="space-between"
            >
              <Grid item xs={3} display={"flex"} alignItems={"center"}>
                <p className="secondary-label" style={{ marginLeft: "0px" }}>
                  Global Action Queue
                </p>
              </Grid>
              <Grid
                xs={9}
                item
                className="global-action-queue-filter-container"
              >
                <div className="date-container">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Due Date From"
                      value={startDate || null}
                      onChange={(date) => {
                        if (date instanceof Date && isValid(date)) {
                          setStartDate(dateToString(date));
                        }
                      }}
                      className="textInput plainLabel"
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          placeholder: "mm/dd/yyyy",
                          style: {
                            fontSize: 12,
                            color: "#868382",
                            opacity: 1,
                            fontWeight: 500,
                          },
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          color: "#868382",
                          fontSize: 12,
                          fontWeight: 500,
                          margin: "10px 0 0 10px",
                        },
                      }}
                      style={{
                        margin: 0,
                        backgroundColor: "rgb(239, 233, 231)",
                        height: "42.5px",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>

                <div className="date-container">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      label="Due Date Through"
                      id="date-picker-inline"
                      value={endDate || null}
                      onChange={(date) => {
                        if (date instanceof Date && isValid(date)) {
                          setEndDate(dateToString(date));
                        }
                      }}
                      className="textInput plainLabel"
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          placeholder: "mm/dd/yyyy",
                          style: {
                            fontSize: 12,
                            color: "#868382",
                            opacity: 1,
                            fontWeight: 500,
                          },
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          color: "#868382",
                          fontSize: 12,
                          fontWeight: 500,
                          margin: "10px 0 0 10px",
                        },
                      }}
                      style={{
                        margin: 0,
                        backgroundColor: "rgb(239, 233, 231)",
                        height: "42.5px",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div
                  className="advanced-search-container"
                  onClick={handleOpenFilter}
                >
                  <FilterListIcon sx={{ width: 20, height: 20 }} />
                  <p className="advanced-search-text">Advanced Search</p>
                  {anchorEl ? (
                    <ArrowDropUp sx={{ width: 24, height: 24 }} />
                  ) : (
                    <ArrowDropDownIcon sx={{ width: 24, height: 24 }} />
                  )}
                </div>
                <FilterMenu
                  startDate={startDate}
                  endDate={endDate}
                  actionTypes={actionTypes}
                  providerLists={providerLists}
                  categories={categories}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  checkedProviders={checkedProviders}
                  setCheckedProviders={setCheckedProviders}
                  checkedCategories={checkedCategories}
                  setCheckedCategories={setCheckedCategories}
                  checkedAction={checkedAction}
                  setCheckedAction={setCheckedAction}
                />
              </Grid>
            </Grid>

            <Grid container className="p-4">
              {badgeData?.length > 0 && (
                <>
                  <div className="list-header">Active Filters</div>
                  <div className="badge">
                    <BadgeList
                      badgeData={badgeData}
                      setBadgeData={setBadgeData}
                      handleDeleteBadge={handleDeleteBadge}
                    />
                    <div>
                      <button className="clear-btn" onClick={clearAllFilters}>
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </>
              )}
              <Grid item xs={12}>
                <Box width={"100%"}>
                  <Box
                    sx={{
                      display: "flex",
                      paddingBottom: "10px",
                      py: 2,
                      width: "100%",
                    }}
                    className="box-header"
                  >
                    <Box
                      sx={{ flexBasis: "120px", textAlign: "left" }}
                      className="action-table-header"
                    >
                      Due Date
                    </Box>
                    <Box
                      sx={{ flexBasis: "10%", textAlign: "left", ml: 2 }}
                      className="action-table-header"
                    >
                      Status
                    </Box>
                    <Box
                      sx={{ flexBasis: "20%", textAlign: "left" }}
                      className="action-table-header"
                    >
                      Patient
                    </Box>
                    <Box
                      sx={{ flexBasis: "20%", textAlign: "left" }}
                      className="action-table-header"
                    >
                      Action Title
                    </Box>
                    <Box
                      sx={{ flexBasis: "20%", textAlign: "left" }}
                      className="action-table-header"
                    >
                      Subtext
                    </Box>
                    <Box
                      sx={{ flexBasis: "20%", textAlign: "left" }}
                      className="action-table-header"
                    >
                      Provider
                    </Box>
                    <Box
                      sx={{ flexBasis: "20%", textAlign: "center" }}
                      className="action-table-header"
                    >
                      Actions
                    </Box>
                  </Box>

                  {globalActionQueues.length > 0 ? (
                    globalActionQueues.map((aq, index) => (
                      <ActionRow key={index} aq={aq} providers={providers} />
                    ))
                  ) : (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      No actions found for the selected date range.
                    </Box>
                  )}
                </Box>
                {hasMoreData && (
                  <Stack
                    width={"100%"}
                    justifyContent={"center"}
                    display={"flex"}
                    alignItems={"center"}
                    my={2}
                  >
                    <Link
                      sx={{ textDecoration: "underline" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLoadMore();
                      }}
                    >
                      Load More
                    </Link>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default GlobalActionQueue;
