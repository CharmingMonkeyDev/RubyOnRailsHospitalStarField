/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, TextField, Checkbox } from "@mui/material";

interface Props {
  csrfToken: string;
  uuid: string;
  logo_src: string;
  button_src: string;
}

const CustomerConsentNew: React.FC<Props> = (props: any) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [iAgree, setIAgree] = React.useState<boolean>(false);
  const [signature, setSignature] = React.useState<string>("");

  return (
    <Modal
      open={open}
      BackdropProps={{
        style: {
          opacity: "1",
          background: "#F2F2F2",
        },
      }}
    >
      <div className="paper customer-consent-container">
        <div className="paperInner">
          <img
            src={props.logo_src}
            alt="Project Starfield"
            className="twoFactorLogo"
          />
          <p className="loginTextCentered primary-header">
            Customer Association Consent/Release Form
          </p>

          <p className="copy-content">
            {props.invited_by_name} would like to add you to the care team at{" "}
            {props.customer?.name}.
          </p>
          <p className="copy-content">
            Please read and sign below if you would like to proceed.
          </p>

          <p className="copy-content">
            By signing your name electronically on this Customer Association
            Consent/Release Form, you are agreeing that your electronic
            signature is the legal equivalent of your manual signature.
          </p>
          <form
            id="customer_selections"
            action={`/customer_consent_update/${props.uuid}`}
            method="post"
          >
            <input
              type="hidden"
              name="authenticity_token"
              value={props.csrfToken}
            />
            <input
              type="hidden"
              name="consent[pending_customer_user_id]"
              value={props.pending_customer_user?.id}
            />
            <Grid container>
              <Grid item xs={12}>
                <span className="loginTextCentered">
                  <Checkbox
                    size="small"
                    name="consent[i_agree]"
                    checked={iAgree}
                    value={iAgree}
                    required
                    style={{
                      color: "#38BCA9",
                    }}
                    onClick={() => setIAgree(iAgree ? false : true)}
                  />
                  By checking this box you agree to the terms noted in the above
                  statement.
                </span>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="signature"
                  size="small"
                  label="Signature"
                  name="consent[signature]"
                  value={signature}
                  className="textInput"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    setSignature(event.target.value);
                  }}
                  inputProps={{
                    minLength: 3,
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <div></div>
              <Grid item xs={2}>
                <button
                  type="submit"
                  form="customer_selections"
                  value="Submit"
                  className="clearButtonStyling"
                >
                  <img
                    src={props.button_src}
                    alt="Verify Code"
                    className="loginButton"
                  />
                </button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerConsentNew;
