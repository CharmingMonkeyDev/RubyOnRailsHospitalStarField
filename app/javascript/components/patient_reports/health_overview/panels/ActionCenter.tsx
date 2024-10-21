/* eslint-disable prettier/prettier */
import * as React from "react";
import { Stack } from "@mui/material";

import AssignedPrograms from "./action_center/AssignedPrograms";
import AssignedProviderActions from "./action_center/AssignedProviderActions";
import PatientActionQueue from "./action_center/PatientActionQueue";

interface Props {}

const ActionCenter: React.FC<Props> = (props: any) => {
  return (
    <Stack gap={0}>
      <PatientActionQueue />
      <AssignedPrograms />
      <AssignedProviderActions />
    </Stack>
  );
};

export default ActionCenter;
