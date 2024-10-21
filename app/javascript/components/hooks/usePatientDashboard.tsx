import * as React from "react";

export const usePatientDashboard = () => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [showSplash, setShowSplash] = React.useState<boolean>(true);

  React.useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let menu = urlParams.get("menu");
    if (menu) {
      setShowSplash(false);
    } else {
      setTimeout(() => {
        setShowSplash(false);
      }, 3000);
    }
  }, []);

  return {
    open,
    error,
    setError,
    showSplash,
  };
};
