import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import * as React from "react";
import GeneralModal from "../../../../modals/GeneralModal";
import { ImagesContext } from "../../../../Context";
import { useState } from "react";
import dayjs from "dayjs";
import { setSortOrder } from "../../../../shared/tables/TableHelper";
import { snakeCaseToTitleCase } from "../../../../utils/CaseFormatHelper";

const AssignmentHistoryModal = ({ type, open, onCloseModal, histories }) => {
  const [filterHistories, setFilterHistories] = useState<any>(histories);
  const images = React.useContext(ImagesContext);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "title",
    direction: "ascending",
  });

  const getSortedAndSearchedList = () => {
    let filteredList = [...histories];
    filteredList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "title") {
      filteredList.sort((a, b) =>
        a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      filteredList.reverse();
    }
    return filteredList;
  };

  React.useEffect(() => {
    if (histories) {
      const historyList = getSortedAndSearchedList();
      setFilterHistories(historyList);
    }
  }, [sortObject, histories]);

  const getSortIcon = (column) => {
    return sortObject.field == column ? (
      <span className="sortIndicator">
        {sortObject.direction == "ascending" ? (
          <img
            src={images.sort_ascending_src}
            width="10"
            className="sort-icon"
            alt="Sort Asc"
          />
        ) : (
          <img
            src={images.sort_descending_src}
            width="10"
            className="sort-icon"
            alt="Sort Desc"
          />
        )}
      </span>
    ) : (
      <span className="sortIndicator">
        <img
          src={images.sort_plain_src}
          width="10"
          className="sort-icon"
          alt="Sort Asc"
        />
      </span>
    );
  };

  const handleCloseModal = () => {
    onCloseModal();
  };

  return (
    <GeneralModal
      open={open}
      title={`${snakeCaseToTitleCase(type)} Assignment History`}
      successCallback={undefined}
      closeCallback={handleCloseModal}
      showCancelButton={false}
      showContinueIcon={false}
      fullWidth={true}
      width="900px"
    >
      <>
        <TableContainer className="template-container" sx={{ mb: "-40px" }}>
          <Table className="no-border-table">
            <TableHead sx={{ borderBottom: "1.5px solid black" }}>
              <TableRow>
                <TableCell
                  className="bold-font-face nowrap-header"
                  sx={{ cursor: "pointer", pl: "24px !important" }}
                  onClick={() => {
                    setSortOrder(
                      "date",
                      sortObject.direction == "ascending"
                        ? "descending"
                        : "ascending",
                      setSortObject
                    );
                  }}
                >
                  Date
                  {getSortIcon("date")}
                </TableCell>
                <TableCell className="nowrap-header bold-font-face">
                  Actor
                </TableCell>
                <TableCell className="nowrap-header bold-font-face">
                  Description
                </TableCell>
                <TableCell className="nowrap-header bold-font-face">
                  Additional Notes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterHistories?.map((history) => (
                <TableRow key={history?.id}>
                  <TableCell sx={{ pl: "24px !important" }}>
                    {dayjs(history.created_at).format("MM/DD/YYYY HH:mm a")}
                  </TableCell>
                  <TableCell>{`${history?.user?.last_name}, ${history?.user?.first_name}`}</TableCell>
                  <TableCell
                    dangerouslySetInnerHTML={{ __html: history.description }}
                  />
                  <TableCell>{history?.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </GeneralModal>
  );
};

export default AssignmentHistoryModal;
