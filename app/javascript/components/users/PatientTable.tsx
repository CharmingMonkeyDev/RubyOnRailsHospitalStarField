/* eslint-disable prettier/prettier */
import * as React from "react";

import {
  Grid,
  Link,
  TextField,
  Switch,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Radio,
  Select,
  Box
} from "@mui/material";
import { getYodaDateToday, formatToUsDate } from "../utils/DateHelper";
import { PrivilegesContext } from "../PrivilegesContext";
import { checkPrivileges } from "../utils/PrivilegesHelper";
import NoteIcon from "@mui/icons-material/Note";

// components
import AddPatientList from "../patients/AddPatientList";
import EditPatientList from "../patients/EditPatientList";
import PatientNotesShow from "../modals/PatientNotesShow";
import { useHistory } from "react-router-dom";

// helper imports
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import {
  AuthenticationContext,
  ImagesContext,
  NewPatientModalContext,
} from "../Context";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import usePagination from "../hooks/usePagination";

interface Props {
  csrfToken: string;
  menu_track_src: string;
  sort_plain_src: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  selectedPatient: any;
  setSelectedPatient: any;
  setShowEditForm: any;
  setTempSelectedPatient: any;
  unsaveChanges: boolean;
  setUnsavedModalOpen: any;
  renderingKey: number;
}

