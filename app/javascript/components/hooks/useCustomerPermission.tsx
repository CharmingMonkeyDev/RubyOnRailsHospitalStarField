import * as React from "react";

export const useCustomerPermission = (permissionType) => {
  const [permitted, setPermitted] = React.useState<boolean>(false);

  React.useEffect(() => {
    try {
      fetch(`/get_customer_permissions?type=${permissionType}`)
        .then((response) => response.json())
        .then((data) => {
          const matched = data.resource;
          setPermitted(matched);
        });
    } catch (error) {
      console.error("Error getting permission", error);
    }
  }, [permissionType]);

  return permitted;
};
