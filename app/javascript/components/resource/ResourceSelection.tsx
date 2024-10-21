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
  Alert,
  Grid,
  Link,
  Snackbar,
} from "@mui/material";

// auth
import { AuthenticationContext } from "../Context";

// helper
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  setSelectedResourceIds: any;
  selectedResourceIds: any;
  setShowResourceSelection: any;
  setHasUnsavedChanges?: any;
}

const ResourceSelection: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  //   other states
  const isArchived = false;
  const [error, setError] = React.useState<string>("");
  const [expandedResource, setExpandedResource] = React.useState([]);
  const [resourceItems, setResourceItems] = React.useState([]);
  const [selectedResourceIds, setSelectedResourceIds] = React.useState<any>([
    ...props.selectedResourceIds,
  ]);

  //   consts
  const menu_track_src =
    "https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png";

  const menu_minus_circle =
    "https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-minus-circle.png";

  React.useEffect(() => {
    getResourceItems();
  }, []);

  const getResourceItems = () => {
    setError("");
    fetch(`/resource_items`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
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

  const selectResource = (resourceItem) => {
    event.preventDefault();
    let tempSelectedResources = [...selectedResourceIds];
    tempSelectedResources.push(resourceItem.id);
    setSelectedResourceIds(tempSelectedResources);
  };

  const removeResource = (resourceItem) => {
    event.preventDefault();
    if (
      confirm(
        "Are you sure you want to remove the resource from the patient action?"
      )
    ) {
      let tempSelectedResources = [...selectedResourceIds];
      let removedList = tempSelectedResources.filter(
        (item) => item != resourceItem.id
      );
      setSelectedResourceIds(removedList);
    }
  };

  const isSelected = (itemId) => {
    const isPresent = selectedResourceIds.includes(itemId);
    return isPresent;
  };

  const handleDoneClick = () => {
    if (!compareArrays(props.selectedResourceIds, selectedResourceIds)) {
      props.setHasUnsavedChanges(true);
    }
    props.setSelectedResourceIds([...selectedResourceIds]);
    props.setShowResourceSelection(false);
  };

  // array comparision for array change

  const compareArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Sort the arrays
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }

    return true;
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
                <Link
                  onClick={handleDoneClick}
                  style={{
                    float: "right",
                    marginRight: 20,
                    marginTop: 5,
                    cursor: "pointer",
                    marginBottom: "18px",
                  }}
                  className="nextButton"
                >
                  <div>Done</div>
                </Link>
                <Link
                  onClick={() => props.setShowResourceSelection(false)}
                  style={{
                    float: "right",
                    marginRight: 16,
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
                          >
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                              }}
                              onClick={() => {
                                setExpandedOnClick(item.id);
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
                              onClick={() => {
                                setExpandedOnClick(item.id);
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
                            ></TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {isSelected(item.id) ? (
                                <Link
                                  onClick={() => {
                                    removeResource(item);
                                  }}
                                  className="trackLink"
                                  style={{
                                    display: "block",
                                    marginTop: 10,
                                  }}
                                >
                                  <img
                                    src={menu_minus_circle}
                                    width="20"
                                    alt="Remove"
                                  />
                                </Link>
                              ) : (
                                <Link
                                  onClick={() => {
                                    selectResource(item);
                                  }}
                                  className="trackLink"
                                  style={{
                                    display: "block",
                                    marginTop: 10,
                                  }}
                                >
                                  <img
                                    src={menu_track_src}
                                    width="20"
                                    alt="Add"
                                  />
                                </Link>
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
                          >
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                              }}
                              onClick={() => {
                                setExpandedOnClick(item.id);
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
                              onClick={() => {
                                setExpandedOnClick(item.id);
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
                            ></TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {isSelected(item.id) ? (
                                <Link
                                  onClick={() => {
                                    removeResource(item);
                                  }}
                                  className="trackLink"
                                  style={{
                                    display: "block",
                                    marginTop: 10,
                                  }}
                                >
                                  <img
                                    src={menu_minus_circle}
                                    width="20"
                                    alt="Remove"
                                  />
                                </Link>
                              ) : (
                                <Link
                                  onClick={() => {
                                    selectResource(item);
                                  }}
                                  className="trackLink"
                                  style={{
                                    display: "block",
                                    marginTop: 10,
                                  }}
                                >
                                  <img
                                    src={menu_track_src}
                                    width="20"
                                    alt="Add"
                                  />
                                </Link>
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
                          >
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                fontFamily: "QuicksandMedium",
                                padding: 5,
                              }}
                              onClick={() => {
                                setExpandedOnClick(item.id);
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
                              onClick={() => {
                                setExpandedOnClick(item.id);
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
                            ></TableCell>
                            <TableCell
                              scope="row"
                              align="left"
                              style={{
                                padding: 5,
                                width: "20px",
                              }}
                            >
                              {isSelected(item.id) ? (
                                <Link
                                  onClick={() => {
                                    removeResource(item);
                                  }}
                                  className="trackLink"
                                  style={{
                                    display: "block",
                                    marginTop: 10,
                                  }}
                                >
                                  <img
                                    src={menu_minus_circle}
                                    width="20"
                                    alt="Remove"
                                  />
                                </Link>
                              ) : (
                                <Link
                                  onClick={() => {
                                    selectResource(item);
                                  }}
                                  className="trackLink"
                                  style={{
                                    display: "block",
                                    marginTop: 10,
                                  }}
                                >
                                  <img
                                    src={menu_track_src}
                                    width="20"
                                    alt="Add"
                                  />
                                </Link>
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

export default ResourceSelection;
