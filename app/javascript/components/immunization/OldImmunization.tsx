// lib imports
import * as React from "react";
import {
  Grid,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  Link,
} from "@mui/material";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// component imports
import { getYodaDateToday } from "../utils/DateHelper";
import ImmunizationDefer from "../modals/ImmunizationDefer";
import ImmunizationGiven from "../modals/ImmunizationGiven";
import NewEncounter from "../patient_encounters/new_encounter";

// helpers and setting imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import { ImagesContext } from "../Context";
import { formatToUsDateFromUTC } from "../utils/DateHelper";

interface Props {}

const Immunization: React.FC<Props> = (props: any) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const images = React.useContext(ImagesContext);
  const afterFetch = React.useRef(false);

  // pagination states
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [pageLinks, setPageLinks] = React.useState<any>([]);
  const perPage = 10;

  // other states
  const [imTypeOptions, setImTypeOptions] = React.useState<any>([]);
  const [imType, setImType] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [mrnNumber, setMrnMuber] = React.useState<string>("");
  const [dob, setDob] = React.useState<string>("");
  const [dueDateFrom, setDueDateFrom] = React.useState<string>("");

  // we want to see t+30 days data
  const defaultThroughDate = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    const defaultDateString = defaultDate.toISOString().split("T")[0];
    return defaultDateString;
  };
  const [dueDateThrough, setDueDateThrough] =
    React.useState<string>(defaultThroughDate);

  const [selectedImId, setSelectedImId] = React.useState<number>();
  const [selectedImUserId, setSelectedImUserId] = React.useState<string>();

  const [immunizations, setImmunizations] = React.useState<any>([]);
  const [paginatedList, setPaginatedList] = React.useState<any>([]);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "name_reversed",
    direction: "descending",
  });
  const [ellipseExpandedForId, setEllipseExapandedForId] =
    React.useState<number>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [givenModalOpen, setGivenModalOpen] = React.useState<boolean>(false);
  const [deferSelectionImId, setDeferSelectionImId] =
    React.useState<string>("");
  const [givenSelectionImId, setGivenSelectionImId] =
    React.useState<string>("");
  const [renderingKey, setRenderingKey] = React.useState<number>(Math.random);

  //inital useEffect and data fetch
  React.useEffect(() => {
    getForecast();
  }, [renderingKey]);

  const getForecast = () => {
    fetch(
      `/immunizations?im_type=${imType}&last_name=${lastName}&mrn=${mrnNumber}&dob=${dob}&due_date_from=${dueDateFrom}&due_date_through=${dueDateThrough}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        console.log(result);
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            setImmunizations(result?.resource?.data);
            setImTypeOptions(result?.resource?.im_types);
            setPaginatedList(paginateList(result?.resource?.data));
          } else {
            alert("Something is wrong forecast cannot be fetched");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = () => {
    getForecast();
  };

  // pagination stuff
  // ------
  const selectPage = (page) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    if (immunizations.length > 0) {
      let pages = Math.ceil(immunizations.length / perPage);
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
  }, [immunizations, currentPage]);

  React.useEffect(() => {
    updatePagination();
  }, [immunizations, currentPage]);

  const paginateList = (list) => {
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
  };

  const updatePagination = () => {
    setPaginatedList(paginateList(immunizations));
  };
  // -------
  // end of pagination stuffs

  // begining of sorting stuff
  // -----
  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  React.useEffect(() => {
    if (immunizations) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const imList = getSortedList();
    setImmunizations(imList);
    setCurrentPage(1);
  };

  const getSortedList = () => {
    let imList = [...immunizations];
    imList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "name_reversed") {
      imList.sort((a, b) =>
        a.user?.name_reversed?.toLowerCase() >
        b.user?.name_reversed?.toLowerCase()
          ? 1
          : -1
      );
    }

    if (sortObject.field == "mrn_number") {
      imList.sort((a, b) => (a.user?.mrn_number > b.user?.mrn_number ? 1 : -1));
    }

    if (sortObject.field == "vaccine_type") {
      imList.sort((a, b) =>
        a.vaccine_type?.toLowerCase() > b.vaccine_type?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "minimum_valid_date") {
      imList.sort((a, b) =>
        new Date(a.minimum_valid_date) > new Date(b.minimum_valid_date) ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      imList.reverse();
    }

    return imList;
  };

  // -----
  // end of sorting stuffs

  // Elliptical click handler start
  // ------
  const handleEllipseToggle = (imId) => {
    if (imId == ellipseExpandedForId) {
      setEllipseExapandedForId(null);
    } else {
      setEllipseExapandedForId(imId);
    }
  };

  const handleDeferModalOpen = (imId: string) => {
    setDeferSelectionImId(imId);
  };

  React.useEffect(() => {
    if (deferSelectionImId) {
      setModalOpen(true);
    }
  }, [deferSelectionImId]);

  React.useEffect(() => {
    if (modalOpen == false) {
      setDeferSelectionImId(null);
    }
  }, [modalOpen]);

  const handleGivenModalOpen = (imId: string) => {
    setGivenSelectionImId(imId);
  };

  React.useEffect(() => {
    if (givenSelectionImId) {
      setGivenModalOpen(true);
    }
  }, [givenSelectionImId]);

  React.useEffect(() => {
    if (givenModalOpen == false) {
      setGivenSelectionImId(null);
    }
  }, [givenModalOpen]);

  // ------
  // end of elliptical handler

  // other functions
  const handleImmunizationSelection = (immunization) => {
    setSelectedImId(immunization?.id);
    setSelectedImUserId(immunization?.user_id);
  };

  const handleClearFilter = () => {
    setImType("");
    setLastName("");
    setMrnMuber("");
    setDob("");
    setDueDateFrom("");
    setDueDateThrough("");
    setRenderingKey(Math.random());
  };

  return (
    <div className="customer-list">
      <ImmunizationDefer
        immunization_id={deferSelectionImId}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setRenderingKey={setRenderingKey}
      />
      <ImmunizationGiven
        immunization_id={givenSelectionImId}
        modalOpen={givenModalOpen}
        setModalOpen={setGivenModalOpen}
        setRenderingKey={setRenderingKey}
      />
      <Grid
        container
        direction="row"
        alignItems="flex-start"
        className="container"
      >
        <Grid item sm={12} md={6}>
          <div className="userAdminInformation">
            <Grid container direction="row" className="adminHeader">
              <Grid item xs={12} md={6}>
                <h3>Immunization Alerts</h3>
              </Grid>
            </Grid>
            <div className="tableContainer">
              <p>
                The patients below have been identified as having immunization
                needs. Please verify and take action by administering
                immunization or deferring the alert.
              </p>

              <Grid container>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="immunization-type"
                    className="field-label-1"
                    style={{ marginTop: "10px", color: "black" }}
                  >
                    Filter by immunization type
                  </InputLabel>
                  <TextField
                    id="imType"
                    name="imType"
                    size="small"
                    label="Select Immunization"
                    value={imType}
                    variant="outlined"
                    onChange={(event) => {
                      setImType(event.target.value);
                    }}
                    select
                    style={{
                      textAlign: "left",
                      marginLeft: "0 !important",
                      width: "250px",
                      marginTop: "8px",
                      marginBottom: "10px",
                      background: "#fcf6f4",
                    }}
                  >
                    {imTypeOptions.map((item, index) => (
                      <MenuItem
                        key={index}
                        value={item}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span> {item} </span>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="patient-due-date"
                    className="field-label-1"
                    style={{ marginTop: "10px", color: "black" }}
                  >
                    Filter by patient or due date
                  </InputLabel>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="search"
                    className="textInput plainLabel"
                    label="Last Name"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                    }}
                    variant="filled"
                    size="small"
                    InputProps={{
                      disableUnderline: true,
                      style: { borderRadius: "4px" },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="search"
                    className="textInput plainLabel"
                    label="Medical Record Number"
                    value={mrnNumber}
                    onChange={(event) => {
                      setMrnMuber(event.target.value);
                    }}
                    variant="filled"
                    size="small"
                    InputProps={{
                      disableUnderline: true,
                      style: { borderRadius: "4px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="dob"
                    type="date"
                    value={dob}
                    className="textInput plainLabel"
                    variant="filled"
                    size="small"
                    label="Date of Birth"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: `${getYodaDateToday()}`,
                    }}
                    InputProps={{
                      disableUnderline: true,
                      style: { borderRadius: "4px" },
                    }}
                    onChange={(event) => {
                      setDob(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel
                    htmlFor="patient-due-date"
                    className="field-label-1"
                    style={{ marginTop: "10px", color: "black" }}
                  >
                    Due date range
                  </InputLabel>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="due-date-from"
                    type="date"
                    value={dueDateFrom}
                    className="textInput plainLabel"
                    variant="filled"
                    size="small"
                    label="Due Date From"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      disableUnderline: true,
                      style: { borderRadius: "4px" },
                    }}
                    onChange={(event) => {
                      setDueDateFrom(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="due-date-through"
                    type="date"
                    value={dueDateThrough}
                    className="textInput plainLabel"
                    variant="filled"
                    size="small"
                    label="Due Date Through"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      disableUnderline: true,
                      style: { borderRadius: "4px" },
                    }}
                    onChange={(event) => {
                      setDueDateThrough(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{ position: "relative" }}
                justifyContent="center"
              >
                <Button
                  className="basic-button orange-btn"
                  onClick={handleSearch}
                  style={{ height: "40px" }}
                >
                  Filter
                </Button>
                <Grid item style={{ textAlign: "right" }}>
                  <p
                    onClick={handleClearFilter}
                    style={{
                      textTransform: "capitalize",
                      color: "red",
                      position: "absolute",
                      right: 0,
                      marginTop: 0,
                      fontSize: "0.8em",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Clear Filter
                  </p>
                </Grid>
              </Grid>

              <TableContainer
                component={Paper}
                style={{
                  marginTop: "10px",
                  border: "1px solid #ff890a",
                  position: "relative",
                }}
              >
                <Table
                  className="table patientlist-table"
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className="table-header"
                        style={{ width: "20px" }}
                      ></TableCell>
                      <TableCell
                        align="left"
                        onClick={() => {
                          setSortOrder(
                            "name_reversed",
                            sortObject.direction == "ascending"
                              ? "descending"
                              : "ascending"
                          );
                        }}
                        style={{ cursor: "pointer" }}
                        className="table-header name-header"
                      >
                        <strong style={{ fontFamily: "QuicksandMedium" }}>
                          Patient
                        </strong>
                        {sortObject.field == "name_reversed" ? (
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
                            "mrn_number",
                            sortObject.direction == "ascending"
                              ? "descending"
                              : "ascending"
                          );
                        }}
                        style={{ cursor: "pointer" }}
                        className="table-header"
                      >
                        <strong style={{ fontFamily: "QuicksandMedium" }}>
                          MRN
                        </strong>
                        {sortObject.field == "mrn_number" ? (
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
                            "vaccine_type",
                            sortObject.direction == "ascending"
                              ? "descending"
                              : "ascending"
                          );
                        }}
                        style={{ cursor: "pointer" }}
                        className="table-header"
                      >
                        <strong style={{ fontFamily: "QuicksandMedium" }}>
                          Immunization
                        </strong>
                        {sortObject.field == "vaccine_type" ? (
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
                            "minimum_valid_date",
                            sortObject.direction == "ascending"
                              ? "descending"
                              : "ascending"
                          );
                        }}
                        style={{ cursor: "pointer" }}
                        className="table-header"
                      >
                        <strong style={{ fontFamily: "QuicksandMedium" }}>
                          Due Date
                        </strong>
                        {sortObject.field == "minimum_valid_date" ? (
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
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedList.length > 0 ? (
                      <>
                        {paginatedList.map((immunization, index) => (
                          <TableRow
                            key={index}
                            className={index % 2 == 0 ? "rowEven" : "row"}
                          >
                            <TableCell>
                              <input
                                className="user-selection"
                                type="radio"
                                name="selectCustomer"
                                onChange={() => {
                                  handleImmunizationSelection(immunization);
                                }}
                                checked={immunization.id == selectedImId}
                              />
                            </TableCell>
                            <TableCell
                              size="small"
                              scope="row"
                              align="left"
                              className="tableCell"
                            >
                              {immunization?.user?.name_reversed}
                            </TableCell>
                            <TableCell
                              size="small"
                              scope="row"
                              align="left"
                              className="tableCell"
                            >
                              {immunization?.user?.mrn_number}
                            </TableCell>
                            <TableCell
                              size="small"
                              scope="row"
                              align="left"
                              className="tableCell"
                            >
                              {immunization?.vaccine_type}
                            </TableCell>
                            <TableCell
                              size="small"
                              scope="row"
                              align="left"
                              className="tableCell"
                            >
                              {immunization.minimum_valid_date
                                ? formatToUsDateFromUTC(
                                    immunization.minimum_valid_date
                                  )
                                : "N/A"}
                            </TableCell>
                            <TableCell
                              size="small"
                              scope="row"
                              align="left"
                              className="tableCell"
                            >
                              <Link
                                onClick={() =>
                                  handleEllipseToggle(immunization.id)
                                }
                              >
                                <MoreVertIcon style={{ color: "black" }} />
                              </Link>
                              {ellipseExpandedForId == immunization.id && (
                                <div
                                  style={{
                                    position: "absolute",
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                    marginLeft: "-55px",
                                    borderRadius: "5px",
                                    boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.3)",
                                    width: "80px",
                                    textAlign: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      padding: "5px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() =>
                                      handleEllipseToggle(immunization.id)
                                    }
                                  >
                                    Select
                                    <ArrowDropDownIcon />
                                  </div>
                                  <div>
                                    <Link
                                      style={{
                                        padding: "5px",
                                        color: "black",
                                        display: "block",
                                      }}
                                      onClick={() =>
                                        handleGivenModalOpen(immunization.id)
                                      }
                                    >
                                      Given
                                    </Link>
                                  </div>
                                  <div>
                                    <Link
                                      style={{
                                        padding: "5px",
                                        color: "black",
                                        display: "block",
                                      }}
                                      onClick={() =>
                                        handleDeferModalOpen(immunization.id)
                                      }
                                    >
                                      Defer
                                    </Link>
                                  </div>
                                </div>
                              )}
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
                    selectPage(
                      currentPage < pageCount ? currentPage + 1 : currentPage
                    );
                  }}
                  className="linkDark"
                >
                  &gt;
                </Link>
              </p>
            </div>
          </div>
        </Grid>

        <Grid item sm={12} md={6}>
          {selectedImUserId && <NewEncounter patientId={selectedImUserId} />}
        </Grid>
      </Grid>
    </div>
  );
};

export default Immunization;
