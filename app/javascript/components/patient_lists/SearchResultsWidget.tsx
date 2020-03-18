/* eslint-disable prettier/prettier */
import * as React from "react";
import {
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	Chip,
} from "@mui/material";
import { Grid, Link } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// app setting imports
import { ImagesContext } from "../Context";
import { formatToUsDateFromUTC } from "../utils/DateHelper";
import { toClass } from "../utils/StringHelper";
import SortComponent from "../common/SortComponent";
interface Props {
  csrfToken: string;
  searchPatients: any;
  setSearchPatients: any;
  checkedList: any;
  setCheckedList: any;
  setOnList: any;
  setPendingAdd: any;
  setPendingRemoval: any;
  onList: any;
  pendingAdd: any;
  pendingRemoval: any;
  paramsPresent: boolean;
  patientListId: string;
  loading: boolean;
}

const preprocessPatients = (patients) => {
  return patients.map((patient) => ({
    ...patient,
    program_titles_string: patient.program_titles
      ? patient.program_titles.join(", ")
      : "",
    diagnosis_code_values_string: patient.diagnosis_code_values
      ? patient.diagnosis_code_values.join(", ")
      : "",
    ltc_facility_names_string: patient.ltc_facility_names
      ? patient.ltc_facility_names.join(", ")
      : "",
    insurance_types_list_string: patient.insurance_types_list
      ? patient.insurance_types_list.join(", ")
      : "",
  }));
};

