import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Radio,
  Grid,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import * as React from "react";
import GeneralModal from "../../../../../modals/GeneralModal";
import { AuthenticationContext, FlashContext } from "../../../../../Context";
import { useState } from "react";
import { getHeaders } from "../../../../../utils/HeaderHelper";
import SearchIcon from "@mui/icons-material/Search";

const LtcSelectionModal = ({
  patientId,
  oldFacility,
  facilities,
  open,
  onUpdateFacility,
  onCloseModal,
  isTransferring,
  isLoading,
  setIsLoading,
}) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const [filteredFacilities, setFilteredFacilities] = useState<any>(facilities);
  const [searchKey, setSearchKey] = React.useState<string>(null);
  const [selectedFacilityId, setSelectedFacilityId] = React.useState<any>(null);

  React.useEffect(() => {
    if (facilities?.length > 0) {
      const facilityList = getSearchedList();
      setFilteredFacilities(facilityList);
    }
  }, [searchKey, facilities]);

  const handleCloseModal = () => {
    resetAssignFacility();
    onCloseModal();
  };

  const handleFacilityChange = (event) => {
    setSelectedFacilityId(event.target.value);
  };

  const getSearchedList = () => {
    let filteredList = [...facilities];
    if (searchKey) {
      setSelectedFacilityId(null);
      filteredList = facilities?.filter((facility) => {
        const searchLower = searchKey.toLowerCase();

        return facility?.name?.toLowerCase().includes(searchLower);
      });
    }
    return filteredList;
  };

  const handleAssignFacility = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/ltc_facility_assignments/`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          user_id: patientId,
          ltc_facility_id: selectedFacilityId,
          action_type: "assign",
        }),
      });
      const result = await response.json();
      if (result.success) {
        flashContext.setMessage({
          text: "You have successfully added the patient to the living facility",
          type: "success",
        });

        resetAssignFacility();
        onUpdateFacility();
      } else {
        flashContext.setMessage({
          text: result?.message ?? "Something went wrong",
          type: "error",
        });
      }
      setIsLoading(false);
    } catch (err) {
      flashContext.setMessage({
        text: "Something went wrong!",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const handleTransferFacility = async () => {
    if (oldFacility?.id == selectedFacilityId) {
      flashContext.setMessage({
        text: "The patient is already assigned to this living facility",
        type: "error",
      });
    } else {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/ltc_facility_assignments/${oldFacility?.id}`,
          {
            method: "PUT",
            headers: getHeaders(authenticationSetting.csrfToken),
            body: JSON.stringify({
              user_id: patientId,
              ltc_facility_id: selectedFacilityId,
              action_type: "transfer",
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          flashContext.setMessage({
            text: "You have successfully transferred the patient",
            type: "success",
          });
          resetAssignFacility();
          onUpdateFacility();
        } else {
          flashContext.setMessage({
            text: result?.message ?? "Failed transfering patient",
            type: "error",
          });
        }
        setIsLoading(false);
      } catch (err) {
        flashContext.setMessage({
          text: "Failed transfering patient",
          type: "error",
        });
        setIsLoading(false);
      }
    }
  };

  const resetAssignFacility = () => {
    setSelectedFacilityId(null);
  };

  return (
    <GeneralModal
      open={open}
      title={
        isTransferring
          ? "Living Facility Transfer"
          : "Living Facility Selection"
      }
      successCallback={
        isTransferring ? handleTransferFacility : handleAssignFacility
      }
      closeCallback={handleCloseModal}
      fullWidth={true}
      width="900px"
      isLoading={isLoading}
      confirmButtonText={isTransferring ? "Transfer Patient" : "Continue"}
      headerClassName="facility-modal-header-text"
      closeIconSize={30}
    >
      <>
        <Grid container style={{ padding: "18px 24px 6px 24px" }}>
          <Grid
            item
            xs={5}
            style={{
              position: "relative",
              marginLeft: "0px !important",
            }}
          >
            <p className="facility-search-text">Filter</p>
            <FormControl sx={{ mt: 1, width: "100%" }} variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="Search Facility Name"
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                style={{
                  backgroundColor: "#EFE9E7",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#1E1E1E",
                }}
                value={searchKey}
                onChange={(event) => {
                  setSearchKey(event.target.value);
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <TableContainer
          className="template-container"
          sx={{ maxHeight: "50vh" }}
        >
          <Table className="no-border-table">
            <TableHead sx={{ borderBottom: "1.5px solid black" }}>
              <TableRow>
                <TableCell width={"1%"} />
                <TableCell
                  className="bold-font-face nowrap-header"
                  sx={{ pl: "0" }}
                >
                  <strong>Facility Name</strong>
                </TableCell>
                <TableCell
                  className="nowrap-header bold-font-face"
                  width={"40%"}
                >
                  <strong>Address</strong>
                </TableCell>
                <TableCell className="nowrap-header bold-font-face">
                  <strong>Phone Number</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFacilities?.map((facility, index) => (
                <TableRow
                  key={facility?.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#EFE9E7" : "white",
                  }}
                >
                  <TableCell
                    width={"9%"}
                    align="right"
                    sx={{
                      pr: "0px !important",
                    }}
                  >
                    <Radio
                      checked={selectedFacilityId == facility?.id}
                      value={facility?.id}
                      onChange={handleFacilityChange}
                    />
                  </TableCell>
                  <TableCell sx={{ pl: "0" }}>{facility?.name}</TableCell>
                  <TableCell>
                    {facility?.address_1 + ', ' + facility?.address_2}
                    <br/>
                    {facility?.city}, {facility?.state} {facility?.zip}
                  </TableCell>
                  <TableCell>{facility?.phone_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </GeneralModal>
  );
};

export default LtcSelectionModal;
