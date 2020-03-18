// library imports
import * as React from "react";
import { Grid } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useHistory } from "react-router-dom";

// auth helpers
import SearchToolsWidget from "./SearchToolsWidget";
import SearchResultsWidget from "./SearchResultsWidget";
import FlashMessage from "../shared/FlashMessage";
import UnsavedChangesModal from "../modals/UnsavedChangesModal";
import EditTitleModal from "../questionnaires/EditTitleModal";
import PendingActionWidget from "./PendingActionWidget";
import { useParams } from "react-router-dom";
import { getHeaders } from "../utils/HeaderHelper";

interface SortObject {
  field: string;
  direction: "descending" | "ascending";
}

// component imports
interface Props {
  csrfToken: string;
  menu_track_src: string;
  sort_plain_src?: string;
  sort_ascending_src?: string;
  sort_descending_src?: string;
  chat_icon_with_orange_line?: string;
  the_wall_icon_grey?: string;
  pencil_grey?: string;
  user_id?: string;
  patient_reports_icon?: string;
}

const PatientListCreate: React.FC<Props> = (props: any) => {
  const history = useHistory();
  const { id } = useParams();
  const [patientList, setPatientList] = React.useState<any>(null);
  const [paramsPresent, setParamsPresent] = React.useState<boolean>(true);
  const [searchPatients, setSearchPatients] = React.useState<any>([]);
  const [checkedList, setCheckedList] = React.useState<any>([]);
  const [pendingAdd, setPendingAdd] = React.useState<any>([]);
  const [pendingRemoval, setPendingRemoval] = React.useState<any>([]);
  const [onList, setOnList] = React.useState<any>([]);
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  const [patientListName, setPatientListName] = React.useState<string>("");
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [editTitle, setEditTitle] = React.useState<boolean>(false);
  const [listName, setListName] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [saveRedirect, setSaveRedirect] = React.useState<boolean>(false);
  // Track initial state
  const initialPatientListName = React.useRef<string>("");
  const initialCheckedList = React.useRef<any[]>([]);

  const handleSave = () => {
    if (!patientListName) {
      setFlashMessage({
        message: "Patient list name required.",
        type: "error",
      });
      return;
    }

    var body = {
      pending_add_ids: pendingAdd.map((patient) => patient.id),
      pending_removal_ids: pendingRemoval.map((patient) => patient.id),
      name: patientListName,
      patient_list_id: null,
    };

    if (patientList) {
      body.patient_list_id = id;
    }

    fetch("/patient_lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": props.csrfToken,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success == false) {
          console.log(data.error);
          setFlashMessage({
            message: "Failed to create patient list.",
            type: "error",
          });
        } else {
          setUnsavedChanges(false);
          initialPatientListName.current = patientListName;
          initialCheckedList.current = [...checkedList];
          setSaveRedirect(true); //calls redirects 
        }
      })
      .catch((error) => {
        console.log(error);
        setFlashMessage({
          message: "An error occurred while creating the patient list.",
          type: "error",
        });
      });
  };

  const handleDiscard = () => {
    setPatientListName(initialPatientListName.current);
    setCheckedList([...initialCheckedList.current]);
    // Reset user.list_status to initial state
    const resetPatients = searchPatients.map((patient) => {
      // Find the corresponding patient in the initial checked list
      const initialPatient = initialCheckedList.current.find(
        (p) => p.id === patient.id
      );
      if (initialPatient) {
        return { ...patient, list_status: initialPatient.list_status };
      }
      return patient;
    });
    setSearchPatients(resetPatients);
    setUnsavedChanges(false);
    setPendingAdd([]);
    setOnList(initialCheckedList.current);
    setPendingRemoval([]);
    setParamsPresent(false);
  };

  const setInitialCheckedList = (patients: any[]) => {
    initialCheckedList.current = patients;
    setCheckedList(patients);
  };

  const getPatientList = async () => {
    const response = await fetch(`/patient_lists/${id}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    });
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    if (result.success == false) {
      alert(result.error);
    } else {
      setPatientList(result.resource);
      setPatientListName(result.resource.name);
      initialPatientListName.current = result.resource.name;
    }
  };

  // redirects after save
  React.useEffect(() => {
    if(!saveRedirect){
      return
    }
    setSaveRedirect(false);
    if (id) {
      history.push("/patient-lists", {
        flashMessage: "You have successfully updated your patient list",
      });
    } else {
      history.push("/patient-lists", {
        flashMessage: "You have successfully created your patient list",
      });
    }
  }, [saveRedirect]);

  React.useEffect(() => {
    const hasUnsavedChanges =
      patientListName !== initialPatientListName.current ||
      checkedList.length !== initialCheckedList.current.length ||
      !checkedList.every(
        (patient, index) => patient.id === initialCheckedList.current[index]?.id
      );
    setUnsavedChanges(hasUnsavedChanges);
  }, [patientListName, checkedList]);

  React.useEffect(() => {
    if (id) {
      getPatientList();
    }
  }, [id]);

  return (
    <div className="patient-list-create-container">
      {unsavedChanges && (
        <UnsavedChangesModal unsavedChanges={unsavedChanges} />
      )}
      <div className="container2">
        <FlashMessage flashMessage={flashMessage} />
        <Grid item xs={12}>
          <Grid container>
            <Grid
              container
              justifyContent="space-between"
              className="floating-header"
            >
              <Grid item xs={2} className="list-create-header">
                {patientListName ? (
                  <span
                    style={{
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      color: "black",
                    }}
                  >
                    {patientListName}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      color: "black",
                    }}
                  >
                    Unsaved List
                  </span>
                )}
                <CreateIcon
                  className="cursor-pointer"
                  onClick={() => {
                    setEditTitle(true);
                  }}
                />
              </Grid>
              <PendingActionWidget
                checkedList={checkedList}
                pendingAdd={pendingAdd}
                pendingRemoval={pendingRemoval}
                onList={onList}
                handleCreate={handleSave}
                handleDiscard={handleDiscard}
                handleSave={handleSave}
                patientListId={id}
              />
            </Grid>
            <div className="divider"></div>
            <Grid item xs={3}>
              <SearchToolsWidget
                user_id={props.user_id}
                patientListId={id}
                csrfToken={props.csrfToken}
                setSearchPatients={setSearchPatients}
                setCheckedList={setInitialCheckedList}
                setOnList={setOnList}
                setPendingAdd={setPendingAdd}
                setPendingRemoval={setPendingRemoval}
                checkedList={checkedList}
                setParamsPresent={setParamsPresent}
                setLoading={setLoading}
              />
            </Grid>
            <Grid item xs={9}>
              <SearchResultsWidget
                patientListId={id}
                csrfToken={props.csrfToken}
                searchPatients={searchPatients}
                setSearchPatients={setSearchPatients}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                setOnList={setOnList}
                setPendingAdd={setPendingAdd}
                setPendingRemoval={setPendingRemoval}
                onList={onList}
                pendingAdd={pendingAdd}
                pendingRemoval={pendingRemoval}
                paramsPresent={paramsPresent}
                loading={loading}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>

      <EditTitleModal
        open={editTitle}
        setOpen={setEditTitle}
        listName={patientListName}
        setListName={setPatientListName}
        initialPatientListName={initialPatientListName}
        title={id ? "Edit Patient List Name" : "Name Patient List"}
      />
    </div>
  );
};

export default PatientListCreate;
