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

const ImmunizationDefer: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);

  const [deferDate, setDeferDate] = React.useState<any>(new Date());

  const handleDateChange = (date) => {
    setDeferDate(date);
  };

  const saveDeferDate = () => {
    fetch(`/immunizations/${props.immunization_id}`, {
      method: "PUT",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        patient_forecast_immunization: {
          defer_date: deferDate,
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
              text: "Immunization is defered",
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
    <GeneralModal
      open={props.modalOpen}
      title={"Defer Immunization Alert"}
      successCallback={saveDeferDate}
      confirmButtonText="Defer & Remind Me"
      closeCallback={() => props.setModalOpen(false)}
      width="600px"
    >
      <p style={{ textAlign: "center", paddingBottom: 20 }}>
        You are attempting to defer this patient’s immunization alert. Would you
        like to continue?
      </p>
      <Grid container className="fum-form-container">
        <Grid item xs={12}>
          <InputLabel htmlFor="next-date" className="fum-field-label">
            Defer alert until
          </InputLabel>
        </Grid>
        <Grid item xs={12} className="field-container">
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
              value={deferDate}
              style={{
                width: "95%",
              }}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
    </GeneralModal>
    // <Modal open={props.modalOpen} className="follow-up-modal">
    //   <div className="paper" style={{ width: "430px", padding: "0px" }}>
    //     <div className="paperInner" style={{ padding: "0px" }}>
    //       <Grid container className="fum-header-container">
    //         <Grid item xs={10}>
    //           <h1 className="fum-header"></h1>
    //         </Grid>
    //         <Grid item xs={2} className="fum-close-icon-container">
    //           <Link
    //             onClick={() => props.setModalOpen(false)}
    //             style={{ color: "black" }}
    //           >
    //             <CloseIcon />
    //           </Link>
    //         </Grid>
    //       </Grid>
    //       <div className="divider-orange" style={{ margin: "0px" }}></div>
    //       <p style={{ paddingLeft: "24px" }}>
    //         You are attempting to defer this patient’s immunization alert. Would
    //         you like to continue?
    //       </p>
    //       <Grid container className="fum-form-container">
    //         <Grid item xs={12}>
    //           <InputLabel htmlFor="next-date" className="fum-field-label">
    //             Defer alert until
    //           </InputLabel>
    //         </Grid>
    //         <Grid item xs={12} className="field-container">
    //           <MuiPickersUtilsProvider utils={DateFnsUtils}>
    //             <KeyboardDatePicker
    //               disableToolbar
    //               disablePast
    //               autoOk={true}
    //               variant="inline"
    //               format="MM/dd/yyyy"
    //               margin="normal"
    //               id="date-picker-inline"
    //               className="next-date"
    //               value={deferDate}
    //               style={{
    //                 width: "95%",
    //               }}
    //               onChange={handleDateChange}
    //               KeyboardButtonProps={{
    //                 "aria-label": "change date",
    //               }}
    //             />
    //           </MuiPickersUtilsProvider>
    //         </Grid>
    //       </Grid>
    //       <Grid
    //         container
    //         direction="row"
    //         justifyContent="center"
    //         alignItems="center"
    //         style={{ paddingBottom: "24px" }}
    //       >
    //         <Grid item xs={4} className="cancel-link-container">
    //           <Link
    //             className="cancel-link"
    //             onClick={() => props.setModalOpen(false)}
    //           >
    //             Cancel
    //           </Link>
    //         </Grid>
    //         <Grid item xs={4} className="confirm-btn-container">
    //           <Link
    //             onClick={saveDeferDate}
    //             className="confirm-btn"
    //             style={{ width: "160px" }}
    //           >
    //             Defer & Remind Me
    //           </Link>
    //         </Grid>
    //       </Grid>
    //     </div>
    //   </div>
    // </Modal>
  );
};

export default ImmunizationDefer;
