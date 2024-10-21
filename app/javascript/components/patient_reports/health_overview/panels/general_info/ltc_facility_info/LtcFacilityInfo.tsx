import { Grid, Link, Stack } from "@mui/material";
import * as React from "react";
import {
  AuthenticationContext,
  FlashContext,
  ImagesContext,
} from "../../../../../Context";
import { Modal as DeleteModal } from "../../../../../modals/Modal";
import { getHeaders } from "../../../../../utils/HeaderHelper";
import LtcFacilityRow from "./LtcFacilityRow";
import LtcSelectionModal from "./LtcSelectionModal";
import HistoryModal from "../../../../../modals/HistoryModal";
import FacilityBuilderModal from "../../../../../long_term_care_facilities/FacilityBuilderModal";

interface Props {
  patient: any;
}

const LtcFacilityInfo: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  const flashContext = React.useContext(FlashContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [assignedFacility, setAssignedLtcFacility] = React.useState<any>(null);
  const [ltcFacilities, setLtcFacilities] = React.useState<any>([]);
  const [ltcHistory, setLtcHistory] = React.useState<any>([]);
  const [showUpdateModal, setShowUpdateModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] =
    React.useState<boolean>(false);
  const [showAddLtcModal, setShowAddLtcModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = React.useState<any>(null);
  const [isTransferring, setIsTransferring] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.patient) {
      fetchAssignedLtcFacilities();
      fetchLtcFacilites();
      fetchHistory();
    }
  }, [props.patient]);

  const fetchAssignedLtcFacilities = () => {
    fetch(
      `/data_fetching/ltc_facilities/assigned?patient_id=${props.patient?.id}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          setAssignedLtcFacility(result.resource);
        }
      })
      .catch((error) => {
        flashContext.setMessage({ text: error, type: "error" });
      });
  };

  const fetchLtcFacilites = () => {
    fetch(`/data_fetching/ltc_facilities`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          setLtcFacilities(result.resource);
        }
      })
      .catch((error) => {
        flashContext.setMessage({ text: error, type: "error" });
      });
  };

  const fetchHistory = () => {
    fetch(
      `/data_fetching/ltc_facilities/history?patient_id=${props.patient?.id}`,
      {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          setLtcHistory(result.resource);
        }
      })
      .catch((error) => {
        flashContext.setMessage({ text: error, type: "error" });
      });
  };

  const handleRemove = () => {
    setIsLoading(true);
    fetch(`/ltc_facility_assignments/${selectedFacility?.id}`, {
      method: "PUT",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        user_id: props.patient?.id,
        ltc_facility_id: selectedFacility?.id,
        action_type: "remove",
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          flashContext.setMessage({ text: result.error, type: "error" });
        } else {
          onModalClose();
          flashContext.setMessage({
            text: "You have successfully removed the patient from the facility.",
            type: "success",
          });
          fetchAssignedLtcFacilities();
        }
        setIsLoading(false);
      })
      .catch((error) => {
        flashContext.setMessage({
          text: error,
          type: "error",
        });
        setIsLoading(false);
      });
  };

  const renderAddButton = () => {
    let buttonTitle = "Assign Living Facility ";
    if (assignedFacility) {
      buttonTitle = "Add New Living Facility";
    }

    return (
      <Link
        className="action-link row"
        onClick={() => {
          !assignedFacility
            ? setShowUpdateModal(true)
            : setShowAddLtcModal(true);
        }}
      >
        <img
          src={images.add_icon}
          alt="Add Facility"
          className="action-icon-image"
          style={{ width: 25, height: 25 }}
        />
        <span className="app-user-text">{buttonTitle}</span>
      </Link>
    );
  };

  const deleteMessage =
    "You are attempting to remove this patient from a living facility.\nWould you like to continue?";
  const deleteMessageLines = deleteMessage.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const onModalClose = () => {
    setSelectedFacility(null);
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setIsTransferring(false);
    fetchAssignedLtcFacilities();
    fetchHistory();
  };

  const handleOpenRemoveModal = (facility) => {
    setSelectedFacility(facility);
    setShowDeleteModal(true);
  };

  const handleOpenTransferModal = (facility) => {
    setIsTransferring(true);
    setSelectedFacility(facility);
    setShowUpdateModal(true);
  };

  const onAddLtcModalClose = () => {
    setShowAddLtcModal(false);
    fetchLtcFacilites();
  };

  return (
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
                  <Grid item>
                    <p className="panel-header">
                      Living Facility Information
                    </p>
                  </Grid>
                  <div className="row">
                    {renderAddButton()}
                    {ltcHistory.length > 0 && (
                      <Link
                        className="action-link row"
                        sx={{ marginLeft: '24px' }}
                        onClick={() => {
                          setShowHistoryModal(true);
                        }}
                      >
                        <img
                          src={images.clock_icon}
                          alt="Facility History"
                          className="action-icon-image"
                          style={{ width: 25, height: 25 }}
                        />
                        <span className="app-user-text">
                          Living Facility History
                        </span>
                      </Link>
                    )}
                  </div>
                </Stack>
              </Grid>
            </Grid>
            <Grid container className="general-patient-info-container">
              <Grid item xs={12} className="info-container">
                {!assignedFacility ? (
                  <p className="no-result-text">
                    This patient is not assigned to a living facility
                    yet. You can assign them to one{" "}
                    <span
                      className="underline_text"
                      onClick={() => setShowUpdateModal(true)}
                    >
                      here!
                    </span>
                  </p>
                ) : (
                  <LtcFacilityRow
                    key={assignedFacility?.id}
                    facility={assignedFacility}
                    handleRemove={handleOpenRemoveModal}
                    handleTransfer={handleOpenTransferModal}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DeleteModal
        successModalOpen={showDeleteModal}
        setSuccessModalOpen={setShowDeleteModal}
        successHeader="Remove Patient from Living Facility?"
        successContent={deleteMessageLines}
        successCallback={handleRemove}
        closeCallback={onModalClose}
        confirmButtonText="Remove Patient"
        isLoading={isLoading}
        width="500px"
        buttonWidth="154px"
        padding="24px 120px"
      />
      <LtcSelectionModal
        patientId={props.patient?.id}
        facilities={ltcFacilities}
        open={showUpdateModal}
        onUpdateFacility={onModalClose}
        onCloseModal={() => {
          setShowUpdateModal(false);
          setIsTransferring(false);
        }}
        isTransferring={isTransferring}
        oldFacility={selectedFacility}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <HistoryModal
        title="Living Facility History"
        objectType="Patient"
        removeText="Unassigned"
        histories={ltcHistory}
        open={showHistoryModal}
        onCloseModal={() => setShowHistoryModal(false)}
        descriptionTitle={"Living Facility"}
        descriptionValue={"ltc_facility"}
      />
      <FacilityBuilderModal
        facility={null}
        openModel={showAddLtcModal}
        setOpenModal={setShowAddLtcModal}
        onClose={() => setShowAddLtcModal(false)}
        onConfirmSuccess={onAddLtcModalClose}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Grid>
  );
};

export default LtcFacilityInfo;
