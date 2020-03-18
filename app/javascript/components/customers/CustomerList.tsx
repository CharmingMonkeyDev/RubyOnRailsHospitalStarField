/* eslint-disable prettier/prettier */
// lib imports
import * as React from "react";
import { Grid, Link, Snackbar, TextField, Switch, Select } from "@mui/material";
import { Alert } from '@mui/material';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell
} from "@mui/material";
import Paper from "@mui/material/Paper";

// component imports
import ShowCustomer from "./ShowCustomer";
import EditCustomer from "./EditCustomer";
import AddCustomer from "./AddCustomer";

// helpers and setting imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import FlashMessage from "../shared/FlashMessage";
import { stateOptions } from "../patients/AddPatientManual";

interface Props {
  csrfToken: string;
  menu_track_src: string;
  user_id: number;
  sort_ascending_src: string;
  sort_descending_src: string;
  sort_plain_src: string;
  pencil_grey: string;
}

const CustomerList: React.FC<Props> = (props: any) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states
  const [sortObject, setSortObject] = React.useState<any>({
    field: "name",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [pageLinks, setPageLinks] = React.useState<any>([]);
  const [paginatedList, setPaginatedList] = React.useState<any>([]);
  const perPage = 20;
  const [customers, setCustomers] = React.useState<any>([]);
  const [fullCustomers, setFullCustomers] = React.useState<any>([]);
  const [selected, setSelected] = React.useState<any>(null);
  const [customerInfo, setCustomerInfo] = React.useState<any>(true);
  const [editInfo, setEditInfo] = React.useState<any>(false);
  const [error, setError] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [showAddCustomerFrom, setShowAddCustomerForm] =
    React.useState<boolean>(false);
  const afterFetch = React.useRef(false);
  const [renderingKey, setRenderingKey] = React.useState<number>(Math.random());

  // filter_controller
  const [showBasicSearch, setShowBasicSearch] = React.useState<boolean>(true);
  const [advName, setAdvName] = React.useState<string>("");
  const [advCity, setAdvCity] = React.useState<string>("");
  const [advState, setAdvState] = React.useState<string>("");

  const getCustomerList = () => {
    if (props.user_id) {
      fetch(`/data_fetching/customers`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setCustomers(result.customers);
            setFullCustomers(result.customers);
            setPaginatedList(paginateList(result.customers));
          }
          afterFetch.current = true;
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
      let customersList = list;
      if (currentPage == 1) {
        return customersList.slice(0, perPage);
      } else {
        let offsetIndex = perPage * (currentPage - 1);
        return customersList.slice(offsetIndex, offsetIndex + perPage);
      }
    }
  };

  const updatePagination = () => {
    setPaginatedList(paginateList(customers));
  };

  React.useEffect(() => {
    getCustomerList();
  }, [renderingKey]);

  React.useEffect(() => {
    sortList();
  }, [sortObject, fullCustomers]);

  React.useEffect(() => {
    if (customers) {
      let pages = customers.length / perPage;
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
  }, [customers, currentPage]);

  React.useEffect(() => {
    basicSearch();
  }, [search]);

  const getFilteredList = (customerListParams) => {
    let customerList = customerListParams.filter((customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase())
    );
    return customerList;
  };

  const basicSearch = () => {
    if (fullCustomers) {
      let customersList = getFilteredList(fullCustomers);
      setCustomers(customersList);
      setCurrentPage(1);
      clearAdvancedSearch();
    }
  };

  React.useEffect(() => {
    updatePagination();
  }, [customers, currentPage]);

  const selectPage = (page) => {
    setCurrentPage(page);
  };

  const clearAdvancedSearch = () => {
    setAdvName("");
    setAdvCity("");
    setAdvState("");
  };

  const sortList = () => {
    let customersList = [].concat(customers);

    customersList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "name") {
      customersList.sort((a, b) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "address") {
      customersList.sort((a, b) =>
        a.address?.toLowerCase() > b.address?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "phone") {
      customersList.sort((a, b) =>
        a["phone_number"] > b["phone_number"] ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      customersList.reverse();
    }

    const searchedCustomerList = getFilteredList(customersList);
    setCustomers(searchedCustomerList);
    if (afterFetch.current == false) {
      setSelected(customersList[0]);
    }
    setCurrentPage(1);
  };

  React.useEffect(() => {
    advancedSearch();
  }, [advState]);

  const advancedSearch = () => {
    fetch(
      `/data_fetching/customers?name=${advName}&city=${advCity}&state=${advState}`,
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
          setCustomers(result.customers);
          const pagList = paginateList(result.customers);
          setPaginatedList(pagList);
          if (pagList.length >= 1) {
            setSelected(pagList[0]);
          }
        }
        afterFetch.current = true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSwitchChange = () => {
    if (showBasicSearch) {
      setShowBasicSearch(false);
      setSearch("");
    } else {
      setShowBasicSearch(true);
      getCustomerList();
      basicSearch();
    }
  };

  return (
    <div className="customer-list">
      <Grid
        container
        direction="row"
        alignItems="flex-start"
        className="container"
      >
        {error.length > 0 && (
          <Snackbar
            open={error.length > 0}
            autoHideDuration={6000}
            onClose={() => {
              setError("");
            }}
          >
            <Alert severity="error" className="alert">
              {error}
            </Alert>
          </Snackbar>
        )}
        <Grid item sm={12} md={6}>
          <Grid container className="patient-search-container">
            <Grid container>
              <Grid item xs={12}>
                <p className="search-form-label">CUSTOMER SEARCH</p>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between">
              {showBasicSearch ? (
                <Grid item xs={6}>
                  <TextField
                    id="search"
                    className="textInput plainLabel"
                    label="Name"
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
                    <Grid item xs={12}>
                      <TextField
                        id="search"
                        className="textInput plainLabel"
                        label="Name"
                        value={advName}
                        onChange={(event) => {
                          setAdvName(event.target.value);
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
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        id="search"
                        className="textInput plainLabel"
                        label="City"
                        value={advCity}
                        onChange={(event) => {
                          setAdvCity(event.target.value);
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
                      <Select
                        id="state"
                        value={advState}
                        required
                        variant="filled"
                        className="textInput plainLabel"
                        sx={{
                          backgroundColor: '#fcf6f4 !important',
                        }}
                        inputProps={{ style: {paddingTop: "15px", paddingBottom: "10px"} }}
                        onChange={(e) => {setAdvState(e.target.value)}}
                        native
                      >
                        <option value={""}>Select State</option>
                        {stateOptions}
                      </Select>
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
              <Grid item xs={12} md={6} className="addLink">
                <Link
                  style={{
                    display: "flex",
                    cursor: "pointer",
                    justifyContent: "flex-end",
                  }}
                  href="#"
                  onClick={() => setShowAddCustomerForm(true)}
                >
                  <div style={{ float: "left", marginRight: 10 }}>
                    <img
                      src={props.menu_track_src}
                      width="40"
                      alt="Add New Customer"
                    />
                  </div>
                  <div className="add-customer-label">Add Customer</div>
                </Link>
              </Grid>
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
                            "name",
                            sortObject.direction == "ascending"
                              ? "descending"
                              : "ascending"
                          );
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <strong style={{ fontFamily: "QuicksandMedium" }}>
                          Customers ({customers?.length})
                        </strong>
                        {sortObject.field == "name" ? (
                          <span className="sortIndicator">
                            {sortObject.direction == "ascending" ? (
                              <img
                                src={props.sort_ascending_src}
                                width="10"
                                alt="Sort Asc"
                              />
                            ) : (
                              <img
                                src={props.sort_descending_src}
                                width="10"
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
                            "address",
                            sortObject.direction == "ascending"
                              ? "descending"
                              : "ascending"
                          );
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <strong style={{ fontFamily: "QuicksandMedium" }}>
                          Address
                        </strong>
                        {sortObject.field == "address" ? (
                          <span className="sortIndicator">
                            {sortObject.direction == "ascending" ? (
                              <img
                                src={props.sort_ascending_src}
                                width="10"
                                alt="Sort Asc"
                              />
                            ) : (
                              <img
                                src={props.sort_descending_src}
                                width="10"
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
                            "phone",
                            sortObject.direction == "ascending"
                              ? "descending"
                              : "ascending"
                          );
                        }}
                        style={{ cursor: "pointer", width: "95px" }}
                      >
                        <strong style={{ fontFamily: "QuicksandMedium" }}>
                          Phone
                        </strong>
                        {sortObject.field == "phone" ? (
                          <span className="sortIndicator">
                            {sortObject.direction == "ascending" ? (
                              <img
                                src={props.sort_ascending_src}
                                width="10"
                                alt="Sort Asc"
                              />
                            ) : (
                              <img
                                src={props.sort_descending_src}
                                width="10"
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedList.map((customer, index) => (
                      <TableRow
                        key={customer.id}
                        className={index % 2 == 0 ? "rowEven" : "row"}
                      >
                        <TableCell style={{ padding: "10px" }}>
                          <input
                            type="radio"
                            name="selectCustomer"
                            onChange={() => {
                              setSelected(customer);
                              setCustomerInfo(true);
                              setEditInfo(false);
                            }}
                            checked={selected?.id == customer.id}
                          />
                        </TableCell>
                        <TableCell
                          size="small"
                          scope="row"
                          align="left"
                          className="tableCell"
                        >
                          {customer.name}
                        </TableCell>
                        <TableCell
                          size="small"
                          scope="row"
                          align="left"
                          className="tableCell"
                        >
                          {customer.address ? customer.full_address : "N/A"}
                        </TableCell>
                        <TableCell
                          size="small"
                          scope="row"
                          align="left"
                          className="tableCell"
                        >
                          {customer.phone_number}
                        </TableCell>
                      </TableRow>
                    ))}
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
        {showAddCustomerFrom ? (
          <Grid item sm={12} md={6}>
            <AddCustomer setShowAddCustomerForm={setShowAddCustomerForm} />
          </Grid>
        ) : (
          <Grid item sm={12} md={6} style={{ marginTop: "88px" }}>
            {customerInfo && selected && !showAddCustomerFrom && (
              <ShowCustomer
                pencil_grey={props.pencil_grey}
                csrfToken={props.csrfToken}
                customerId={selected.id}
                setEditInfo={setEditInfo}
                setCustomerInfo={setCustomerInfo}
              />
            )}
            {}
            {editInfo && (
              <EditCustomer
                customerId={selected.id}
                csrfToken={props.csrfToken}
                setEditInfo={setEditInfo}
                setCustomerInfo={setCustomerInfo}
                setError={setError}
                setRenderingKey={setRenderingKey}
              />
            )}
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default CustomerList;
