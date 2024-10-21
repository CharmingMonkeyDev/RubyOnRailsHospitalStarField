import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

interface Props {
  cardTitle: string;
  actionNumber: string;
  actionColor?: string;
  smallTitle?: boolean;
}

const ActionHeader: React.FC<Props> = ({
  cardTitle,
  actionNumber,
  actionColor = "#FF890A",
  smallTitle = false,
}) => {
  return (
    <Card
      sx={{
        minWidth: { sm: "110px", xl: "140px" },
        borderRadius: "5px",
        textAlign: "center",
      }}
    >
      <CardContent
        sx={{
          bgcolor: "#FF890A",
          borderRadius: "5px 5px 0 0",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="white"
          fontSize={smallTitle ? "0.75rem !important" : "0.9rem"}
        >
          {cardTitle}
        </Typography>
      </CardContent>
      <Box width="100%" height="1px" bgcolor="#FF890A" mt={"2px"} />
      <CardContent sx={{ padding: "8px 0" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color={actionColor}
          sx={{
            backgroundColor: "white",
            px: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {actionNumber ?? (
            <Skeleton
              variant="rectangular"
              width={50}
              height={50}
              sx={{ bgcolor: "#ffdfbe"}}
            />
          )}
        </Typography>
        <Typography variant="subtitle2" color="black">
          Actions
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ActionHeader;
