// lib imports
import * as React from "react";
import { Grid, Link, Stack, TextField } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// component imports
import ImmunizationDefer from "../modals/ImmunizationDefer";
import ImmunizationGiven from "../modals/ImmunizationGiven";
import FilterMenu from "./FilterMenu";

// helpers and setting imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import { ImagesContext } from "../Context";
import { dateToString, formatToUsDateFromUTC } from "../utils/DateHelper";
import { getYodaDateToday } from "../utils/DateHelper";
import debounce from "lodash/debounce";
import BadgeList from "../common/BadgeList";

interface Props {}

interface ChipData {
  key: number;
  label: string;
  type: string;
}

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
  const [patientLists, setPatientLists] = React.useState<any>([]);
  const [lastName, setLastName] = React.useState<string>("");
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
  const [immunizations, setImmunizations] = React.useState<any>([]);
  const [paginatedList, setPaginatedList] = React.useState<any>([]);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "name_reversed",
    direction: "descending",
  });
  const [deferModalOpen, setDeferModalOpen] = React.useState<boolean>(false);
  const [givenModalOpen, setGivenModalOpen] = React.useState<boolean>(false);
  const [deferSelectionImId, setDeferSelectionImId] =
    React.useState<string>("");
  const [givenSelectionImId, setGivenSelectionImId] =
    React.useState<string>("");
  const [renderingKey, setRenderingKey] = React.useState<number>(Math.random);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [checkedImTypes, setCheckedImTypes] = React.useState<any>([]);
  const [checkedPatientList, setCheckedPatientList] = React.useState<any>("");
  const [badgeData, setBadgeData] = React.useState<ChipData[]>([]);

  const imTypesQuery = checkedImTypes
    .map((item) => `im_types[]=${item}`)
    .join("&");

  const calendarRef = React.useRef(null);
  const lastNameRef = React.useRef("");

  // Handle manual click on customized calendar icon
  const handleCalendarClick = () => {
    if (calendarRef.current) {
      calendarRef.current.showPicker();
    }
  };

  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //inital useEffect and data fetch
  React.useEffect(() => {
    getForecast();
  }, [
    renderingKey,
    dob,
    dueDateFrom,
    dueDateThrough,
    checkedImTypes,
    checkedPatientList,
  ]);

  const getForecast = () => {
    fetch(
      `/immunizations?${
        imTypesQuery ? `${imTypesQuery}&` : imTypesQuery
      }last_name=${
        lastNameRef.current
      }&patient_list=${checkedPatientList}&dob=${dob}&due_date_from=${dueDateFrom}&due_date_through=${dueDateThrough}`,
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
            setPatientLists(result?.resource?.patient_lists);
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

  const debouncedFetchData = debounce(() => {
    getForecast();
  }, 500);

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

  const setOrder = (fieldName) => {
    setSortOrder(
      fieldName,
      sortObject.direction == "ascending" ? "descending" : "ascending"
    );
  };

  const renderSortIcon = (fieldName) => {
    return sortObject.field == fieldName ? (
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
          alt="Sort Plain"
        />
      </span>
    );
  };

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

    if (sortObject.field) {
      imList.sort((a, b) =>
        a[sortObject.field]?.toLowerCase() > b[sortObject.field]?.toLowerCase()
          ? 1
          : -1
      );
    }

    if (sortObject.direction == "descending") {
      imList.reverse();
    }

    return imList;
  };

  // -----
  // end of sorting stuffs

  const handleDeferModalOpen = (imId: string) => {
    setDeferSelectionImId(imId);
  };

  React.useEffect(() => {
    if (deferSelectionImId) {
      setDeferModalOpen(true);
    }
  }, [deferSelectionImId]);

  React.useEffect(() => {
    if (deferModalOpen == false) {
      setDeferSelectionImId(null);
    }
  }, [deferModalOpen]);

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
  // end of given and defer handler

  const handleDeleteBadge = (badgeToDelete) => {
    if (badgeToDelete?.type == "imType") {
      setCheckedImTypes((badges) =>
        badges.filter((badge) => badge !== badgeToDelete.label)
      );
    }

    if (badgeToDelete?.type == "patientList") {
      setCheckedPatientList("");
    }
  };

  React.useEffect(() => {
    const imTypeBadges = checkedImTypes.map((imType) => ({
      key: imType,
      label: imType,
      type: "imType",
    }));

    const patientListBadge = checkedPatientList
      ? {
          key: checkedPatientList,
          label: checkedPatientList,
          type: "patientList",
        }
      : null;

    const updatedBadgeData = patientListBadge
      ? [...imTypeBadges, patientListBadge]
      : imTypeBadges;

    setBadgeData(updatedBadgeData);
  }, [checkedImTypes, checkedPatientList]);

  return (
    <div className="immunization-container">
      <div className="immunization-header-section">
        <p className="immunization-header-text">Immunization Alerts</p>
      </div>
      <Grid container className="panel-container" borderRadius={"4px"}>
        <Grid item xs={12}>
          <Grid container className="panel-show-container">
            <Grid container className="panel-information-container">
              <Grid container direction="row" className="admin-header">
                <Grid item xs={12} className="box-header">
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    paddingX={3}
                    paddingY={1}
                    alignItems={"center"}
                    display={"flex"}
                  >
                    <Grid
                      item
                      xs={3}
                      display={"flex"}
                      direction={"row"}
                      alignItems={"center"}
                    >
                      <p className="immunization-result">
                        Immunization Results
                      </p>
                      {immunizations.length > 0 && (
                        <p className="immunization-count-container">
                          {immunizations.length}
                        </p>
                      )}
                    </Grid>
                    <Grid
                      xs={10}
                      item
                      display={"flex"}
                      direction={"row"}
                      alignItems={"center"}
                      gap={2.5}
                    >
                      <TextField
                        id="last_name"
                        className="textInput plainLabel"
                        placeholder="Search Last Name"
                        value={lastName}
                        onChange={(event) => {
                          setLastName(event.target.value);
                          lastNameRef.current = event.target.value;
                          debouncedFetchData();
                        }}
                        variant="outlined"
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            borderRadius: "4px",
                            height: 42.25,
                            backgroundColor: "#EFE9E7",
                            width: "100%",
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },
                          },
                          "& .MuiInputBase-input": {
                            color: "#1E1E1E",
                            fontSize: 12,
                            fontWeight: 500,
                            "&::placeholder": {
                              color: "#868382",
                              fontSize: 12,
                              fontWeight: 500,
                              opacity: 1,
                            },
                          },
                        }}
                      />
                      <TextField
                        id="dob"
                        type="date"
                        value={dob}
                        className="textInput plainLabel"
                        variant="filled"
                        size="small"
                        label="Date of Birth"
                        inputRef={calendarRef}
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            color: "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                        inputProps={{
                          max: `${getYodaDateToday()}`,
                        }}
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            borderRadius: "4px",
                            backgroundColor: "#EFE9E7",
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon
                                onClick={handleCalendarClick}
                                style={{ cursor: "pointer" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(event) => {
                          setDob(event.target.value);
                        }}
                        sx={{
                          width: "150px !important",
                          flexShrink: 0,
                          "& .MuiInputBase-input::placeholder": {
                            color: "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                            opacity: 1,
                          },
                          "& .MuiInputBase-input": {
                            color: dob ? "#1E1E1E" : "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                          "& input[type=date]::-webkit-calendar-picker-indicator":
                            {
                              opacity: 0,
                              display: "none",
                            },
                        }}
                      />

                      <div className="date-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Due Date From"
                            value={dueDateFrom || null}
                            onChange={(date) => {
                              setDueDateFrom(dateToString(date));
                            }}
                            className="textInput plainLabel"
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                            InputProps={{
                              disableUnderline: true,
                              inputProps: {
                                placeholder: "mm/dd/yyyy",
                                style: {
                                  fontSize: 12,
                                  color: "#868382",
                                  opacity: 1,
                                  fontWeight: 500,
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: "#868382",
                                fontSize: 12,
                                fontWeight: 500,
                                margin: "10px 0 0 10px",
                              },
                            }}
                            style={{
                              margin: 0,
                              backgroundColor: "rgb(239, 233, 231)",
                              height: "42.5px",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </div>

                      <div className="date-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label="Due Date Through"
                            id="date-picker-inline"
                            value={dueDateThrough || null}
                            onChange={(date) => {
                              setDueDateThrough(dateToString(date));
                            }}
                            className="textInput plainLabel"
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                            InputProps={{
                              disableUnderline: true,
                              inputProps: {
                                placeholder: "mm/dd/yyyy",
                                style: {
                                  fontSize: 12,
                                  color: "#868382",
                                  opacity: 1,
                                  fontWeight: 500,
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: "#868382",
                                fontSize: 12,
                                fontWeight: 500,
                                margin: "10px 0 0 10px",
                              },
                            }}
                            style={{
                              margin: 0,
                              backgroundColor: "rgb(239, 233, 231)",
                              height: "42.5px",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </div>

                      {/* <TextField
                        id="due-date-from"
                        type="date"
                        value={dueDateFrom}
                        className="textInput plainLabel"
                        variant="filled"
                        size="small"
                        label="Due Date From"
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            color: "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            borderRadius: "4px",
                            backgroundColor: "#EFE9E7",
                          },
                        }}
                        onChange={(event) => {
                          setDueDateFrom(event.target.value);
                        }}
                        sx={{
                          "& .MuiInputBase-input::placeholder": {
                            color: "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                            opacity: 1,
                          },
                          "& .MuiInputBase-input": {
                            color: dueDateFrom ? "#1E1E1E" : "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                      /> */}
                      {/* <TextField
                        id="due-date-through"
                        type="date"
                        value={dueDateThrough}
                        className="textInput plainLabel"
                        variant="filled"
                        size="small"
                        label="Due Date Through"
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            color: "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            borderRadius: "4px",
                            backgroundColor: "#EFE9E7",
                          },
                        }}
                        onChange={(event) => {
                          setDueDateThrough(event.target.value);
                        }}
                        sx={{
                          "& .MuiInputBase-input::placeholder": {
                            color: "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                            opacity: 1,
                          },
                          "& .MuiInputBase-input": {
                            color: dueDateThrough ? "#1E1E1E" : "#868382",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                        }}
                      /> */}

                      <div
                        className="advanced-search-container"
                        onClick={handleOpenFilter}
                      >
                        <FilterListIcon sx={{ width: 20, height: 20 }} />
                        <p className="advanced-search-text">Advanced Search</p>
                        {anchorEl ? (
                          <ArrowDropUp sx={{ width: 24, height: 24 }} />
                        ) : (
                          <ArrowDropDownIcon sx={{ width: 24, height: 24 }} />
                        )}
                      </div>
                      <FilterMenu
                        imTypes={imTypeOptions}
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        tagListLength={imTypeOptions?.length}
                        checkedItems={checkedImTypes}
                        setCheckedItems={setCheckedImTypes}
                        patientLists={patientLists}
                        checkedPatientList={checkedPatientList}
                        setCheckedPatientList={setCheckedPatientList}
                      />
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container className="general-patient-info-container">
                {badgeData?.length > 0 && (
                  <div className="badge-container">
                    <BadgeList
                      badgeData={badgeData}
                      setBadgeData={setBadgeData}
                      handleDeleteBadge={handleDeleteBadge}
                    />
                  </div>
                )}

                <Grid item xs={12} style={{ backgroundColor: "white" }}>
                  <TableContainer>
                    <Table className="no-border-table">
                      <TableHead className="table-header-box">
                        <TableRow>
                          <TableCell
                            align="left"
                            onClick={() => {
                              setOrder("name_reversed");
                            }}
                            style={{ cursor: "pointer" }}
                            className="table-header name-header"
                            sx={{ paddingLeft: "24px !important" }}
                            width="30%"
                          >
                            <div className="row">
                              <p className="table-header">Patient Name</p>
                              {renderSortIcon("name_reversed")}
                            </div>
                          </TableCell>
                          <TableCell
                            align="left"
                            onClick={() => {
                              setOrder("date_of_birth");
                            }}
                            style={{ cursor: "pointer" }}
                            className="nowrap-header"
                            width="15%"
                          >
                            <div className="row">
                              <p className="table-header"> Date Of Birth</p>
                              {renderSortIcon("date_of_birth")}
                            </div>
                          </TableCell>
                          <TableCell
                            align="left"
                            onClick={() => {
                              setOrder("vaccine_type");
                            }}
                            style={{ cursor: "pointer" }}
                            className="nowrap-header"
                            width="30%"
                          >
                            <div className="row">
                              <p className="table-header">Immunization</p>
                              {renderSortIcon("vaccine_type")}
                            </div>
                          </TableCell>
                          <TableCell
                            align="left"
                            onClick={() => {
                              setOrder("minimum_valid_date");
                            }}
                            style={{ cursor: "pointer" }}
                            className="nowrap-header"
                            width="15%"
                          >
                            <div className="row">
                              <p className="table-header">Due Date</p>
                              {renderSortIcon("minimum_valid_date")}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="nowrap-header"
                            width="5%"
                          >
                            <p className="table-header">Given</p>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="nowrap-header"
                            sx={{ paddingRight: "16px !important" }}
                            width="5%"
                          >
                            <p className="table-header">Defer</p>
                          </TableCell>
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
                                <TableCell
                                  size="small"
                                  scope="row"
                                  align="left"
                                  className="tableCell"
                                  sx={{ paddingLeft: "24px !important" }}
                                >
                                  <Link
                                    className={"table-body-link"}
                                    href={`/patient_reports/${immunization?.user?.id}/immunizations`}
                                  >
                                    {immunization?.user?.name_reversed}
                                  </Link>
                                </TableCell>
                                <TableCell
                                  size="small"
                                  scope="row"
                                  align="left"
                                  className="tableCell"
                                >
                                  <p className="table-body-text">
                                    {immunization?.user?.date_of_birth}
                                  </p>
                                </TableCell>
                                <TableCell
                                  size="small"
                                  scope="row"
                                  align="left"
                                  className="tableCell"
                                >
                                  <p className="table-body-text">
                                    {immunization?.vaccine_type}
                                  </p>
                                </TableCell>
                                <TableCell
                                  size="small"
                                  scope="row"
                                  align="left"
                                  className="tableCell"
                                >
                                  <p className="table-body-text">
                                    {immunization.minimum_valid_date
                                      ? formatToUsDateFromUTC(
                                          immunization.minimum_valid_date
                                        )
                                      : "N/A"}
                                  </p>
                                </TableCell>
                                <TableCell
                                  size="small"
                                  scope="row"
                                  align="center"
                                  className="tableCell"
                                >
                                  <Link
                                    onClick={() =>
                                      handleGivenModalOpen(immunization.id)
                                    }
                                  >
                                    <img
                                      src={images.immunization_icon}
                                      alt="ImmunizationIcon"
                                      className="action-icon-image"
                                      style={{
                                        width: 24,
                                        height: 24,
                                        color: "black",
                                      }}
                                    />
                                  </Link>
                                </TableCell>
                                <TableCell
                                  size="small"
                                  scope="row"
                                  align="center"
                                  className="tableCell"
                                  sx={{ paddingRight: "16px !important" }}
                                >
                                  <Link
                                    onClick={() =>
                                      handleDeferModalOpen(immunization.id)
                                    }
                                  >
                                    <img
                                      src={images.immunization_calendar}
                                      alt="DeferIcon"
                                      className="action-icon-image"
                                      style={{ width: 24, height: 24 }}
                                    />
                                  </Link>
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
                  {paginatedList.length > 0 && (
                    <p className="pagerLinks">
                      <Link
                        onClick={() => {
                          selectPage(
                            currentPage > 1 ? currentPage - 1 : currentPage
                          );
                        }}
                        className="linkDark"
                      >
                        <ArrowBackIosIcon
                          sx={{ width: 20, height: 20, color: "#4A4442" }}
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
                          sx={{ width: 20, height: 20, color: "#4A4442" }}
                        />
                      </Link>
                    </p>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ImmunizationDefer
        immunization_id={deferSelectionImId}
        modalOpen={deferModalOpen}
        setModalOpen={setDeferModalOpen}
        setRenderingKey={setRenderingKey}
      />
      <ImmunizationGiven
        immunization_id={givenSelectionImId}
        modalOpen={givenModalOpen}
        setModalOpen={setGivenModalOpen}
        setRenderingKey={setRenderingKey}
      />
    </div>
  );
};

export default Immunization;
