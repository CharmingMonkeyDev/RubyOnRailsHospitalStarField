/* eslint-disable prettier/prettier */
import * as React from "react";
import { Box, Grid, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { AuthenticationContext, ImagesContext } from "../../Context";
import { useParams } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import AddData from "../../patient-dashboard/AddData";
import { getHeaders } from "../../utils/HeaderHelper";
import { formatTimeWithAMPM, formatToUsDateFromUTC } from "../../utils/DateHelper";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import ShowReadingNote from "../../patient-dashboard/ShowReadingNote";
import Modal from "../../modals/Modal";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";

interface Props {}

const modalContent = (
  <div className="modal-content">
    <p className="align-center">
      {"You are attempting to delete this patient's blood pressure. This action cannot be undone. Would you like to continue?"}
    </p>
  </div>
);

const BloodPressurePanel: React.FC<Props> = (props: any) => {
  // users id
  const { id } = useParams();
  const authSettings = React.useContext(AuthenticationContext);
  const [addData, setAddData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [showNotes, setShowNotes] = useState<any>(null);
  const [bloodPressureReadings, setBloodPressureReadings] =  useState<any>([]);
  const [ openReadingDeleteModal, setOpenReadingDeleteModal] = useState<boolean>(false);
  const [selectedReading, setSelectedReading] = useState<any>();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/?menu=false"),
    onSwipedRight: () => (window.location.href = "/my-labs"),
  });

  const getBPReadings = () => {
    if (id) {
      fetch(`/data_fetching/my_data/${id}`, {
        method: "GET",
        headers: getHeaders(authSettings.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.error(result.error);
          } else {
            setBloodPressureReadings(result.blood_pressure_readings);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    getBPReadings();
  }, []);

  const handleCloseDeleteReadingModal = () => {
    setSelectedReading(undefined);
    setOpenReadingDeleteModal(false);
  };

  const removeReading = () => {
    if(selectedReading) {
      fetch(`/blood_pressure_reading/${selectedReading.id}`, {
        method: "DELETE",
        headers: getHeaders(authSettings.csrfToken),
        body: JSON.stringify({
          reading: { patient_device_reading_id: selectedReading.id },
        }),
      })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.error(result.error);
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };

  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });

  React.useEffect(() => {
    if (bloodPressureReadings) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const bloodPressureList = getSortedAndSearchedList();
    setBloodPressureReadings(bloodPressureList);
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
    let bpList = [...bloodPressureReadings];
    bpList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "name") {
      bpList.sort((a, b) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "date_recorded") {
      bpList.sort((a, b) =>
        new Date(a["date_recorded"]).getTime() > new Date(b["date_recorded"]).getTime() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      bpList.reverse();
    }
    return bpList;
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  return (
    <Grid className="panel-container">
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
                  <Grid item>
                    <h3>Blood Pressure</h3>
                  </Grid>
                  <Link
                    className="action-link add-encounter"
                    onClick={() => {
                      setAddData("blood_pressure");
                    }}                  >
                    <AddIcon className="plus-icon" />{" "}
                    <span className="app-user-text">Add Blood Pressure</span>
                  </Link>
                </Stack>
              </Grid>
            </Grid>
            <Grid
              container
              className="medication-container grey-container pad-top-10"
            >
              <Grid item xs={12} className="medication-table-container">
                <TableContainer>
                  <Table>
                    <TableHead className="table-header-box">
                      <TableRow>
                        <TableCell
                          className="nowrap-header"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortOrder(
                              "date_recorded",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending"
                            );
                          }}
                        >
                          Date {getSortIcon("date_recorded")}
                        </TableCell>
                        <TableCell>Blood Pressure</TableCell>
                        <TableCell>Added By</TableCell>
                        <TableCell
                          className="nowrap-header"
                          width={"2%"}
                          align="center"
                        >
                          Edit
                        </TableCell>
                        <TableCell
                          className="nowrap-header"
                          width={"2%"}
                          align="center"
                        >
                          Delete
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {bloodPressureReadings?.map(
                      (bloodPressureReading) =>
                        (
                          <TableRow key={bloodPressureReading.id}>
                            <TableCell>
                              {formatToUsDateFromUTC(bloodPressureReading.date_recorded)} &nbsp;                                 
                              {formatTimeWithAMPM(bloodPressureReading.date_recorded)}
                            </TableCell>
                            <TableCell sx={{py: "0 !important", display: "table-cell"}}>
                              <Box height={"100%"} display={"flex"} alignItems={"center"}>
                                {bloodPressureReading.sys_dis_value}
                                {bloodPressureReading.notes && bloodPressureReading.notes.length && (
                                  <InfoIcon
                                    style={{
                                      fontSize: 16,
                                      marginLeft: 10,
                                      cursor: "pointer",
                                      color: "grey"
                                    }}
                                    onClick={() => {
                                      bloodPressureReading.type = "blood_pressure"; 
                                      setShowNotes(bloodPressureReading);
                                    }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {bloodPressureReading.creator?.id !== bloodPressureReading.user.id ? bloodPressureReading.creator?.name : "Patient"}
                            </TableCell>
                            <TableCell align="center">
                              <Link
                                onClick={() => {bloodPressureReading.type = "blood_pressure"; setEditData(bloodPressureReading)}}
                              >
                                <CreateIcon style={{
                                  display: "inline-block",
                                  cursor: "pointer",
                                  color: "black",
                                }} />
                              </Link>
                            </TableCell>
                            <TableCell align="center">
                              <Delete
                                style={{
                                  display: "inline-block",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setSelectedReading(bloodPressureReading);
                                  setOpenReadingDeleteModal(true);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {(addData || editData) && (
          <AddData
            patient_id={id}
            button_src={props.button_src}
            csrfToken={authSettings.csrfToken}
            setAddData={setAddData}
            addData={addData}
            editData={editData}
            setEditData={setEditData}
            setShowNotes={setShowNotes}
            source={"provider"}
            type={"blood_pressure"}
          />
        )}
        {showNotes && (
          <ShowReadingNote
            editData={editData}
            setEditData={setEditData}
            showNotes={showNotes}
            setShowNotes={setShowNotes}
            readingType="Blood Pressure"
          />
        )}
        <Modal
          successModalOpen={openReadingDeleteModal}
          setSuccessModalOpen={handleCloseDeleteReadingModal}
          successHeader={"Delete Blood Pressure"}
          successContent={modalContent}
          successCallback={removeReading}
          closeCallback={handleCloseDeleteReadingModal}
          confirmButtonText={"Continue"}
        />
    </Grid>
  );
};

export default BloodPressurePanel;
