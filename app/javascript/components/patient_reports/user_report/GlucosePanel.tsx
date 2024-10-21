/* eslint-disable prettier/prettier */
import * as React from "react";
import { Box, Grid, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PatientInfo from "../PatientInfo";
import { AuthenticationContext, ImagesContext } from "../../Context";
import { useParams } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import AddData from "../../patient-dashboard/AddData";
import { getHeaders } from "../../utils/HeaderHelper";
import { formatTimeWithAMPM, formatToUsDateFromUTC } from "../../utils/DateHelper";
import CreateIcon from "@mui/icons-material/Create";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import ShowReadingNote from "../../patient-dashboard/ShowReadingNote";
import Modal from "../../modals/Modal";
import AddIcon from "@mui/icons-material/Add";

interface Props {}
const modalContent = (
  <div className="modal-content">
    <p className="align-center">
      {"You are attempting to delete this patient's blood glucose. This action cannot be undone. Would you like to continue?"}
    </p>
  </div>
);
const GlucosePanel: React.FC<Props> = (props: any) => {
  // users id
  const { id } = useParams();
  const authSettings = React.useContext(AuthenticationContext);
  const [addData, setAddData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [showNotes, setShowNotes] = useState<any>(null);
  const [glucoseReadings, setGlucoseReadings] =  useState<any>([]);
  const [ openReadingDeleteModal, setOpenReadingDeleteModal] = useState<boolean>(false);
  const [selectedReading, setSelectedReading] = useState<any>();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/?menu=false"),
    onSwipedRight: () => (window.location.href = "/my-labs"),
  });

  const getGlucoseReadings = () => {
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
            console.log("Res", result.patient_device?.patient_device_readings);
            setGlucoseReadings(result.patient_device?.patient_device_readings);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    getGlucoseReadings();
  }, []);

  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });

  React.useEffect(() => {
    if (glucoseReadings) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const glucoseList = getSortedAndSearchedList();
    setGlucoseReadings(glucoseList);
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
    let glucoseList = [...glucoseReadings];
    glucoseList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "name") {
      glucoseList.sort((a, b) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "date_recorded") {
      glucoseList.sort((a, b) =>
        new Date(a["date_recorded"]).getTime() > new Date(b["date_recorded"]).getTime() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      glucoseList.reverse();
    }
    return glucoseList;
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const handleCloseDeleteReadingModal = () => {
    setSelectedReading(undefined);
    setOpenReadingDeleteModal(false);
  };

  const removeReading = () => {
    if (selectedReading?.id) {
      fetch(`/remove_blood_glucose`, {
        method: "POST",
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
                    <h3>Glucose</h3>
                  </Grid>
                  <Link
                    className="action-link add-encounter"
                    onClick={() => {
                      setAddData("blood_glucose");
                    }}                 
                  >
                    <AddIcon className="plus-icon" />{" "}
                    <span className="app-user-text">Add Glucose</span>
                  </Link>
                </Stack>
              </Grid>
            </Grid>
            <Grid container className="medication-container grey-container pad-top-10">
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
                          }}>
                          Date {getSortIcon("date_recorded")}
                        </TableCell>
                        <TableCell>
                          Blood Glucose (mg/dL)
                        </TableCell>
                        <TableCell>
                          Added By
                        </TableCell>
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
                    {glucoseReadings?.map(
                      (glucoseReading) =>
                          (
                          <TableRow key={glucoseReading.id}>
                            <TableCell>
                              {formatToUsDateFromUTC(glucoseReading.date_recorded)}
                            </TableCell>
                            <TableCell sx={{py: "0 !important", display: "table-cell"}}>
                              <Box height={"100%"} display={"flex"} alignItems={"center"}>
                                {glucoseReading.reading_value}
                                {glucoseReading.notes && glucoseReading.notes.length && (
                                  <InfoIcon
                                    style={{
                                      fontSize: 16,
                                      marginLeft: 10,
                                      cursor: "pointer",
                                      color: "grey"
                                    }}
                                    onClick={() => {
                                      glucoseReading.type = "blood_glucose"; 
                                      setShowNotes(glucoseReading);
                                    }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {glucoseReading.creator?.id !== glucoseReading.user?.id ? glucoseReading.creator?.name : "Patient"}
                            </TableCell>
                            <TableCell align="center">
                              <Link
                                onClick={() => {glucoseReading.type = "blood_glucose"; setEditData(glucoseReading)}}
                                style={{
                                  color: "black"
                                }}
                              >
                                <CreateIcon />
                              </Link>
                            </TableCell>
                            <TableCell align="center">
                              <Delete
                                style={{
                                  display: "inline-block",
                                  cursor: "pointer",
                                  color: "black",
                                }}
                                onClick={() => {
                                  setSelectedReading(glucoseReading);
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
            type={"blood_glucose"}
          />
      )}
      {showNotes && (
        <ShowReadingNote
          editData={editData}
          setEditData={setEditData}
          showNotes={showNotes}
          setShowNotes={setShowNotes} 
          readingType={"Blood Glucose"}
        />
      )}
      <Modal
        successModalOpen={openReadingDeleteModal}
        setSuccessModalOpen={handleCloseDeleteReadingModal}
        successHeader={"Delete Blood Glucose"}
        successContent={modalContent}
        successCallback={removeReading}
        closeCallback={handleCloseDeleteReadingModal}
        confirmButtonText={"Continue"}
      />
    </Grid>
  );
};

export default GlucosePanel;
