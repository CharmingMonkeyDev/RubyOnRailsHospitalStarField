import * as React from "react";
import {
  Grid,
  Link,
  Modal,
  InputLabel,
  TextField,
  Snackbar,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import { useState } from "react";
import { checkPrivileges } from "../utils/PrivilegesHelper";
import { PrivilegesContext } from "../PrivilegesContext";
import { Alert } from "@mui/material";
import GeneralModal from "./GeneralModal";

interface Props {
  patient_id: string;
  modalOpen: boolean;
  setModalOpen: any;
  setFlashMessage?: any;
  setRenderingKey?: any;
}

const useStyles = makeStyles(() => ({
  container: {
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: 500,
    marginTop: 80,
    "@media (max-width: 600px)": {
      width: "100%",
      marginTop: 70,
    },
  },
  pageTitle: {
    textAlign: "center",
    "& span": {
      font: "26px QuicksandMedium",
    },
  },
  backButton: {
    font: "30px QuicksandMedium",
    textDecoration: "none",
    display: "inline-block",
    marginTop: -6,
  },
  pageHeading: {
    borderBottom: "1px solid #948b87",
    marginBottom: 20,
    paddingBottom: 10,
  },
  centerText: {
    textAlign: "center",
  },
  infoSection: {
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
    marginBottom: 15,
    boxShadow: "1px 1px 1px 1px #efefef",
    padding: 10,
  },
  nextButton: {
    background: "none",
    border: "none",
    padding: 10,
    paddingLeft: "30%",
    paddingRight: "30%",
    font: "inherit",
    cursor: "pointer",
    outline: "inherit",
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "#ff8906",
    borderRadius: 4,
    fontFamily: "QuicksandMedium",
    marginTop: 20,
    display: "inline-block",
    "&:hover": {
      textDecoration: "none",
    },
  },
  textInputLabel: {
    font: "12px QuicksandMedium",
    display: "inline-block",
    marginTop: 10,
  },
  textInput: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: "#fcf6f4",
  },
  centerButton: {
    textAlign: "center",
    marginTop: 10,
  },
  clearButtonStyling: {
    background: "none",
    color: "inherit",
    border: "none",
    padding: 0,
    font: "inherit",
    cursor: "pointer",
    outline: "inherit",
    textAlign: "center",
  },
  alert: {
    border: "1px solid #dbe3e6",
  },
}));

const FollowUpForm: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [nextDate, setNextDate] = React.useState<any>(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const userPrivileges = React.useContext(PrivilegesContext);
  const [actionResourceItems, setActionResourceItems] = React.useState([]);
  const [error, setError] = React.useState("");
  const classes = useStyles();

  const handleDateChange = (date) => {
    setNextDate(date);
  };

  React.useEffect(() => {
    getTempActionResources();
  }, []);

  const getTempActionResources = () => {
    let tempActionResources = JSON.parse(
      sessionStorage.getItem("saved_action_resources_temp")
    );
    let tempIds = [];
    if (tempActionResources) {
      tempIds = tempActionResources.map((tempActionResource) => {
        return tempActionResource.resource_item_id;
      });
    }
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
          let allResourceItems = result.resource;
          let selectedActionResources = allResourceItems.filter(
            (resourceItem) => tempIds.includes(resourceItem.id)
          );
          setActionResourceItems(selectedActionResources);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const validForm = () => {
    return !!nextDate && !!title;
  };

  const saveFollowUp = () => {
    if (validForm()) {
      fetch(`/follow_up_dates`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          follow_up_date: {
            user_id: props.patient_id,
            next_date: nextDate,
            title: title,
            description: description,
          },
          resource_items: actionResourceItems,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            if (result?.resource) {
              props.setFlashMessage({
                message: "Follow up date added",
                type: "success",
              });
              props.setModalOpen(false);
              props.setRenderingKey(Math.random());
            } else {
              alert("Something is wrong and template cannot be saved");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setError("Invalid entries, please check your entries and try again.");
    }
  };

  const addResource = () => {
    sessionStorage.setItem(
      "patient_action_temp",
      JSON.stringify({
        text: title,
        subtext: description,
      })
    );
    window.location.href = `/resource-catalog?patient=${props.patient_id}&patient_action=new&redirect_url=/patient_reports/${props.patient_id}/new_action`;
  };

  const removeActionResourceItem = (resource) => {
    if (
      confirm("Are you sure you want to remove the resource from the action?")
    ) {
      let actionResourceItemsTemp = actionResourceItems;
      actionResourceItemsTemp = actionResourceItemsTemp.filter(
        (item) => item.id !== resource.id
      );
      setActionResourceItems(actionResourceItemsTemp);
    }
  };

  const closeModal = () => {
    sessionStorage.setItem("saved_action_resources_temp", JSON.stringify([]));
    props.setModalOpen(false);
    window.location.href = `/patient_reports/${props.patient_id}/action_center`;
  };

  return (
    <>
      {error.length > 0 && (
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            setError("");
          }}
        >
          <Alert severity="error" className={classes.alert}>
            {error}
          </Alert>
        </Snackbar>
      )}
      <GeneralModal
        open={props.modalOpen}
        title={"Create New Action"}
        successCallback={saveFollowUp}
        closeCallback={closeModal}
        containerClassName="manual-patient-modal-body"
        width="600px"
        confirmButtonText="Create Action"
      >
        <Grid
          container
          className="fum-form-container"
          spacing={1}
          style={{ paddingTop: 20 }}
        >
          <Grid item xs={12} className="field-container">
            <InputLabel htmlFor="next-date" className="fum-field-label">
              Enter Date
            </InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                disablePast
                autoOk={true}
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                className="next-date"
                value={nextDate}
                style={{
                  width: "100%",
                }}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} className="field-container">
            <TextField
              label="Title"
              placeholder="Enter Title"
              value={title}
              className="textInput"
              required
              maxRows={20}
              variant="filled"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              InputLabelProps={{
                required: true,
              }}
            />
          </Grid>
          <Grid item xs={12} className="field-container">
            <TextField
              label="Description"
              placeholder="Enter Description"
              value={description}
              className="textInput"
              required
              multiline
              maxRows={20}
              variant="filled"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              InputLabelProps={{
                required: false,
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} className="field-container">
          <div style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}>
            {checkPrivileges(userPrivileges, "Access Resource Catalog") && (
              <Link
                className="default-btn"
                onClick={addResource}
                style={{ paddingLeft: 90, paddingRight: 90 }}
              >
                Add Resource
              </Link>
            )}
            {actionResourceItems && actionResourceItems.length > 0 && (
              <>
                {actionResourceItems.map((actionResource, index) => (
                  <p
                    key={index}
                    style={{
                      textAlign: "left",
                      width: "75%",
                      marginLeft: "auto",
                      marginRight: "auto",
                      fontFamily: "QuicksandMedium",
                      fontSize: 14,
                    }}
                  >
                    <Link
                      href={`${actionResource.link}`}
                      target="_blank"
                      style={{ color: "#f8890b" }}
                    >
                      {actionResource.name}
                    </Link>
                    <Link
                      onClick={() => {
                        removeActionResourceItem(actionResource);
                      }}
                    >
                      <DeleteIcon
                        style={{
                          fontSize: 20,
                          color: "#c1b7b3",
                          display: "inline-block",
                          cursor: "pointer",
                          float: "right",
                        }}
                      />
                    </Link>
                  </p>
                ))}
              </>
            )}
          </div>
        </Grid>
      </GeneralModal>
    </>
  );
};

export default FollowUpForm;
