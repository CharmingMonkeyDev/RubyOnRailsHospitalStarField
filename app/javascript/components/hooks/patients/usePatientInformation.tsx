/* eslint-disable prettier/prettier */
import * as React from "react";

// helper
import { getHeaders } from "../../utils/HeaderHelper";

export const usePatientInformation = (patient, patientLabs, csrfToken) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [labA1cs, setLabA1cs] = React.useState<any>(null);
  const [labBps, setLabBps] = React.useState<any>(null);
  const [labTcs, setLabTcs] = React.useState<any>(null);
  const [labHdls, setLabHdls] = React.useState<any>(null);
  const [editPatientInformation, setEditInformation] =
    React.useState<boolean>(false);
  const [addMedication, setAddMedication] = React.useState<boolean>(false);
  const [editMedication, setEditMedication] = React.useState<boolean>(null);
  const [showA1c, setShowA1c] = React.useState<boolean>(false);
  const [showBp, setShowBp] = React.useState<boolean>(false);
  const [showTc, setShowTc] = React.useState<boolean>(false);
  const [showHdl, setShowHdl] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<string>("labs");
  const [currentPatient, setCurrentPatient] = React.useState<any>(null);
  const [expandedPatientPathway, setExpandedPatientPathway] = React.useState(
    []
  );

  React.useEffect(() => {
    setLabA1cs(patientLabs?.hgb_data_values?.slice(0, 5));
    setLabBps([]);
    setLabTcs(patientLabs?.tc_values?.slice(0, 5));
    setLabHdls(patientLabs?.hdl_values?.slice(0, 5));
  }, [patientLabs]);

  React.useEffect(() => {
    setCurrentPatient(patient);
    if (patient?.assigned_pathways && patient?.assigned_pathways.length > 0)
      setExpandedPatientPathway([patient?.assigned_pathways[0].id]);
  }, [patient]);

  const closeModal = () => {
    setEditMedication(null);
    window.location.href = "/";
  };

  const formatDate = (dateString) => {
    let date = new Date(dateString);
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      date.getFullYear()
    );
  };

  const formatDateSlashes = (dateString) => {
    let date = new Date(dateString);
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "-" +
      date.getFullYear()
    );
  };

  const formatDateDots = (dateString) => {
    let date = new Date(dateString);
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "." +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "." +
      date.getFullYear().toString().substr(-2)
    );
  };

  const calculateAge = (dateOfBirth) => {
    var today = new Date();
    var birthDate = new Date(dateOfBirth);
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    return age_now;
  };

  const dateFormattedRuby = (dateString) => {
    let date = new Date(dateString);
    return (
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
    );
  };

  const completePathwayAction = (action, completed = true) => {
    fetch(`/assigned_pathway_week_actions/${action.id}`, {
      method: "PATCH",
      headers: getHeaders(csrfToken),
      body: JSON.stringify({
        assigned_pathway_week_action: {
          completed_at: completed
            ? `${dateFormattedRuby(Date.now())} 12:00:00.000000`
            : null,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          alert(result.error);
        } else {
          setCurrentPatient(result.data.patient);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const isPathwayActionChecked = (action) => {
    return (
      (action.recurring == true &&
        formatDateSlashes(action.completed_at) ==
          formatDateSlashes(Date.now())) ||
      (action.recurring == false && action.completed_at)
    );
  };

  const setExpandedPatientPathwayOnClick = (patientPathway) => {
    let expandedCopy = expandedPatientPathway;
    if (
      expandedPatientPathway.length > 0 &&
      expandedPatientPathway.includes(patientPathway)
    ) {
      expandedCopy = expandedCopy.filter((item) => item !== patientPathway);
      setExpandedPatientPathway(expandedCopy);
    } else if (expandedPatientPathway.length > 0) {
      setExpandedPatientPathway((expandedCopy) => [
        ...expandedCopy,
        patientPathway,
      ]);
    } else {
      expandedCopy = [patientPathway];
      setExpandedPatientPathway(expandedCopy);
    }
  };

  return {
    open,
    closeModal,
    formatDate,
    formatDateDots,
    calculateAge,
    labA1cs,
    labBps,
    labTcs,
    labHdls,
    editPatientInformation,
    setEditInformation,
    addMedication,
    setAddMedication,
    showA1c,
    setShowA1c,
    showBp,
    setShowBp,
    showTc,
    setShowTc,
    showHdl,
    setShowHdl,
    expanded,
    setExpanded,
    editMedication,
    setEditMedication,
    formatDateSlashes,
    currentPatient,
    setCurrentPatient,
    completePathwayAction,
    isPathwayActionChecked,
    setExpandedPatientPathwayOnClick,
    expandedPatientPathway,
    setExpandedPatientPathway,
  };
};
