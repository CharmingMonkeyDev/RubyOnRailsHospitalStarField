// Library Imports
import * as React from "react";
import {
  Box,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import { Delete } from "@mui/icons-material";
// component imports
import FlashMessage from "../../../shared/FlashMessage";
import NewPatientNotes from "../../../modals/NewPatientNotes";

// app setting imports
import { AuthenticationContext } from "../../../Context";

// importing header helpers
import { getHeaders } from "../../../utils/HeaderHelper";
import { useParams } from "react-router-dom";
import Modal from "../../../modals/Modal";

interface Props {}

const modalContent = (
  <div className="modal-content">
    <p className="align-center">
      {
        "You are attempting to delete this patient's important notes. This action cannot be undone. Would you like to continue?"
      }
    </p>
  </div>
);

const PatientNotes: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  let { id: patientId } = useParams();

  // Error handling states
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  // other states
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [notes, setNotes] = React.useState<any>([]);
  const [editNoteId, setEditNoteId] = React.useState<number>(null);
  const [renderingKey, setRenderingKey] = React.useState<number>(Math.random());
  const [openNoteDeleteModal, setOpenNoteDeleteModal] =
    React.useState<boolean>(false);
  const [deleteNoteId, setdeleteNoteId] = React.useState<string>();

  React.useEffect(() => {
    getNotes();
  }, [patientId, renderingKey]);

  const getNotes = () => {
    fetch(`/patient_notes?patient_id=${patientId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          if (result?.resource) {
            setNotes(result?.resource);
          } else {
            alert("Something is wrong and template cannot be saved");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNoteDelete = () => {
    if (!deleteNoteId) {
      return;
    }
    fetch(`/patient_notes/${deleteNoteId}`, {
      method: "DELETE",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          getNotes();
          setOpenNoteDeleteModal(false);
          setFlashMessage({
            message: "Patient Notes deleted successfully.",
            type: "success",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseDeleteReadingModal = () => {
    setdeleteNoteId(undefined);
    setOpenNoteDeleteModal(false);
  };

  const handleNewModalOpen = () => {
    setModalOpen(true);
  };

  const handleEditNoteEdit = (noteId) => {
    setEditNoteId(noteId);
  };

  React.useEffect(() => {
    if (editNoteId) {
      setModalOpen(true);
    }
  }, [editNoteId]);

  React.useEffect(() => {
    if (!modalOpen) {
      setEditNoteId(null);
    }
  }, [modalOpen]);

  return (
    <Grid container className="panel-container">
      <Grid item xs={12}>
        <FlashMessage flashMessage={flashMessage} />
        <NewPatientNotes
          patient_id={patientId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          patientNoteId={editNoteId}
          setRenderingKey={setRenderingKey}
        />
        <Modal
          successModalOpen={openNoteDeleteModal}
          setSuccessModalOpen={handleCloseDeleteReadingModal}
          successHeader={"Delete Important Note"}
          successContent={modalContent}
          successCallback={handleNoteDelete}
          closeCallback={handleCloseDeleteReadingModal}
          confirmButtonText={"Continue"}
        />
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
                    <h3>Important Notes</h3>
                  </Grid>
                  <Link
                    className="action-link add-encounter"
                    onClick={handleNewModalOpen}
                  >
                    <AddIcon className="plus-icon" />{" "}
                    <span className="app-user-text">New Note</span>
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
                        <TableCell>Note</TableCell>
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
                      {notes?.map((note) => (
                        <TableRow key={note.id}>
                          <TableCell>
                            <Box
                              dangerouslySetInnerHTML={{ __html: note.note }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Link
                              onClick={() => handleEditNoteEdit(note.id)}
                              style={{
                                color: "black",
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
                                setdeleteNoteId(note.id);
                                setOpenNoteDeleteModal(true);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {notes.length == 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ p: 2 }}>
                            There are no Notes for this patient.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientNotes;
