import * as React from "react";
import { Grid, Link, Modal, InputLabel } from "@mui/material";
import ReactQuill from "react-quill";
import CloseIcon from "@mui/icons-material/Close";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

interface Props {
  patient_id: string;
  modalOpen: boolean;
  setModalOpen: any;
}

const PatientNotesShow: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [notes, setNotes] = React.useState<any>([]);

  React.useEffect(() => {
    getNotes();
  }, [props.patient_id]);

  const getNotes = () => {
    fetch(`/patient_notes?patient_id=${props.patient_id}`, {
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
  return (
    <Modal open={props.modalOpen} className="follow-up-modal">
      <div className="paper" style={{ width: "430px", padding: "0px" }}>
        <div className="paperInner" style={{ padding: "0px" }}>
          <Grid container className="fum-header-container">
            <Grid item xs={10}>
              <h1 className="fum-header">Important Notes</h1>
            </Grid>
            <Grid item xs={2} className="fum-close-icon-container">
              <Link
                onClick={() => props.setModalOpen(false)}
                style={{ color: "black" }}
              >
                <CloseIcon />
              </Link>
            </Grid>
          </Grid>
          <div className="divider-orange" style={{ margin: "0px" }}></div>
          <Grid container className="fum-form-container">
            <Grid
              item
              xs={12}
              className="ql-note-container"
              style={{ maxHeight: "300px", overflow: "scroll" }}
            >
              <InputLabel htmlFor="next-date" className="fum-field-label">
                Notes
              </InputLabel>
              {notes.map((note) => {
                return (
                  <div key={note.id}>
                    <ReactQuill
                      value={note.note}
                      readOnly={true}
                      modules={{
                        clipboard: {
                          matchVisual: false,
                        },
                        toolbar: false,
                      }}
                    />
                  </div>
                );
              })}
            </Grid>
          </Grid>
        </div>
      </div>
    </Modal>
  );
};

export default PatientNotesShow;
