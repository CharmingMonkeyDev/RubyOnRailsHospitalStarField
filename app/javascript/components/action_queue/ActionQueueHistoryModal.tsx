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
import { useState } from "react";
import dayjs from "dayjs";
import { AuthenticationContext, ImagesContext } from "../Context";
import GeneralModal from "../modals/GeneralModal";
import { setSortOrder } from "../shared/tables/TableHelper";
import { snakeCaseToTitleCase } from "../utils/CaseFormatHelper";
import { getHeaders } from "../utils/HeaderHelper";

const ActionQueueHistoryModal = ({ open, onCloseModal, actionQueueId }) => {
  const [histories, setHistories] = useState<any>([]);
  const [filterHistories, setFilterHistories] = useState<any>([]);
  const images = React.useContext(ImagesContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "title",
    direction: "ascending",
  });

  React.useEffect(() => {
    fetchHistories();
  }, [actionQueueId]);

  const fetchHistories = async () => {
    if (!actionQueueId) {
      return;
    }
    const response = await fetch(
      `/data_fetching/action_queues/${actionQueueId}/histories`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    );
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    if (result.success == false) {
      alert(result.error);
    } else {
      setHistories(result?.resource);
    }
  };

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
      title={`Action/Step Assignment History`}
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
                  Type
                </TableCell>
                <TableCell className="nowrap-header bold-font-face">
                  Description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterHistories?.length < 1 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No related history yet.
                  </TableCell>
                </TableRow>
              )}
              {filterHistories?.map((history) => (
                <TableRow key={history?.id}>
                  <TableCell sx={{ pl: "24px !important" }}>
                    {dayjs(history.created_at).format("MM/DD/YYYY HH:mm a")}
                  </TableCell>
                  <TableCell>{`${history?.user?.last_name}, ${history?.user?.first_name}`}</TableCell>
                  <TableCell>{history?.history_type}</TableCell>
                  <TableCell>{history?.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </GeneralModal>
  );
};

export default ActionQueueHistoryModal;
