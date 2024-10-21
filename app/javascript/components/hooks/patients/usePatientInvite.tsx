/* eslint-disable prettier/prettier */
import * as React from "react";
import { getHeaders } from "../../utils/HeaderHelper";

export const usePatientInvite = (patient, csrfToken) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [identityVerified, setIdentityVerified] =
    React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [dateOfBirth, setDateOfBirth] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState(false);

  const closeModal = () => {
    window.location.href = "/";
  };

  const validForm = () => {
    let valid = false;
    dateOfBirth ? (valid = true) : (valid = false);
    return valid;
  };

  const verifyIdentity = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(`/verify_identity`, {
        method: "POST",
        headers: getHeaders(csrfToken),
        body: JSON.stringify({
          user: {
            date_of_birth: dateOfBirth,
            invite_token: patient.invite_token,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            setIdentityVerified(true);
          }
        })
        .catch((error) => {
          setError(error);
          setDisabledButton(false);
        });
    } else {
      setError("Invalid entry, please check your entry and try again.");
      setDisabledButton(false);
    }
  };

  return {
    open,
    dateOfBirth,
    setDateOfBirth,
    closeModal,
    disabledButton,
    setDisabledButton,
    verifyIdentity,
    identityVerified,
    error,
    setError,
  };
};
