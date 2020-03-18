import * as React from "react";
import { Grid, Link, Modal, InputLabel } from "@mui/material";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CloseIcon from "@mui/icons-material/Close";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext, FlashContext } from "../Context";
import GeneralModal from "./GeneralModal";

interface Props {
  immunization_id: string;
  modalOpen: boolean;
  setModalOpen: any;
  setRenderingKey?: any;
}

const ImmunizationGiven: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  const [givenDate, setGivenDate] = React.useState<any>(new Date());

  const handleDateChange = (date) => {
    setGivenDate(date);
  };

  const saveGivenDate = () => {
    fetch(`/immunizations/${props.immunization_id}`, {
      method: "PUT",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        patient_forecast_immunization: {
          given_date: givenDate,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            flashContext.setMessage({
              text: "Immunization is updated",
              type: "success",
            });
            props.setModalOpen(false);
            props.setRenderingKey(Math.random());
          } else {
            alert("Something is wrong record cannot be updated");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <GeneralModal
        open={props.modalOpen}
        title={"Given Date"}
        successCallback={saveGivenDate}
        closeCallback={() => props.setModalOpen(false)}
        width="600px"
      >
        <Grid container style={{ paddingTop: 20 }}>
          <Grid item xs={12}>
            <InputLabel htmlFor="next-date" className="fum-field-label">
              Immunization given on
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="field-container">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                autoOk={true}
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                className="next-date"
                value={givenDate}
                style={{
                  width: "95%",
                }}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }} />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </GeneralModal>
      <Modal open={false} className="follow-up-modal">
        <div className="paper" style={{ width: "430px", padding: "0px" }}>
          <div className="paperInner" style={{ padding: "0px" }}>
            <Grid container className="fum-header-container">
              <Grid item xs={10}>
                <h1 className="fum-header">Given Date</h1>
              </Grid>
              <Grid item xs={2} className="fum-close-icon-container">
                <Link
                  onClick={() => props.setModalOpen(false)}
                  style={{ color: "black" }}
                >
                  <CloseIcon />
                </Link>
              </Grid>
            </Grid>
            <div className="divider-orange" style={{ margin: "0px" }}></div>
            <Grid container className="fum-form-container">
              <Grid item xs={12}>
                <InputLabel htmlFor="next-date" className="fum-field-label">
                  Immunization given on
                </InputLabel>
              </Grid>
              <Grid item xs={12} className="field-container">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk={true}
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    className="next-date"
                    value={givenDate}
                    style={{
                      width: "95%",
                    }}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }} />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{ paddingBottom: "24px" }}
            >
              <Grid item xs={4} className="cancel-link-container">
                <Link
                  className="cancel-link"
                  onClick={() => props.setModalOpen(false)}
                >
                  Cancel
                </Link>
              </Grid>
              <Grid item xs={4} className="confirm-btn-container">
                <Link
                  onClick={saveGivenDate}
                  className="confirm-btn"
                  style={{ width: "160px" }}
                >
                  Continue
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ImmunizationGiven;
