import * as React from "react";

export const useLogin = () => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const closeModal = () => {
    window.location.href = "/";
  };

  return {
    open,
    email,
    password,
    setEmail,
    setPassword,
    closeModal,
  };
};