const PatientTable: React.FC<Props> = (props: any) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const images = React.useContext(ImagesContext);
  const modalSetting = React.useContext(NewPatientModalContext);

  const [fullPatients, setFullPatients] = React.useState<any>([]);
  const [paginatedList, setPaginatedList] = React.useState<any>(null);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "last_name",
    direction: "descending",
  });
  const [search, setSearch] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const perPage = 20;
  const [patients, setPatients] = React.useState<any>([]);
  const [patientLists, setPatientLists] = React.useState<any>([]);
  const [selectedPatientList, setSelectedPatientList] =
    React.useState<any>(null); //this is an object
  const [showBasicSearch, setShowBasicSearch] = React.useState<boolean>(true);
  const [advFirstName, setAdvFirstName] = React.useState<string>("");
  const [advLastName, setAdvLastName] = React.useState<string>("");
  const [advDateOfBirth, setAdvDateOfBirth] = React.useState<string>("");
  const [advFollowUpDate, setAdvFollowUpDate] = React.useState<string>("");
  const [openAddPatientListModal, setOpenAddPatientListModal] =
    React.useState<boolean>(false);
  const [openEditPatientListModal, setOpenEditPatientListModal] =
    React.useState<boolean>(false);
  const [editListSelection, setEditListSelection] = React.useState<any>("");

  // patient notes modal controllers
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [noteForId, setNoteForId] = React.useState<string>("");

  const userPrivileges = React.useContext(PrivilegesContext);
  const afterFetch = React.useRef(false);

  React.useEffect(() => {
    getPatients();
  }, [props.renderingKey]);

  // Basic search
  React.useEffect(() => {
    if (!afterFetch.current){
      return
    }
    basicSearch();
  }, [search]);

  React.useEffect(() => {
    if (fullPatients && afterFetch.current) {
      sortList();
    }
  }, [sortObject]);

  React.useEffect(() => {
    if (!afterFetch.current){
      return
    }
    updatePagination();
  }, [patients, currentPage]);

  React.useEffect(() => {
    if (!afterFetch.current){
      return
    }
    advancedSearch();
  }, [selectedPatientList]);

  React.useEffect(() => {
    if (openEditPatientListModal == false && afterFetch.current) {
      getPatients(); //refreshes patient lists
      advancedSearch();
    }
  }, [openEditPatientListModal]);

  React.useEffect(() => {
    if (openAddPatientListModal == false && afterFetch.current) {
      getPatients(); //refreshes patient lists
    }
  }, [openAddPatientListModal]);

  React.useEffect(() => {
    if (!afterFetch.current){
      return
    }
    // check if list was deleted
    let filtered =
      patientLists?.filter((list) => list.id == selectedPatientList?.id) || [];
    if (filtered.length == 0) {
      setSelectedPatientList(null);
    }
  }, [patientLists]);

  const getPatients = () => {
    fetch(
      `/data_fetching/patient_index?patient_list=${
        selectedPatientList ? selectedPatientList?.id : ""
      }`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          setFullPatients(result.patients);
          setPatients(result.patients);
          setPaginatedList(paginateList(result.patients));
          setPatientLists(result.patient_lists);
          if (result.patients?.length >= 1) {
            if (!props.selectedPatient) {
              setFirstPatientSelection(result.patients[0]);
            }
          }
          afterFetch.current = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const advancedSearch = () => {
    fetch(
      `/data_fetching/patient_index?first_name=${advFirstName}&last_name=${advLastName}&date_of_birth=${advDateOfBirth}&patient_list=${
        selectedPatientList ? selectedPatientList?.id : ""
      }&follow_up_date=${advFollowUpDate}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          console.log("Running advanced search");
          setPatients(result.patients);
          setPaginatedList(paginateList(result.patients));
          setCurrentPage(1);
          if (result.patients?.length >= 1) {
            setFirstPatientSelection(result.patients[0]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const basicSearch = () => {
    if (fullPatients) {
      let patientList = getFilteredList(fullPatients);
      setPatients(patientList);
      setCurrentPage(1);
      clearAdvancedSearch();
    }
  };

  const getFilteredList = (patientListParam) => {
    let patientList = patientListParam.filter(
      (patient) =>
        patient.last_name.toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
    return patientList;
  };

  const setFirstPatientSelection = (user) => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const patient_id = url.searchParams.get("patient_id");
    const isEdit = url.searchParams.get("action") && url.searchParams.get("action") === "edit";
    if (patient_id) {
      fetch(`/data_fetching/edit_my_info/${patient_id}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            props.setSelectedPatient(result);
            props.setTempSelectedPatient(result);
            if(isEdit) {
              props.setShowEditForm(true);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      props.setSelectedPatient(user);
      props.setTempSelectedPatient(user);
    }
  };

  const selectPage = (page) => {
    setCurrentPage(page);
  };
  const { pageCount, pageLinks } = usePagination(patients, perPage, currentPage, selectPage);

  const sortList = () => {
    const patientList = getSortedAndSearchedList();
    if (afterFetch.current == false) {
      setFirstPatientSelection(patientList[0]);
    }
    setPatients(patientList);
    setCurrentPage(1);
  };

  const getSortedAndSearchedList = () => {
    let patientList = [...patients];
    patientList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "last_sign_in_at") {
      patientList.sort((a, b) =>
        new Date(a["last_sign_in_at"]) > new Date(b["last_sign_in_at"]) ? 1 : -1
      );
    }

    if (sortObject.field == "formatted_follow_up") {
      patientList.sort((a, b) =>
        new Date(a["formatted_follow_up"]) > new Date(b["formatted_follow_up"])
          ? 1
          : -1
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

    if (search) {
      patientList = getFilteredList(patientList);
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
    setPaginatedList(paginateList(patients));
  };

  const clearAdvancedSearch = () => {
    setAdvDateOfBirth("");
    setAdvFollowUpDate("");
    setAdvLastName("");
    setAdvFirstName("");
  };

  const handleSwitchChange = () => {
    if (showBasicSearch) {
      setShowBasicSearch(false);
      setSearch("");
    } else {
      setShowBasicSearch(true);
      basicSearch();
    }
  };

  const history = useHistory();

  const handlePatientSelection = (user) => {
    if (props.unsaveChanges) {
      props.setTempSelectedPatient(user);
      props.setUnsavedModalOpen(true);
    } else {
      props.setSelectedPatient(user);
      props.setTempSelectedPatient(user);
      props.setShowEditForm(false);
      history.push(`/patients?patient_id=${user.id}`, { shallow: true });
    }
  };

  const handleNewPatientModalOpen = () => {
    modalSetting.setNewPatientModalOpen(true);
  };

  const handleNewPatientListModalOpen = () => {
    setOpenAddPatientListModal(true);
  };

  const showEditModal = (list) => {
    setEditListSelection(list);
    setOpenEditPatientListModal(true);
  };

  function updatePatientList(id: string | null) {
    if (id) {
      let patientList = patientLists.filter((item) => item.id == id)[0];
      console.log("patient list");
      console.log(patientList);

      setSelectedPatientList(patientList);
    } else {
      setSelectedPatientList(null);
    }
  }

  const handlePatientNotesShow = (patientId) => {
    setNoteForId(patientId);
  };

  React.useEffect(() => {
    if (noteForId) {
      setModalOpen(true);
    }
  }, [noteForId]);

  React.useEffect(() => {
    if (!modalOpen) {
      setNoteForId("");
    }
  }, [modalOpen]);

  return (
    <Grid item xs={12} md={6} className="patient-index-container">
      <Grid container className="patient-search-container">
        <Grid container>
          <Grid item xs={12}>
            <p className="search-form-label">PATIENT SEARCH</p>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between">
          {showBasicSearch ? (
            <Grid item xs={6}>
              <TextField
                id="search"
                className="textInput plainLabel"
                label="Last Name"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                variant="filled"
                size="small"
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Grid>
          ) : (
            <Grid item xs={6}>
              <Grid container justifyContent="space-between" spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    id="search"
                    className="textInput plainLabel"
                    label="Last Name"
                    value={advLastName}
                    onChange={(event) => {
                      setAdvLastName(event.target.value);
                    }}
                    variant="filled"
                    size="small"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        advancedSearch();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="search"
                    className="textInput plainLabel"
                    label="First Name"
                    value={advFirstName}
                    onChange={(event) => {
                      setAdvFirstName(event.target.value);
                    }}
                    variant="filled"
                    size="small"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        advancedSearch();
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    id="date"
                    type="date"
                    value={advDateOfBirth}
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
                    }}
                    onChange={(event) => {
                      setAdvDateOfBirth(event.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        advancedSearch();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="date"
                    type="date"
                    value={advFollowUpDate}
                    className="textInput plainLabel"
                    variant="filled"
                    size="small"
                    label="Follow-Up Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    onChange={(event) => {
                      setAdvFollowUpDate(event.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        advancedSearch();
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={5} className="search-switch">
            <div style={{ alignSelf: "center" }} className="switch">
              BASIC SEARCH
              <Switch
                checked={!showBasicSearch}
                onChange={handleSwitchChange}
                color="primary"
              />
              ADVANCED SEARCH
            </div>

            {!showBasicSearch && (
              <div className="search-button-container">
                <Link className="search-button" onClick={advancedSearch}>
                  Search
                </Link>
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
      <div className="userAdminInformation">
        <Grid container direction="row" className="adminHeader">
          <Grid item xs={12} md={6}>
            <h3>Search Results</h3>
          </Grid>
          <Grid item xs={12} lg={6} className="addLink">
            {checkPrivileges(userPrivileges, "Invite New Patient") && (
              <Link
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  cursor: "pointer",
                }}
                href="#"
                onClick={handleNewPatientModalOpen}
              >
                <div style={{ float: "left", marginRight: 10 }}>
                  <img
                    src={props.menu_track_src}
                    width="40"
                    alt="Invite New Patient"
                  />
                </div>
                <div className="add-patient-label">Add Patient</div>
              </Link>
            )}
          </Grid>
          <div className="divider"></div>
        </Grid>
        <Grid container direction="row" style={{ paddingLeft: "50px" }}>
          <Grid item xs={12} md={6}>
            <InputLabel
              htmlFor="patient-list"
              className="field-label-1"
              style={{ marginTop: "10px", color: "black" }}
            >
              Patient List Selection
            </InputLabel>
            <Select
              id="patientListId"
              name="patientList[id]"
              value={selectedPatientList?.id || "default"}
              onChange={(event) => {
                updatePatientList(event.target.value);
              }}
              fullWidth
              renderValue={(selected) => {
                if (selected === "default") {
                  return "All Patients";
                }
                const selectedList = patientLists.find((list) => list.id === selected);
                return selectedList ? selectedList.name : "All Patients";
              }}
              sx={{ textAlign: "left", marginLeft: "0 !important", mt: "10px" }}
            >
              <MenuItem key={-1} value={"default"}>
                All Patients
              </MenuItem>
              {patientLists.map((list, index) => (
                <MenuItem
                  key={index}
                  value={list.id}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box component="span">{list.name}</Box>
                  <Link
                    sx={{ marginLeft: "15px", marginTop: "5px" }}
                    className="action-icon"
                    href="#"
                    onClick={(event) => {
                      event.stopPropagation();
                      showEditModal(list);
                    }}
                  >
                    <img
                      style={{ height: "20px" }}
                      src={images.pencil_grey}
                      alt="Edit List"
                      className="action-icon-image"
                    />
                  </Link>
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} lg={6} className="addLink">
            <Link
              style={{
                display: "flex",
                justifyContent: "flex-end",
                cursor: "pointer",
              }}
              href="#"
              onClick={handleNewPatientListModalOpen}
            >
              <div style={{ float: "left", marginRight: 10 }}>
                <img
                  src={images.menu_track_src}
                  width="40"
                  alt="Create New Patient List"
                />
              </div>
              <div className="add-patient-label grey-plus-label">
                New Patient List
              </div>
            </Link>
          </Grid>
          <div className="divider"></div>
        </Grid>
        <div className="tableContainer">
          <TableContainer component={Paper}>
            <Table className="table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
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
                    className="table-header name-header nowrap-header"
                  >
                    <strong style={{ fontFamily: "QuicksandMedium" }}>
                      Patients ({patients.length})
                    </strong>
                    {sortObject.field == "last_name" ? (
                      <span className="sortIndicator">
                        {sortObject.direction == "ascending" ? (
                          <img
                            src={props.sort_ascending_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Asc"
                          />
                        ) : (
                          <img
                            src={props.sort_descending_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Desc"
                          />
                        )}
                      </span>
                    ) : (
                      <span className="sortIndicator">
                        <img
                          src={props.sort_plain_src}
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
                    className="table-header nowrap-header"
                  >
                    <strong style={{ fontFamily: "QuicksandMedium" }}>
                      Last Contact
                    </strong>
                    {sortObject.field == "last_contact" ? (
                      <span className="sortIndicator">
                        {sortObject.direction == "ascending" ? (
                          <img
                            src={props.sort_ascending_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Asc"
                          />
                        ) : (
                          <img
                            src={props.sort_descending_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Desc"
                          />
                        )}
                      </span>
                    ) : (
                      <span className="sortIndicator">
                        <img
                          src={props.sort_plain_src}
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
                    className="table-header nowrap-header"
                  >
                    <strong style={{ fontFamily: "QuicksandMedium" }}>
                      Last Login
                    </strong>
                    {sortObject.field == "last_sign_in_at" ? (
                      <span className="sortIndicator">
                        {sortObject.direction == "ascending" ? (
                          <img
                            src={props.sort_ascending_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Asc"
                          />
                        ) : (
                          <img
                            src={props.sort_descending_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Desc"
                          />
                        )}
                      </span>
                    ) : (
                      <span className="sortIndicator">
                        <img
                          src={props.sort_plain_src}
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
                        "formatted_follow_up",
                        sortObject.direction == "ascending"
                          ? "descending"
                          : "ascending"
                      );
                    }}
                    style={{ cursor: "pointer" }}
                    className="table-header nowrap-header"
                  >
                    <strong style={{ fontFamily: "QuicksandMedium" }}>
                      Follow Up
                    </strong>
                    {sortObject.field == "formatted_follow_up" ? (
                      <span className="sortIndicator">
                        {sortObject.direction == "ascending" ? (
                          <img
                            src={props.sort_ascending_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Asc"
                          />
                        ) : (
                          <img
                            src={props.sort_descending_src}
                            width="10"
                            className="sort-icon"
                            alt="Sort Desc"
                          />
                        )}
                      </span>
                    ) : (
                      <span className="sortIndicator">
                        <img
                          src={props.sort_plain_src}
                          width="10"
                          className="sort-icon"
                          alt="Sort Asc"
                        />
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="left" className="table-header nowrap-header">
                    <strong style={{ fontFamily: "QuicksandMedium" }}>
                      Notes
                    </strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedList ? (
                  <>
                    {paginatedList.map((user, index) => (
                      <TableRow
                        key={index}
                        className={index % 2 == 0 ? "rowEven" : "row"}
                      >
                        <TableCell>
                        <Radio
                          onChange={() => {
                            handlePatientSelection(user);
                          }}
                          checked={props.selectedPatient?.id == user.id}
                          name="radio-buttons"
                          size="small"
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
                          N/A
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
                          {user.formatted_follow_up
                            ? user.formatted_follow_up
                            : "N/A"}
                        </TableCell>
                        <TableCell
                          size="small"
                          scope="row"
                          align="left"
                          className="tableCell"
                        >
                          <Link onClick={() => handlePatientNotesShow(user.id)}>
                            <NoteIcon style={{ color: "#A29D9B" }} />
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
          <p className="pagerLinks">
            <Link
              onClick={() => {
                selectPage(1);
              }}
              className="linkDark"
            >
              <ArrowBack />
          </Link>
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
            <Link
              onClick={() => {
                selectPage(pageCount);
              }}
              className="linkDark"
            >
              <ArrowForward />
            </Link>
          </p>
        </div>
      </div>
      <AddPatientList
        openModal={openAddPatientListModal}
        setOpenModal={setOpenAddPatientListModal}
      ></AddPatientList>
      <EditPatientList
        selectedPatientList={editListSelection}
        openModal={openEditPatientListModal}
        setOpenModal={setOpenEditPatientListModal}
      ></EditPatientList>
      {noteForId && (
        <PatientNotesShow
          patient_id={noteForId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      )}
    </Grid>
  );
};

export default PatientTable;
