// Library Imports
import * as React from "react";
import { Grid, Link, Checkbox, Paper } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

// component imports
import SortableHeaderColumn from "../../../shared/tables/SortableHeaderColumn";

// app setting imports
import { AuthenticationContext, FlashContext } from "../../../Context";

// importing header helpers
import { getHeaders } from "../../../utils/HeaderHelper";
import { formatToUsDate } from "../../../utils/DateHelper";
import {
  getCoachListOptions,
  getModal,
} from "../../../action_queue/QueueHelper";
import {
  updateActionCoaches,
  updateAssignedActions,
} from "../../../action_queue/QueueService";
import { getSortedListByString } from "../../../shared/tables/TableHelper";
interface Props {
  patient_id: string;
}

export type ActionModalType =
  | "assign"
  | "unassign"
  | "complete"
  | "incomplete"
  | "action"
  | "dismiss"
  | "defer";

const ProviderAction: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  // For field states
  const [panelExpanded, setPanelExpanded] = React.useState<boolean>(true);

  // other states
  const [assignedActions, setAssignedActions] = React.useState<any>([]);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "due_date",
    direction: "descending",
  });
  const [selectedActionId, setSelectedActionId] = React.useState<any>("");
  const [successModalOpen, setSuccessModalOpen] =
    React.useState<boolean>(false);
  const [selectedModalAction, setSelectedModalAction] =
    React.useState<ActionModalType>("action");
  const [selectedCoachId, setSelectedCoachId] = React.useState<any>("");
  const [coachOptions, setCoachOptions] = React.useState<any>(null);
  const coachListOptions = getCoachListOptions(coachOptions);
  const [reloadHook, setReloadHook] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState<boolean>(false);
  const [sortedAssignedActions, setSortedAssignedActions] = React.useState<any>(
    []
  );

  React.useEffect(() => {
    getAssignedActions();
    fetchCoachOptions();
  }, [props.patient_id, reloadHook]);

  const getAssignedActions = () => {
    if (props.patient_id) {
      fetch(`/provider_assigned_actions/${props.patient_id}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setAssignedActions(result?.resource);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // panel expansion collapse controller
  const togglePanelExpansion = () => {
    setPanelExpanded(!panelExpanded);
  };

  // getting coach options for model
  const fetchCoachOptions = () => {
    fetch(`/data_fetching/get_patients_with_unassigned_actions?source=all`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setCoachOptions(result?.resource?.coach_options);
          if (result?.resource?.coach_options?.length > 0) {
            setSelectedCoachId(result?.resource?.coach_options[0]?.id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeCallback = () => {
    setSelectedModalAction("action");
  };

  const actionUpdateSuccessCallback = async (actionDeferToDate = null) => {
    //Show next modal in flow (either an error message or the next screen)
    if (selectedModalAction == "assign") {
      updateActionCoaches(
        selectedActionId,
        selectedCoachId,
        {
          csrfToken: authenticationSetting.csrfToken,
          setError: setError,
          setReloadHook: setReloadHook,
          setDisabledButton: setDisabledButton,
        },
        setSuccessMessage
      );
    } else if (selectedModalAction != "action") {
      updateAssignedActions(
        {
          setError: setError,
          setDisabledButton: setDisabledButton,
          csrfToken: authenticationSetting.csrfToken,
          setReloadHook: setReloadHook,
        },
        {
          selectedActionId,
          selectedMenuAction: selectedModalAction,
          setSuccessMessage: setSuccessMessage,
          selectedCoachId,
          actionDeferToDate,
        }
      );
      setReloadHook(!reloadHook);
    }

    if (selectedModalAction != "action") {
      setSuccessModalOpen(false);
      setSelectedModalAction("action");
    }
  };

  const modal = getModal(selectedModalAction, {
    successModalOpen,
    setSuccessModalOpen,
    successCallback: actionUpdateSuccessCallback,
    selectedModalAction,
    setSelectedModalAction,
    closeCallback,
    selectedCoachId,
    setSelectedCoachId,
    coachListOptions,
  });

  // setting flashMessage
  React.useEffect(() => {
    if (successMessage.length >= 1) {
      flashContext.setMessage({
        text: successMessage,
        type: "success",
      });
    } else if (error.length >= 1) {
      flashContext.setMessage({
        text: error,
        type: "error",
      });
    }
  }, [successMessage, error]);

  // sorting functions
  React.useEffect(() => {
    if (assignedActions) {
      sortList();
    }
  }, [sortObject, assignedActions]);

  const sortList = () => {
    switch (sortObject.field) {
      case "provider_name":
        setSortedAssignedActions(
          getSortedListByString(assignedActions, sortObject, "provider_name")
        );
        break;
      case "text":
        setSortedAssignedActions(
          getSortedListByString(assignedActions, sortObject, "text")
        );
        break;
      case "due_date":
        setSortedAssignedActions(
          getSortedListByString(assignedActions, sortObject, "due_date")
        );
        break;
      default:
        break;
    }
  };
  return (
    <Grid container className="panel-container">
      <Grid item xs={12}>
        <Grid container className="panel-show-container">
          <Grid container className="panel-information-container">
            <Grid
              container
              direction="row"
              className="admin-header cursor-pointer"
              onClick={togglePanelExpansion}
            >
              <Grid item xs={12} lg={6}>
                <h3>Provider Actions</h3>
              </Grid>
              <Grid
                container
                item
                lg={6}
                direction="row"
                justifyContent="flex-end"
                style={{ flexWrap: "nowrap" }}
              >
                {panelExpanded ? (
                  <>
                    <span>
                      <Link className="action-icon">
                        <ArrowDropUpIcon className="expand-icon" />
                      </Link>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <Link className="action-icon">
                        <ArrowDropDownIcon className="expand-icon" />
                      </Link>
                    </span>
                  </>
                )}
              </Grid>
            </Grid>
            {panelExpanded && (
              <Grid
                container
                className="care-plan-container grey-container pad-top-10"
              >
                <Grid item xs={12}>
                  <Grid
                    item
                    xs={12}
                    style={{
                      paddingRight: "10px",
                      background: "white",
                      paddingTop: "15px",
                    }}
                  >
                    <div
                      className="add-medication-btn"
                      style={{
                        marginRight: "0px",
                      }}
                    >
                      <Link
                        href={`/care-plan-management?patient=${props.patient_id}`}
                        className="btn-link"
                        style={{
                          paddingRight: "15px",
                          paddingLeft: "15px",
                        }}
                      >
                        Edit Care Plan
                      </Link>
                    </div>
                  </Grid>
                </Grid>
                <TableContainer component={Paper} className="tableContainer">
                  <Table className="table" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <SortableHeaderColumn
                          setSortObject={setSortObject}
                          sortObject={sortObject}
                          sort_ascending_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-ascending.png"
                          sort_plain_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-plain.png"
                          sort_descending_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-descending.png"
                          columnTitle="Action"
                          columnSortField="text"
                        />
                        <SortableHeaderColumn
                          setSortObject={setSortObject}
                          sortObject={sortObject}
                          sort_ascending_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-ascending.png"
                          sort_plain_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-plain.png"
                          sort_descending_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-descending.png"
                          columnTitle="Provider"
                          columnSortField="provider_name"
                        />
                        <SortableHeaderColumn
                          setSortObject={setSortObject}
                          sortObject={sortObject}
                          sort_ascending_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-ascending.png"
                          sort_plain_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-plain.png"
                          sort_descending_src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/sort-descending.png"
                          columnTitle="Due Date"
                          columnSortField="due_date"
                        />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedAssignedActions ? (
                        sortedAssignedActions.map((assignedAction) => {
                          return (
                            <TableRow
                              key={assignedAction.id}
                              className={`row ${
                                new Date(assignedAction.due_date) <
                                  new Date() && "overdue-action"
                              }`}
                            >
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                <div>{assignedAction?.text}</div>
                                <div>{assignedAction?.subtext}</div>
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                {assignedAction?.provider_name
                                  ? assignedAction?.provider_name
                                  : "Unassigned"}
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                <div className="actionList">
                                  <div
                                    className="actionItem"
                                    onClick={() => {
                                      setSelectedActionId([assignedAction.id]);
                                      setSuccessModalOpen(!successModalOpen);
                                    }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <p>
                                      {assignedAction.due_date
                                        ? formatToUsDate(
                                            assignedAction.due_date
                                          )
                                        : "No Due Date"}
                                    </p>
                                    <MoreVert className="actionIcon" />
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <p>No actions found.</p>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      {modal && modal}
    </Grid>
  );
};

export default ProviderAction;
