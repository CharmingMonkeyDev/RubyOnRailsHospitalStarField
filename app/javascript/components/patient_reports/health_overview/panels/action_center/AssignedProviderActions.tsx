import {
  Grid,
  Link,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { getHeaders } from "../../../../utils/HeaderHelper";
import {
  AuthenticationContext,
  FlashContext,
  ImagesContext,
} from "../../../../Context";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { ImportContacts, EventRepeatOutlined } from "@mui/icons-material";
import SVG from "react-inlinesvg";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AssignProviderActionModal from "./AssignProviderActionModal";
import { getChipColor } from "./ProgramRow";
import { setSortOrder } from "../../../../shared/tables/TableHelper";
import AssignmentHistoryModal from "./AssignmentHistoryModal";
import useFetchAssignmentHistories from "../../../../hooks/patients/useFetchAssignmentHistories";
import GeneralModal from "../../../../modals/GeneralModal";
import CustomChip from "../../../../shared/CustomChip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { th } from "date-fns/locale";
import { snakeCaseToTitleCase } from "../../../../utils/CaseFormatHelper";

const ActionRow = ({
  index,
  assignedAction,
  patientId,
  onActionComplete,
  expandedInitially = false,
}) => {
  const action = assignedAction?.action;
  const actionSteps = assignedAction?.action_steps;
  const [expanded, setExpanded] = useState(expandedInitially);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceOwner, setResourceOwner] = useState<string>();
  const [resources, setResources] = useState<any>([]);

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

  const [notes, setNotes] = useState("");
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  const handleCompleteAction = async () => {
    try {
      const response = await fetch(
        `/patients/${patientId}/assigned_provider_actions/${assignedAction.id}/complete_action`,
        {
          method: "PUT",
          headers: getHeaders(authenticationSetting.csrfToken),
          body: JSON.stringify({
            notes: notes,
          }),
        }
      );
      const result = await response.json();
      setOpenCompleteActionModal(false);
      flashContext.setMessage({
        text: result.message,
        type: result.success == false ? "error" : "success",
      });
      onActionComplete();
    } catch (error) {
      console.error(error);
      flashContext.setMessage({
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  return (
    <>
      <TableRow key={action.id} onClick={handleExpandToggle}>
        <TableCell
          style={{
            paddingLeft: "24px",
          }}
        >
          <Box sx={{ pt: index === 0 ? 2 : 0 }}>{action.category}</Box>
        </TableCell>
        <TableCell>
          <Box sx={{ pt: index === 0 ? 2 : 0 }}>
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
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ pt: index === 0 ? 2 : 0 }}>{action.title}</Box>
        </TableCell>
        <TableCell>
          <Box sx={{ pt: index === 0 ? 2 : 0 }}>{action.subject}</Box>
        </TableCell>
        <TableCell>
          <Box sx={{ pt: index === 0 ? 2 : 0 }}>{"Provider Action"}</Box>
        </TableCell>
        <TableCell>
          <Stack direction={"row"} spacing={1} pt={index === 0 ? 2 : 0}>
            {assignedAction?.status === "active" && (
              <div>
                <KeyboardArrowDownIcon
                  aria-controls={openDropdown ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDropdown ? "true" : undefined}
                  onClick={(event) => handleDropDownClick(event)}
                />
                <Menu
                  id="status-menu"
                  anchorEl={anchorEl}
                  open={openDropdown}
                  onClose={handleCloseDropdown}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <MenuItem onClick={handleManualComplete}>
                    Manual Complete
                  </MenuItem>
                </Menu>
              </div>
            )}
            <CustomChip
              label={snakeCaseToTitleCase(assignedAction?.status)}
              type={getChipColor(assignedAction?.status)}
              sx={{ px: 2, textTransform: "capitalize", width: "100%" }}
              fullWidth={true}
            />
          </Stack>
        </TableCell>
        <TableCell>
          <Stack
            direction={"row"}
            spacing={3}
            alignItems={"center"}
            justifyContent={"end"}
            pr={2}
            pt={index === 0 ? 2 : 0}
          >
            {!!action.action_resources &&
              action.action_resources.length > 0 && (
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
            <EventRepeatOutlined style={{ fontSize: "1.5em" }} />
            {expanded ? (
              <ArrowDropUpIcon style={{ fontSize: "2em" }} />
            ) : (
              <ArrowDropDownIcon style={{ fontSize: "2em" }} />
            )}
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
            <TableCell>{step.subtext}</TableCell>
            <TableCell></TableCell>
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
      <GeneralModal
        title={"Complete Action?"}
        confirmButtonText="Complete Action"
        open={openCompleteActionModal}
        successCallback={handleCompleteAction}
        closeCallback={() => {
          setOpenCompleteActionModal(false);
          setNotes("");
        }}
        width="500px"
      >
        <Stack gap={2} mt={2}>
          <Typography>
            You are about to end this action for this patient. Would you like to
            add any additional notes on the completion?
          </Typography>
          <TextField
            label="Additional Notes"
            placeholder="Enter Additional Notes"
            value={notes}
            className="textInput"
            required
            multiline
            maxRows={20}
            minRows={5}
            variant="filled"
            onChange={(event) => {
              setNotes(event.target.value);
            }}
            InputLabelProps={{
              required: false,
            }}
          />
        </Stack>
      </GeneralModal>
    </>
  );
};

const AssignedProviderActions = () => {
  let { id: patientId } = useParams();
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [addActionsModal, setAddActionsModal] = React.useState(false);
  const [publishedActions, setPublishedActions] = React.useState<any>([]);
  const [assignedActions, setAssignedActions] = React.useState<any>([]);
  const [allAssignedActions, setAllAssignedActions] = React.useState<any>([]);
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [reFetchingKey, setReFetchingKey] = useState(Math.random());

  React.useEffect(() => {
    fetchPublishedActions();
    fetchAssignedActions();
  }, [patientId]);

  const fetchPublishedActions = async () => {
    try {
      const response = await fetch(`/actions?status=published&unassociated=1`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      const result = await response.json();

      setPublishedActions(result?.resource);
    } catch (err) {
      alert("Error fetching published actions");
      console.error(err);
    }
  };

  const fetchAssignedActions = async () => {
    try {
      const response = await fetch(
        `/patients/${patientId}/assigned_provider_actions`,
        {
          method: "GET",
          headers: getHeaders(authenticationSetting.csrfToken),
        }
      );
      const result = await response.json();
      setAllAssignedActions(result.resource);
      setAssignedActions(result.resource);
    } catch (err) {
      alert("Error fetching actions");
      console.error(err);
    }
  };

  const { assignmentHistories, loading, error } = useFetchAssignmentHistories(
    patientId,
    "action",
    reFetchingKey
  );

  const handleCloseAssignActionModal = () => {
    setAddActionsModal(false);
  };

  const images = React.useContext(ImagesContext);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "category",
    direction: "ascending",
  });

  const getSortedAndSearchedList = () => {
    let filteredList = [...allAssignedActions];
    filteredList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "title") {
      filteredList.sort((a, b) =>
        a.action?.title?.toLowerCase() > b.action?.title?.toLowerCase() ? 1 : -1
      );
    } else if (sortObject.field == "category") {
      filteredList.sort((a, b) =>
        a.action?.category?.toLowerCase() > b.action?.category?.toLowerCase()
          ? 1
          : -1
      );
    } else if (sortObject.field == "subject") {
      filteredList.sort((a, b) =>
        a.action?.subject?.toLowerCase() > b.action?.subject?.toLowerCase()
          ? 1
          : -1
      );
    }

    if (sortObject.direction == "descending") {
      filteredList.reverse();
    }
    return filteredList;
  };
  React.useEffect(() => {
    if (allAssignedActions) {
      const actionsList = getSortedAndSearchedList();
      setAssignedActions(actionsList);
    }
  }, [sortObject]);

  const getSortIcon = (column) => {
    return sortObject.field == column ? (
      <span className="sortIndicator">
        {sortObject.direction == "ascending" ? (
          <img
            src={images.sort_ascending_src}
            width="10"
            className="sort-icon"
            alt="Sort Asc"
          />
        ) : (
          <img
            src={images.sort_descending_src}
            width="10"
            className="sort-icon"
            alt="Sort Desc"
          />
        )}
      </span>
    ) : (
      <span className="sortIndicator">
        <img
          src={images.sort_plain_src}
          width="10"
          className="sort-icon"
          alt="Sort Asc"
        />
      </span>
    );
  };

  return (
    <Grid container className="panel-container" borderRadius={"5px"}>
      <Grid item xs={12}>
        <Grid container className="panel-show-container">
          <Grid
            container
            direction="row"
            className="admin-header"
            borderBottom={"4px solid #ff890a"}
          >
            <Grid item xs={12}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                paddingX={3}
                paddingY={1}
                alignItems={"center"}
                display={"flex"}
              >
                <Grid item>
                  <h3>Assigned Individual Actions</h3>
                </Grid>
                <div>
                  <Link
                    className="action-link add-encounter"
                    onClick={() => setShowHistoryModal(true)}
                    sx={{ mr: 3 }}
                  >
                    <img
                      src={images.history_icon}
                      alt="Edit Patient"
                      style={{
                        width: "28px",
                        marginBottom: "-8px",
                        marginRight: "2px",
                      }}
                    />
                    <span className="app-user-text">
                      Show Action Assignment History
                    </span>
                  </Link>
                  <Link
                    className="action-link add-encounter"
                    onClick={() => setAddActionsModal(true)}
                    sx={{ mr: 3 }}
                  >
                    <img
                      src={images.add_icon}
                      alt="Edit Patient"
                      style={{
                        width: "25px",
                        marginBottom: "-8px",
                        marginRight: "2px",
                      }}
                    />
                    <span className="app-user-text">Add Provider Action</span>
                  </Link>
                </div>
              </Stack>
            </Grid>
          </Grid>
          <Grid
            container
            className="tabs-container"
            style={{
              paddingTop: "10px",
            }}
          >
            <Grid item xs={12} className="panel-body">
              <Grid item xs={12} className="medication-table-container">
                <TableContainer>
                  <Table className="no-border-table">
                    <TableHead className="table-header-box">
                      <TableRow>
                        <TableCell
                          className="nowrap-header bold-font-face "
                          style={{
                            fontWeight: "bolder",
                            paddingLeft: "24px",
                            verticalAlign: "baseline",
                          }}
                          onClick={() => {
                            setSortOrder(
                              "category",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending",
                              setSortObject
                            );
                          }}
                        >
                          Category
                          {getSortIcon("category")}
                        </TableCell>
                        <TableCell
                          className="nowrap-header bold-font-face "
                          style={{
                            verticalAlign: "baseline",
                          }}
                        >
                          Icon
                        </TableCell>
                        <TableCell
                          className="nowrap-header bold-font-face "
                          style={{ verticalAlign: "baseline" }}
                          onClick={() => {
                            setSortOrder(
                              "title",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending",
                              setSortObject
                            );
                          }}
                        >
                          Action Title
                          {getSortIcon("title")}
                        </TableCell>
                        <TableCell
                          className="nowrap-header bold-font-face "
                          style={{ verticalAlign: "baseline" }}
                          onClick={() => {
                            setSortOrder(
                              "subject",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending",
                              setSortObject
                            );
                          }}
                        >
                          Subtext
                          {getSortIcon("subject")}
                        </TableCell>
                        <TableCell
                          className="nowrap-header bold-font-face "
                          style={{ verticalAlign: "baseline" }}
                        >
                          Action Type
                        </TableCell>
                        <TableCell
                          className="nowrap-header bold-font-face "
                          style={{ verticalAlign: "baseline" }}
                        >
                          Action Status
                        </TableCell>
                        <TableCell width={"150px"}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedActions?.map((assignedAction, index) => (
                        <ActionRow
                          index={index}
                          assignedAction={assignedAction}
                          key={assignedAction.id}
                          expandedInitially={false}
                          patientId={patientId}
                          onActionComplete={() => {
                            fetchAssignedActions();
                            setReFetchingKey(Math.random());
                          }}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AssignProviderActionModal
        patientId={patientId}
        open={addActionsModal}
        onAddAction={() => {
          fetchAssignedActions();
          setReFetchingKey(Math.random());
          handleCloseAssignActionModal();
        }}
        onCloseModal={handleCloseAssignActionModal}
        publishedActions={publishedActions}
      />
      <AssignmentHistoryModal
        type={"action"}
        open={showHistoryModal}
        onCloseModal={() => setShowHistoryModal(false)}
        histories={assignmentHistories}
      />
    </Grid>
  );
};

export default AssignedProviderActions;
