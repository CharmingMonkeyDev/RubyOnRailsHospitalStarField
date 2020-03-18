import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  Link,
  Snackbar,
  Box,
  Checkbox,
  Divider,
} from "@mui/material";
import { Alert } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import SVG from "react-inlinesvg";
// auth
import { AuthenticationContext, ImagesContext } from "../Context";

// helper
import { getHeaders } from "../utils/HeaderHelper";
import { useState } from "react";

const useStyles = makeStyles(() => ({
  noBorderBottom: {
    borderBottom: 0,
  },
}));

const AccordionTableRow = ({
  action,
  className,
  allExpanded = false,
  checked = false,
  onActionSelectRemove,
  disabled = false,
}) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(allExpanded);
  const [isSelected, setIsSelected] = useState(checked);

  React.useEffect(() => {
    setExpanded(allExpanded);
  }, [allExpanded]);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const onCheckboxChange = (event) => {
    event.stopPropagation();
    onActionSelectRemove(!isSelected);
    setIsSelected(!isSelected);
  };

  return (
    <>
      <TableRow
        onClick={handleChange}
        style={{ cursor: "pointer", borderBottom: 0 }}
        className={className}
      >
        <TableCell
          className={"first-column " + expanded ? classes.noBorderBottom : ""}
        >
          <Checkbox
            checked={isSelected}
            onClick={onCheckboxChange}
            disabled={disabled}
          />
        </TableCell>
        <TableCell className={expanded ? classes.noBorderBottom : ""}>
          <SVG
            src={action?.icon_url}
            width={25}
            height={25}
            fill={"black"}
            aria-placeholder={"Icon"}
            style={{
              marginRight: 8,
            }}
          />
        </TableCell>
        <TableCell className={expanded ? classes.noBorderBottom : ""}>
          {action?.category_name}
        </TableCell>
        <TableCell className={expanded ? classes.noBorderBottom : ""}>
          {action?.title}
        </TableCell>
        <TableCell
          className={expanded ? classes.noBorderBottom : ""}
          align="left"
        >
          {action?.subject}
        </TableCell>
        <TableCell
          className={expanded ? classes.noBorderBottom : ""}
          align="center"
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className={className} style={{ padding: 10 }}>
          <TableCell colSpan={6}>
            <Grid
              container
              spacing={5}
              style={{ padding: "15px 10px 0 10px", paddingBottom: 10 }}
            >
              <Grid item xs={3}>
                <strong>Resources Attached</strong>
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  {action?.resources?.map((resource, index) => (
                    <p key={`${resource.id}-${index}`} style={{ margin: 0 }}>
                      <a href={resource.link} target="_blank" rel="noreferrer">
                        {resource.name}
                      </a>
                    </p>
                  ))}
                </div>
              </Grid>
              <Grid item xs={1} style={{ maxWidth: 15 }}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid
                item
                xs={5}
                style={{
                  paddingBottom: 10,
                  paddingLeft: 0,
                  marginRight: 20,
                }}
              >
                <strong>Steps</strong>
                <TableContainer
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      {action?.action_steps?.map((step, index) => (
                        <TableRow key={step.id}>
                          <TableCell
                            align="left"
                            style={{
                              paddingRight: 10,
                              borderBottom: 0,
                              paddingLeft: 0,
                              width: 20,
                            }}
                          >
                            {step.icon_url ? (
                              <SVG
                                src={step.icon_url}
                                width={20}
                                height={20}
                                fill={"black"}
                                aria-placeholder={"Icon"}
                                style={{ marginBottom: "-5px" }}
                              />
                            ) : (
                              <Box width={20}></Box>
                            )}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{
                              paddingRight: 0,
                              borderBottom: 0,
                              paddingLeft: 0,
                            }}
                          >
                            {step.title}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              borderBottom: 0,
                              paddingRight: 0,
                            }}
                          >
                            Quick launch encounter
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={1} style={{ maxWidth: 15 }}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item xs={2}>
                <strong>Recurrence</strong>
                <p>{action.readable_recurrence}</p>
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

interface Props {
  handleSaveSelection: any;
  selectedActionIds: any;
  setShowActionSelection: any;
  setHasUnsavedChanges: any;
}

const ActionSelection: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  const [error, setError] = React.useState<string>("");
  const [actionItems, setActionItems] = React.useState([]);
  const [selectedActions, setSelectedActions] = React.useState([]);
  const [selectedActionIds, setSelectedActionIds] = React.useState<any>([
    ...props.selectedActionIds,
  ]);
  const [existingActionIds, setExistingActionIds] = React.useState<any>([
    ...props.selectedActionIds,
  ]);

  const [expandAll, setExpandAll] = React.useState(false);

  React.useEffect(() => {
    getActionItems();
  }, []);

  const getActionItems = async () => {
    setError("");
    try {
      const response = await fetch(`/actions?status=published`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      const result = await response.json();
      setActionItems(result.resource);
      setSelectedActions(
        result.resource.filter((a) => selectedActionIds.includes(a.id))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const selectAction = (action) => {
    event.preventDefault();
    let tempSelectedActions = [...selectedActions];
    tempSelectedActions.push(action);
    setSelectedActions(tempSelectedActions);
    setSelectedActionIds(tempSelectedActions.map((a) => a.id));
  };

  const removeAction = (action) => {
    let tempSelectedActions = [...selectedActions];
    let removedList = tempSelectedActions.filter(
      (item) => item.id != action.id
    );
    setSelectedActions(removedList);
    setSelectedActionIds(tempSelectedActions.map((a) => a.id));
  };

  const handleDoneClick = () => {
    props.handleSaveSelection([...selectedActions]);
    props.setShowActionSelection(false);
  };

  const images = React.useContext(ImagesContext);

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const [sortObject, setSortObject] = React.useState<any>({
    field: "category",
    direction: "ascending",
  });

  const sortList = () => {
    let actionList = [...actionItems];
    actionList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "category") {
      actionList.sort((a, b) =>
        a.category?.toLowerCase() > b.category?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.field == "title") {
      actionList.sort((a, b) =>
        a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
      );
    }
    if (sortObject.field == "subtext") {
      actionList.sort((a, b) =>
        a.subtext?.toLowerCase() > b.subtext?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      actionList.reverse();
    }

    setActionItems(actionList);
  };

  React.useEffect(() => {
    if (actionItems) {
      sortList();
    }
  }, [sortObject]);

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
                <h3>Add Actions to Program</h3>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                className="addLink"
                style={{ paddingRight: 0 }}
              >
                <Link
                  onClick={handleDoneClick}
                  style={{
                    float: "right",
                    marginRight: 20,
                    marginTop: 5,
                    cursor: "pointer",
                    marginBottom: "18px",
                    padding: "10px",
                  }}
                  className="nextButton"
                >
                  <div>Save Selections</div>
                </Link>
                <Link
                  onClick={() => props.setShowActionSelection(false)}
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
                    Back to Program
                  </div>
                </Link>
              </Grid>
            </Grid>
            <div className="divider"></div>

            <div>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                style={{ margin: "20px 0 10px 20px" }}
              >
                <Grid item xs={12}>
                  <div
                    className="userAdminInformation"
                    style={{
                      paddingBottom: "80px",
                      boxShadow: "0px 1px 3px 1px #b6aeae",
                      borderRadius: "2px",
                    }}
                  >
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="stretch"
                      className="adminHeader"
                    >
                      <Grid item xs={12}>
                        <h3>Action List</h3>
                      </Grid>
                    </Grid>
                    <div
                      className="divider"
                      style={{ borderWidth: "1px !important" }}
                    ></div>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="stretch"
                    >
                      <TableContainer>
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="left"
                                component="th"
                                className="bold-font-face nowrap-header first-column"
                              ></TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                className="bold-font-face nowrap-header"
                              >
                                Icon
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                className="bold-font-face nowrap-header"
                                onClick={() => {
                                  setSortOrder(
                                    "category",
                                    sortObject.direction == "ascending"
                                      ? "descending"
                                      : "ascending"
                                  );
                                }}
                              >
                                Category
                                {getSortIcon("category")}
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                className="bold-font-face nowrap-header"
                                onClick={() => {
                                  setSortOrder(
                                    "title",
                                    sortObject.direction == "ascending"
                                      ? "descending"
                                      : "ascending"
                                  );
                                }}
                              >
                                Title
                                {getSortIcon("title")}
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                className="bold-font-face nowrap-header"
                                onClick={() => {
                                  setSortOrder(
                                    "subtext",
                                    sortObject.direction == "ascending"
                                      ? "descending"
                                      : "ascending"
                                  );
                                }}
                              >
                                Subtext
                                {getSortIcon("subtext")}
                              </TableCell>
                              <TableCell
                                align="center"
                                component="th"
                                className="bold-font-face nowrap-header"
                              >
                                <Link
                                  onClick={() => setExpandAll(!expandAll)}
                                  style={{ color: "unset" }}
                                >
                                  {!expandAll ? "Expand All" : "Collapse All"}
                                </Link>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {actionItems?.map((action, index) => (
                              <AccordionTableRow
                                key={action.id}
                                action={action}
                                className={
                                  index % 2 === 0 ? `panel-grey-background` : ""
                                }
                                onActionSelectRemove={(checked: boolean) => {
                                  if (checked) {
                                    selectAction(action);
                                  } else {
                                    removeAction(action);
                                  }
                                }}
                                allExpanded={expandAll}
                                checked={selectedActionIds.includes(action.id)}
                                disabled={existingActionIds.includes(action.id)}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ActionSelection;
