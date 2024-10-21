import * as React from "react";

// helper
import { getHeaders } from "../../utils/HeaderHelper";

export const useAddPatient = (csrfToken) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [firstName, setFirstName] = React.useState<string>("");
  const [middleName, setMiddleName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [dateOfBirth, setDateOfBirth] = React.useState<any>("1969-12-31");
  const [email, setEmail] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [patientSource, setPatientSource] = React.useState(false);
  const [carePlanSource, setCarePlanSource] = React.useState(false);

  React.useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let patients = urlParams.get("patients");
    let carePlan = urlParams.get("care_plan");
    if (patients && patients == "true") setPatientSource(true);
    if (carePlan && carePlan == "true") setCarePlanSource(true);
  }, []);

  const closeModal = () => {
    let url = "/";
    if (patientSource) url = "/patients";
    if (carePlanSource) url = "/care-plan-management";
    window.location.href = url;
  };

  const validForm = () => {
    let valid = false;
    if (firstName && lastName && email && dateOfBirth) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      !re.test(String(email).toLowerCase()) ? (valid = false) : (valid = true);
    }
    return valid;
  };

  const addPatient = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(`/invite_patient`, {
        method: "POST",
        headers: getHeaders(csrfToken),
        body: JSON.stringify({
          user: {
            email: email,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            date_of_birth: `${dateOfBirth}`,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            let url = "/patients";
            location.href = url;
          }
        })
        .catch((error) => {
          setError(error);
          setDisabledButton(false);
        });
    } else {
      setError("Invalid entries, please check your entries and try again.");
      setDisabledButton(false);
    }
  };

  return {
    open,
    email,
    setEmail,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    dateOfBirth,
    setDateOfBirth,
    closeModal,
    addPatient,
    error,
    setError,
    disabledButton,
    setDisabledButton,
  };
};
