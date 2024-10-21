import * as React from "react";
import { Grid } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Link as RouterLink } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { formatToUsDate } from "../utils/DateHelper";

// app setting imports
import { AuthenticationContext } from "../Context";

// importing header helpers
import { getHeaders } from "../utils/HeaderHelper";

// component import
import PatientBreadcrumbs from "../paritals/patient_breadcrumbs";

interface Props {
  patient_id: number;
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
  labContainer: {
    display: "block",
  },
  dataContainer: {
    borderRadius: 4,
    border: "1px solid #b7b7b7",
    margin: 5,
  },
  dataTitle: {
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "#939393",
    font: "20px QuicksandMedium",
    padding: 2,
  },
  dataFlex: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #939393",
    paddingTop: 4,
    paddingBottom: 4,
  },
  dataFlexHidden: {
    display: "none",
    flexDirection: "row",
  },
  dataValue: {
    textAlign: "center",
    color: "#313133",
    fontWeight: "bold",
    font: "16px QuicksandMedium",
    paddingTop: 2,
    paddingBottom: 2,
    flex: 1,
  },
  dataDate: {
    textAlign: "center",
    color: "#888888",
    fontWeight: "normal",
    font: "12px QuicksandMedium",
    flex: 1,
    paddingTop: 5,
  },
  dataExpand: {
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "#939393",
    fontSize: 15,
    cursor: "pointer",
  },
}));

const Lab: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  const classes = useStyles();
  const [showA1c, setShowA1c] = React.useState<boolean>(false);
  const [showBp, setShowBp] = React.useState<boolean>(false);
  const [showTc, setShowTc] = React.useState<boolean>(false);
  const [showHdl, setShowHdl] = React.useState<boolean>(false);

  const [labA1cs, setLabA1cs] = React.useState<any>(null);
  const [labBps, setLabBps] = React.useState<any>(null);
  const [labTcs, setLabTcs] = React.useState<any>(null);
  const [labHdls, setLabHdls] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/data_fetching/get_labs/${props.patient_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setLabA1cs(result?.resource?.hgb_data_values?.slice(0, 5));
          setLabHdls(result?.resource?.hdl_values?.slice(0, 5));
          setLabTcs(result?.resource?.tc_values?.slice(0, 5));
          setLabBps(result.resource?.bp_values);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/cgm_report"),
    onSwipedRight: () => (window.location.href = "/my-medications"),
  });

  React.useEffect(() => {}, []);

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
                <RouterLink
                  to="/?menu=false"
                  className={classes.backButton}
                  style={{ color: "#4A4442" }}
                >
                  &lt;
                </RouterLink>
              </Grid>
              <Grid item xs={8} className={classes.pageTitle}>
                <span>Labs</span>
              </Grid>
              <Grid item xs={2}>
                &nbsp;
              </Grid>
            </Grid>

            <div className={classes.labContainer}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Grid item xs={6}>
                  <div
                    className={classes.dataContainer}
                    onClick={() => {
                      setShowA1c(!showA1c);
                    }}
                  >
                    <div className={classes.dataTitle}>A1C</div>
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
                              {formatToUsDate(lab[1])}
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
                      <div className={classes.dataExpand}>
                        <ArrowDropDownIcon style={{ fontSize: "1.5rem" }} />
                      </div>
                    )}
                    {showA1c && (
                      <div className={classes.dataExpand}>
                        <ArrowDropDownIcon style={{ fontSize: "1.5rem" }} />
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className={classes.dataContainer}
                    onClick={() => {
                      setShowBp(!showBp);
                    }}
                  >
                    <div className={classes.dataTitle}>BP</div>
                    {labBps != null && labBps.length ? (
                      <>
                        {labBps.map((lab, index) => (
                          <div
                            key={lab.id}
                            className={
                              index == 0 || showBp
                                ? classes.dataFlex
                                : classes.dataFlexHidden
                            }
                          >
                            <div className={classes.dataValue}>
                              {lab?.sys_dis_value}
                            </div>
                            <div className={classes.dataDate}>
                              {formatToUsDate(lab.date_recorded)}
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
                      <div className={classes.dataExpand}>
                        <ArrowDropDownIcon style={{ fontSize: "1.5rem" }} />
                      </div>
                    )}
                    {showBp && (
                      <div className={classes.dataExpand}>
                        <ArrowDropDownIcon style={{ fontSize: "1.5rem" }} />
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className={classes.dataContainer}
                    onClick={() => {
                      setShowTc(!showTc);
                    }}
                  >
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
                              {formatToUsDate(lab[1])}
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
                      <div className={classes.dataExpand}>
                        <ArrowDropDownIcon style={{ fontSize: "1.5rem" }} />
                      </div>
                    )}
                    {showTc && (
                      <div className={classes.dataExpand}>
                        <ArrowDropDownIcon style={{ fontSize: "1.5rem" }} />
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className={classes.dataContainer}
                    onClick={() => {
                      setShowHdl(!showHdl);
                    }}
                  >
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
                              {formatToUsDate(lab[1])}
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
                      <div className={classes.dataExpand}>
                        <ArrowDropDownIcon style={{ fontSize: "1.5rem" }} />
                      </div>
                    )}
                    {showHdl && (
                      <div className={classes.dataExpand}>
                        <ArrowDropDownIcon style={{ fontSize: "1.5rem" }} />
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <PatientBreadcrumbs page={"labs"} />
        </Grid>
      </div>
    </div>
  );
};

export default Lab;