const SearchResultsWidget: React.FC<Props> = (props: any) => {
  const [sortObject, setSortObject] = React.useState<any>({
    field: "created_at",
    direction: "descending",
  });

  // pagination states
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [pageLinks, setPageLinks] = React.useState<any>([]);
  const perPage = 10;

  const [paginatedList, setPaginatedList] = React.useState<any>([]);

  // const [checkedList, setCheckedList] = React.useState<Array<any>>([]);
  const afterFetch = React.useRef(false);
  const images = React.useContext(ImagesContext);
  const selectPage = (page) => {
    setCurrentPage(page);
  };
  React.useEffect(() => {
    if (props.searchPatients) {
      if (props.searchPatients.length > 0) {
        let pages = Math.ceil(props.searchPatients.length / perPage);
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
    }
  }, [props.searchPatients, currentPage]);

  React.useEffect(() => {
    updatePagination();
  }, [props.searchPatients, currentPage]);

  const paginateList = (list) => {
    if (list) {
      if (list.length == 0) {
        return [];
      } else {
        let imList = list;
        if (currentPage == 1) {
          return imList.slice(0, perPage);
        } else {
          let offsetIndex = perPage * (currentPage - 1);
          return imList.slice(offsetIndex, offsetIndex + perPage);
        }
      }
    }
  };

  const updatePagination = () => {
    setPaginatedList(paginateList(props.searchPatients));
  };

  React.useEffect(() => {
    sortList();
  }, [sortObject]);

  const sortList = () => {
    const patientList = getSortedAndSearchedList();
    props.setSearchPatients(patientList);
    setCurrentPage(1);
  };

  const getSortedAndSearchedList = () => {
    if (props.searchPatients === null) return null;
    let patientList = [...props.searchPatients];
    patientList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "date_of_birth") {
      patientList.sort((a, b) =>
        new Date(a["date_of_birth"]) > new Date(b["date_of_birth"]) ? 1 : -1
      );
    }

    if (sortObject.field == "last_name") {
      patientList.sort((a, b) =>
        a.last_name?.toLowerCase() > b.last_name?.toLowerCase() ? 1 : -1
      );
    }
    if (sortObject.field == "cgm_present") {
      patientList = sortByBooleanField(patientList, "cgm_present");
    }
    if (sortObject.direction == "descending") {
      patientList.reverse();
    }

    return patientList;
  };

  const sortByBooleanField = (list, field) => {
    return list.sort((a, b) => {
      const aValue = a[field] !== undefined ? (a[field] ? "Yes" : "No") : "";
      const bValue = b[field] !== undefined ? (b[field] ? "Yes" : "No") : "";
      return aValue.toLowerCase() > bValue.toLowerCase() ? 1 : -1;
    });
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const displayArrayField = (arrayField) => {
    return arrayField && arrayField.length > 0 ? arrayField.join(", ") : "";
  };

  const removeFromStatusList = (listType, user) => {
    switch (listType) {
      case "Pending Add":
        let filteredPendingAdd = props.pendingAdd.filter(
          (u) => u.id !== user.id
        );
        props.setPendingAdd([...filteredPendingAdd]);
        break;
      case "Pending Removal":
        let filteredPendingRemoval = props.pendingRemoval.filter(
          (u) => u.id !== user.id
        );
        props.setPendingRemoval([...filteredPendingRemoval]);
        break;
      case "On List":
        let filteredOnList = props.onList.filter((u) => u.id !== user.id);
        props.setOnList([...filteredOnList]);
        break;
    }
  };

  const addToStatusList = (listType, user) => {
    switch (listType) {
      case "Pending Add":
        props.setPendingAdd([...props.pendingAdd, user]);
        break;

      case "Pending Removal":
        props.setPendingRemoval([...props.pendingRemoval, user]);
        break;

      case "On List":
        props.setOnList([...props.onList, user]);
        break;
    }
  };

  const handlePatientSelection = (checked: boolean, user) => {
    if (checked) {
      props.setCheckedList([...props.checkedList, user]);
      removeFromStatusList(user.list_status, user); //remove from old lists
      const status = user.on_list ? "On List" : "Pending Add";
      addToStatusList(status, user); //add to new lists
      const updatedPatients = props.searchPatients.map((patient) =>
        patient.id === user.id ? { ...patient, list_status: status } : patient
      );
      props.setSearchPatients(updatedPatients);
    } else {
      let filteredList = props.checkedList.filter((u) => u.id != user.id);
      props.setCheckedList([...filteredList]);
      removeFromStatusList(user.list_status, user); //remove from old lists
      const status = user.on_list ? "Pending Removal" : "Not on List";
      addToStatusList(status, user); //add to new lists
      // Revert list_status if unchecked
      const updatedPatients = props.searchPatients.map((patient) =>
        patient.id === user.id ? { ...patient, list_status: status } : patient
      );
      props.setSearchPatients(updatedPatients);
    }
  };

  const selectAll = (checked) => {
    var searchPatients = props.searchPatients;
    var pendingAdd = props.pendingAdd;
    var pendingRemoval = props.pendingRemoval;
    var onList = props.onList;

    props.searchPatients.forEach((user) => {
      if (checked) {
        // remove from old list
        switch (user.list_status) {
          case "Pending Add":
            pendingAdd = pendingAdd.filter((u) => u.id !== user.id);
            break;
          case "Pending Removal":
            pendingRemoval = pendingRemoval.filter((u) => u.id !== user.id);
            break;
          case "On List":
            onList = onList.filter((u) => u.id !== user.id);
            break;
        }

        const status = user.on_list ? "On List" : "Pending Add";

        // add to new list
        switch (status as string) {
          case "Pending Add":
            pendingAdd = [...pendingAdd, user];
            break;

          case "Pending Removal":
            pendingRemoval = [...pendingRemoval, user];
            break;

          case "On List":
            onList = [...onList, user];
            break;
        }

        // update status on user
        searchPatients = searchPatients.map((patient) =>
          patient.id === user.id ? { ...patient, list_status: status } : patient
        );
      } else {
        // remove from old list
        switch (user.list_status) {
          case "Pending Add":
            pendingAdd = pendingAdd.filter((u) => u.id !== user.id);
            break;
          case "Pending Removal":
            pendingRemoval = pendingRemoval.filter((u) => u.id !== user.id);
            break;
          case "On List":
            onList = onList.filter((u) => u.id !== user.id);
            break;
        }

        const status = user.on_list ? "Pending Removal" : "Not on List";

        // add to new list
        switch (status as string) {
          case "Pending Add":
            pendingAdd = [...pendingAdd, user];
            break;

          case "Pending Removal":
            pendingRemoval = [...pendingRemoval, user];
            break;

          case "On List":
            onList = [...onList, user];
            break;
        }

        // update status on user
        searchPatients = searchPatients.map((patient) =>
          patient.id === user.id ? { ...patient, list_status: status } : patient
        );
      }

      props.setSearchPatients(searchPatients);
      props.setPendingAdd(pendingAdd);
      props.setPendingRemoval(pendingRemoval);
      props.setOnList(onList);
    });

    // Updated checkedList
    if (checked) {
      props.setCheckedList([...props.checkedList, ...props.searchPatients]);
    } else {
      let filteredList = [...props.checkedList];
      props.searchPatients.forEach((patient) => {
        filteredList = filteredList.filter((u) => u.id != patient.id);
      });
      props.setCheckedList([...filteredList]);
    }
  };

  const isUserChecked = (user) => {
    let filtered = props.checkedList.filter((patient) => patient.id == user.id);
    return filtered.length > 0;
  };

  const formatPatientNameReversed = (firstName, middleName, lastName) => {
    const capitalize = (s) => {
      if (!s) return "";
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    const formattedFirstName = capitalize(firstName);
    const formattedLastName = capitalize(lastName);

    let formattedMiddleInitial = "";
    if (middleName && middleName.trim() !== "") {
      formattedMiddleInitial = capitalize(middleName.charAt(0));
    }

    return `${formattedLastName}, ${formattedFirstName} ${formattedMiddleInitial}`.trim();
  };

  React.useEffect(() => {
    if (props.searchPatients) {
      const preprocessedPatients = preprocessPatients(props.searchPatients);
      if (
        JSON.stringify(preprocessedPatients) !==
        JSON.stringify(props.searchPatients)
      ) {
        props.setSearchPatients(preprocessedPatients);
      }
    }
  }, [props.searchPatients]);

  return (
    <>
      <Grid item xs={12}>
        <Grid container>
          <Grid
            container
            justifyContent="space-between"
            className="widget-container"
          >
            <Grid item xs={12} className="widget-header">
              <h3>Search Results</h3>
              <div className="badge">
                {props.searchPatients ? props.searchPatients.length : "-"}
              </div>
            </Grid>
          </Grid>
          <div className="divider"></div>
          <Grid container>
            <Grid item xs={12} className="widget-body content-center">
              {props.loading ? (
                <div className="loading-container">
                  <img src={images.new_large_spinner_src}></img>
                  <h3>Loading...</h3>
                  <p>
                    We are loading your patients list.
                    <br />
                    This might take a few miniutes. Please do not leave this
                    page.
                  </p>
                </div>
              ) : props.paramsPresent || props.patientListId ? (
                <div className="search-table-container">
                  <TableContainer component={Paper}>
                    <Table
                      className="no-border-table"
                      aria-label="simple table"
                      style={{ minWidth: "1600px" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className="table-header select-all"
                            style={{ cursor: "pointer", width: "70px" }}
                          >
                            <div style={{ fontSize: "10px" }}>
                              <b>Select All</b>
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
                            style={{
                              cursor: "pointer",
                              width: "242px",
                              padding: "0px 12px",
                            }}
                            className="table-header name-header"
                          >
                            <strong style={{ fontFamily: "QuicksandMedium" }}>
                              Patients Name
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
                            style={{
                              cursor: "pointer",
                              width: "242px",
                              padding: "0px 12px",
                            }}
                            className="table-header"
                          >
                            <strong style={{ fontFamily: "QuicksandMedium" }}>
                              List Status
                            </strong>
                          </TableCell>
                          <SortComponent
                            column_name="program_titles_string"
                            column_title="Programs"
                            list={props.searchPatients}
                            setList={props.setSearchPatients}
                            sortObject={sortObject}
                            setSortObject={setSortObject}
                            className="table-header"
                            sx={{
                              cursor: "pointer",
                              width: "242px",
                              padding: "0px 12px",
                            }}
                          />
                          <SortComponent
                            column_name="diagnosis_code_values_string"
                            column_title="Diagnosis Codes"
                            list={props.searchPatients}
                            setList={props.setSearchPatients}
                            sortObject={sortObject}
                            setSortObject={setSortObject}
                            className="table-header"
                            sx={{
                              cursor: "pointer",
                              width: "242px",
                              padding: "0px 12px",
                            }}
                          />
                          <SortComponent
                            column_name="ltc_facility_names_string"
                            column_title="LTC Facility Names"
                            list={props.searchPatients}
                            setList={props.setSearchPatients}
                            sortObject={sortObject}
                            setSortObject={setSortObject}
                            className="table-header"
                            sx={{
                              cursor: "pointer",
                              width: "242px",
                              padding: "0px 12px",
                            }}
                          />
                          <SortComponent
                            column_name="insurance_types_list_string"
                            column_title="Insurance Types"
                            list={props.searchPatients}
                            setList={props.setSearchPatients}
                            sortObject={sortObject}
                            setSortObject={setSortObject}
                            className="table-header"
                            sx={{
                              cursor: "pointer",
                              width: "242px",
                              padding: "0px 12px",
                            }}
                          />
                          <TableCell
                            align="left"
                            onClick={() => {
                              setSortOrder(
                                "cgm_present",
                                sortObject.direction == "ascending"
                                  ? "descending"
                                  : "ascending"
                              );
                            }}
                            style={{
                              cursor: "pointer",
                              width: "242px",
                              padding: "0px 12px",
                            }}
                            className="table-header"
                          >
                            <strong style={{ fontFamily: "QuicksandMedium" }}>
                              CGM Enrolled?
                            </strong>
                            {sortObject.field == "cgm_present" ? (
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
                                "date_of_birth",
                                sortObject.direction == "ascending"
                                  ? "descending"
                                  : "ascending"
                              );
                            }}
                            style={{
                              cursor: "pointer",
                              width: "242px",
                              padding: "0px 12px",
                            }}
                            className="table-header"
                          >
                            <strong style={{ fontFamily: "QuicksandMedium" }}>
                              Date of Birth
                            </strong>
                            {sortObject.field == "cgm_present" ? (
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
                        <>
                          {paginatedList?.map((user, index) => (
                            <TableRow
                              key={index}
                              className={index % 2 == 0 ? "rowEven" : "row"}
                            >
                              <TableCell
                                size="small"
                                scope="row"
                                align="center"
                                className="tableCell"
                              >
                                <input
                                  className="user-selection"
                                  type="checkbox"
                                  name="selectCustomer"
                                  onChange={(event) => {
                                    handlePatientSelection(
                                      event.target.checked,
                                      user
                                    );
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
                                {formatPatientNameReversed(
                                  user.first_name,
                                  user.middle_name,
                                  user.last_name
                                )}
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                <Chip
                                  size="small"
                                  className={`custom-badge ${toClass(
                                    user.list_status
                                  )}`}
                                  label={user.list_status}
                                />
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                {displayArrayField(user.program_titles)}
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                {displayArrayField(user.diagnosis_code_values)}
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                {displayArrayField(user.insurance_types_list)}
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                {displayArrayField(user.ltc_facility_names)}
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                {user.cgm_present === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                size="small"
                                scope="row"
                                align="left"
                                className="tableCell"
                              >
                                <p className="table-body-text">
                                  {user.date_of_birth
                                    ? formatToUsDateFromUTC(user.date_of_birth)
                                    : ""}
                                </p>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {props.searchPatients && props.searchPatients.length > 0 && (
                    <div className="pagerLinks" style={{ paddingTop: 16 }}>
                      <Link
                        onClick={() => {
                          selectPage(
                            currentPage > 1 ? currentPage - 1 : currentPage
                          );
                        }}
                        className="linkDark"
                      >
                        <ArrowBackIosIcon
                          sx={{ width: 16, height: 16, color: "#4A4442" }}
                        />
                      </Link>
                      {pageLinks}
                      <Link
                        onClick={() => {
                          selectPage(
                            currentPage < pageCount
                              ? currentPage + 1
                              : currentPage
                          );
                        }}
                        className="linkDark"
                      >
                        <ArrowForwardIosIcon
                          sx={{ width: 16, height: 16, color: "#4A4442" }}
                        />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div>To search for a patient, enter criteria in the fields</div>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SearchResultsWidget;
