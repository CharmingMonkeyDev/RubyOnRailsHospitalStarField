/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable prettier/prettier */
import * as React from "react";
import {
  Grid,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Checkbox,
} from "@mui/material";
import { usePatientInformation } from "../hooks/patients/usePatientInformation";
import { usePatientInformationStyles } from "../styles/usePatientInformationStyles";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { PrivilegesContext } from "../PrivilegesContext";
import { checkPrivileges } from "../utils/PrivilegesHelper";

// helper
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patient_id: number;
  button_src: string;
  csrfToken: string;
  current_channel_id: number;
}

const PatientInformation: React.FC<Props> = (props: any) => {
  const [patient, setPatient] = React.useState<any>(null);
  const [patientLabs, setPatientLabs] = React.useState<any>(null);
  const userPrivileges = React.useContext(PrivilegesContext);

  React.useEffect(() => {
    if (props.patient_id) {
      fetch(`/data_fetching/patient_information/${props.patient_id}`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setPatient(result?.resource);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.patient_id]);

  React.useEffect(() => {
    if (props.patient_id) {
      fetch(`/data_fetching/patient_labs/${props.patient_id}`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setPatientLabs(result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.patient_id]);

  const { classes } = usePatientInformationStyles();
  const {
    open,
    closeModal,
    formatDate,
    formatDateDots,
    calculateAge,
    labA1cs,
    labBps,
    labTcs,
    labHdls,
    editPatientInformation,
    setEditInformation,
    addMedication,
    setAddMedication,
    showA1c,
    setShowA1c,
    showBp,
    setShowBp,
    showTc,
    setShowTc,
    showHdl,
    setShowHdl,
    expanded,
    setExpanded,
    editMedication,
    setEditMedication,
    formatDateSlashes,
    currentPatient,
    setCurrentPatient,
    completePathwayAction,
    isPathwayActionChecked,
    setExpandedPatientPathwayOnClick,
    expandedPatientPathway,
    setExpandedPatientPathway,
  } = usePatientInformation(patient, patientLabs, props.csrfToken);

  const startChat = (patientId) => {
    window.location.href = `/?user_patient_details=${patientId}`;
  };

  return (
    <>
      {typeof props.current_channel_id == "undefined" && (
        <Link
          onClick={() => {
            startChat(props.patient_id);
          }}
          className={classes.editLinkAnchor}
          style={{ float: "right" }}
          title="Start Chat"
        >
          <ChatIcon style={{ color: "#f8890b", marginRight: 20 }} />
        </Link>
      )}
      {patient ? (
        <p className={classes.patientText}>
          <strong className={classes.patientName}>{patient?.name}</strong>
          <br />
          {patient?.gender && <>{patient?.gender}&nbsp;&nbsp;&nbsp;&nbsp;</>}
          {calculateAge(patient?.date_of_birth)} yrs.
          <br />
          {formatDate(patient?.date_of_birth)}
          <br />
          {patient?.city}
          {patient?.city && <>,</>} {patient?.state} {patient?.zip}
          <br />
          <span className={classes.editLink}>
            <Link
              onClick={() => {
                setEditInformation(true);
              }}
              className={classes.editLinkAnchor}
            >
              Edit patient info
            </Link>
          </span>
        </p>
      ) : (
        <p>Loading...</p>
      )}
      <br />
      {checkPrivileges(userPrivileges, "View Patient Labs") && (
        <Accordion
          className={classes.topAccordion}
          expanded={expanded === "labs"}
          onChange={() => {
            expanded == "labs" ? setExpanded("") : setExpanded("labs");
          }}
        >
          <AccordionSummary
            expandIcon={
              expanded === "labs" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.accordionHeader}
          >
            <span className={classes.accordianHeaderTag}>Labs</span>
          </AccordionSummary>
          <AccordionDetails className={classes.accordianContent}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <Link
                  onClick={() => {
                    alert("Future feature");
                  }}
                  className={classes.dataLink}
                >
                  RPM
                </Link>
              </Grid>
            </Grid>

            <div className={classes.labContainer}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Grid item xs={3}>
                  <div className={classes.dataContainer}>
                    <div className={classes.dataTitle}>A1c</div>
                    {labA1cs != null && labA1cs.length ? (
                      <>
                        {labA1cs.map((lab, index) => (
                          <div
                            key={index}
                            className={
                              index == 0 || showA1c
                                ? classes.dataFlex
                                : classes.dataFlexHidden
                            }
                          >
                            <div className={classes.dataValue}>{lab[0]}</div>
                            <div className={classes.dataDate}>
                              {formatDateDots(lab[1])}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {labA1cs == null ? (
                          <div className={classes.dataFlex}>
                            <div className={classes.dataValue}>Loading...</div>
                            <div className={classes.dataDate}></div>
                          </div>
                        ) : (
                          <div className={classes.dataFlex}>
                            <div className={classes.dataValue}>N/A</div>
                            <div className={classes.dataDate}></div>
                          </div>
                        )}
                      </>
                    )}
                    {!showA1c && (
                      <div
                        className={classes.dataExpand}
                        onClick={() => {
                          setShowA1c(true);
                        }}
                      >
                        <ArrowDropDownIcon style={{ fontSize: "1rem" }} />
                      </div>
                    )}
                    {showA1c && (
                      <div
                        className={classes.dataExpand}
                        onClick={() => {
                          setShowA1c(false);
                        }}
                      >
                        <ArrowDropDownIcon style={{ fontSize: "1rem" }} />
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className={classes.dataContainer}>
                    <div className={classes.dataTitle}>BP</div>
                    {labBps != null && labBps.length ? (
                      <>
                        {labBps.map((lab, index) => (
                          <div
                            key={index}
                            className={
                              index == 0 || showBp
                                ? classes.dataFlex
                                : classes.dataFlexHidden
                            }
                          >
                            <div className={classes.dataValue}>{lab[0]}</div>
                            <div className={classes.dataDate}>
                              {formatDateDots(lab[1])}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {labBps == null ? (
                          <div className={classes.dataFlex}>
                            <div className={classes.dataValue}>Loading...</div>
                            <div className={classes.dataDate}></div>
                          </div>
                        ) : (
                          <div className={classes.dataFlex}>
                            <div className={classes.dataValue}>N/A</div>
                            <div className={classes.dataDate}></div>
                          </div>
                        )}
                      </>
                    )}
                    {!showBp && (
                      <div
                        className={classes.dataExpand}
                        onClick={() => {
                          setShowBp(true);
                        }}
                      >
                        <ArrowDropDownIcon style={{ fontSize: "1rem" }} />
                      </div>
                    )}
                    {showBp && (
                      <div
                        className={classes.dataExpand}
                        onClick={() => {
                          setShowBp(false);
                        }}
                      >
                        <ArrowDropDownIcon style={{ fontSize: "1rem" }} />
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className={classes.dataContainer}>
                    <div className={classes.dataTitle}>TC</div>
                    {labTcs != null && labTcs.length ? (
                      <>
                        {labTcs.map((lab, index) => (
                          <div
                            key={index}
                            className={
                              index == 0 || showTc
                                ? classes.dataFlex
                                : classes.dataFlexHidden
                            }
                          >
                            <div className={classes.dataValue}>{lab[0]}</div>
                            <div className={classes.dataDate}>
                              {formatDateDots(lab[1])}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {labTcs == null ? (
                          <div className={classes.dataFlex}>
                            <div className={classes.dataValue}>Loading...</div>
                            <div className={classes.dataDate}></div>
                          </div>
                        ) : (
                          <div className={classes.dataFlex}>
                            <div className={classes.dataValue}>N/A</div>
                            <div className={classes.dataDate}></div>
                          </div>
                        )}
                      </>
                    )}
                    {!showTc && (
                      <div
                        className={classes.dataExpand}
                        onClick={() => {
                          setShowTc(true);
                        }}
                      >
                        <ArrowDropDownIcon style={{ fontSize: "1rem" }} />
                      </div>
                    )}
                    {showTc && (
                      <div
                        className={classes.dataExpand}
                        onClick={() => {
                          setShowTc(false);
                        }}
                      >
                        <ArrowDropDownIcon style={{ fontSize: "1rem" }} />
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className={classes.dataContainer}>
                    <div className={classes.dataTitle}>HDL</div>
                    {labHdls != null && labHdls.length ? (
                      <>
                        {labHdls.map((lab, index) => (
                          <div
                            key={index}
                            className={
                              index == 0 || showHdl
                                ? classes.dataFlex
                                : classes.dataFlexHidden
                            }
                          >
                            <div className={classes.dataValue}>{lab[0]}</div>
                            <div className={classes.dataDate}>
                              {formatDateDots(lab[1])}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {labHdls == null ? (
                          <div className={classes.dataFlex}>
                            <div className={classes.dataValue}>Loading...</div>
                            <div className={classes.dataDate}></div>
                          </div>
                        ) : (
                          <div className={classes.dataFlex}>
                            <div className={classes.dataValue}>N/A</div>
                            <div className={classes.dataDate}></div>
                          </div>
                        )}
                      </>
                    )}
                    {!showHdl && (
                      <div
                        className={classes.dataExpand}
                        onClick={() => {
                          setShowHdl(true);
                        }}
                      >
                        <ArrowDropDownIcon style={{ fontSize: "1rem" }} />
                      </div>
                    )}
                    {showHdl && (
                      <div
                        className={classes.dataExpand}
                        onClick={() => {
                          setShowHdl(false);
                        }}
                      >
                        <ArrowDropDownIcon style={{ fontSize: "1rem" }} />
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      <Accordion
        expanded={expanded === "medications"}
        onChange={() => {
          expanded == "medications"
            ? setExpanded("")
            : setExpanded("medications");
        }}
      >
        <AccordionSummary
          expandIcon={
            expanded === "medications" ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            )
          }
          aria-controls="panel3a-content"
          id="panel3a-header"
          className={classes.accordionHeader}
        >
          <span className={classes.accordianHeaderTag}>Medications</span>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianContent}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item xs={12}>
              <Grid item xs={12} className={classes.addMedicationsSection}>
                <Link
                  onClick={() => {
                    setAddMedication(true);
                  }}
                  className={classes.addMedicationButton}
                >
                  Add
                </Link>
                <br />
                <br />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {typeof patient?.patient_medications !== "undefined" &&
              patient?.patient_medications.length ? (
                <>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableBody>
                        {patient?.patient_medications.map(
                          (medication, index) => (
                            <TableRow
                              key={medication.id}
                              className={
                                index % 2 == 0
                                  ? classes.medicationRowEven
                                  : classes.medicationRow
                              }
                            >
                              <TableCell component="th" scope="row">
                                {medication.name}
                              </TableCell>
                              <TableCell>{medication.value}</TableCell>
                              <TableCell>
                                {formatDateDots(medication.created_at)}
                              </TableCell>
                              <TableCell>
                                <Link
                                  onClick={() => {
                                    setEditMedication(medication);
                                  }}
                                  className={classes.addMedicationButton}
                                >
                                  Edit
                                </Link>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <>
                  {patient == null ? (
                    <p>Loading...</p>
                  ) : (
                    <p>No medications found</p>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "careplan"}
        onChange={() => {
          expanded == "careplan" ? setExpanded("") : setExpanded("careplan");
        }}
      >
        <AccordionSummary
          expandIcon={
            expanded === "careplan" ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            )
          }
          aria-controls="panel4a-content"
          id="panel4a-header"
          className={classes.accordionHeader}
        >
          <span className={classes.accordianHeaderTag}>Care Plan</span>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianContent}>
          <div className={classes.assignedActions}>
            <Link
              className={classes.addMedicationButton}
              href={`/care-plan-management?patient=${props.patient_id}`}
              style={{ float: "right", paddingLeft: 40, paddingRight: 40 }}
            >
              Edit Care Plan
            </Link>
            {currentPatient &&
            typeof currentPatient.assigned_actions != "undefined" ? (
              <>
                {currentPatient.assigned_actions.map((action, index) => (
                  <div key={index}>
                    <Checkbox
                      size="small"
                      style={{
                        color: "#38BCA9",
                      }}
                      checked={
                        (action.recurring == true &&
                          formatDate(action.completed_at) ==
                            formatDate(Date.now())) ||
                        (action.recurring == false && action.completed_at)
                      }
                    />
                    {action.text}
                    <br />
                    <div style={{ marginLeft: 40 }}>
                      <small>{action.subtext}</small>
                    </div>
                    {action.patient_action &&
                      action.patient_action.action_resources && (
                        <div
                          style={{
                            marginLeft: 40,
                            marginTop: 10,
                            marginBottom: 5,
                          }}
                        >
                          {action.patient_action.action_resources.map(
                            (actionResource, index) => (
                              <div key={index}>
                                <small>
                                  <a
                                    href={`${
                                      actionResource.resource_item
                                        .resource_type == "pdf"
                                        ? actionResource.resource_item.pdf_url
                                        : actionResource.resource_item.link_url
                                    }`}
                                    target="_blank"
                                    style={{ color: "#f8890b" }}
                                  >
                                    {actionResource.resource_item.name}
                                  </a>
                                </small>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {currentPatient == null ? (
                  <p>Loading...</p>
                ) : (
                  <p>Current patient not found</p>
                )}
              </>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "coach"}
        onChange={() => {
          expanded == "coach" ? setExpanded("") : setExpanded("coach");
        }}
      >
        <AccordionSummary
          expandIcon={expanded === "coach" ? "-" : <AddIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
          className={classes.accordionHeader}
        >
          <span className={classes.accordianHeaderTag}>Coach</span>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianContent}>
          <div className={classes.assignedPathwayContainer}>
            <Link
              className={classes.addMedicationButton}
              href={`/care-plan-management?patient=${props.patient_id}`}
              style={{ float: "right", paddingLeft: 40, paddingRight: 40 }}
            >
              Edit Care Plan
            </Link>
            {currentPatient &&
            typeof currentPatient.assigned_pathways != "undefined" ? (
              <>
                {currentPatient.assigned_pathways.map((pathway, index) => (
                  <div key={index} className={classes.assignedPathwayGroup}>
                    <div
                      style={{ cursor: "pointer", marginBottom: 10 }}
                      onClick={() => {
                        setExpandedPatientPathwayOnClick(pathway.id);
                      }}
                    >
                      <div className={classes.assignedPathway}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Grid item xs={12}>
                            <div style={{ float: "left" }}>{pathway.name}</div>
                            <div style={{ float: "left" }}>
                              <ArrowDropDownIcon
                                style={{ color: "#c1b7b3", marginTop: -3 }}
                              />
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                      <div className={classes.assignedPathway}>
                        Start Date: {formatDateSlashes(pathway.start_date)}
                      </div>
                    </div>

                    {expandedPatientPathway.length > 0 &&
                      expandedPatientPathway.includes(pathway.id) && (
                        <>
                          {pathway.assigned_pathway_weeks.map((week, index) => (
                            <div key={index}>
                              <div className={classes.assignedPathwayWeek}>
                                {week.name}{" "}
                                <span>
                                  {formatDateSlashes(new Date(week.start_date))}
                                </span>
                              </div>
                              {week.assigned_pathway_week_actions.map(
                                (action, index) => (
                                  <div
                                    key={index}
                                    className={
                                      classes.assignedPathwayWeekAction
                                    }
                                  >
                                    <Checkbox
                                      style={{
                                        color: "#38BCA9",
                                      }}
                                      size="small"
                                      onClick={() =>
                                        completePathwayAction(
                                          action,
                                          isPathwayActionChecked(action)
                                            ? false
                                            : true
                                        )
                                      }
                                      checked={isPathwayActionChecked(action)}
                                    />
                                    {action.text}
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </>
                      )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {currentPatient == null ? (
                  <p>Loading...</p>
                ) : (
                  <p>Care plan not found</p>
                )}
              </>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default PatientInformation;
