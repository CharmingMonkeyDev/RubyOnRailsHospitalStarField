import * as React from "react";
import { Grid, Checkbox, Link } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { useSwipeable } from "react-swipeable";
import { formatToUsDate } from "../utils/DateHelper";

// component import
import PatientBreadcrumbs from "../paritals/patient_breadcrumbs";

// helpers
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  patient_id: number;
  csrfToken: string;
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
  indicatorContainer: {
    width: "100%",
    textAlign: "center",
    "@media (max-width: 600px)": {
      position: "absolute",
      bottom: 20,
    },
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: "#efe9e7",
    display: "inline-block",
    marginRight: 6,
    marginLeft: 6,
    marginTop: 25,
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
  noteText: {
    font: "14px QuicksandMedium",
    padding: 20,
    color: "#4A4442",
  },
}));

const CarePlan: React.FC<Props> = (props: any) => {
  const classes = useStyles();
  const [currentPatient, setCurrentPatient] = React.useState<any>(null);

  React.useEffect(() => {
    if (props.patient_id) {
      fetch(`/data_fetching/care_plan/${props.patient_id}`, {
        method: "GET",
        headers: getHeaders(props.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setCurrentPatient(result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.patient_id]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/my-data"),
    onSwipedRight: () => (window.location.href = "/patient_chats"),
  });

  React.useEffect(() => {}, []);

  const dateFormattedRuby = (dateString) => {
    let date = new Date(dateString);
    return (
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
    );
  };

  const completeAction = (action, completed = true) => {
    fetch(`/assigned_actions/${action.id}`, {
      method: "PATCH",
      headers: getHeaders(props.csrfToken),
      body: JSON.stringify({
        assigned_action: {
          completed_at: completed
            ? `${dateFormattedRuby(Date.now())} 12:00:00.000000`
            : null,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          alert(result.error);
        } else {
          setCurrentPatient(result.data.patient);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const isActionChecked = (action) => {
    return (
      (action.recurring == true &&
        formatToUsDate(action.completed_at) == formatToUsDate(Date.now())) ||
      (action.recurring == false && action.completed_at)
    );
  };

  return (
    <div {...swipeHandlers} style={{ touchAction: "pan-y", minHeight: "86vh" }}>
      <div className={classes.container}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12} className="space-for-breadcrum">
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              className={classes.pageHeading}
            >
              <Grid item xs={2} className={classes.centerText}>
                <Link
                  href="/?menu=false"
                  className={classes.backButton}
                  style={{ color: "#4A4442" }}
                >
                  &lt;
                </Link>
              </Grid>
              <Grid item xs={8} className={classes.pageTitle}>
                <span>Care Plan</span>
              </Grid>
              <Grid item xs={2}>
                &nbsp;
              </Grid>
            </Grid>

            {typeof currentPatient?.assigned_actions != "undefined" ? (
              <div style={{ marginBottom: 30 }}>
                {currentPatient?.assigned_actions.map((action, index) => (
                  <div
                    key={index}
                    style={{
                      font: "18px QuicksandMedium",
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 10,
                    }}
                  >
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <Grid item xs={2}>
                        <Checkbox
                          size="medium"
                          checked={isActionChecked(action)}
                          onClick={() =>
                            completeAction(
                              action,
                              isActionChecked(action) ? false : true
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <div>{action.text}</div>
                        <div>
                          <small>{action.subtext}</small>
                        </div>

                        <div style={{ marginLeft: 10, marginBottom: 5 }}>
                          {action.resource_links.map((linkObj, index) => (
                            <div key={index}>
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
                          ))}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </div>
            ) : currentPatient?.assigned_actions?.length == 0 ? (
              <p>Care plan not found.</p>
            ) : (
              <p>Loading...</p>
            )}
          </Grid>
          <PatientBreadcrumbs page={"care_plan"} />
        </Grid>
      </div>
    </div>
  );
};

export default CarePlan;
