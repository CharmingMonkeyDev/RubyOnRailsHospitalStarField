/* eslint-disable prettier/prettier */

// library imports
import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";

// component imports
import PatientTable from "./PatientTable";
import PatientShow from "./PatientShow";
import PatientEdit from "./PatientEdit";
import EditPrivileges from "../admin/core_team/EditPrivileges";
import { useHistory } from "react-router-dom";

interface Props {
  csrfToken: string;
  menu_track_src: string;
  sort_plain_src: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  chat_icon_with_orange_line: string;
  the_wall_icon_grey: string;
  pencil_grey: string;
  patient_reports_icon: string;
}

const PatientIndex: React.FC<Props> = (props: any) => {
  // other states
  const [selectedPatient, setSelectedPatient] = React.useState<any>(null);
  const [showEditForm, setShowEditForm] = React.useState<boolean>(false);
  const [unsaveChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [unsavedModalOpen, setUnsavedModalOpen] =
    React.useState<boolean>(false);
  const [privilegesModalOpen, setPrivilegesModalOpen] =
    React.useState<boolean>(false);
  const [renderingKey, setRenderingKey] = React.useState<number>(Math.random());

  // this state us used for pateint selection check when patient is changes on edit page
  const [tempSelectedPatient, setTempSelectedPatient] =
    React.useState<any>(null);

  const confirmOnSaveModal = () => {
    setSelectedPatient(tempSelectedPatient);
    setUnsavedModalOpen(false);
    setShowEditForm(false);
    setUnsavedChanges(false);
  };
  const history = useHistory();

  return (
    <div className="patient-container">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container2"
      >
        <PatientTable
          csrfToken={props.csrfToken}
          menu_track_src={props.menu_track_src}
          sort_plain_src={props.sort_plain_src}
          sort_ascending_src={props.sort_ascending_src}
          sort_descending_src={props.sort_descending_src}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          setShowEditForm={setShowEditForm}
          setTempSelectedPatient={setTempSelectedPatient}
          unsaveChanges={unsaveChanges}
          setUnsavedModalOpen={setUnsavedModalOpen}
          renderingKey={renderingKey}
        />
        {selectedPatient && (
          <>
            {showEditForm ? (
              <PatientEdit
                csrfToken={props.csrfToken}
                selectedPatient={selectedPatient}
                onUpdate={() => {
                  setShowEditForm(false);
                  history.push(`/patients?patient_id=${selectedPatient.id}`, { shallow: true });
                }}
                unsaveChanges={unsaveChanges}
                setUnsavedChanges={setUnsavedChanges}
                setUnsavedModalOpen={setUnsavedModalOpen}
              />
            ) : (
              <PatientShow
                csrfToken={props.csrfToken}
                selectedPatient={selectedPatient}
                chat_icon_with_orange_line={props.chat_icon_with_orange_line}
                the_wall_icon_grey={props.the_wall_icon_grey}
                pencil_grey={props.pencil_grey}
                setShowEditForm={setShowEditForm}
                menu_track_src={props.menu_track_src}
                privilegesModalOpen={privilegesModalOpen}
                setPrivilegesModalOpen={setPrivilegesModalOpen}
                patient_reports_icon={props.patient_reports_icon}
                setRenderingKey={setRenderingKey}
              />
            )}
          </>
        )}
        {privilegesModalOpen && (
          <EditPrivileges
            selected_user={selectedPatient}
            csrfToken={props.csrfToken}
            setPrivilegesModalOpen={setPrivilegesModalOpen}
          />
        )}
        <Modal
          open={unsavedModalOpen}
          className="unsaved-changes-modal-container"
        >
          <div className="paper">
            <div className="paperInner">
              <Grid container>
                <Grid item xs={12}>
                  <p className="main-header">Switch Patients?</p>
                </Grid>
                <Grid item xs={12}>
                  <p className="content">
                    You have made changes to this patient&#39;s profile that are
                    not saved. If you switch patient profiles the changes will
                    not be saved. Would you like to switch patient profiles?
                  </p>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={6} className="cancel-link-container">
                  <Link
                    className="cancel-link"
                    onClick={() => setUnsavedModalOpen(false)}
                  >
                    Cancel
                  </Link>
                </Grid>
                <Grid item xs={6} className="confirm-btn-container">
                  <Link onClick={confirmOnSaveModal} className="confirm-btn">
                    Confirm
                  </Link>
                </Grid>
              </Grid>
            </div>
          </div>
        </Modal>
      </Grid>
    </div>
  );
};

export default PatientIndex;
