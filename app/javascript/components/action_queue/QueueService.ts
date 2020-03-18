import { getHeaders } from "../utils/HeaderHelper";

export const getPatientsWithUnassignedActions = (
  props,
  sortAndUpdate: Function,
  setCoachOptions: Function,
  setSelectedCoachId: Function,
  source = "all",
  startOfWeek?: string,
  endOfWeek?: string
) => {
  let url = `/data_fetching/get_patients_with_unassigned_actions?source=${source}`;

  if (startOfWeek && endOfWeek) {
    url += `&start_of_week=${startOfWeek}&end_of_week=${endOfWeek}`;
  }

  fetch(url, {
    method: "GET",
    headers: getHeaders(props.csrfToken),
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.success == false) {
        console.error(result.message);
      } else {
        sortAndUpdate(result?.resource?.patients);
        setCoachOptions(result?.resource?.coach_options);
        if (result?.resource?.coach_options?.length > 0) {
          setSelectedCoachId(result?.resource?.coach_options[0]?.id);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getPatientsWithAssignedActions = (
  props,
  sortAndUpdate,
  selectedProvider,
  selectedStatus,
  source = "all",
  startOfWeek?: string,
  endOfWeek?: string
) => {
  let url = `/data_fetching/get_patients_with_assigned_actions?selected_provider_id=${selectedProvider}&selected_status=${selectedStatus}&source=${source}`;

  if (startOfWeek && endOfWeek) {
    url += `&start_of_week=${startOfWeek}&end_of_week=${endOfWeek}`;
  }

  fetch(url, {
    method: "GET",
    headers: getHeaders(props.csrfToken),
  })
    .then((result) => result.json())
    .then((result) => {
      if (typeof result.error !== "undefined") {
        console.error(result.error);
      } else {
        sortAndUpdate(result.patients);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getProviderList = (
  props,
  setProviderList,
  setSelectedProvider
) => {
  fetch(`/data_fetching/get_provider_list`, {
    method: "GET",
    headers: getHeaders(props.csrfToken),
  })
    .then((result) => result.json())
    .then((result) => {
      if (typeof result.error !== "undefined") {
        console.error(result.error);
      } else {
        setProviderList(result.provider_options);
        setSelectedProvider(result.selected_provider?.id);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const validForm = (selectedActionIds, selectedCoachId) => {
  let valid = false;
  if (selectedActionIds || selectedCoachId) {
    valid = true;
  }
  return valid;
};

export const updateActionCoaches = (
  selectedActionIds,
  selectedCoachId,
  props,
  setSuccessMessage
) => {
  if (validForm(selectedActionIds, selectedCoachId)) {
    console.log(selectedActionIds, selectedCoachId);
    fetch(`/data_fetching/update_action_coach`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        coach_id: selectedCoachId,
        action_ids: selectedActionIds,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          props.setError(result.error);
          props.setDisabledButton(false);
        } else {
          props.setReloadHook(!props.reloadHook); // reload the queue
          setSuccessMessage(result.message);
        }
      })
      .catch((error) => {
        props.setError(error);
        props.setDisabledButton(false);
      });
  } else {
    props.setError("Invalid entries, please check your entries and try again.");
    props.setDisabledButton(false);
  }
};

export const updateAssignedActions = (
  props,
  {
    selectedActionId,
    selectedMenuAction,
    setSuccessMessage,
    selectedCoachId,
    actionDeferToDate,
  }
) => {
  if (validForm(selectedActionId, selectedCoachId)) {
    fetch(`/data_fetching/update_assigned_actions`, {
      method: "POST",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        action_ids: selectedActionId,
        selected_menu_action: selectedMenuAction,
        deferred_until: actionDeferToDate,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          props.setError(result.error);
          props.setDisabledButton(false);
        } else {
          props.setReloadHook(!props.reloadHook);
          setSuccessMessage(result.message);
        }
      })
      .catch((error) => {
        props.setError(error);
        props.setDisabledButton(false);
      });
  } else {
    props.setError("Invalid entries, please check your entries and try again.");
    props.setDisabledButton(false);
  }
};

export const handleExpandPatient = (
  actions,
  setSelectedActionIds,
  setTogglePatient,
  togglePatient
) => {
  setSelectedActionIds(actions.map((action) => action.id));
  setTogglePatient(!togglePatient);
};

export const handleExpandAction = (action, actions, setSelectedActionIds) => {
  setSelectedActionIds([action.id]);
  if (action.expanded) {
    action.expanded = false;
  } else {
    action.expanded = true;
  }
  const restOfActions = actions.filter(
    (actionObj) => actionObj.id != action.id
  );
  restOfActions.map((action) => {
    action.expanded = false;
  });
};
