import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";

interface ChipData {
  key: number;
  label: string;
  type: string;
}

interface Props {
  badgeData: ChipData[];
  setBadgeData: Function;
  handleDeleteBadge: Function;
}

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const BadgeList: React.FC<Props> = ({
  badgeData,
  setBadgeData,
  handleDeleteBadge,
}) => {
  const handleDelete = (chipToDelete: ChipData) => () => {
    handleDeleteBadge(chipToDelete);
    setBadgeData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "start",
        flexWrap: "wrap",
        listStyle: "none",
        border: "none",
        boxShadow: "none",
        background: "#EFE9E7",
        p: 0,
        m: 0,
      }}
      component="ul"
    >
      {badgeData.map((data) => {
        return (
          <ListItem key={data.key}>
            <Chip
              label={data.label}
              onDelete={handleDelete(data)}
              deleteIcon={<CloseIcon sx={{ width: 14, height: 14 }} />}
              sx={{
                height: 22,
                backgroundColor: "#FF890A",
                color: "#FAFAFA",
                "& .MuiChip-label": {
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: 18,
                },
                "& .MuiChip-deleteIcon": {
                  color: "#FAFAFA",
                },
              }}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
};

export default BadgeList;