/* eslint-disable prettier/prettier */
// library imports
import * as React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Grid, 
  Link, 
  TextField, 
  Switch, 
  Snackbar
} from "@mui/material";

// helpers import
import { formatToUsDate } from "../../utils/DateHelper";
import { snakeCaseToTitleCase } from "../../utils/CaseFormatHelper";
import { Alert } from '@mui/material';

// app setting imports
import { AuthenticationContext } from "../../Context";
import { getHeaders } from "../../utils/HeaderHelper";

interface Props {
  csrfToken: string;
  menu_track_src: string;
  sort_plain_src: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  selectedProvider: any;
  setSelectedProvider: any;
  setShowEditForm: any;
  setTempSelectedProvider: any;
  unsaveChanges: boolean;
  setUnsavedModalOpen: any;
  setShowAddCoreTeamForm: any;
  renderingKey: number;
}

const CoreTeamShow: React.FC<Props> = (props: any) => {
  //  context import
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [sortObject, setSortObject] = React.useState<any>({
    field: "created_at",
    direction: "descending",
  });
  const [search, setSearch] = React.useState<string>("");

  // pagination states
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [pageLinks, setPageLinks] = React.useState<any>([]);
  const [paginatedList, setPaginatedList] = React.useState<any>([]);
  const perPage = 20;

  // fullProviders are actual results from API call, providers are answer showing on page
  const [providers, setProviders] = React.useState<any>([]);
  const [fullProviders, setFullProviders] = React.useState<any>([]);

  // filter_controller
  const [showBasicSearch, setShowBasicSearch] = React.useState<boolean>(true);
  const [advFirstName, setAdvFirstName] = React.useState<string>("");
  const [advLastName, setAdvLastName] = React.useState<string>("");

  const [flashMessage, SetFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  const afterFetch = React.useRef(false);

  React.useEffect(() => {
    getProviders();
  }, [props.renderingKey]);

  const getProviders = () => {
    fetch(`/data_fetching/core_teams`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setFullProviders(result?.resource?.providers);
          setProviders(result?.resource?.providers);
          setPaginatedList(paginateList(result?.resource?.providers));
          if (result?.resource?.providers?.length >= 1) {
            props.setSelectedProvider(result?.resource?.providers[0]);
            props.setTempSelectedProvider(result?.resource?.providers[0]);
          }
        }
        afterFetch.current = true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const advancedSearch = () => {
    event.preventDefault();
    fetch(
      `/data_fetching/core_teams?first_name=${advFirstName}&last_name=${advLastName}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setProviders(result?.resource?.providers);
          setSearch(""); //clears basic search
          setCurrentPage(1);
          if (result?.resource?.providers?.length >= 1) {
            props.setSelectedProvider(result?.resource?.providers[0]);
            props.setTempSelectedProvider(result?.resource?.providers[0]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (providers) {
      let pages = providers.length / perPage;
      setPageCount(Math.ceil(pages));
      const pageLinks = [];
      for (let i = 1; i <= pages + 1; i++) {
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
  }, [providers, currentPage]);

  // Basic search
  React.useEffect(() => {
    basicSearch();
  }, [search]);

  const basicSearch = () => {
    if (fullProviders) {
      let providerList = getFilteredList(fullProviders);
      setProviders(providerList);
      setCurrentPage(1);
      clearAdvancedSearch();
    }
  };

  const getFilteredList = (providerListParam) => {
    let providerList = providerListParam.filter(
      (provider) =>
        provider.last_name.toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
    return providerList;
  };

  React.useEffect(() => {
    if (providers) {
      sortList();
    }
  }, [sortObject]);

  const selectPage = (page) => {
    setCurrentPage(page);
  };

  const sortList = () => {
    const providerList = getSortedAndSearchedList();
    if (afterFetch.current == false) {
      props.setSelectedProvider(providerList[0]);
      props.setTempSelectedProvider(providerList[0]);
    }
    setProviders(providerList);
    setCurrentPage(1);
  };

  const getSortedAndSearchedList = () => {
    let providerList = [...providers];
    providerList.sort((a, b) => (a.id > b.id ? 1 : -1));
    if (sortObject.field == "last_sign_in_at") {
      providerList.sort((a, b) =>
        new Date(a["last_sign_in_at"]) > new Date(b["last_sign_in_at"]) ? 1 : -1
      );
    }

    if (sortObject.field == "created_at") {
      providerList.sort((a, b) =>
        new Date(a["created_at"]) > new Date(b["created_at"]) ? 1 : -1
      );
    }

    if (sortObject.field == "last_name") {
      providerList.sort((a, b) =>
        a["last_name"]?.toLowerCase() > b["last_name"]?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "role") {
      providerList.sort((a, b) =>
        a?.role?.toLowerCase() > b?.role?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "status") {
      providerList.sort((a, b) =>
        a?.invitation_accepted > b?.invitation_accepted ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      providerList.reverse();
    }

    if (search) {
      providerList = getFilteredList(providerList);
    }
    return providerList;
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
      let providerList = list;
      if (currentPage == 1) {
        return providerList.slice(0, perPage);
      } else {
        let offsetIndex = perPage * (currentPage - 1);
        return providerList.slice(offsetIndex, offsetIndex + perPage);
      }
    }
  };

  const updatePagination = () => {
    setPaginatedList(paginateList(providers));
  };

  React.useEffect(() => {
    updatePagination();
  }, [providers, currentPage]);

  const clearAdvancedSearch = () => {
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

  const handleProviderSelection = (user) => {
    if (props.unsaveChanges) {
      props.setTempSelectedProvider(user);
      props.setUnsavedModalOpen(true);
    } else {
      props.setSelectedProvider(user);
      props.setTempSelectedProvider(user);
      props.setShowEditForm(false);
    }
  };

  const processResendInvite = (user_id) => {
    fetch(`/resend_provider_invitation/${user_id}`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
          SetFlashMessage({ message: result.message, type: "error" });
        } else {
          SetFlashMessage({ message: result.message, type: "success" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {flashMessage.message.length > 0 && (
        <Snackbar
          open={flashMessage.message.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            SetFlashMessage({ message: "", type: "error" });
          }}
        >
          <Alert severity={flashMessage.type}>{flashMessage.message}</Alert>
        </Snackbar>
      )}
      <Grid item xs={6} className="patient-index-container">
        <Grid container className="patient-search-container">
          <Grid container>
            <Grid item xs={12}>
              <p className="search-form-label">PROVIDER SEARCH</p>
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
                  InputProps={{
                    disableUnderline: true,
                  }}
                  size="small"
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
                      InputProps={{
                        disableUnderline: true,
                      }}
                      size="small"
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
                      InputProps={{
                        disableUnderline: true,
                      }}
                      size="small"
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
              <div className="switch">
                BASIC SEARCH
                <Switch
                  checked={!showBasicSearch}
                  onChange={handleSwitchChange}
                  color="primary"
                />
                ADVANCED SEARCH
              </div>

              {!showBasicSearch && (
                <div className="search-button-container up-10px">
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
            <Grid item xs={12} md={6} className="addLink">
              <Link
                style={{
                  display: "flex",
                  cursor: "pointer",
                  justifyContent: "flex-end",
                }}
                onClick={() => props.setShowAddCoreTeamForm(true)}
              >
                <div style={{ float: "left", marginRight: 10 }}>
                  <img
                    src={props.menu_track_src}
                    width="40"
                    alt="Invite New Provider"
                  />
                </div>
                <div
                  style={{
                    float: "left",
                    fontFamily: "QuicksandMedium",
                    color: "#a29d9b",
                    marginTop: 8,
                  }}
                >
                  Add New Provider
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
                      className="table-header name-header provider"
                    >
                      <strong style={{ fontFamily: "QuicksandMedium" }}>
                        Providers ({providers?.length})
                      </strong>
                      {sortObject.field == "last_name" ? (
                        <span className="sortIndicator provider">
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
                        <span className="sortIndicator provider">
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
                          "role",
                          sortObject.direction == "ascending"
                            ? "descending"
                            : "ascending"
                        );
                      }}
                      style={{ cursor: "pointer" }}
                      className="table-header provider"
                    >
                      <strong style={{ fontFamily: "QuicksandMedium" }}>
                        Role
                      </strong>
                      {sortObject.field == "role" ? (
                        <span className="sortIndicator provider">
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
                        <span className="sortIndicator provider">
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
                          "created_at",
                          sortObject.direction == "ascending"
                            ? "descending"
                            : "ascending"
                        );
                      }}
                      style={{ cursor: "pointer" }}
                      className="table-header provider"
                    >
                      <strong style={{ fontFamily: "QuicksandMedium" }}>
                        Date Joined
                      </strong>
                      {sortObject.field == "created_at" ? (
                        <span className="sortIndicator provider">
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
                        <span className="sortIndicator provider">
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
                      className="table-header provider"
                    >
                      <strong style={{ fontFamily: "QuicksandMedium" }}>
                        Last Login
                      </strong>
                      {sortObject.field == "last_sign_in_at" ? (
                        <span className="sortIndicator provider">
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
                        <span className="sortIndicator provider">
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
                          "status",
                          sortObject.direction == "ascending"
                            ? "descending"
                            : "ascending"
                        );
                      }}
                      style={{ cursor: "pointer" }}
                      className="table-header provider"
                    >
                      <strong style={{ fontFamily: "QuicksandMedium" }}>
                        {" "}
                        Status{" "}
                      </strong>
                      {sortObject.field == "status" ? (
                        <span className="sortIndicator provider">
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
                        <span className="sortIndicator provider">
                          <img
                            src={props.sort_plain_src}
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
                  {paginatedList ? (
                    <>
                      {paginatedList.map((user, index) => (
                        <TableRow
                          key={index}
                          className={index % 2 == 0 ? "rowEven" : "row"}
                        >
                          <TableCell>
                            <input
                              type="radio"
                              name="selectCustomer"
                              onChange={() => {
                                handleProviderSelection(user);
                              }}
                              checked={props.selectedProvider?.id == user.id}
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
                            {snakeCaseToTitleCase(user.role)}
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
                          <TableCell>
                            {!user.is_active 
                              ? "Inactive" 
                              : (user.invitation_accepted == true ? (
                                "Active"
                                ) : (
                                  <Link
                                    className={`linkDark gimme-pointer-cursor`}
                                    onClick={() => processResendInvite(user.id)}
                                  >
                                    Resend Invite
                                  </Link>
                                )
                              )
                            }
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
    </>
  );
};

export default CoreTeamShow;
