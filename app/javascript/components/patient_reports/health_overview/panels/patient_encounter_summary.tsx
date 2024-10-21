/* eslint-disable prettier/prettier */

// Library Imports
import * as React from "react";
import { Grid, Link, Stack, Table, TableBody, TableContainer, TableHead, TableRow, TableCell } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useParams } from "react-router-dom";

// component imports
import FlashMessage from "../../../shared/FlashMessage";

// app setting imports
import { AuthenticationContext, BackContext } from "../../../Context";

// importing header helpers
import { getHeaders } from "../../../utils/HeaderHelper";
import { snakeCaseToTitleCase, toTitleCase } from "../../../utils/CaseFormatHelper";

interface Props {}

const PatientEncounterSummary: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // Error handling states
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });
  let { id:patientId } = useParams();
  const [allEncounters, setAllEncounters] = React.useState<any>();

  React.useEffect(() => {
    getEncounterData();
  }, [patientId]);

  const getEncounterData = () => {
    if (patientId) {
      fetch(`/encounters/list/${patientId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setAllEncounters(result?.resource);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Grid container className="panel-container">
      <Grid item xs={12}>
        <FlashMessage flashMessage={flashMessage} />
        <Grid container className="panel-show-container">
          <Grid container className="panel-information-container">
            <Grid
              container
              direction="row"
              className="admin-header"
            >
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
                    <h3>Encounters Summary</h3>
                  </Grid>
                  <Link
                      className="action-link add-encounter"
                      href={`/patient_reports/${patientId}/patient_encounters/new`}
                    >
                      <AddIcon className="plus-icon" />{" "}
                      <span className="app-user-text">New Encounter</span>
                    </Link>
                </Stack>
              </Grid>
            </Grid>
            <Grid
              container
              className="grey-container"
              style={{
                marginTop: "-11px",
              }}
            >
              <Grid container className="tabs-container">
                <Grid 
                  item xs={12} 
                  className="panel-body tab-body-container" 
                  padding={0}
                  mt={1}
                  sx={{border: "0px !important"}}
                >
                  <TableContainer>
                    <Table>
                      <TableHead className="table-header-box">
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Provider</TableCell>
                          <TableCell>Billable?</TableCell>
                          <TableCell align="center" width={"5%"}>View/Edit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allEncounters?.map((encounter) => (
                          <TableRow key={encounter?.id}>
                            <TableCell className="date-data">
                            <span className="time-td">
                                {encounter?.formatted_date}
                              </span>
                            </TableCell>
                            <TableCell>{snakeCaseToTitleCase(encounter?.encounter_type)}</TableCell>
                            <TableCell>{toTitleCase(encounter?.status)}</TableCell>
                            <TableCell>{encounter?.provider_name}</TableCell>
                            <TableCell>{encounter?.generate_claim ? "Yes" : "No"}</TableCell>
                            <TableCell align="center" width={"5%"}>
                              <Stack direction={"row"} gap={1} justifyContent={"space-around"} width={"100%"}>
                                <a
                                  title="View Note"
                                  href={`/patient_reports/${patientId}/patient_encounters/new?encounter_id=${encounter.uuid}&view_only=1`}
                                >
                                  <VisibilityIcon  sx={{color: "gray"}} />
                                </a>
                                {encounter.status == "pended" && (
                                  <a
                                    title="Edit Note"
                                    href={`/patient_reports/${patientId}/patient_encounters/new?encounter_id=${encounter.uuid}`}
                                  >
                                    <CreateIcon  sx={{color: "gray"}} />
                                  </a>
                                  )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientEncounterSummary;
