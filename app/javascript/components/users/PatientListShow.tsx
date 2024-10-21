/* eslint-disable prettier/prettier */

// library imports
import { Box, Chip, Grid, Link, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import * as React from "react";
import { getSortedListByDate, setSortOrder } from "../shared/tables/TableHelper";
import dayjs from "dayjs";
import { AuthenticationContext, ImagesContext } from "../Context";
import { useParams } from "react-router-dom";
import { getHeaders } from "../utils/HeaderHelper";
import CustomChip from "../shared/CustomChip";

// component imports

// import PatientShowTable from "./PatientShowTable";

interface Props {}
const searchIcon = require("../../../assets/images/search.svg");

const PatientShow: React.FC<Props> = (props: any) => {
  const { id } = useParams();
  const images = React.useContext(ImagesContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [patientList, setPatientList] = React.useState<any>();
  const [patients, setPatients] = React.useState<any>(null);
  const [sortObject, setSortObject] = React.useState<any>(null);
  const [searchKey, setSearchKey] = React.useState<string>("");

  React.useEffect(() => {
    fetchPatientListDetails();
  }, [id]);

  const fetchPatientListDetails = async () =>{
    try {
      const response = await fetch(`/patient_lists/${id}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      const result = await response.json();
      console.log(result);
      setPatientList(result?.patient_list);
      setPatients(result?.patients);
    } catch (err) {
      alert("Error fetching patient list info");
      console.error(err);
    }
  }

  const getSortedAndSearchedList = React.useCallback((patients) => {
    let sortedPatients = [...patients];
    sortedPatients.sort((a, b) => (a.id > b.id ? 1 : -1));
    switch (sortObject.field) {
      case "date_of_birth":
        return getSortedListByDate(
          sortedPatients,
          sortObject,
          "date_of_birth"
        );
      default:
        return getSortedListByDate(
          sortedPatients,
          sortObject,
          "last_name"
        );
    }
  }, [sortObject]);
  
  const sortList = React.useCallback(() => {
    setPatients(prev => prev ? getSortedAndSearchedList(prev) : prev);
  }, [getSortedAndSearchedList]);
  
  React.useEffect(() => {
    sortList();
  }, [sortList]);

  const filteredPatients = patients?.filter((patient) => {
    const searchLower = searchKey.toLowerCase();
    return (
      patient.last_name.toLowerCase().includes(searchLower) || 
      patient.first_name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="patient-lists-container">
        <div className="container2">
          <Grid item xs={12} sx={{mb: 2}}>
            <Grid container>
              <Stack
                direction={"row"}
                justifyContent="space-between"
                alignItems={"center"}
                px={"25px"}
                py={"15px"}
                minHeight={"50px"}
                width={"100%"}
                marginInline={"10px"}
                sx={{
                  background: "#ffffff 0% 0% no-repeat padding-box",
                  boxShadow: "0px 10px 20px #00000029",
                  borderRadius: "5px",
                }}
              >
                <Typography variant="h5" fontFamily={"QuicksandBold"}>{patientList?.name}</Typography>
                <Stack direction={"row"} gap={2} display={"flex"} alignItems={"center"}>
                  <Chip
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label={patients?.length ?? 0}
                          size="medium"
                          sx={{
                            backgroundColor: "#3F51B5",
                            color: "white",
                            height: '18px',
                            minWidth: '16px',
                            fontSize: '10px',
                            padding: '2px 0',
                          }}
                        />
                        <span style={{ marginLeft: 4 }}>On List</span>
                      </Box>
                    }
                    size={"medium"}
                    variant={"filled"}
                    sx={{
                      py: 2,
                      textTransform: "capitalize",
                      backgroundColor: "#D1D7FF",
                      color: "#3F51B5",
                      fontFamily: "QuicksandBold"
                    }}
                  />
                  <Link href="/patient-lists" sx={{color: "#55504E", textDecoration: "underline", fontSize: "0.8em"}}>Back to Patient Lists</Link>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid
              container
              display={"flex"}
              alignItems={"center"}
              justifyContent="space-between"
              className="customer-relation-container"
            >
              <Grid item xs={5} className="association-header" sx={{marginLeft: "0 !important"}}>
                <Stack direction={"row"} gap={2} ml={"14px !important"} className="association-header" display={"flex"} alignItems={"center"}>
                  <h3>Search Results</h3>
                  <Chip
                    label={searchKey ? filteredPatients.length : "—"}
                    size={"small"}
                    sx={{
                      px: 1,
                      fontFamily: "QuicksandBold",
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={4} className="button-container" sx={{marginTop: "0 !important"}}>
                <Grid
                  item
                  xs={12}
                  className="patient-chat-search__box field-container"
                  style={{
                    position: "relative",
                    marginLeft: "0px !important",
                  }}
                >
                  <TextField
                    id="search-builder"
                    placeholder="Search"
                    value={searchKey}
                    onChange={(event) => {
                      setSearchKey(event.target.value);
                    }}
                    style={{ width: "100%", backgroundColor: "#EFE9E7", borderRadius: "5px" }}
                    className="the-field the-search"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <img
                    src={searchIcon}
                    style={{
                      width: "15px",
                      position: "absolute",
                      top: "13px",
                      right: "15px",
                      zIndex: 10,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <div className="divider"></div>
            <Grid container>
              <Grid item xs={12} className="customer-association-table-container">
                <Box sx={{ overflowX: 'auto' }}>
                  <Table className="no-border-table" sx={{ bgcolor: "white", minWidth: "1000px" }}>
                    <TableHead className="table-header-box">
                      <TableRow>
                        <TableCell
                          component={"th"}
                          className="nowrap-header bold-font-face"
                          onClick={() => {
                            setSortOrder(
                              "patient_name",
                              sortObject?.direction === "ascending"
                                ? "descending"
                                : "ascending",
                              setSortObject
                            );
                          }}
                          style={{ cursor: "pointer", minWidth: "200px" }}
                        >
                          Patient Name
                          {sortObject?.field === "patient_name" ? (
                            <span className="sortIndicator">
                              {sortObject?.direction === "ascending" ? (
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
                        <TableCell component={"th"} className="nowrap-header bold-font-face" sx={{ minWidth: '150px' }}>List Status</TableCell>
                        <TableCell component={"th"} className="nowrap-header bold-font-face" sx={{ minWidth: '250px' }}>Programs</TableCell>
                        <TableCell component={"th"} className="nowrap-header bold-font-face" sx={{ minWidth: '150px' }}>Diagnosis Code</TableCell>
                        <TableCell component={"th"} className="nowrap-header bold-font-face" sx={{ minWidth: '150px' }}>Insurance Type</TableCell>
                        <TableCell component={"th"} className="nowrap-header bold-font-face" sx={{ minWidth: '200px' }}>Long Term Care Facility</TableCell>
                        <TableCell component={"th"} className="nowrap-header bold-font-face" sx={{ minWidth: '150px' }}>CGM Enrolled?</TableCell>
                        <TableCell
                          component={"th"}
                          className="nowrap-header bold-font-face"
                          onClick={() => {
                            setSortOrder(
                              "date_of_birth",
                              sortObject?.direction === "ascending"
                                ? "descending"
                                : "ascending",
                              setSortObject
                            );
                          }}
                          style={{ cursor: "pointer", minWidth: "150px" }}
                        >
                          Date of Birth
                          {sortObject?.field === "date_of_birth" ? (
                            <span className="sortIndicator">
                              {sortObject?.direction === "ascending" ? (
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
                      {filteredPatients?.map((patient, index) => (
                        <TableRow key={patient.id}>
                          <TableCell sx={{ textTransform: "capitalize", minWidth: "150px" }}>
                            {`${patient.last_name}, ${patient.first_name}`}
                          </TableCell>
                          <TableCell sx={{ minWidth: '120px' }}>
                            <CustomChip label={"On List"} fullWidth />
                          </TableCell>
                          <TableCell sx={{ minWidth: '150px' }}>{patient.programs}</TableCell>
                          <TableCell sx={{ minWidth: '150px' }}>{patient.assigned_diagnoses}</TableCell>
                          <TableCell sx={{ minWidth: '150px' }}>{patient.insurance_type}</TableCell>
                          <TableCell sx={{ minWidth: '200px' }}>{patient.ltc_facility}</TableCell>
                          <TableCell sx={{ minWidth: '150px' }}>TBD</TableCell>
                          <TableCell sx={{ minWidth: '150px' }}>
                            {dayjs(patient?.date_of_birth).format("MM/DD/YYYY")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        </div>
      </div>
    </>
  );
};

export default PatientShow;