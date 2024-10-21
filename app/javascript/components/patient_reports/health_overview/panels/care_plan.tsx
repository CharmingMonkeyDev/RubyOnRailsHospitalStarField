/* eslint-disable prettier/prettier */

// Library Imports
import * as React from "react";
import { Grid, Link, Checkbox } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

// app setting imports
import { AuthenticationContext } from "../../../Context";

// importing header helpers
import { getHeaders } from "../../../utils/HeaderHelper";

interface Props {
  patient_id: string;
}

const CarePlan: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [panelExpanded, setPanelExpanded] = React.useState<boolean>(true); 

  // other states
  const [assignedActions, setAssignedActions] = React.useState<any>([]);

  React.useEffect(() => {
    getAssignedActions();
  }, [props.patient_id]);

  const getAssignedActions = () => {
    if (props.patient_id) {
      fetch(`/patient_assigned_actions/${props.patient_id}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setAssignedActions(result?.resource);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const formatDate = (dateString) => {
    let date = new Date(dateString);
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      date.getFullYear()
    );
  };

  const togglePanelExpansion = () => {
    setPanelExpanded(!panelExpanded);
  };

  return (
    <Grid container className="panel-container">
      <Grid item xs={12}>
        <Grid container className="panel-show-container">
          <Grid container className="panel-information-container">
            <Grid
              container
              direction="row"
              className="admin-header cursor-pointer"
              onClick={togglePanelExpansion}
            >
              <Grid item xs={12} lg={6}>
                <h3>Patient Care Plan</h3>
              </Grid>
              <Grid
                container
                item
                lg={6}
                direction="row"
                justifyContent="flex-end"
                style={{ flexWrap: "nowrap" }}
              >
                {panelExpanded ? (
                  <>
                    <span>
                      <Link className="action-icon">
                        <ArrowDropUpIcon className="expand-icon" />
                      </Link>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <Link className="action-icon">
                        <ArrowDropDownIcon className="expand-icon" />
                      </Link>
                    </span>
                  </>
                )}
              </Grid>
            </Grid>
            {panelExpanded && (
              <Grid
                container
                className="care-plan-container grey-container pad-top-10"
              >
                <Grid item xs={12}>
                  <Grid
                    item
                    xs={12}
                    style={{
                      paddingRight: "10px",
                      background: "white",
                      paddingTop: "15px",
                    }}
                  >
                    <div
                      className="add-medication-btn"
                      style={{
                        marginRight: "0px",
                      }}
                    >
                      <Link
                        href={`/care-plan-management?patient=${props.patient_id}`}
                        className="btn-link"
                        style={{
                          paddingRight: "15px",
                          paddingLeft: "15px",
                        }}
                      >
                        Edit Care Plan
                      </Link>
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  style={{
                    background: "white",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  {assignedActions.map((assignedAction) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        container
                        key={assignedAction.id}
                        spacing={1}
                      >
                        <Grid item xs={1} className="check-box-container">
                          <Checkbox
                            size="medium"
                            style={{
                              backgroundColor: "transparent",
                            }}
                            checked={
                              (assignedAction?.recurring == true &&
                                formatDate(assignedAction?.completed_at) ==
                                  formatDate(Date.now())) ||
                              (assignedAction?.recurring == false &&
                                assignedAction?.completed_at)
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={10}
                          container
                          className="action-container"
                        >
                          <Grid item xs={12} className="action-text">
                            {assignedAction?.text}
                          </Grid>
                          <Grid item xs={12} className="action-subtext">
                            {assignedAction?.subtext}
                          </Grid>
                          <Grid item xs={12}>
                            {assignedAction.resource_links.map(
                              (linkObj, index) => (
                                <div key={index} style={{ marginLeft: "15px" }}>
                                  <small>
                                    <a
                                      href={`${linkObj.link}`}
                                      target="_blank"
                                      style={{ color: "#f8890b" }}
                                      rel="noreferrer"
                                    >
                                      {linkObj.name}
                                    </a>
                                  </small>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CarePlan;
