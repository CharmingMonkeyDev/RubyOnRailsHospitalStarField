import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import * as React from "react";
import GeneralModal from "../modals/GeneralModal";
import { useState } from "react";
import dayjs from "dayjs";
import SortComponent from "../common/SortComponent";

const HistoryModal = ({
  title,
  objectType,
  removeText,
  histories,
  open,
  onCloseModal,
  descriptionTitle,
  descriptionValue,
}) => {
  const [filterHistories, setFilterHistories] = useState<any>(histories);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "title",
    direction: "ascending",
  });

  const handleCloseModal = () => {
    onCloseModal();
  };

  const actionText = (history) => {
    switch (history?.action_type) {
      case "assign":
        return `Assigned ${objectType}`;
      case "transfer":
        return `Transferred ${objectType}`;
      case "remove":
        return `${removeText} ${objectType}`;
    }
  };

  return (
    <GeneralModal
      open={open}
      title={title}
      successCallback={undefined}
      closeCallback={handleCloseModal}
      showCancelButton={false}
      showContinueIcon={false}
      fullWidth={true}
      width="990px"
      headerClassName="facility-modal-header-text"
      closeIconSize={30}
      modalClassName="history-modal"
    >
      <>
        <TableContainer className="template-container" sx={{ mb: "-40px" }}>
          <Table className="no-border-table">
            <TableHead className="facility-modal-header">
              <TableRow>
                <SortComponent
                  column_name={"date"}
                  column_title={"Date"}
                  list={histories}
                  setList={setFilterHistories}
                  sortObject={sortObject}
                  setSortObject={setSortObject}
                  className="bold-font-face nowrap-header"
                  sx={{
                    cursor: "pointer",
                    pl: "40px !important",
                    width: "25%",
                  }}
                />
                <TableCell
                  className="nowrap-header bold-font-face"
                  sx={{ width: "20%" }}
                >
                  Actor
                </TableCell>
                <TableCell
                  className="nowrap-header bold-font-face"
                  sx={{ width: "20%" }}
                >
                  Action
                </TableCell>
                <TableCell
                  className="nowrap-header bold-font-face"
                  sx={{ width: "35%", pr: "40px !important" }}
                >
                  {descriptionTitle}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterHistories?.map((history) => (
                <TableRow key={history?.id}>
                  <TableCell
                    sx={{
                      pl: "40px !important",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <p>{dayjs(history.created_at).format("MM/DD/YYYY")}</p>
                    <p style={{ marginLeft: 16 }}>
                      {dayjs(history.created_at).format("HH:mm a")}
                    </p>
                  </TableCell>
                  <TableCell>{history?.actor}</TableCell>
                  <TableCell>{actionText(history)}</TableCell>
                  <TableCell
                    sx={{
                      pr: "40px !important",
                    }}
                    className="overflow-ellipsis"
                  >
                    {history[descriptionValue]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </GeneralModal>
  );
};

export default HistoryModal;