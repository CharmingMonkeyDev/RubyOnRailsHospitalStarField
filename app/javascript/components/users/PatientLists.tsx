/* eslint-disable prettier/prettier */

// library imports
import * as React from "react";

// component imports

import PatientListsTable from "./PatientListsTable";

interface Props {
  csrfToken: string;
  menu_track_src: string;
  sort_plain_src?: string;
  sort_ascending_src?: string;
  sort_descending_src?: string;
  chat_icon_with_orange_line?: string;
  the_wall_icon_grey?: string;
  pencil_grey?: string;
  patient_reports_icon?: string;
}

const PatientLists: React.FC<Props> = (props: any) => {
  return (
    <div className="patient-lists-container">
      <div className="container2">
        <PatientListsTable
          csrfToken={props.csrfToken}
          menu_track_src={props.menu_track_src}
          sort_ascending_src={props.sort_ascending_src}
          sort_descending_src={props.sort_descending_src}
          sort_plain_src={props.sort_plain_src}
        />
      </div>
    </div>
  );
};

export default PatientLists;