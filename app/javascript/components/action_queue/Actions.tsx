/* eslint-disable react-hooks/exhaustive-deps */
import { FormControl, Grid, Modal, Select } from "@mui/material";
import * as React from "react";

// helpers
import { useEffect } from "react";
import { ActionSourceFilterType } from "./ActionQueue";
import ActionsTable from "./ActionsTable";
import AssignedAction from "./AssignedAction";
import {
  assignmentTypeListOptions,
  formatActionsArray,
  getAssignedActionStatuses,
  getCoachListOptions,
  getProviderListOptions,
  getModal,
} from "./QueueHelper";
import {
  getPatientsWithAssignedActions,
  getPatientsWithUnassignedActions,
  getProviderList,
  updateActionCoaches,
  updateAssignedActions,
} from "./QueueService";
import UnassignedAction from "./UnassignedAction";
import ClearIcon from "@mui/icons-material/Clear";
import { getHeaders } from "../utils/HeaderHelper";

export type ActionAssignmentType =
  | "My Actions"
  | "Unassigned Actions"
  | "Assigned Actions"
  | "All Actions";

export type ActionModalType =
  | "assign"
  | "unassign"
  | "complete"
  | "incomplete"
  | "action"
  | "dismiss"
  | "defer";

interface Props {
  csrfToken: string;
  user_id: string;
  setError: any;
  setSuccessMessage: Function;
  setDisabledButton: any;
  reloadHook: boolean;
  setReloadHook: Function;
  actionStatuses: any;
  action_queue_assign_icon: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  sort_plain_src: string;
  source: ActionSourceFilterType;
}

