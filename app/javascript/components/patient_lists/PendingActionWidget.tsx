// library imports
import * as React from "react";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

// component imports
interface Props {
  checkedList: any;
  pendingAdd: any;
  pendingRemoval: any;
  onList: any;
  handleCreate: Function;
  handleDiscard: Function;
  handleSave: Function;
  user_id?: string;
  patientListId?: string;
}

const PendingActionWidget: React.FC<Props> = (props: any) => {
  const showPending =
    props.pendingRemoval.length > 0 ||
    props.onList.length > 0 ||
    props.pendingAdd.length > 0;
  return (
    <Grid item xs={8} className="button-container">
      {showPending && (
        <div
          className="pending-add-create-widget"
          style={{
            width: props.patientListId
              ? props.pendingRemoval.length > 0 || props.pendingAdd.length > 0
                ? 740
                : 122
              : 385,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: 30,
            }}
          >
            {props.onList.length > 0 && (
              <div className="on-list">
                <span className="badge">{props.onList.length}</span>
                <span className="on-list-text">On List</span>
              </div>
            )}
            {props.pendingRemoval.length > 0 && (
              <div className="pending-removal">
                <span className="badge">{props.pendingRemoval.length}</span>
                <span className="pending-removal-text">Pending Removal</span>
              </div>
            )}
            {props.pendingAdd.length > 0 && (
              <div className="pending-add">
                <span className="badge">{props.pendingAdd.length}</span>
                <span className="pending-add-text">Pending Add</span>
              </div>
            )}
          </div>
          {props.patientListId &&
            (props.pendingRemoval.length > 0 ||
              props.pendingAdd.length > 0) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 16,
                }}
              >
                <div className="buttons-container">
                  <button
                    className="widget-button"
                    onClick={props.handleDiscard}
                  >
                    Discard Changes
                  </button>
                  <button className="widget-button" onClick={props.handleSave}>
                    Save
                  </button>
                </div>
              </div>
            )}
          {!props.patientListId && (
            <button className="widget-button" onClick={props.handleCreate}>
              Create
            </button>
          )}
        </div>
      )}
      <Link
        style={{
          display: "inline-block",
          cursor: "pointer",
          paddingRight: 10,
        }}
        to="/patient-lists"
      >
        <span className="button-back">Back to Patient Lists</span>
      </Link>
      <div>
        {/* {props.pendingAdd && (<span> {props.pendingAdd.length} pendingAdd </span>)}
        {props.pendingRemoval && (<span> {props.pendingRemoval.length} pendingRemoval </span>)}
        {props.onList && (<span> {props.onList.length} onList </span>)} */}
      </div>
    </Grid>
  );
};

export default PendingActionWidget;
