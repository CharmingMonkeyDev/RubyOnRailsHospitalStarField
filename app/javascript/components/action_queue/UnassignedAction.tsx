import * as React from "react";

import { TableCell, TableRow } from "@mui/material";

// helpers
import { ImportContacts, MoreVert } from "@mui/icons-material";
import { formatToUsDate } from "../utils/DateHelper";
import { truncateString } from "../utils/StringHelper";

interface Props {
  patients: any;
  action: any;

  setSuccessModalOpen: Function;
  successModalOpen: boolean;
  setSelectedActionId: Function;
  handleResourceClick?: Function;
}

const UnassignedAction: React.FC<Props> = (props: Props) => {
  const {
    patients,
    action,
    setSuccessModalOpen,
    successModalOpen,
    setSelectedActionId,
  } = props;

  const patient = patients.find((p) => p.id == action.patient_id);

  if (!patient || !action) return <>Empty Action</>;

  return (
    <TableRow
      className={`row ${
        new Date(action.due_date) < new Date() && "overdue-action"
      }`}
    >
      <TableCell size="small" scope="row" align="left" className="tableCell">
        <a
          style={{ textDecoration: "none" }}
          href={`/patient_reports/${patient?.id}/action_center`}
        >
          {patient.last_name}, {patient.first_name}{" "}
          {patient.middle_name?.substring(0, 1)}
        </a>
      </TableCell>
      <TableCell size="small" scope="row" align="left" className="tableCell">
        <div className="actionList">
          <div
            className="actionItem"
            onClick={() => {
              setSelectedActionId([action.id]);
              setSuccessModalOpen(!successModalOpen);
            }}
          >
            <ImportContacts
              className="actionIcon"
              style={{ color: "grey", fontSize: "1.9em" }}
              onClick={(e) => {
                e.stopPropagation();
                props.handleResourceClick(action.id);
              }}
            />
            <p>{truncateString(action.text, 22)}</p>
            <MoreVert className="actionIcon" />
          </div>
        </div>
      </TableCell>
      <TableCell size="small" scope="row" align="left" className="tableCell">
        Unassigned
      </TableCell>
      <TableCell size="small" scope="row" align="left" className="tableCell">
        {action.due_date ? formatToUsDate(action.due_date) : "No Due Date"}
      </TableCell>
    </TableRow>
  );
};

export default UnassignedAction;
