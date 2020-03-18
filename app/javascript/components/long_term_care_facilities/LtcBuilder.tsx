import {
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { AuthenticationContext, FlashContext, ImagesContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import { Modal as DeleteModal } from "../modals/Modal";
import FacilityBuilderModal from "./FacilityBuilderModal";
import Delete from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";

interface Props {}

const LtcBuilder: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState<boolean>(false);
  const [facilities, setFacilities] = React.useState<any>([]);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = React.useState<any>(null);

  // fetching inital data
  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (facilities) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const facilityList = getSortedAndSearchedList();
    setFacilities(facilityList);
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

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
    let facilityList = [...facilities];
    facilityList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "name") {
      facilityList.sort((a, b) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      facilityList.reverse();
    }
    return facilityList;
  };

  const getData = () => {
    fetch(`data_fetching/ltc_facilities`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          setFacilities(result.resource);
        }
      })
      .catch((error) => {
        flashContext.setMessage({ text: error, type: "error" });
      });
  };

  const handleDelete = () => {
    fetch(`/ltc_facilities/${selectedFacility?.id}`, {
      method: "DELETE",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          onDeleteModalClose();
          flashContext.setMessage({
            text: "You have successfully deleted the facility.",
            type: "success",
          });
          getData();
        }
      })
      .catch((error) => {
        flashContext.setMessage({
          text: error,
          type: "error",
        });
      });
  };

  const onDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedFacility(null);
  };

  const onEditModalClose = () => {
    setShowUpdateModal(false);
    setSelectedFacility(null);
  };

  const onEditSuccess = () => {
    onEditModalClose();
    getData();
  };

  const deleteMessage =
    "You are attempting to delete this facility.\nThis action cannot be undone.\nWould you like to continue?";
  const deleteMessageLines = deleteMessage.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
  return (
    <div style={{ padding: "10px 24px 24px 120px" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12} className="patient-edit-container patient-edit-form" style={{'borderRadius': 0}}>
          <Grid container>
            <Grid
              className="patient-edit-header"
              container
              justifyContent="space-between"
            >
              <Grid item xs={4}>
                <p className="secondary-label" style={{ marginLeft: 0 }}>
                  Living Facility Builder
                </p>
              </Grid>
              <Grid item xs={6} className="q-btn-container">
                <Link
                  onClick={() => setShowUpdateModal(true)}
                  className="grey-font"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="row"
                  display="flex"
                  sx={{ marginRight: 4 }}
                >
                  <img
                    src={images.add_icon}
                    width="36px"
                    alt="Add New Living Facility"
                    style={{ padding: 5 }}
                  />
                  <span className="app-user-text disable-pointer">
                    Add New Living Facility
                  </span>
                </Link>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <TableContainer>
                  <Table size="small">
                    <TableHead className="table-header-box">
                      <TableRow>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          style={{ cursor: "pointer", paddingLeft: "30px" }}
                          onClick={() => {
                            setSortOrder(
                              "name",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending"
                            );
                          }}
                        >
                          <div className="row nowrap-header ">
                            Facility Name
                            {getSortIcon("name")}
                          </div>
                        </TableCell>
                        <TableCell component="th" className="bold-font-face">
                          Address
                        </TableCell>
                        <TableCell component="th" className="bold-font-face">
                          Phone Number
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          align="center"
                        >
                          Patient Count
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          align="center"
                        >
                          Edit
                        </TableCell>
                        <TableCell
                          component="th"
                          className="bold-font-face"
                          align="center"
                        >
                          Remove
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {facilities.map((facility, index) => {
                        return (
                          <TableRow
                            key={facility?.id}
                            sx={
                              index === 0
                                ? { "& > td": { paddingTop: "25px" } }
                                : {}
                            }
                          >
                            <TableCell
                              sx={{ borderBottom: "none", paddingLeft: "30px" }}
                            >
                              <p className="table-body-text">
                                {facility?.name}
                              </p>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none" }}>
                              <span className="table-body-text">
                                {facility?.address_1 +
                                  ", " +
                                  facility?.address_2}
                                <br />
                                {facility?.city}, {facility?.state}{" "}
                                {facility?.zip}
                              </span>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none" }}>
                              <p className="table-body-text">
                                {facility?.phone_number}
                              </p>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ borderBottom: "none" }}
                            >
                              {facility?.patient_count}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ borderBottom: "none" }}
                            >
                              <Link
                                onClick={() => {
                                  setSelectedFacility(facility);
                                  setShowUpdateModal(true);
                                }}
                              >
                                <CreateIcon
                                  sx={{ height: 24, color: "#1E1E1E" }}
                                />
                              </Link>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ borderBottom: "none" }}
                            >
                              {facility?.patient_count == 0 && (
                                <Link
                                  onClick={() => {
                                    setSelectedFacility(facility);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <Delete
                                    sx={{ height: 24, color: "#1E1E1E" }}
                                  />
                                </Link>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DeleteModal
        successModalOpen={showDeleteModal}
        setSuccessModalOpen={setShowDeleteModal}
        successHeader="Delete Facility"
        successContent={deleteMessageLines}
        successCallback={handleDelete}
        closeCallback={onDeleteModalClose}
        confirmButtonText="Delete Facility"
        isLoading={isLoading}
        width="500px"
        buttonWidth="154px"
        padding="24px"
      />
      <FacilityBuilderModal
        facility={selectedFacility}
        openModel={showUpdateModal}
        setOpenModal={setShowUpdateModal}
        onClose={onEditModalClose}
        onConfirmSuccess={onEditSuccess}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default LtcBuilder;
