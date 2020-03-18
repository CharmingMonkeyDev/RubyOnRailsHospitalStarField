/* eslint-disable prettier/prettier */

// Library Imports
import * as React from "react";
import { Grid, Link, Stack } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddIcon from "@mui/icons-material/Add";

// component imports
import FlashMessage from "../../../shared/FlashMessage";

// app setting imports
import { AuthenticationContext } from "../../../Context";

// importing header helpers
import { getHeaders } from "../../../utils/HeaderHelper";
import { formatToUsDate } from "../../../utils/DateHelper";
import AddLabValues from "./AddLabValues";
import { useParams } from "react-router-dom";

interface Props {}

const Labs: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);
  let { id:patientId } = useParams();

  // For field states
  const [labA1cs, setLabA1cs] = React.useState<any>(null);
  const [labTcs, setLabTcs] = React.useState<any>(null);
  const [labHdls, setLabHdls] = React.useState<any>(null);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [labObject, setLabObject] = React.useState<any>();

  // Error handling states
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  React.useEffect(() => {
    getLabsData();
  }, [patientId]);

  const getLabsData = () => {
    if (patientId) {
      fetch(`/data_fetching/get_labs/${patientId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.message);
          } else {
            setLabA1cs(result?.resource?.hgb_data_values?.slice(0, 8));
            setLabHdls(result?.resource?.hdl_values?.slice(0, 8));
            setLabTcs(result?.resource?.tc_values?.slice(0, 8));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleEdit = (lab: any) => {
    setLabObject(lab);
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
                    <h3>Labs</h3>
                  </Grid>
                  <Link
                      className="action-link add-encounter"
                      onClick={() => setOpenAddModal(true)}
                    >
                      <AddIcon className="plus-icon" />{" "}
                      <span className="app-user-text">Add New Lab Value</span>
                    </Link>
                </Stack>
              </Grid>
            </Grid>
            <Grid
                container
                className="labs-container grey-container pad-top-10"
              >
                <Grid item xs={12} className="data-body-container">
                  <Grid container className="data-container-parent" spacing={1}>
                    <Grid item xs={4} className="data-container dc-mr">
                      <div className="single-lab-header">A1c</div>
                      {labA1cs != null && labA1cs.length ? (
                        <>
                          {labA1cs.map((lab, index) => {
                            return (
                              <div 
                                key={index} 
                                className="data-row" 
                                title="Edit"  
                                onClick={() => lab.id ? handleEdit(lab) : alert("This data is from NDIIHN and can not be edited.")}
                              >                                
                                <span className="data-value">{lab.reading_value}</span>{" "}
                                <span className="data-date">
                                  {formatToUsDate(lab.date_recorded)}
                                </span>
                              </div>
                            );
                          })}
                          <div className="data-row-caret">
                            <ArrowDropDownIcon
                              style={{
                                color: "white",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {labA1cs == null ? (
                            <div className="data-row">
                              <span className="data-value">Loading</span>
                            </div>
                          ) : (
                            <div className="data-row">
                              <span className="data-value">N/A</span>
                            </div>
                          )}
                        </>
                      )}
                    </Grid>
                    <Grid item xs={4} className="data-container dc-mr">
                      <div className="single-lab-header">TC</div>
                      {labTcs != null && labTcs.length ? (
                        <>
                          {labTcs.map((lab, index) => {
                            return (
                              <div 
                                key={index} 
                                className="data-row" 
                                title="Edit"  
                                onClick={() => lab.id ? handleEdit(lab) : alert("This data is from NDIIHN and can not be edited.")}
                              >
                                <span className="data-value">{lab.reading_value}</span>{" "}
                                <span className="data-date">
                                  {formatToUsDate(lab.date_recorded)}
                                </span>
                              </div>
                            );
                          })}
                          <div className="data-row-caret">
                            <ArrowDropDownIcon
                              style={{
                                color: "white",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {labTcs == null ? (
                            <div className="data-row">
                              <span className="data-value">Loading</span>
                            </div>
                          ) : (
                            <div className="data-row">
                              <span className="data-value">N/A</span>
                            </div>
                          )}
                        </>
                      )}
                    </Grid>
                    <Grid item xs={4} className="data-container">
                      <div className="single-lab-header">HDL</div>
                      {labHdls != null && labHdls.length ? (
                        <>
                          {labHdls.map((lab, index) => {
                            return (
                              <div 
                                key={index} 
                                className="data-row" 
                                title="Edit"  
                                onClick={() => lab.id ? handleEdit(lab) : alert("This data is from NDIIHN and can not be edited.")}
                              >
                                <span className="data-value">{lab.reading_value}</span>{" "}
                                <span className="data-date">
                                  {formatToUsDate(lab.date_recorded)}
                                </span>
                              </div>
                            );
                          })}
                          <div className="data-row-caret">
                            <ArrowDropDownIcon
                              style={{
                                color: "white",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {labHdls == null ? (
                            <div className="data-row">
                              <span className="data-value">Loading</span>
                            </div>
                          ) : (
                            <div className="data-row">
                              <span className="data-value">N/A</span>
                            </div>
                          )}
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
      {open && (
        <AddLabValues
          patient_id={patientId}
          open={openAddModal}
          setOpenAddModal={setOpenAddModal}
          onSuccess={() => {
            history.pushState(null, null, '#labs');
            window.location.reload();
          }}
          onModalClose={() => setLabObject(undefined)}
          labObject={labObject}
        />
      )}
    </Grid>
  );
};

export default Labs;