const Actions: React.FC<Props> = (props: Props) => {
  const { source } = props;

  const [patientsWithAssigned, setPatientsWithAssigned] =
    React.useState<any>(null);
  const [patientsWithUnassigned, setPatientsWithUnassigned] =
    React.useState<any>(null);
  const [assignedActionsList, setAssignedActionsList] = React.useState<any>([]);
  const [unassignedActionsList, setUnassignedActionsList] = React.useState<any>(
    []
  );

  const [showResourceModal, setShowResourceModal] = React.useState(false);
  const [associatedResources, setAssociatedResources] = React.useState<any>();

  const assignedActionStatuses = getAssignedActionStatuses(
    props.actionStatuses
  );

  const [actionsList, setActionsList] = React.useState<any>([]);
  const [selectedActionAssignment, setSelectedActionAssignment] =
    React.useState<ActionAssignmentType>("All Actions");
  const [selectedProvider, setSelectedProvider] = React.useState<any>(null); //this is provider id
  const [selectedStatus, setSelectedStatus] =
    React.useState<string>("incomplete");
  const [providerList, setProviderList] = React.useState<any>(null);
  const [coachOptions, setCoachOptions] = React.useState<any>(null);
  const [selectedCoachId, setSelectedCoachId] = React.useState<any>("");
  const [selectedActionId, setSelectedActionId] = React.useState<any>("");
  const providerListOptions = getProviderListOptions(providerList);
  const coachListOptions = getCoachListOptions(coachOptions);
  const [successModalOpen, setSuccessModalOpen] =
    React.useState<boolean>(false);

  const [selectedModalAction, setSelectedModalAction] =
    React.useState<ActionModalType>("action");

  useEffect(() => {
    getProviderList(props, setProviderList, setSelectedProvider);
  }, [props.reloadHook]);

  useEffect(() => {
    if (selectedProvider) {
      let selectedActionStatus = "";
      if (selectedActionAssignment == "Assigned Actions") {
        selectedActionStatus = selectedStatus;
      }

      getPatientsWithAssignedActions(
        props,
        sortAndUpdateAssignedActions,
        selectedProvider,
        selectedActionStatus,
        source
      );
    }

    getPatientsWithUnassignedActions(
      props,
      sortAndUpdateUnassignedActions,
      setCoachOptions,
      setSelectedCoachId,
      source
    );
  }, [
    selectedProvider,
    selectedStatus,
    selectedActionAssignment,
    source,
    props.reloadHook,
  ]);

  useEffect(() => {
    const selectedCoach =
      coachOptions?.find((c) => c.id == selectedCoachId) ?? {};
    const assigned_actions = patientsWithAssigned
      ?.map((patient) => {
        return formatActionsArray(patient.assigned_actions, {
          patient_id: patient.id,
          provider_name: selectedCoach.name ?? "",
        });
      })
      ?.flat();

    setAssignedActionsList(assigned_actions);
  }, [patientsWithAssigned, selectedCoachId]);

  useEffect(() => {
    const selectedCoach =
      coachOptions?.find((c) => c.id == selectedCoachId) ?? {};

    const unassigned_actions = patientsWithUnassigned
      ?.map((patient) => {
        return formatActionsArray(patient.unassigned_actions, {
          patient_id: patient.id,
          provider_name: selectedCoach.name ?? "",
        });
      })
      ?.flat();

    setUnassignedActionsList(unassigned_actions);
  }, [patientsWithUnassigned, selectedCoachId]);

  useEffect(() => {
    let actions = [];
    if (selectedActionAssignment == "My Actions") {
      actions = assignedActionsList.filter(
        (action) => action.assigned_coach_id == props?.user_id
      );
    } else if (selectedActionAssignment == "Assigned Actions") {
      actions = assignedActionsList;
    } else if (selectedActionAssignment == "Unassigned Actions") {
      actions = unassignedActionsList;
    } else if (assignedActionsList && unassignedActionsList) {
      actions = [...assignedActionsList, ...unassignedActionsList];
    }
    setActionsList(actions);
  }, [
    selectedActionAssignment,
    source,
    assignedActionsList,
    unassignedActionsList,
  ]);

  const sortAndUpdateAssignedActions = (patientsArray) => {
    if (patientsArray) {
      patientsArray.sort((a, b) => (a.last_name > b.last_name ? 1 : -1));
      setPatientsWithAssigned(patientsArray);
    }
  };

  const sortAndUpdateUnassignedActions = (patientsArray) => {
    if (patientsArray) {
      patientsArray.sort((a, b) => (a.last_name > b.last_name ? 1 : -1));
      setPatientsWithUnassigned(patientsArray);
    }
  };

  const handleActionAssignmentChange = (value) => {
    setSelectedActionAssignment(value);
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
        props,
        props.setSuccessMessage
      );
    } else if (selectedModalAction != "action") {
      updateAssignedActions(props, {
        selectedActionId,
        selectedMenuAction: selectedModalAction,
        setSuccessMessage: props.setSuccessMessage,
        selectedCoachId,
        actionDeferToDate,
      });
      props.setReloadHook(!props.reloadHook);
    }

    if (selectedModalAction != "action") {
      setSuccessModalOpen(false);
      setSelectedModalAction("action");
    }
  };

  const handleResourceClick = (id: string) => {
    setShowResourceModal(true);
    fetch(`/action/${id}/resouce_items`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.error(result.message);
        } else {
          setAssociatedResources(result?.resource);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const actionListFragments = actionsList?.map((action) => {
    let fragment = null;
    if (action.status != "unassigned") {
      fragment = (
        <AssignedAction
          key={action.id + ":assigned"}
          action={action}
          patients={patientsWithAssigned}
          setSuccessModalOpen={setSuccessModalOpen}
          successModalOpen={successModalOpen}
          selectedStatus={selectedStatus}
          coachOptions={coachOptions}
          setSelectedActionId={setSelectedActionId}
          handleResourceClick={handleResourceClick}
        />
      );
    } else {
      fragment = (
        <UnassignedAction
          key={action.id + ":unassigned"}
          action={action}
          patients={patientsWithUnassigned}
          setSuccessModalOpen={setSuccessModalOpen}
          successModalOpen={successModalOpen}
          setSelectedActionId={setSelectedActionId}
          handleResourceClick={handleResourceClick}
        />
      );
    }
    return fragment;
  });

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

  return (
    <>
      <Grid item xs={12} className="action-queue-table-container">
        <div
          className="userAdminInformation"
          style={{ boxShadow: "none", marginRight: "0px" }}
        >
          <Grid
            container
            direction="row"
            style={{ padding: "15px", borderBottom: "1px solid #A29D9B" }}
          >
            <Grid item xs={3}>
              <FormControl variant="standard">
                <Select
                  id="ActionType"
                  value={selectedActionAssignment}
                  label="Action Type"
                  onChange={(e) => handleActionAssignmentChange(e.target.value)}
                >
                  {assignmentTypeListOptions}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}></Grid>
            {selectedActionAssignment == "Assigned Actions" && (
              <>
                <Grid item xs={3}>
                  <Select
                    id="Provider"
                    value={selectedProvider}
                    label="Provider"
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    {providerListOptions}
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <Select
                    id="Status"
                    value={selectedStatus}
                    label="Status"
                    onChange={(e) => setSelectedStatus(e.target.value.toString())}
                  >
                    {assignedActionStatuses}
                  </Select>
                </Grid>
              </>
            )}
          </Grid>

          <ActionsTable
            actionListFragments={actionListFragments}
            setActionsList={setActionsList}
            actionsList={actionsList}
            {...props}
          />
        </div>
        {modal && modal}
      </Grid>
      <Modal open={showResourceModal} className="modal-primary">
        <div className="paper">
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <div className="main-header">
                  Associated Resources
                  <span
                    id="dismiss-button"
                    onClick={() => {
                      setShowResourceModal(false);
                      setAssociatedResources([]);
                    }}
                  >
                    <ClearIcon />
                  </span>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="content" style={{ padding: "40px" }}>
                  {!!associatedResources ? (
                    associatedResources.length > 0 ? (
                      associatedResources.map((resource) => (
                        <li key={resource.id}>
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {resource.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      <div>No associated resources</div>
                    )
                  ) : (
                    "Loading..."
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Actions;
