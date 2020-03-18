/* eslint-disable prettier/prettier */
// importing libraties
import * as React from "react";
import {
	Grid,
	TextField
} from "@mui/material";

// importing hooks

// app setting imports
import GeneralModal from "../modals/GeneralModal";

interface Props {
  open: boolean;
  setOpen: Function;
  setListName: Function;
  listName: string;
  initialPatientListName: any;
	title: string;
  // successCallback: Function;
}

const EditTitleModal: React.FC<Props> = (props: any) => {
  return (
    <GeneralModal
      open={props.open}
      title={props.title}
      successCallback={() => {props.setOpen(false)}}
      closeCallback={() => {
        props.setListName(props.initialPatientListName.current)
        props.setOpen(false)
      }}
      containerClassName="add-patient-modal"
      width="430px"
      confirmButtonText="Save"
      confirmButtonClass="modal-save-btn"
    >
      <Grid container className="form-container" spacing={1}>
        <Grid container>
          <Grid item xs={12} className="field-container">
            <TextField
              id="patient-title"
              size="small"
              required
              value={props.listName}
              variant="outlined"
              className="the-field"
              onChange={(event) => {
                props.setListName(event.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </GeneralModal>
  );
};

export default EditTitleModal;
