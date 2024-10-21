import * as React from "react";
import { Modal, Grid, TextField, MenuItem, Checkbox } from "@mui/material";

interface Props {
  csrfToken: string;
  user_id: string;
  logo_src: string;
  button_src: string;
}

const New: React.FC<Props> = (props: any) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [customer, setCustomer] = React.useState<string>(
    props.customers[0]?.id
  );
  const [doNotAsk, setDoNotAsk] = React.useState<boolean>(false);

  return (
    <Modal
      className="customer-selection-modal"
      open={open}
      BackdropProps={{
        style: {
          opacity: "1",
          background: "#F2F2F2",
        },
      }}
    >
      <div className="paper">
        <div className="paperInner">
          <img
            src={props.logo_src}
            alt="Project Starfield"
            className="twoFactorLogo"
          />
          <p className="loginTextCentered">Select your customer association</p>
          <form
            id="customer_selections"
            action="/customer_selections"
            method="post"
          >
            <input
              type="hidden"
              name="authenticity_token"
              value={props.csrfToken}
            />
            <input
              type="hidden"
              name="customer[user_id]"
              value={props.user_id}
            />
            <TextField
              id="customer_id"
              name="customer[customer_id]"
              className="textInput"
              value={customer}
              variant="outlined"
              size="small"
              onChange={(event) => {
                setCustomer(event.target.value);
              }}
              select
            >
              {props.customers.map((customer, index) => (
                <MenuItem key={index} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </TextField>
            <div>
              <Checkbox
                size="medium"
                name="customer[do_not_ask]"
                checked={doNotAsk}
                value={doNotAsk}
                style={{
                  color: "#FF890A",
                  backgroundColor: "transparent",
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginLeft: -3,
                }}
                onClick={() => setDoNotAsk(doNotAsk ? false : true)}
              />
              <span className="loginTextCentered">
                Make this my default and do not ask me upon login
              </span>
            </div>

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
                  style={{ marginTop: 15 }}
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

export default New;
