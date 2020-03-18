/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";
import CoreTeamList from "./CoreTeamList";
import AddProvider from "./AddProvider";
import ProviderShow from "./ProviderShow";
import ProviderEdit from "./ProviderEdit";
import EditPrivileges from "./EditPrivileges";

interface Props {
  csrfToken: string;
  menu_track_src: string;
  user_id: number;
  sort_plain_src: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  chat_icon_with_orange_line: string;
  the_wall_icon_grey: string;
  pencil_grey: string;
  button_src: string;
}

const CoreTeamIndex: React.FC<Props> = (props: any) => {
  const [selectedProvider, setSelectedProvider] = React.useState<any>(null);
  const [showEditForm, setShowEditForm] = React.useState<boolean>(false);
  const [unsaveChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [unsavedModalOpen, setUnsavedModalOpen] =
    React.useState<boolean>(false);

  // this state us used for pateint selection check when patient is changes on edit page
  const [tempSelectedProvider, setTempSelectedProvider] =
    React.useState<any>(null);
  const [showAddCoreTeamForm, setShowAddCoreTeamForm] =
    React.useState<boolean>(false);
  const [privilegesModalOpen, setPrivilegesModalOpen] =
    React.useState<boolean>(false);

  const [renderingKey, setRenderingKey] = React.useState<number>(Math.random());

  const confirmOnSaveModal = () => {
    setSelectedProvider(tempSelectedProvider);
    setUnsavedModalOpen(false);
    setShowEditForm(false);
    setUnsavedChanges(false);
    setShowAddCoreTeamForm(false);
  };

  return (
    <div className="coreTeam">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container2"
      >
        <CoreTeamList
          csrfToken={props.csrfToken}
          menu_track_src={props.menu_track_src}
          sort_plain_src={props.sort_plain_src}
          sort_ascending_src={props.sort_ascending_src}
          sort_descending_src={props.sort_descending_src}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          setShowEditForm={setShowEditForm}
          setTempSelectedProvider={setTempSelectedProvider}
          unsaveChanges={unsaveChanges}
          setUnsavedModalOpen={setUnsavedModalOpen}
          setShowAddCoreTeamForm={setShowAddCoreTeamForm}
          renderingKey={renderingKey}
        />

        {showAddCoreTeamForm ? (
          <AddProvider
            csrfToken={props.csrfToken}
            unsaveChanges={unsaveChanges}
            setUnsavedChanges={setUnsavedChanges}
            setUnsavedModalOpen={setUnsavedModalOpen}
            setShowAddCoreTeamForm={setShowAddCoreTeamForm}
          />
        ) : (
          <>
            {selectedProvider && (
              <>
                {showEditForm ? (
                  <ProviderEdit
                    csrfToken={props.csrfToken}
                    selectedProvider={selectedProvider}
                    setShowEditForm={setShowEditForm}
                    unsaveChanges={unsaveChanges}
                    setUnsavedChanges={setUnsavedChanges}
                    setUnsavedModalOpen={setUnsavedModalOpen}
                    onDataUpdated={() => {
                      setShowEditForm(false);
                      setRenderingKey(Math.random());
                    }}
                  />
                ) : (
                  <ProviderShow
                    selectedProvider={selectedProvider}
                    chat_icon_with_orange_line={
                      props.chat_icon_with_orange_line
                    }
                    the_wall_icon_grey={props.the_wall_icon_grey}
                    pencil_grey={props.pencil_grey}
                    setShowEditForm={setShowEditForm}
                    menu_track_src={props.menu_track_src}
                    setPrivilegesModalOpen={setPrivilegesModalOpen}
                    privilegesModalOpen={privilegesModalOpen}
                    user_id={props.user_id}
                  />
                )}
              </>
            )}
          </>
        )}
        {privilegesModalOpen && (
          <EditPrivileges
            selected_user={selectedProvider}
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
                  <p className="main-header">Switch Provider?</p>
                </Grid>
                <Grid item xs={12}>
                  <p className="content">
                    You have made changes to this provider&#39;s profile that
                    are not saved. Would you like to continue?
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

export default CoreTeamIndex;
