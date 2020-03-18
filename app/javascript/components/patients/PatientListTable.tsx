/* eslint-disable prettier/prettier */
import * as React from "react";
import { Link } from "@mui/material";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import {Paper} from "@mui/material";

// helper imports
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import { AuthenticationContext } from "../Context";
import { formatToUsDate } from "../utils/DateHelper";
import { ImagesContext } from "../Context";

interface Props {
  fullPatients: any;
  setFullPatients: any;
  paginatedList: any;
  setPaginatedList: any;
  patients: any;
  setPatients: any;
  getPatientsUrl: string;
  resetTable: boolean;
  setResetTable: any;
  refreshTable: boolean;
  setRefreshTable: any;
  checkedList: any;
  setCheckedList: any;
  resetPage: boolean;
  setResetPage: any;
}

const PatientListTable: React.FC<Props> = (props: any) => {
  // modal settting coming from context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "created_at",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [pageLinks, setPageLinks] = React.useState<any>([]);
  const perPage = 9;

  // const [checkedList, setCheckedList] = React.useState<Array<any>>([]);
  const afterFetch = React.useRef(false);
  const images = React.useContext(ImagesContext);

  // Data fetching functions
  const getPatients = () => {
    fetch(`${props.getPatientsUrl}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          props.setFullPatients(result.patients);
          props.setPatients(result.patients);
          props.setPaginatedList(paginateList(result.patients));
          afterFetch.current = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect functions
  // reset table back to baseline
  React.useEffect(() => {
    if (props.resetTable) {
      setCurrentPage(1);
      props.setCheckedList([]);
      props.setResetTable(false);
    }
  }, [props.resetTable]);

  React.useEffect(() => {
    if (props.resetPage) {
      setCurrentPage(1);
      props.setResetPage(false);
    }
  }, [props.resetPage]);

  // pull new data
  React.useEffect(() => {
    if (props.refreshTable) {
      getPatients();
      props.setCheckedList([]);
      props.setRefreshTable(false);
    }
  }, [props.refreshTable]);

  React.useEffect(() => {
    getPatients();
  }, [props.getPatientsUrl]);

  React.useEffect(() => {
    if (props.patients) {
      let pages = Math.ceil(props.patients.length / perPage);
      setPageCount(pages);
      const pageLinks = [];
      for (let i = 1; i <= pages; i++) {
        pageLinks.push(
          <Link
            key={i}
            onClick={() => {
              selectPage(i);
            }}
            className={currentPage == i ? "linkDark" : "linkLight"}
          >
            {i}
          </Link>
        );
      }
      setPageLinks(pageLinks);
    }
  }, [props.patients, currentPage]);

  React.useEffect(() => {
    if (props.fullPatients) {
      sortList();
    }
  }, [sortObject]);

  React.useEffect(() => {
    updatePagination();
  }, [props.patients, currentPage]);

  const selectPage = (page) => {
    setCurrentPage(page);
  };

  const sortList = () => {
    const patientList = getSortedAndSearchedList();
    props.setPatients(patientList);
    setCurrentPage(1);
  };

  const getSortedAndSearchedList = () => {
    let patientList = [...props.patients];
    patientList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "last_sign_in_at") {
      patientList.sort((a, b) =>
        new Date(a["last_sign_in_at"]) > new Date(b["last_sign_in_at"]) ? 1 : -1
      );
    }

    if (sortObject.field == "created_at") {
      patientList.sort((a, b) =>
        new Date(a["created_at"]) > new Date(b["created_at"]) ? 1 : -1
      );
    }

    if (sortObject.field == "last_name") {
      patientList.sort((a, b) =>
        a.last_name?.toLowerCase() > b.last_name?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      patientList.reverse();
    }

    return patientList;
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const paginateList = (list) => {
    if (list.length == 0) {
      return [];
    } else {
      let patientList = list;
      if (currentPage == 1) {
        return patientList.slice(0, perPage);
      } else {
        let offsetIndex = perPage * (currentPage - 1);
        return patientList.slice(offsetIndex, offsetIndex + perPage);
      }
    }
  };

  const updatePagination = () => {
    props.setPaginatedList(paginateList(props.patients));
  };

  const handlePatientSelection = (checked: boolean, user) => {
    // add patient to checked list
    if (checked) {
      props.setCheckedList([...props.checkedList, user]);
    } else {
      // remove patient from checked list
      let filteredList = props.checkedList.filter((u) => u.id != user.id);
      props.setCheckedList([...filteredList]);
    }
  };

  const selectAll = (checked) => {
    if (checked) {
      props.setCheckedList([...props.checkedList, ...props.paginatedList]);
    } else {
      let filteredList = [...props.checkedList];
      props.paginatedList.forEach((patient) => {
        filteredList = filteredList.filter((u) => u.id != patient.id);
      });
      props.setCheckedList([...filteredList]);
    }
  };

  const isUserChecked = (user) => {
    let filtered = props.checkedList.filter((patient) => patient.id == user.id);
    return filtered.length > 0;
  };

  return (
    <div
      className="tableContainer"
      style={{ marginTop: "20px", width: "100%", padding: 0 }}
    >
      <TableContainer component={Paper}>
        <Table className="table patientlist-table" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header" style={{ width: "20px" }}>
                <div>
                  <b>All</b>
                </div>
                <input
                  className="user-selection"
                  type="checkbox"
                  name="selectAll"
                  onChange={(event) => {
                    selectAll(event.target.checked);
                  }}
                />
              </TableCell>
              <TableCell
                align="left"
                onClick={() => {
                  setSortOrder(
                    "last_name",
                    sortObject.direction == "ascending"
                      ? "descending"
                      : "ascending"
                  );
                }}
                style={{ cursor: "pointer" }}
                className="table-header name-header"
              >
                <strong style={{ fontFamily: "QuicksandMedium" }}>
                  Patients ({props.patients.length})
                </strong>
                {sortObject.field == "last_name" ? (
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
                )}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => {
                  setSortOrder(
                    "last_contact",
                    sortObject.direction == "ascending"
                      ? "descending"
                      : "ascending"
                  );
                }}
                style={{ cursor: "pointer" }}
                className="table-header"
              >
                <strong style={{ fontFamily: "QuicksandMedium" }}>
                  Last Contact
                </strong>
                {sortObject.field == "last_contact" ? (
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
                )}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => {
                  setSortOrder(
                    "last_sign_in_at",
                    sortObject.direction == "ascending"
                      ? "descending"
                      : "ascending"
                  );
                }}
                style={{ cursor: "pointer" }}
                className="table-header"
              >
                <strong style={{ fontFamily: "QuicksandMedium" }}>
                  Last Login
                </strong>
                {sortObject.field == "last_sign_in_at" ? (
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
                )}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => {
                  setSortOrder(
                    "created_at",
                    sortObject.direction == "ascending"
                      ? "descending"
                      : "ascending"
                  );
                }}
                style={{ cursor: "pointer" }}
                className="table-header"
              >
                <strong style={{ fontFamily: "QuicksandMedium" }}>
                  Date Joined
                </strong>
                {sortObject.field == "created_at" ? (
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
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.paginatedList ? (
              <>
                {props.paginatedList.map((user, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 == 0 ? "rowEven" : "row"}
                  >
                    <TableCell>
                      <input
                        className="user-selection"
                        type="checkbox"
                        name="selectCustomer"
                        onChange={(event) => {
                          handlePatientSelection(event.target.checked, user);
                        }}
                        checked={isUserChecked(user)}
                      />
                    </TableCell>
                    <TableCell
                      size="small"
                      scope="row"
                      align="left"
                      className="tableCell"
                    >
                      {user.name_reversed}
                    </TableCell>
                    <TableCell
                      size="small"
                      scope="row"
                      align="left"
                      className="tableCell"
                    >
                      {user.last_contact
                        ? formatToUsDate(user.last_contact)
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      size="small"
                      scope="row"
                      align="left"
                      className="tableCell"
                    >
                      {user.last_sign_in_at
                        ? formatToUsDate(user.last_sign_in_at)
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      size="small"
                      scope="row"
                      align="left"
                      className="tableCell"
                    >
                      {user.created_at
                        ? formatToUsDate(user.created_at)
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              afterFetch.current && <p>No users found.</p>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <p className="pagerLinks">
        <Link
          onClick={() => {
            selectPage(currentPage > 1 ? currentPage - 1 : currentPage);
          }}
          className="linkDark"
        >
          &lt;
        </Link>
        {pageLinks}
        <Link
          onClick={() => {
            selectPage(currentPage < pageCount ? currentPage + 1 : currentPage);
          }}
          className="linkDark"
        >
          &gt;
        </Link>
      </p>
    </div>
  );
};

export default PatientListTable;
