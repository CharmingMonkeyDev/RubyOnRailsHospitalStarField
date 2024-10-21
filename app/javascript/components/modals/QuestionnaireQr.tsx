import React, { FC, useEffect, useState } from "react";
import { Grid, Link, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "react-qr-code";

// authentication helpers
import { AuthenticationContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  modalOpen: boolean;
  setModalOpen: any;
  patientId: string;
}

const QuestionnaireQr: FC<Props> = (props: Props) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    getUrl();
  }, []);

  const getUrl = () => {
    if (props.patientId) {
      fetch(`/guided_questionnaires/`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          patient_id: props.patientId,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            setUrl(result.resource);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Modal open={props.modalOpen} className="follow-up-modal">
      <div className="paper" style={{ width: "800px", padding: "0px" }}>
        <div className="paperInner" style={{ padding: "0px" }}>
          <Grid container className="fum-header-container">
            <Grid item xs={11}>
              <h1 className="fum-header">Close Questionnaire?</h1>
            </Grid>
            <Grid item xs={1} className="fum-close-icon-container">
              <Link
                onClick={() => props.setModalOpen(false)}
                style={{ color: "black" }}
              >
                <CloseIcon />
              </Link>
            </Grid>
          </Grid>
          <div className="divider-orange" style={{ margin: "0px" }}></div>
          <Grid style={{ padding: "32px 46.5px", textAlign: "center", fontWeight: "lighter" }}>
            <span>
              Scan the QR code below using a tablet to begin the guided process. This code will expire in <span style={{fontWeight: "bold"}}>5 minutes.</span>
            </span>
          </Grid>
          <Grid
            container
            className="fum-form-container"
            justifyContent="center"
          >
            {url && <QRCode value={url} />}
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ paddingBottom: 30, marginTop: 40 }}
          >
            <Grid
              item
              xs={4}
              className="cancel-link-container"
              style={{ textAlign: "center" }}
            >
              <Link
                className="cancel-link"
                onClick={() => props.setModalOpen(false)}
              >
                Close
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionnaireQr;