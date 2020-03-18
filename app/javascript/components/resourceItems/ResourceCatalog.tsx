import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Grid,
  Link,
  Snackbar,
} from "@mui/material";
import AddResource from "./AddResource";
import { Alert } from '@mui/material';
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

// helper
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  user_id: number;
  csrfToken: string;
  menu_track_src: string;
  menu_minus_circle: string;
}

const ResourceCatalog: React.FC<Props> = (props: any) => {
  const [addResource, setAddResource] = React.useState<boolean>(false);
  const [isArchived, setIsArchived] = React.useState<boolean>(false);
  const [editResource, setEditResource] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");
  const [expandedResource, setExpandedResource] = React.useState([]);
  const [resourceItems, setResourceItems] = React.useState([]);
  const [patientActionId, setPatientActionId] = React.useState<any>(null);
  const [patientAction, setPatientAction] = React.useState<any>(null);
  const [savedActionResources, setSavedActionResources] = React.useState([]);
  const [patientId, setPatientId] = React.useState<string>("");
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get("redirect_url");

  React.useEffect(() => {
    getResourceItems();

    let urlParams = new URLSearchParams(window.location.search);
    let patientActionIdParameter = urlParams.get("patient_action");
    let patient = urlParams.get("patient");
    setPatientId(patient);
    if (patientActionIdParameter) {
      setPatientActionId(patientActionIdParameter);
      if (patientActionIdParameter == "new") {
        setSavedActionResources(
          JSON.parse(sessionStorage.getItem("saved_action_resources_temp"))
        );
      }
    }
  }, []);

  React.useEffect(() => {
    if (patientActionId && patientActionId != "new") getPatientAction();
  }, [patientActionId]);

  const getPatientAction = () => {
    setError("");
    fetch(`/patient_actions/${patientActionId}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          setError(result.error);
        } else {
          setPatientAction(result.data.patient_action);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const getResourceItems = () => {
    setError("");
    fetch(`/resource_items`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          setError(result.message);
        } else {
          if (result.message === "Access Denied") {
            setResourceItems([]);
          } else {
            setResourceItems(result.resource);
          }
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const removeResource = (resource_item) => {
    setError("");
    if (confirm("Are you sure you want to remove the resource?")) {
      fetch(`/resource_items/${resource_item.id}`, {
        method: "PATCH",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          is_deleted: true,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            setError(result.message);
          } else {
            window.location.href = `/resource-catalog`;
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  const setExpandedOnClick = (resource) => {
    let expandedCopy = expandedResource;
    if (expandedResource.length > 0 && expandedResource.includes(resource)) {
      expandedCopy = expandedCopy.filter((item) => item !== resource);
      setExpandedResource(expandedCopy);
    } else if (expandedResource.length > 0) {
      setExpandedResource((expandedCopy) => [...expandedCopy, resource]);
    } else {
      expandedCopy = [resource];
      setExpandedResource(expandedCopy);
    }
  };

  const addPatientActionResource = (resourceItem) => {
    if (patientActionId == "new") {
      let savedActionResourcesTemp = savedActionResources
        ? savedActionResources
        : [];
      savedActionResourcesTemp.push({
        patient_action_id: patientActionId,
        resource_item_id: resourceItem.id,
      });
      setSavedActionResources(savedActionResourcesTemp);
      sessionStorage.setItem(
        "saved_action_resources_temp",
        JSON.stringify(savedActionResourcesTemp)
      );
    } else {
      setError("");
      fetch(`/action_resources/`, {
        method: "POST",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          action_resource: {
            patient_action_id: patientActionId,
            resource_item_id: resourceItem.id,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            setError(result.error);
          } else {
            setPatientAction(result.data.patient_action);
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  const removePatientActionResource = (item) => {
    if (
      confirm(
        "Are you sure you want to remove the resource from the patient action?"
      )
    ) {
      if (patientActionId == "new") {
        let actionResourceItemsTemp = savedActionResources;
        actionResourceItemsTemp = actionResourceItemsTemp.filter(
          (resourceItem) => resourceItem.resource_item_id !== item.id
        );
        setSavedActionResources(actionResourceItemsTemp);
        sessionStorage.setItem(
          "saved_action_resources_temp",
          JSON.stringify(actionResourceItemsTemp)
        );
      } else {
        let actionResource = patientAction.action_resources.filter(
          (actionResource) => actionResource.resource_item_id == item.id
        )[0];
        if (typeof actionResource !== "undefined") {
          setError("");
          fetch(`/action_resources/${actionResource.id}`, {
            method: "DELETE",
            headers: getHeaders(props.csrfToken),
          })
            .then((result) => result.json())
            .then((result) => {
              if (typeof result.error !== "undefined") {
                setError(result.error);
              } else {
                setPatientAction(result.data.patient_action);
              }
            })
            .catch((error) => {
              setError(error);
            });
        } else {
          setError("Action Resource Not Found");
        }
      }
    }
  };

  const thisActionHasResource = (item) => {
    let actionResource = null;
    if (patientActionId != "new") {
      actionResource = patientAction.action_resources.filter(
        (actionResourceItem) => actionResourceItem.resource_item_id == item.id
      )[0];
    } else {
      if (savedActionResources)
        actionResource = savedActionResources.filter(
          (actionResourceItem) => actionResourceItem.resource_item_id == item.id
        )[0];
    }
    return actionResource !== null && typeof actionResource !== "undefined";
  };

  return (
    <div className="resource-catalog">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container"
      >
        <Grid item xs={12}>
          {error.length > 0 && (
            <Snackbar
              open={error.length > 0}
              autoHideDuration={6000}
              onClose={() => {
                setError("");
              }}
            >
              <Alert severity="error" className="alert">
                {error}
              </Alert>
            </Snackbar>
          )}

          {(addResource || editResource) && (
            <AddResource
              csrfToken={props.csrfToken}
              editResource={editResource}
              setEditResource={setEditResource}
              redirect={true}
            />
          )}

          <div
            className="userAdminInformation"
            style={{ paddingBottom: "80px" }}
          >
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="stretch"
              className="adminHeader"
            >
              <Grid item xs={12} md={6}>
                <h3>Resource Catalog</h3>
              </Grid>
              <Grid item xs={12} md={6} className="addLink">
                {!patientActionId && (
                  <>
                    <Link
                      onClick={() => {
                        setAddResource(true);
                      }}
                      style={{
                        float: "right",
                        marginTop: 5,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ float: "left", marginRight: 5 }}>
                        <img
                          src={props.menu_track_src}
                          width="30"
                          alt="Add Action"
                        />
                      </div>
                      <div
                        style={{
                          float: "left",
                          fontSize: 16,
                          marginTop: 5,
                          color: "#757575",
                        }}
                      >
                        Add Resource
                      </div>
                    </Link>
                    <Link
                      onClick={() => {
                        isArchived ? setIsArchived(false) : setIsArchived(true);
                      }}
                      style={{
                        float: "right",
                        marginRight: 20,
                        marginTop: 5,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{ float: "left", marginRight: 5, marginTop: 2 }}
                      >
                        {isArchived ? (
                          <UnarchiveIcon style={{ color: "#919191" }} />
                        ) : (
                          <ArchiveIcon style={{ color: "#919191" }} />
                        )}
                      </div>
                      <div
                        style={{
                          float: "left",
                          fontSize: 16,
                          marginTop: 5,
                          color: "#757575",
                        }}
                      >
                        {isArchived ? (
                          <>Unarchived Resources</>
                        ) : (
                          <>Archived Resources</>
                        )}
                      </div>
                    </Link>
                  </>
                )}
                {patientActionId && (
                  <>
                    <Link
                      href={
                        redirectUrl ??
                        `/care-plan-management?patient_action=${patientActionId}&patient=${patientId}`
                      }
                      style={{
                        float: "right",
                        marginRight: 20,
                        marginTop: 5,
                        cursor: "pointer",
                      }}
                      className="nextButton"
                    >
                      <div>Done</div>
                    </Link>
                    <Link
                      href={`/care-plan-management?patient_action=${patientActionId}`}
                      style={{
                        float: "right",
                        marginRight: 80,
                        cursor: "pointer",
                        font: "14px QuicksandMedium",
                        color: "#313133",
                        textDecoration: "underline",
                        marginTop: 20,
                        display: "inline-block",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          marginTop: -2,
                          color: "#757575",
                        }}
                      >
                        Cancel
                      </div>
                    </Link>
                  </>
                )}
              </Grid>
            </Grid>
            <div className="divider"></div>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="stretch"
            >
              <Grid item xs={12} md={4} className="careSection">
                <div className="careHeader">
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={12} md={12}>
                      PDFs
                    </Grid>
                  </Grid>
                </div>
                <TableContainer component={Paper}>
                  <Table className="table" aria-label="simple table">
                    <TableBody>
                      {resourceItems
                        .filter(
                          (item) =>
                            item.resource_type == "pdf" &&
                            item.is_deleted == isArchived
                        )
                        .map((item, index) => (
                          <TableRow
                            key={index}
                            className={index % 2 == 0 ? "row" : "rowEven"}
                            onClick={() => {
                              setExpandedOnClick(item.id);
                            }}
                          >
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                              }}
                            >
                              <div style={{ marginLeft: 30, fontSize: 13 }}>
                                {item.name}
                                {expandedResource.length > 0 &&
                                  expandedResource.includes(item.id) && (
                                    <div>
                                      <small>
                                        &nbsp;&nbsp;&nbsp;&bull; PDF Url:{" "}
                                        <a
                                          href={item.pdf_url}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Open PDF
                                        </a>
                                      </small>
                                    </div>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {expandedResource.length > 0 &&
                              expandedResource.includes(item.id) ? (
                                <ArrowDropUpIcon style={{ fontSize: 20 }} />
                              ) : (
                                <ArrowDropDownIcon style={{ fontSize: 20 }} />
                              )}
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {!patientActionId && (
                                <CreateIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setEditResource(item);
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {!patientActionId && (
                                <>
                                  {!isArchived && (
                                    <DeleteIcon
                                      style={{
                                        fontSize: 20,
                                        color: "#c1b7b3",
                                        display: "inline-block",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        removeResource(item);
                                      }}
                                    />
                                  )}
                                </>
                              )}
                              {(patientAction || patientActionId == "new") && (
                                <>
                                  {thisActionHasResource(item) ? (
                                    <Link
                                      onClick={() => {
                                        removePatientActionResource(item);
                                      }}
                                      className="trackLink"
                                      style={{
                                        display: "block",
                                        marginTop: 10,
                                      }}
                                    >
                                      <img
                                        src={props.menu_minus_circle}
                                        width="20"
                                        alt="Remove"
                                      />
                                    </Link>
                                  ) : (
                                    <Link
                                      onClick={() => {
                                        addPatientActionResource(item);
                                      }}
                                      className="trackLink"
                                      style={{
                                        display: "block",
                                        marginTop: 10,
                                      }}
                                    >
                                      <img
                                        src={props.menu_track_src}
                                        width="20"
                                        alt="Add"
                                      />
                                    </Link>
                                  )}
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={4} className="careSection">
                <div className="careHeader">
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <Grid item xs={12} md={6}>
                      Videos
                    </Grid>
                    <Grid item xs={12} md={6}>
                      &nbsp;
                    </Grid>
                  </Grid>
                </div>

                <TableContainer component={Paper}>
                  <Table className="table" aria-label="simple table">
                    <TableBody>
                      {resourceItems
                        .filter(
                          (item) =>
                            item.resource_type == "video" &&
                            item.is_deleted == isArchived
                        )
                        .map((item, index) => (
                          <TableRow
                            key={index}
                            className={index % 2 == 0 ? "row" : "rowEven"}
                            onClick={() => {
                              setExpandedOnClick(item.id);
                            }}
                          >
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                              }}
                            >
                              <div style={{ marginLeft: 30, fontSize: 13 }}>
                                {item.name}
                                {expandedResource.length > 0 &&
                                  expandedResource.includes(item.id) && (
                                    <div>
                                      <small>
                                        &nbsp;&nbsp;&nbsp;&bull; Link Url:{" "}
                                        <a
                                          href={item.link_url}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {item.link_url}
                                        </a>
                                      </small>
                                    </div>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {expandedResource.length > 0 &&
                              expandedResource.includes(item.id) ? (
                                <ArrowDropUpIcon style={{ fontSize: 20 }} />
                              ) : (
                                <ArrowDropDownIcon style={{ fontSize: 20 }} />
                              )}
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {!patientActionId && (
                                <CreateIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setEditResource(item);
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {!patientActionId && (
                                <>
                                  {!isArchived && (
                                    <DeleteIcon
                                      style={{
                                        fontSize: 20,
                                        color: "#c1b7b3",
                                        display: "inline-block",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        removeResource(item);
                                      }}
                                    />
                                  )}
                                </>
                              )}
                              {(patientAction || patientActionId == "new") && (
                                <>
                                  {thisActionHasResource(item) ? (
                                    <Link
                                      onClick={() => {
                                        removePatientActionResource(item);
                                      }}
                                      className="trackLink"
                                      style={{
                                        display: "block",
                                        marginTop: 10,
                                      }}
                                    >
                                      <img
                                        src={props.menu_minus_circle}
                                        width="20"
                                        alt="Remove"
                                      />
                                    </Link>
                                  ) : (
                                    <Link
                                      onClick={() => {
                                        addPatientActionResource(item);
                                      }}
                                      className="trackLink"
                                      style={{
                                        display: "block",
                                        marginTop: 10,
                                      }}
                                    >
                                      <img
                                        src={props.menu_track_src}
                                        width="20"
                                        alt="Add"
                                      />
                                    </Link>
                                  )}
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="careHeader">
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <Grid item xs={12} md={6}>
                      External Links
                    </Grid>
                    <Grid item xs={12} md={6}>
                      &nbsp;
                    </Grid>
                  </Grid>
                </div>
                <TableContainer component={Paper}>
                  <Table className="table" aria-label="simple table">
                    <TableBody>
                      {resourceItems
                        .filter(
                          (item) =>
                            item.resource_type == "link" &&
                            item.is_deleted == isArchived
                        )
                        .map((item, index) => (
                          <TableRow
                            key={index}
                            className={index % 2 == 0 ? "row" : "rowEven"}
                            onClick={() => {
                              setExpandedOnClick(item.id);
                            }}
                          >
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                              }}
                            >
                              <div style={{ marginLeft: 30, fontSize: 13 }}>
                                {item.name}
                                {expandedResource.length > 0 &&
                                  expandedResource.includes(item.id) && (
                                    <div>
                                      <small>
                                        &nbsp;&nbsp;&nbsp;&bull; Link Url:{" "}
                                        <a
                                          href={item.link_url}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {item.link_url}
                                        </a>
                                      </small>
                                    </div>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {expandedResource.length > 0 &&
                              expandedResource.includes(item.id) ? (
                                <ArrowDropUpIcon style={{ fontSize: 20 }} />
                              ) : (
                                <ArrowDropDownIcon style={{ fontSize: 20 }} />
                              )}
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {!patientActionId && (
                                <CreateIcon
                                  style={{
                                    fontSize: 20,
                                    color: "#c1b7b3",
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setEditResource(item);
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {!patientActionId && (
                                <>
                                  {!isArchived && (
                                    <DeleteIcon
                                      style={{
                                        fontSize: 20,
                                        color: "#c1b7b3",
                                        display: "inline-block",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        removeResource(item);
                                      }}
                                    />
                                  )}
                                </>
                              )}
                              {(patientAction || patientActionId == "new") && (
                                <>
                                  {thisActionHasResource(item) ? (
                                    <Link
                                      onClick={() => {
                                        removePatientActionResource(item);
                                      }}
                                      className="trackLink"
                                      style={{
                                        display: "block",
                                        marginTop: 10,
                                      }}
                                    >
                                      <img
                                        src={props.menu_minus_circle}
                                        width="20"
                                        alt="Remove"
                                      />
                                    </Link>
                                  ) : (
                                    <Link
                                      onClick={() => {
                                        addPatientActionResource(item);
                                      }}
                                      className="trackLink"
                                      style={{
                                        display: "block",
                                        marginTop: 10,
                                      }}
                                    >
                                      <img
                                        src={props.menu_track_src}
                                        width="20"
                                        alt="Add"
                                      />
                                    </Link>
                                  )}
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResourceCatalog;
