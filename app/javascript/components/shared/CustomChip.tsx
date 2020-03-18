import { Chip, ChipProps } from "@mui/material";
import * as React from "react";

interface CustomChipsProps extends ChipProps {
  label: string;
  type?:
    | "success"
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "warning";
  variant?: "filled" | "outlined";
  size?: "small" | "medium";
  fullWidth?: boolean;
}

const CustomChip = ({
  label,
  type = "success",
  size = "small",
  variant = "filled",
  fullWidth = false,
  ...props
}: CustomChipsProps) => {
  const colors = {
    success: {
      color: "#7AD98C",
      bgColor: "#EDF7EE",
    },
    warning: {
      color: "#DBBD5B",
      bgColor: "#FFEEB7",
    },
    error: {
      color: "#FFA33F",
      bgColor: "#FFF0DF",
    },
  };
  const colorHash = colors[type];

  return (
    <Chip
      label={label}
      size={size}
      variant={variant}
      sx={{
        px: 1,
        textTransform: "capitalize",
        backgroundColor: colorHash?.bgColor,
        color: colorHash?.color,
        fontFamily: "QuicksandBold",
        width: fullWidth ? "100%" : undefined,
      }}
    />
  );
};

export default CustomChip;
