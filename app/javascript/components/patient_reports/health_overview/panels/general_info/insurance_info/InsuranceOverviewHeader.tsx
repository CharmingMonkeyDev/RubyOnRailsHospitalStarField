import Delete from "@mui/icons-material/Delete";
import { Link } from "@mui/material";
import * as React from "react";
import { capitalize } from "../../../../../utils/StringHelper";
import { ChatContext, ImagesContext } from "../../../../../Context";
import ConfirmModal from "../../../../../modals/ConfirmModal";

interface Props {
    patient: any;
    patientInsurance: any;
    secondaryPatientInsurance: any;
    isSecondaryInsurance: boolean;
    isAddingMode: boolean;
    showEditForm: boolean;
    handleDeletion: Function;
    showChat: boolean;
    setShowChat: Function;  
}

const InsuranceOverviewHeader: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  const chatSettings = React.useContext(ChatContext);
  const [open, setOpen] = React.useState<boolean>(false);

  const shouldShowTag =
    props.secondaryPatientInsurance || (props.isAddingMode && !props.isSecondaryInsurance);
  const tagContainer = `label-tag-container ${
    props.isSecondaryInsurance ? "secondary-container" : ""
  }`;
  const tagLabel = `label-tag ${props.isSecondaryInsurance ? "secondary-tag" : ""}`;

  const handleShowChat = (patientInsurance) => {
    if (patientInsurance?.relationship == "self") {
      chatSettings.setPatientId(props.patient?.id);
    } else {
      chatSettings.setPatientId(patientInsurance?.insured_user_id);
    }
    props.setShowChat(true);
  };

  return (
    <>
      <div className="overview-container row space-between">
        <div className="row">
          <div className="item-icon-container">
            <img
              src={images.check_mark_icon}
              alt="Insurance Icon"
              className="action-icon-image"
              style={{ width: 23, maxHeight: 23 }}
            />
          </div>
          <div className="header-text-container">
            <div className="row">
              <h4 className="overview-header">
                {props.patientInsurance?.insurance_type}
              </h4>
              <h4 className="medical_id_text">
                #ID: {props.patientInsurance?.insured_id}
              </h4>
              {shouldShowTag && (
                <div className={tagContainer}>
                  <p className={tagLabel}>
                    {props.isSecondaryInsurance ? "Secondary" : "Primary"}
                  </p>
                </div>
              )}
            </div>
            <p className="overview-detail">
              {props.patientInsurance?.plan_name}
              <span style={{ marginLeft: 10, marginRight: 10 }}>•</span>
              Patient’s Relationship to Insured:{" "}
              {capitalize(props.patientInsurance?.relationship)}
            </p>
          </div>
        </div>
        <div className="row">
          {props.isSecondaryInsurance && props.showEditForm && (
            <Link
              className="action-link add-encounter"
              onClick={() => {
                setOpen(true);
              }}
              sx={{ mr: 2.5 }}
            >
              <div className="item-icon-container">
                <Delete sx={{ height: 24, color: "#FF890A" }} />
              </div>
            </Link>
          )}
          <Link
            className="action-link add-encounter"
            onClick={() => handleShowChat(props.patientInsurance)}
          >
            <div className="item-icon-container">
              <img
                src={images.chat_bubble_orange}
                alt="Chat Bubble"
                className="action-icon-image"
                style={{ width: 28, maxHeight: 27 }}
              />
            </div>
          </Link>
        </div>
      </div>
      <div className="divider"></div>
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        header={"Warning"}
        content={"Are you sure you want to delete this insurance item?"}
        onConfirm={() => props.handleDeletion(props.secondaryPatientInsurance)}
      />
    </>
  )
}

export default InsuranceOverviewHeader;
