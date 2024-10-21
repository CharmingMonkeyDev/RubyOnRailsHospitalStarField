import * as React from "react";
import { Modal, Grid } from "@mui/material";
import { usePatientDashboardStyles } from "../styles/usePatientDashboardStyles";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";
import { Stack } from "@mui/system";

interface Props {
  editData: any;
  setEditData: any;
  showNotes: any;
  setShowNotes: any;
  readingType: string;
}

const ShowReadingNote: React.FC<Props> = (props: any) => {
  const { classes } = usePatientDashboardStyles();
  const [open, setOpen] = React.useState<boolean>(true);
  const [notes, setNotes] = React.useState<string>(
    props.showNotes ? props.showNotes.notes : ""
  );

  const closeModal = () => {
    props.setEditData(null);
    props.setShowNotes(null);
  };

  return (
    <>
      <Modal open={open} className="modal-primary" onClose={closeModal}>
        <div className="paper">
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  className="main-header"
                  alignItems={"center"}
                >
                  <Stack direction={"row"}>
                    {props.readingType} Note &nbsp;
                    <CreateIcon
                      style={{
                        cursor: "pointer",
                        color: "#a29d9b",
                      }}
                      onClick={() => {
                        props.setEditData(props.showNotes);
                      }}
                    />
                  </Stack>
                  <span id="dismiss-button" onClick={closeModal}>
                    <ClearIcon />
                  </span>
                </Stack>
              </Grid>
              <Grid item xs={12} style={{ padding: "0 40px 40px 25px" }}>
                <div className="content">
                  <h3>Note(s)</h3>
                  <p
                    style={{
                      font: "13px QuicksandMedium",
                      textAlign: "left",
                      padding: 20,
                      borderRadius: "10px",
                      backgroundColor: "#EFE9E7",
                      minHeight: 100,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {notes.length ? notes : "No notes avaiable."}
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShowReadingNote;
