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

// app setting imports
import {
  AuthenticationContext,
  FlashContext,
  ImagesContext,
} from "../../../Context";

// importing header helpers
import { getHeaders } from "../../../utils/HeaderHelper";
import { formatToUsDateFromUTC } from "../../../utils/DateHelper";
import { useParams } from "react-router-dom";
import {
  getSortedListByDate,
  getSortedListByNumber,
  getSortedListByString,
  setSortOrder,
} from "../../../shared/tables/TableHelper";

interface Props {}

const PatientImmunizations: React.FC<Props> = (props: any) => {
  const { id: patientId } = useParams();
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  // other states
  const [allImmunizations, setAllImmunizations] = React.useState<any>([]);
  const [linkedWithNdiis, setLinkedWithNdiis] = React.useState<boolean>(false);
  const [linkBtnLabel, setLinkBtnLabel] =
    React.useState<string>("Link to NDIIS");

  React.useEffect(() => {
    getImmunizations();
  }, [patientId]);

  const getImmunizations = async () => {
    const response = await fetch(`/patient_immunizations/${patientId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    });
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    if (result?.resource) {
      const immunizations = [
        ...(result?.resource?.historic?.map((item) => ({
          immunization: item.vaccine_name || null,
          date_received: item.immunization_date || null,
          due_date: null,
        })) || []),
        ...(result?.resource?.forecast?.map((item) => ({
          immunization: item.vaccine_type || null,
          date_received: null,
          due_date: item.minimum_valid_date || null,
        })) || []),
      ];

      setAllImmunizations(immunizations);

      setLinkedWithNdiis(result?.resource?.ndiis_linked);
    } else {
      alert("Something is wrong and template cannot be saved");
    }
  };

  const handleLinkToNdiis = () => {
    setLinkBtnLabel("Loading...");
    fetch(`/link_to_ndiis/${patientId}`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            setLinkedWithNdiis(result?.resource?.ndiis_linked);
            if (result?.resource?.ndiis_linked) {
              flashContext.setMessage({
                text: "Linked with NDIIS",
                type: "success",
              });
              getImmunizations();
            } else {
              flashContext.setMessage({
                text: "Cannot link with NDIIS",
                type: "error",
              });
            }
          } else {
            alert("Something is wrong and template cannot be saved");
          }
          setLinkBtnLabel("Link to NDIIS");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [sortObject, setSortObject] = React.useState<any>({
    field: "",
    direction: "",
  });

  React.useEffect(() => {
    if (allImmunizations) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const immunizationsList = getSortedAndSearchedList();
    setAllImmunizations(immunizationsList);
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
    let imList = [...allImmunizations];
    imList.sort((a, b) => (a.id > b.id ? 1 : -1));
    switch (sortObject.field) {
      case "immunization":
        return getSortedListByString(imList, sortObject, "immunization");
      case "date_received":
        return getSortedListByDate(imList, sortObject, "date_received");
      case "due_date":
        return getSortedListByDate(imList, sortObject, "due_date");
      default:
        return getSortedListByNumber(imList, sortObject, "id");
    }
  };

  return (
    <Grid className="panel-container">
      <Grid item xs={12}>
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
                    <h3>Immunizations</h3>
                  </Grid>
                  {!linkedWithNdiis && (
                    <Link
                      className="basic-button orange-btn"
                      style={{ width: "150px" }}
                      onClick={handleLinkToNdiis}
                    >
                      {linkBtnLabel}
                    </Link>
                  )}
                </Stack>
              </Grid>
            </Grid>
            <Grid
              container
              className="medication-container grey-container pad-top-10"
            >
              <Grid item xs={12} className="medication-table-container">
                {!linkedWithNdiis ? (
                  <p style={{ padding: "20px", textAlign: "center" }}>
                    The patient is currently not connected with NDIIS. Click the
                    button to attempt to link and retrieve immunization
                    information.
                  </p>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead className="table-header-box">
                        <TableRow>
                          <TableCell
                            className="nowrap-header"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSortOrder(
                                "immunization",
                                sortObject.direction == "ascending"
                                  ? "descending"
                                  : "ascending",
                                setSortObject
                              );
                            }}
                          >
                            Immunization {getSortIcon("immunization")}
                          </TableCell>
                          <TableCell
                            className="nowrap-header"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSortOrder(
                                "date_received",
                                sortObject.direction == "ascending"
                                  ? "descending"
                                  : "ascending",
                                setSortObject
                              );
                            }}
                          >
                            Date Received {getSortIcon("date_received")}
                          </TableCell>
                          <TableCell
                            className="nowrap-header"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSortOrder(
                                "due_date",
                                sortObject.direction == "ascending"
                                  ? "descending"
                                  : "ascending",
                                setSortObject
                              );
                            }}
                          >
                            Due Date {getSortIcon("due_date")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allImmunizations?.map((immunization) => (
                          <TableRow key={immunization.id}>
                            <TableCell>{immunization.immunization}</TableCell>
                            <TableCell>
                              {!!immunization?.date_received
                                ? formatToUsDateFromUTC(
                                    immunization.date_received
                                  )
                                : ""}
                            </TableCell>
                            <TableCell>
                              {!!immunization?.due_date
                                ? formatToUsDateFromUTC(immunization.due_date)
                                : ""}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientImmunizations;
