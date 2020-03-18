import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";
import ReactQuill from "react-quill";
import CloseIcon from "@mui/icons-material/Close";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";
import GeneralModal from "./GeneralModal";

interface Props {
  patient_id: string;
  modalOpen: boolean;
  setModalOpen: any;
  patientNoteId?: number;
  setRenderingKey: any;
}

const NewPatientNotes: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [note, setNote] = React.useState<string>("");
  const flashContext = React.useContext(FlashContext);

  // form mode are "Add" and "Edit"
  const [formMode, setFormMode] = React.useState<string>("Add");

  React.useEffect(() => {
    if (props.patientNoteId) {
      setFormMode("Edit");
      getNoteValue();
    } else {
      setFormMode("Add");
      setNote("");
    }
  }, [props.patientNoteId]);

  const getNoteValue = () => {
    fetch(`/patient_notes/${props.patientNoteId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          if (result?.resource) {
            setNote(result?.resource?.note);
          } else {
            alert("Something is wrong note cannot be fetched");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveNote = () => {
    if (note.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      flashContext.setMessage({ text: "Note cannot be empty", type: "error" });
    } else {
      let url = `/patient_notes`;
      let method = "POST";
      if (props.patientNoteId) {
        url = `/patient_notes/${props.patientNoteId}`;
        method = "PATCH";
      }
      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          patient_note: {
            user_id: props.patient_id,
            note: note,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            if (result?.resource) {
              // reseting states and closing modal
              props.setRenderingKey(Math.random());
              props.setModalOpen(false);
              setNote("");
              flashContext.setMessage({ text: "Note saved", type: "success" });
            } else {
              alert("Something is wrong and note cannot be saved");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <GeneralModal
      open={props.modalOpen}
      title={formMode + " a note"}
      successCallback={saveNote}
      closeCallback={() => props.setModalOpen(false)}
      containerClassName="manual-patient-modal-body"
      confirmButtonText="Save Note"
    >
      <Grid container style={{ paddingTop: 30 }}>
        <Grid item xs={12}>
          <ReactQuill
            theme="snow"
            value={note}
            onChange={(value) => setNote(value)}
            modules={{
              clipboard: {
                matchVisual: false,
              },
            }}
          />
        </Grid>
      </Grid>
    </GeneralModal>
  );
};

export default NewPatientNotes;
