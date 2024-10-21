import * as React from "react";
import { Modal, Grid, Link, Snackbar } from "@mui/material";
import { Alert } from '@mui/material';

import { AuthenticationContext } from "../Context";

// helper imports
import { getHeaders } from "../utils/HeaderHelper";

interface Props {}

const AcceptTerms: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [open, setOpen] = React.useState<boolean>(true);
  const [disabledButton, setDisabledButton] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [terms, setTerms] = React.useState<any>(null);

  const closeModal = (e, reason) => {
    if (reason != "backdropClick") {
      setOpen(false);
    }
  };

  // get terms
  React.useEffect(() => {
    fetch(`/legal/terms`, {
      method: "GET",
      // do not use get header, has different accept param
      headers: {
        "content-type": "application/json",
        accept: "text/html",
        "X-CSRF-Token": authenticationSetting.csrfToken,
        "X-Frame-Options": "sameorigin",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Content-Security-Policy": "default-src 'self'",
      },
    })
      .then((result) => {
        return result.text();
      })
      .then((result) => {
        setTerms(result);
      })
      .catch((error) => {
        alert("Something went wrong.  Refresh page and try again.");
        console.log(error);
      });
  }, []);

  const saveTerms = () => {
    // make api call to save terms & close modal
    fetch(`/terms`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        terms: true,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.error) {
          alert(
            "Something went wrong.  If this continues please contact support."
          );
          console.log(result);
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        alert(
          "Something went wrong.  If this continues please contact support."
        );
        console.log(error);
      });
  };

  React.useEffect(() => {
    let termsEl = document.querySelector("#terms-small");
    if (termsEl) {
      termsEl.innerHTML = terms;
    }
  }, [terms]);

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
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        </Snackbar>
      )}

      <Modal
        open={open}
        onClose={closeModal}
        className="add-action-modal terms-modal"
      >
        <div className="paper">
          <div className="paperInner">
            <h1 className="color-primary text-center"> Starfield </h1>
            <h2 className="text-center"> Terms & Conditions </h2>
            <div id="terms-small"> </div>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              className="button-container"
            >
              <Grid
                item
                xs={6}
                className="centerButton"
                style={{ paddingTop: "15px" }}
              >
                <a rel="nofollow" data-method="delete" href="/users/sign_out">
                  <Link className="cancel-link" onClick={() => {}}>
                    Cancel
                  </Link>
                </a>
              </Grid>
              <Grid item xs={6} className="centerButton">
                {!disabledButton ? (
                  <Link className="nextButton" onClick={() => saveTerms()}>
                    Accept
                  </Link>
                ) : (
                  <>Saving...</>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AcceptTerms;
