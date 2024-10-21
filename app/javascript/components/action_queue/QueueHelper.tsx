import { MenuItem } from "@mui/material";
import globals from "../globals/globals";
import React from "react";
import { toTitleCase } from "../utils/CaseFormatHelper";
import AssignmentModal from "./modals/AssignmentModal";
import ActionModal from "./modals/ActionModal";
import UnassignModal from "./modals/UnassignModal";
import DismissModal from "./modals/DismissModal";
import CompleteModal from "./modals/CompleteModal";
import IncompleteModal from "./modals/IncompleteModal";
import DeferModal from "./modals/DeferModal";

export const formatActionsArray = (actionsArray, other_data) => {
  return actionsArray?.map((action) => {
    return { ...action, ...other_data };
  });
};

export const getAssignedActionStatuses = (actionStatuses) => {
  return actionStatuses?.map((status) => {
    if (status == "unassigned") return;
    return (
      <MenuItem key={status} value={status}>
        {toTitleCase(status)}
      </MenuItem>
    );
  });
};

export const getProviderListOptions = (providerList) => {
  return providerList?.map((provider) => {
    return (
      <MenuItem key={provider.id} value={provider.id}>
        {`${provider.last_name}, ${provider.first_name} ${provider.middle_name}`}
      </MenuItem>
    );
  });
};

export const getCoachListOptions = (coachOptions) => {
  return coachOptions?.map((coach) => {
    return (
      <MenuItem key={coach.id} value={coach.id}>
        {`${coach.last_name}, ${coach.first_name} ${coach.middle_name}`}
      </MenuItem>
    );
  });
};

export const assignmentTypeListOptions =
  globals.assignment_type_list_options.map((option) => {
    return (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    );
  });

export const actionMenuOptions = globals.individual_action_menu_options.map(
  (option) => {
    return (
      <MenuItem key={option[1]} value={option[1]}>
        {option[0]}
      </MenuItem>
    );
  }
);

export const completeActionMenuOptions =
  globals.complete_action_menu_options.map((option) => {
    return (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    );
  });

export const groupActionMenuOptions = globals.group_action_menu_options.map(
  (option) => {
    return (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    );
  }
);

export const completeGroupActionMenuOptions =
  globals.complete_group_action_menu_options.map((option) => {
    return (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    );
  });

export const getModal = (modalType, props) => {
  switch (modalType) {
    case "assign":
      return (
        <AssignmentModal
          successModalOpen={props.successModalOpen}
          setSuccessModalOpen={props.setSuccessModalOpen}
          successCallback={props.successCallback}
          closeCallback={props.closeCallback}
          selectedCoachId={props.selectedCoachId}
          setSelectedCoachId={props.setSelectedCoachId}
          coachListOptions={props.coachListOptions}
        />
      );
    case "unassign":
      return (
        <UnassignModal
          successModalOpen={props.successModalOpen}
          setSuccessModalOpen={props.setSuccessModalOpen}
          successCallback={props.successCallback}
          closeCallback={props.closeCallback}
        />
      );
    case "dismiss":
      return (
        <DismissModal
          successModalOpen={props.successModalOpen}
          setSuccessModalOpen={props.setSuccessModalOpen}
          successCallback={props.successCallback}
          closeCallback={props.closeCallback}
        />
      );
    case "complete":
      return (
        <CompleteModal
          successModalOpen={props.successModalOpen}
          setSuccessModalOpen={props.setSuccessModalOpen}
          successCallback={props.successCallback}
          closeCallback={props.closeCallback}
        />
      );
    case "incomplete":
      return (
        <IncompleteModal
          successModalOpen={props.successModalOpen}
          setSuccessModalOpen={props.setSuccessModalOpen}
          successCallback={props.successCallback}
          closeCallback={props.closeCallback}
        />
      );
    case "defer":
      return (
        <DeferModal
          successModalOpen={props.successModalOpen}
          setSuccessModalOpen={props.setSuccessModalOpen}
          successCallback={props.successCallback}
          closeCallback={props.closeCallback}
        />
      );
    default:
      return (
        <ActionModal
          successModalOpen={props.successModalOpen}
          setSuccessModalOpen={props.setSuccessModalOpen}
          successCallback={props.successCallback}
          closeCallback={props.closeCallback}
          setSelectedModalAction={props.setSelectedModalAction}
        />
      );
  }
};
