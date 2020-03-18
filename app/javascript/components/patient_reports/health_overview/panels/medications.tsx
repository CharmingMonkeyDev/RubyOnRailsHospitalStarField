// Library Imports
import * as React from "react";
import {
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
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// component imports
import FlashMessage from "../../../shared/FlashMessage";
import AddMedication from "./AddMedication";

// app setting imports
import { AuthenticationContext, ImagesContext } from "../../../Context";

// importing header helpers
import { getHeaders } from "../../../utils/HeaderHelper";
import { useParams } from "react-router-dom";

interface Props {}

const Medications: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [medications, setMedications] = React.useState<any>([]);
  const [medication, setMedication] = React.useState<any>(null);
  let { id: patientId } = useParams();

  const [open, setOpen] = React.useState<boolean>(false);
  const [firstLoad, setFirlstLoad] = React.useState<boolean>(true);

  // Error handling states
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });

  React.useEffect(() => {
    if (medications) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const medicationList = getSortedAndSearchedList();
    setMedications(medicationList);
  };
  const images = React.useContext(ImagesContext);

  const getSortIcon = (column) => {
    return sortObject.field == column ? (
      <span className="sortIndicator">
        {sortObject.direction == "ascending" ? (
          <img
            src={images.sort_ascending_src}
            width="10"
            className="sort-icon"
            alt="Sort Asc"
          />
        ) : (
          <img
            src={images.sort_descending_src}
            width="10"
            className="sort-icon"
            alt="Sort Desc"
          />
        )}
      </span>
    ) : (
      <span className="sortIndicator">
        <img
          src={images.sort_plain_src}
          width="10"
          className="sort-icon"
          alt="Sort Asc"
        />
      </span>
    );
  };

  const getSortedAndSearchedList = () => {
    let medicationList = [...medications];
    medicationList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "name") {
      medicationList.sort((a, b) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "created_at") {
      medicationList.sort((a, b) =>
        new Date(a["created_at"]) > new Date(b["created_at"]) ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      medicationList.reverse();
    }
    return medicationList;
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  React.useEffect(() => {
    getCurrentMedicationData();
  }, [patientId, open]);

  React.useEffect(() => {
    if (firstLoad) {
      setFirlstLoad(false);
    } else {
      setOpen(true);
    }
  }, [medication]);

  const getCurrentMedicationData = () => {
    if (patientId) {
      fetch(`/patient_medications/${patientId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setMedications(result?.resource);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const setEditMedication = (medic) => {
    setMedication(medic);
  };

  const handleNewFormOpen = () => {
    // making selected meciation null so new form triggers
    setFirlstLoad(false);
    setMedication(null);
    setOpen(true);
  };

  const removeMedication = (medicationId) => {
    if (
      confirm("Deleting this entry cannot be undone, do you wish to continue?")
    ) {
      fetch(`/patient_medications/${medicationId}`, {
        method: "DELETE",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setMedications(result?.resource);
            setFlashMessage({ message: result?.message, type: "success" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Grid container className="panel-container">
      <FlashMessage flashMessage={flashMessage} />
      <Grid item xs={12}>
        <FlashMessage flashMessage={flashMessage} />
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
                    <h3>Medications</h3>
                  </Grid>
                  <Link
                    className="action-link add-encounter"
                    onClick={handleNewFormOpen}
                  >
                    <AddIcon className="plus-icon" />{" "}
                    <span className="app-user-text">Add Medication</span>
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
                        <TableCell
                          className="nowrap-header"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortOrder(
                              "name",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending"
                            );
                          }}
                        >
                          Name {getSortIcon("name")}
                        </TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell
                          className="nowrap-header"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortOrder(
                              "created_at",
                              sortObject.direction == "ascending"
                                ? "descending"
                                : "ascending"
                            );
                          }}
                        >
                          Date Added to Starfield {getSortIcon("created_at")}
                        </TableCell>
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
                      {medications.map((medication) => {
                        return (
                          <TableRow key={medication?.id}>
                            <TableCell>{medication.name}</TableCell>
                            <TableCell>{medication.value}</TableCell>
                            <TableCell>
                              {medication.formatted_created_at}
                            </TableCell>
                            <TableCell className="nowrap-header" align="center">
                              <CreateIcon
                                style={{
                                  fontSize: 18,
                                  color: "black",
                                  display: "inline-block",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setEditMedication(medication);
                                }}
                              />
                            </TableCell>
                            <TableCell className="nowrap-header" align="center">
                              <DeleteIcon
                                style={{
                                  fontSize: 18,
                                  color: "black",
                                  display: "inline-block",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                  marginLeft: 15,
                                }}
                                onClick={() => {
                                  removeMedication(medication.id);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {open && (
        <AddMedication
          patient_id={patientId}
          edit_medication={medication}
          open={open}
          setOpen={setOpen}
        />
      )}
    </Grid>
  );
};

export default Medications;
