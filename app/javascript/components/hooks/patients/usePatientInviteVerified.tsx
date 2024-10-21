/* eslint-disable prettier/prettier */
import * as React from "react";
import globals from "../../globals/globals";
import { MenuItem } from "@mui/material";

// helpers
import { getHeaders } from "../../utils/HeaderHelper";

export const usePatientInviteVerified = (patient, csrfToken) => {
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [firstName, setFirstName] = React.useState<string>(
    patient?.first_name || ""
  );
  const [middleName, setMiddleName] = React.useState<string>(
    patient?.middle_name || ""
  );
  const [lastName, setLastName] = React.useState<string>(
    patient?.last_name || ""
  );
  const [email, setEmail] = React.useState<string>(patient?.email || "");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>(patient?.address || "");
  const [city, setCity] = React.useState<string>(patient?.city || "");
  const [state, setState] = React.useState<string>(
    patient?.state || globals.states[0]
  );
  const [zip, setZip] = React.useState<string>(patient?.zip || "");
  const [mobilePhoneNumber, setMobilePhoneNumber] = React.useState<string>(
    patient?.mobile_phone_number || ""
  );
  const [gender, setGender] = React.useState<string>(patient?.gender || "");

  const stateOptions = globals.states.map((state) => {
    return (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    );
  });

  const genderOptions = globals.genders.map((gender) => {
    return (
      <MenuItem key={gender} value={gender}>
        {gender}
      </MenuItem>
    );
  });

  const validForm = () => {
    const message = "Invalid entries.";
    if (!firstName) {
      setError(`${message} Error: First Name`);
      return false;
    }
    if (!lastName) {
      setError(`${message} Error: Last Name`);
      return false;
    }
    if (!address) {
      setError(`${message} Error: Address`);
      return false;
    }
    if (!city) {
      setError(`${message} Error: City`);
      return false;
    }
    if (!state) {
      setError(`${message} Error: State`);
      return false;
    }
    if (!zip) {
      setError(`${message} Error: Zip`);
      return false;
    }
    if (!mobilePhoneNumber) {
      setError(`${message} Error: Phone Number`);
      return false;
    }
    if (!gender) {
      setError(`${message} Error: Gender`);
      return false;
    }
    if (!email) {
      setError(`${message} Error: Email`);
      return false;
    }
    if (!password) {
      setError(`${message} Error: Password`);
      return false;
    }
    if (!confirmPassword) {
      setError(`${message} Error: Confirm Password`);
      return false;
    }

    const numberUpperTest = /[A-Z].*\d|\d.*[A-Z]/;
    const numberLowerTest = /[a-z].*\d|\d.*[a-z]/;
    if (password != confirmPassword) {
      setError(
        `${message} Error: Password and Confirm Password does not match`
      );
      return false;
    }
    if (
      password.length < 8 ||
      !numberUpperTest.test(String(password)) ||
      !numberLowerTest.test(String(password))
    ) {
      setError(`${message} Error: Password requirement`);
      return false;
    }

    const emailTest =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailTest.test(String(email).toLowerCase())) {
      setError(`${message} Error: Invalid email formate`);
      return false;
    }

    return true;
  };

  const completeAccount = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      fetch(`/complete_account`, {
        method: "POST",
        headers: getHeaders(csrfToken),
        body: JSON.stringify({
          user: {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email: email,
            password: password,
            invite_token: patient.invite_token,
            address: address,
            city: city,
            state: state,
            zip: zip,
            mobile_phone_number: mobilePhoneNumber,
            gender: gender,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
            setDisabledButton(false);
          } else {
            if (result?.data?.customer_user_id) {
              // pending association
              window.location.href = `/customer_consent_new/${result?.data?.uuid}?customer_user=${result?.data?.customer_user_id}`;
            } else {
              window.location.href = `/`;
            }
          }
        })
        .catch((error) => {
          setError(error);
          setDisabledButton(false);
        });
    } else {
      setDisabledButton(false);
    }
  };

  return {
    disabledButton,
    setDisabledButton,
    error,
    setError,
    completeAccount,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    address,
    setAddress,
    city,
    setCity,
    state,
    setState,
    zip,
    setZip,
    mobilePhoneNumber,
    setMobilePhoneNumber,
    stateOptions,
    gender,
    setGender,
    genderOptions,
  };
};
