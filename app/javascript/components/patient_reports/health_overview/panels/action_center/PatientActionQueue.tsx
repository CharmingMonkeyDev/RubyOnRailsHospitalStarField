import React, { useEffect } from "react";
import dayjs from "dayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SVG from "react-inlinesvg";

import {
    ImportContacts,
    EventRepeatOutlined,
    Schedule,
    AutoFixHigh,
    Launch,
    KeyboardArrowUp,
  } from "@mui/icons-material";
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
    Stack,
  } from "@mui/material";
import { useParams } from "react-router-dom";
import FlashMessage from "../../../../shared/FlashMessage";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { AuthenticationContext, FlashContext } from "../../../../Context";
import { getHeaders } from "../../../../utils/HeaderHelper";
import GeneralModal from "../../../../modals/GeneralModal";
import ActionQueueHistoryModal from "../../../../action_queue/ActionQueueHistoryModal";
import { HtmlTooltip } from "./ActionRow";

const ActionItem = ({ aq, providers }) => {
    const [expanded, setExpanded] = React.useState(false);
    const [showHistoryModal, setShowHistoryModal] = React.useState(false);
    const [showHistoryFor, setShowHistoryFor] = React.useState<number>();
    const actionStatus = [
        {
            type: 1,
            label: "Complete",
        },
        {
            type: 2,
            label: "Skipped",
        },
        {
            type: 3,
            label: "Incomplete",
        },
    ];
    const handleExpandToggle = () => {
      setExpanded(!expanded);
    };
    const [showResourceModal, setShowResourceModal] = React.useState(false);
    const [resourceOwner, setResourceOwner] = React.useState<string>();
    const [resources, setResources] = React.useState<any>([]);
    const [recurrenceToolTipOpen, setRecurrenceToolTipOpen] =
      React.useState(false);
    const [activeAutomationTooltipId, setActiveAutomationTooltipId] =
      React.useState(null);
    const [activeQLTooltipId, setActiveQLTooltipId] = React.useState(null);
  
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const openDropdown = Boolean(anchorEl);
    const openDropdown1 = Boolean(anchorEl1);
    const handleDropDownClick = (event: any) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };
    const handleDropDownClick1 = (event: any) => {
        event.stopPropagation();
        setAnchorEl1(event.currentTarget);
    };
    const handleCloseDropdown = () => {
      setAnchorEl(null);
      setAnchorEl1(null);
    };
    const [openCompleteActionModal, setOpenCompleteActionModal] = React.useState(false);
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
  
    const handleChangeStatus = (id, statusType) => {
        console.log(`aq.id: ${JSON.stringify(id)}`);
        console.log(`Status type: ${statusType}`);
        handleCloseDropdown();
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
            sx={{ flexBasis: "10%", display: "flex", alignItems: "left", paddingLeft: "0px !important" }}
          >
            <Stack
              direction={"row"}
              spacing={1}
              display={"flex"}
              alignItems={"center"}
            >
              <List
                component="nav"
                aria-label="Action Status"
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
                  onClick={handleDropDownClick1}
                  sx={{ padding: "2px 4px 2px 4px !important", fontSize: "unset" }}
                >
                  <ListItemText
                    primary={
                      <Stack direction={"row"} fontSize={"0.875rem"} sx={{
                        padding: "4px 8px 4px 8px"
                      }}>
                        <KeyboardArrowDownIcon /> &nbsp;
                        <Chip
                            label={`${aq.status.charAt(0).toUpperCase() + aq.status.slice(1)}`}
                            size="small"
                            sx={{ 
                                px: "3px",
                                width: "110px",
                                background: `${aq.status == 'incomplete' ? "#f6d7d7" : (aq.status == 'complete' ? "#00ff00" : "#0000ff")}`,
                                color: `${aq.status == 'incomplete' ? "#fd3636" : (aq.status == 'complete' ? "#41cb5b" : "#d2b144")}`,
                            }}
                        />
                      </Stack>
                    }
                  />
                    </ListItemButton>
              </List>
                <Menu
                    id="status-menu"
                    anchorEl={anchorEl1}
                    open={openDropdown1}
                    onClose={handleCloseDropdown}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    sx={{
                      paddingTop : "0px !important",
                      paddingBottom: "0px !important",
                    }}
                    >
                        <ListItemText
                            primary={
                            <Stack direction={"row"} fontSize={"0.875rem"}>
                                <MenuItem
                                    key={`${aq.id}`}
                                    onClick={() => {
                                      handleCloseDropdown();  
                                    }}>
                                    <KeyboardArrowUp /> &nbsp;
                                    <Chip
                                        label={`${aq.status.charAt(0).toUpperCase() + aq.status.slice(1)}`}
                                        size="small"
                                        sx={{
                                            px: "3px",
                                            width: "110px",
                                            color: "#565656",
                                            background: "#d3d3d3"
                                        }}
                                    />
                                </MenuItem>
                            </Stack>
                            }
                        />
                {actionStatus?.filter(status => status.label != aq.status.charAt(0).toUpperCase() + aq.status.slice(1))?.map((status, index) => (
                    <MenuItem
                        key={`${aq.id} - ${status.type}`}
                        sx={{
                            justifyContent: "flex-end"
                        }}
                        onClick={() => {
                            console.log(index, status);
                            handleChangeStatus(aq, status.type);
                    }}>
                        <Chip
                            label={`${status.label}`}
                            size="small"
                            sx={{
                                px: "3px",
                                width: "110px",
                                background: `${status.label == 'Incomplete' ? "#F6D7D7" : (status.label == 'Complete' ? "#edf7ee" : "#ffeeb6")}`,
                                color: `${status.label == 'Incomplete' ? "red" : (status.label == 'Complete' ? "#41cb5b" : "#d2b144")}`,
                            }}
                        />
                    </MenuItem>
                ))}
                </Menu>
            </Stack>
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
  
    const [showResourceModal, setShowResourceModal] = React.useState(false);
    const [resources, setResources] = React.useState<any>([]);
  
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

interface props {

}

const PatientActionQueue: React.FC<props> = ({}) => {

    let { id: patientId } = useParams();
    const authenticationSetting = React.useContext(AuthenticationContext);
    const [actionQueues, setActionQueues] = React.useState<any>([]);
    const [providers, setProviders] = React.useState<any>([]);
    useEffect(() => {
        fetchProviders();
        // Reset the state and fetch new data when filter changes
        setActionQueues([]);

        fetchActionQueues();
    }, []);
    
    const fetchActionQueues = async () => {
        const queryParams = new URLSearchParams({
            patient_id: patientId,
          });
      
        const response = await fetch(
            `/data_fetching/get_incompleted_actions?${queryParams}`,
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
            // Replace existing data for first page
            setActionQueues(result.resource?.data || []);
          }
      
    }
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
    return (
    <Grid container className="panel-container" borderRadius={"4px"}> 
        <Grid item xs={12} className="patient-edit-container patient-edit-form">
          <Grid container>
            <Grid
              className="patient-edit-header"
              container
              justifyContent="space-between"
            >
              <Grid item xs={3} display={"flex"} alignItems={"center"}>
                <p className="secondary-label" style={{ marginLeft: "0px" }}>
                  Patient's Action Queue
                </p>
              </Grid>
            </Grid>

            <Grid container className="p-4">
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
                      
                    </Box>
                  </Box>

                  {actionQueues.length > 0 ? (
                    actionQueues.map((aq, index) => (
                      <ActionRow key={index} aq={aq} providers={providers} />
                    ))
                  ) : (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      No actions found for the selected date range.
                    </Box>
                  )}
                </Box>
                {/* {hasMoreData && (
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
                )} */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
};

export default PatientActionQueue;
