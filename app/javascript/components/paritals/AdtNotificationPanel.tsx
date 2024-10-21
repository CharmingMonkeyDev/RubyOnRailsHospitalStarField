import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// app setting imports
import { AuthenticationContext, ImagesContext } from "../Context";

// import helpers
import { getHeaders } from "../utils/HeaderHelper";
import {
  getSortedListByDate,
  setSortOrder,
} from "../shared/tables/TableHelper";

interface Props {
  patient_id: number;
}

const AdtNotificationPanel: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // states
  const [notifications, setNotifications] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/data_fetching/adt_notifications?user_id=${props.patient_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setNotifications(result.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.patinet_id]);

  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });

  React.useEffect(() => {
    if (notifications) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const notificationsList = getSortedAndSearchedList();
    setNotifications(notificationsList);
  };
  const images = React.useContext(ImagesContext);

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

  const getSortedAndSearchedList = () => {
    let notificationList = [...notifications];
    notificationList.sort((a, b) => (a.id > b.id ? 1 : -1));
    switch (sortObject.field) {
      case "formatted_event_date":
        return getSortedListByDate(
          notificationList,
          sortObject,
          "formatted_event_date"
        );
      default:
        return getSortedListByDate(
          notificationList,
          sortObject,
          "formatted_event_date"
        );
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead className="table-header-box">
          <TableRow>
            <TableCell
              className="nowrap-header"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSortOrder(
                  "formatted_event_date",
                  sortObject.direction == "ascending"
                    ? "descending"
                    : "ascending",
                  setSortObject
                );
              }}
            >
              Date Sent {getSortIcon("formatted_event_date")}
            </TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Patient Class</TableCell>
            <TableCell>Facility</TableCell>
            <TableCell>Diagnosis</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications?.length < 1 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No ADT Notifications
              </TableCell>
            </TableRow>
          )}
          {notifications?.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>{notification.formatted_event_date}</TableCell>
              <TableCell>{notification.event_type}</TableCell>
              <TableCell>{notification.patient_class}</TableCell>
              <TableCell>{notification.facility_name}</TableCell>
              <TableCell>{notification.diagnosis}</TableCell>
              <TableCell>{}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdtNotificationPanel;
